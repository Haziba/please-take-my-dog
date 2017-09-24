CREATE TABLE dog_request(
	id serial primary key,
	carerId int,
	dogId int,
	form json,
	occurredOn date
);
