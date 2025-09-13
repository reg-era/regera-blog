CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id),
    blog_id INT REFERENCES blogs(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);