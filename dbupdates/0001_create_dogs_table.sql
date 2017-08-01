CREATE TABLE dogs(
	id serial primary key,
	carerId int,
	name char(50),
	dateOfBirth date,
	breed char(50),
	location char(50),
	imageUrl char(400),
	size real
);
