CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id),
    blog_id INT REFERENCES blogs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);