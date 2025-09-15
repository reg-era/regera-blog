-- Notification for likes
CREATE OR REPLACE FUNCTION notify_like()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, content, seen, created_at)
    VALUES (
        (SELECT user_id FROM blogs WHERE id = NEW.blog_id), -- blog owner
        format('User %s liked your blog (ID %s)', 
                (SELECT username FROM users WHERE id = NEW.user_id), NEW.blog_id),
        FALSE,
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;