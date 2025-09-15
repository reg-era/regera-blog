-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,              -- who reported
    reported_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,              -- optional: reported user
    reported_blog_id BIGINT REFERENCES blogs(id) ON DELETE CASCADE,              -- optional: reported blog
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
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