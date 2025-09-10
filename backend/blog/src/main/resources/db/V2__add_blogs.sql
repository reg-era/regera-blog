CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
