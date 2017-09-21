ALTER TABLE carer ALTER COLUMN pass TYPE varchar(100);
-- Set all passwords to 'password'
UPDATE carer SET pass='sha1$90c9339e$1$ee96319fc1978c9ee0a53f17679bb30d64599d79';
