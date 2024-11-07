-- init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(200),
    quantity INTEGER DEFAULT 1
);

INSERT INTO users (name, email, password) VALUES ('John Doe', 'johndoe@bsospace.com', 'fake password this user cannot login');