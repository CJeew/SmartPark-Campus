-- Fix stale columns left behind by Hibernate ddl-auto=update renames.
-- These columns were created with NOT NULL when entity used different names.
-- Now the entity writes to the correct columns (created_by_user_id, data_bytes)
-- so these old columns just need their NOT NULL constraint removed.

ALTER TABLE ticket_attachments ALTER COLUMN data DROP NOT NULL;
ALTER TABLE ticket_attachments ALTER COLUMN data SET DEFAULT NULL;

-- reporter_user_id is already nullable (optional=true was set originally), no action needed.
-- created_by_user_id is the correct FK column and is handled by Hibernate now.
