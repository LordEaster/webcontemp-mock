import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import pool from './db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
};
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Secret key for JWT (store this securely in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Interface for JWT payload
interface JwtPayload {
    userId: number;
}

// Extend Request interface to include user property
declare global {
    namespace Express {
        interface Request {
        user?: JwtPayload;
        }
    }
}

// Middleware to authenticate routes using JWT
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: 'Invalid or expired token' });
            return;
        }
        req.user = decoded as JwtPayload;
        next();
    });
}

// Register a new user
app.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    try {
        // Check if the email is already registered
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
        return;
    } catch (err: any) {
        res.status(400).json({ error: err.message });
        return;
    }
});

// Login a user and return a token
app.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        // Fetch the user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
        return;
    }
});

// CRUD operations for Items

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
    return;
});

// Get all users
app.get('/users', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT id, name, email FROM users');
        res.json(result.rows);
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
});

// Create a new item in the user's bag
app.post('/users/:userId/items', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const { item_name, quantity } = req.body;
    const userId = parseInt(req.params.userId, 10); // Ensure userId is an integer

    // Ensure the user is accessing their own data
    if (userId !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden: You can only add items to your own account' });
        return;
    }

    // Validate required fields
    if (!item_name) {
        res.status(400).json({ error: 'Item name is required' });
        return;
    }

    try {
        // Insert the new item into the database, generating a unique item ID
        const result = await pool.query(
            'INSERT INTO items (user_id, item_name, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, item_name, quantity || 1]
        );

        res.status(201).json(result.rows[0]); // Return the created item with its unique item ID
    } catch (err: any) {
        console.error('Error inserting item:', err);
        res.status(500).json({ error: 'Failed to add item to the database' });
    }
});

// Get all items in the user's bag
app.get('/users/:userId/items', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    // Ensure the user is accessing their own data
    if (parseInt(userId) !== req.user?.userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }

    try {
        const result = await pool.query(
        'SELECT * FROM items  JOIN users ON items.user_id = users.id WHERE user_id = $1',
        [userId]
        );
        res.json(result.rows);
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
});

// Update an item in the user's bag
app.put('/items/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const { item_name, quantity } = req.body;
    const { id } = req.params;

    try {
        // Check if the item belongs to the authenticated user
        const itemResult = await pool.query(
        'SELECT * FROM items WHERE id = $1',
        [id]
        );
        if (itemResult.rows.length === 0) {
            res.status(404).json({ error: 'Item not found' });
            return;
        return;
        }
        const item = itemResult.rows[0];
        if (item.user_id !== req.user?.userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const result = await pool.query(
        'UPDATE items SET item_name = $1, quantity = $2 WHERE id = $3 RETURNING *',
        [item_name || item.item_name, quantity || item.quantity, id]
        );
        res.json(result.rows[0]);
        return;
    } catch (err: any) {
        res.status(400).json({ error: err.message });
        return;
    }
});

// Delete an item from the user's bag
app.delete('/items/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});