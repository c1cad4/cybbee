CREATE INDEX bee_posts_visible_cursor ON bee_posts(hidden,created DESC,id DESC);
CREATE INDEX bee_posts_kind_cursor ON bee_posts(hidden,kind,created DESC,id DESC);
CREATE INDEX bee_posts_owner_created ON bee_posts(owner,created DESC);
CREATE UNIQUE INDEX bee_points_cursor ON bee_points(id);
CREATE INDEX bee_points_area ON bee_points(lat,lon,id);
CREATE TABLE bee_action_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, window INTEGER NOT NULL DEFAULT 0);
