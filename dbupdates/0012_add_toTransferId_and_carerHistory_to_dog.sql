ALTER TABLE dog ADD COLUMN transfercarerid integer null;
ALTER TABLE dog ADD COLUMN carerhistory json not null default '[]'::json;

update dog set carerhistory=('[{"id":' || dog.carerId || ',"on":"' || CURRENT_DATE || '"}]')::JSON;
