ALTER TABLE carer ADD COLUMN email varchar(100);
ALTER TABLE carer ADD COLUMN pass varchar(50);

UPDATE carer SET email='harry.boyes@gmail.com', pass='test';
