-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (user_id <> reported_user_id)
);