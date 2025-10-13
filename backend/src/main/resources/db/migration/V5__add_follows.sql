-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,        -- the person being followed
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,    -- the one who follows
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, follower_id), -- prevent duplicate follows
    CHECK (user_id <> follower_id) -- prevent self-follow
);