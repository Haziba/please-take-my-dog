CREATE TABLE entity(
	uuid uuid primary key,
	entityType text,
	data jsonb,
	totalEventsApplied int 
);
