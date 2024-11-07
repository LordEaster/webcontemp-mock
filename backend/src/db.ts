import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'api-db', // Name of the PostgreSQL service in Docker Compose
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

export default pool;