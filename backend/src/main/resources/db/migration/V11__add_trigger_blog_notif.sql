CREATE OR REPLACE FUNCTION notify_followers_on_new_blog()
RETURNS TRIGGER AS $$
DECLARE
    author_name TEXT;
BEGIN
    SELECT username INTO author_name FROM users WHERE id = NEW.user_id;

    INSERT INTO notifications (user_id, content)
    SELECT f.user_id, CONCAT('New blog post from ', author_name, ': ', NEW.title)
    FROM follows f
    WHERE f.follower_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_notify_followers_on_new_blog
AFTER INSERT ON blogs
FOR EACH ROW
EXECUTE FUNCTION notify_followers_on_new_blog();
