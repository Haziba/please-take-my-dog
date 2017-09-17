ALTER TABLE dog RENAME COLUMN imageurl TO images;
UPDATE dog SET images=null;
