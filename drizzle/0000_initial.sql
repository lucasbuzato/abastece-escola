CREATE TABLE rooms (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY NOT NULL, room_id TEXT NOT NULL REFERENCES rooms(id), role TEXT NOT NULL CHECK(role IN ('coordinator','supplier','school')), actor_id TEXT NOT NULL, name TEXT NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX sessions_room_idx ON sessions(room_id);
