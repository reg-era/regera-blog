-- Trigger for follows
CREATE TRIGGER trg_follow_notify
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION notify_follow();

-- Trigger for comments
CREATE TRIGGER trg_comment_notify
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_comment();

-- Trigger for likes
CREATE TRIGGER trg_like_notify
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION notify_like();
