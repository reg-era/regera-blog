CREATE OR REPLACE FUNCTION notify_comment()
RETURNS TRIGGER AS $$
DECLARE
    blog_owner_id BIGINT;
BEGIN
    SELECT user_id INTO blog_owner_id
    FROM blogs
    WHERE id = NEW.blog_id;

    IF blog_owner_id = NEW.user_id THEN
        RETURN NEW;
    END IF;

    INSERT INTO notifications (user_id, content)
    VALUES (
        blog_owner_id,
        format(
            'User %s commented on your blog (ID %s)',
            (SELECT username FROM users WHERE id = NEW.user_id),
            NEW.blog_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comments
CREATE TRIGGER trg_comment_notify
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_comment();
