CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reported_user_id BIGINT REFERENCES users (id) ON DELETE CASCADE,
    reported_blog_id BIGINT REFERENCES blogs (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (
            reported_user_id IS NOT NULL
            AND reported_blog_id IS NULL
        )
        OR (
            reported_blog_id IS NOT NULL
            AND reported_user_id IS NULL
        )
    )
);