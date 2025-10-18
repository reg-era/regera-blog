CREATE OR REPLACE FUNCTION notify_follow()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, content)
    VALUES (
        NEW.follower_id,
        format('User %s started following you', (SELECT username FROM users WHERE id = NEW.user_id))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for follows
CREATE TRIGGER trg_follow_notify
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION notify_follow();