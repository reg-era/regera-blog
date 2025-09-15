-- Notification for follows
CREATE OR REPLACE FUNCTION notify_follow()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, content, seen, created_at)
    VALUES (
        NEW.user_id,  -- the person being followed
        format('User %s started following you', (SELECT username FROM users WHERE id = NEW.follower_id)),
        FALSE,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
