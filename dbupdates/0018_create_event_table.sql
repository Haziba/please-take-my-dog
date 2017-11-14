CREATE TABLE event(
	id serial primary key,
  uuid int NOT NULL,
	type char(50) NOT NULL,
	body jsonb NOT NULL,
  inserted_at timestamp(6) NOT NULL DEFAULT statement_timestamp()
);
