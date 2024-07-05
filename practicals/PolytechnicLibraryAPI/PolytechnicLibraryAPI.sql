/*	

!!!!!!	NOTE	!!!!!!

1. Use bed_db cos the Table are kinda the same and related
2. Drop all existing table using the code below.
3. Then execute the rest of the code

*/

/*
drop table UserBooks
drop table Users
drop table Books
*/


CREATE TABLE Users
(
	user_id			int	Identity(1,1)	not null,
	username		varchar(255)		not null	unique,
	passwordHash	varchar(255)		not null,
	role			varchar(20)			not null	check(role in ('member','librarian')),
	constraint PK_Users primary key (user_id)
)

CREATE TABLE Books
(
	book_id			int	Identity(1,1)	not null,
	title			varchar(255)		not null,
	author			varchar(255)		not null,
	availability	char(1)				not null	check(availability in ('Y','N')),
	constraint PK_Books primary key (book_id)
)

INSERT INTO Books (title, author, availability) VALUES
('Book Title 1', 'Author 1', 'Y'),
('Book Title 2', 'Author 2', 'N'),
('Book Title 3', 'Author 3', 'Y'),
('Book Title 4', 'Author 4', 'Y'),
('Book Title 5', 'Author 5', 'N'),
('Book Title 6', 'Author 6', 'Y'),
('Book Title 7', 'Author 7', 'Y'),
('Book Title 8', 'Author 8', 'N'),
('Book Title 9', 'Author 9', 'Y'),
('Book Title 10', 'Author 10', 'N');

select * from Books
select * from Users