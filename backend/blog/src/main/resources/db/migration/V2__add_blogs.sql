CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id),
    title TEXT NOT NULL,
    cover TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
