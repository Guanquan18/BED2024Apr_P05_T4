--create database SpearAcademy_db

-- 1. Table (Account)
create table Account
(
	AccId		smallint Identity(1,1)		not null,
	FullName	varchar(50)					not null,
	DOB			date						not null CHECK(DOB <= getdate()),
	Email		varchar(100)				not null unique,
	ContactNo	char(8)						not null unique,
	Password	varchar(150)				not null, 
	Photo		varchar(200)				null,
	LinkedIn	varchar(150)				null, 
	constraint PK_Account primary key (AccId)
)


-- 2. Table (Student)
create table Student
(
	StudentId		smallint		not null,
	constraint PK_Student primary key (StudentId),
	constraint FK_Student_StudentId foreign key (StudentId)
		references Account (AccId)
)

-- 3. Table (Educator)
create table Educator
(
	EducatorId			smallint		not null,
	Organisation		varchar(100)	null,
	ProfessionalTitle	varchar(100)	null,
	YearsOfExperience	int				null,
	FieldOfStudy		varchar(100)	null,
	HighestDegree		varchar(150)	not null,
	constraint PK_Educator primary key (EducatorId),
	constraint FK_Educator_EducatorId foreign key (EducatorId)
		references Account (AccId)
)


select * from Educator

---
-- 4. Table (Courses)
create table Course
(
	CourseId			smallint Identity(1,1)	not null,
	CourseTitle			varchar(150)			not null,
	SmallDescription	varchar(200)			not null,
	Description			Text					not null,
	Label				varchar(100)			null,
	Badge				varchar(100)			null,
	Thumbnail			varchar(150)			not null,
	LastUpdated			smalldatetime			not null default(getdate()),
	Creator				smallint				not null,
	constraint PK_Course primary key (CourseId),
	constraint FK_Course_Creator foreign key (Creator)
		references Account (AccId)
)

-- 5. Table (SectionDetails)
create table SectionDetails
(
	SectionNo				smallint Identity(1,1)	not null,
	SectionTitle			varchar(150)			not null,
	Video					varchar(150)			not null,
	Section_Course			smallint				not null,
	constraint PK_SectionDetails primary key (SectionNo,Section_Course),
	constraint FK_SectionDetails_Course foreign key (Section_Course)
		references Course (CourseId)
)	

-- 6. Table (Quiz)
create table Quiz
(
	QuizId					smallint Identity(1,1)	not null,
	QuizTitle				varchar(150)			not null,
	Section_Quiz			smallint				not null,
	Course_Quiz				smallint                NOT NULL,
	constraint PK_Quiz primary key (QuizId,Section_Quiz),
	constraint FK_Quiz_Section foreign key (Section_Quiz,Course_Quiz)
		references SectionDetails (SectionNo,Section_Course)
)

-- 7. Table (Question)
create table Question
(
	QuestionNo				smallint Identity(1,1)	not null,
	QuestionTitle			varchar(150)			not null,
	Quiz_Question			smallint				not null,
	Section_Question		smallint				not null,
	constraint PK_Question primary key (QuestionNo,Quiz_Question),
	constraint FK_Question_Quiz foreign key (Quiz_Question,Section_Question)
		references Quiz (QuizId,Section_Quiz)
)

-- 8. Table (Option)
create table [Option]
(
	OptionNo				smallint Identity(1,1)	not null,
	OptionName				varchar(150)			not null,
	Explanation				varchar(500)			null,
	IsCorrectOption			BIT					not null check(IsCorrectOption in ('Y','N')),
	Question_Option			smallint				not null,
	Quiz_Option				smallint				not null,
	constraint PK_Qption primary key (OptionNo,Question_Option),
	constraint FK_Option_Question foreign key (Question_Option,Quiz_Option)
		references Question (QuestionNo,Quiz_Question)
)

-- 9. Table (Attempt)
create table Attempt
(
	Attemptid				smallint Identity(1,1)	not null,
	score					int						not null,
	NoOfCorrect				int						not null,
	NoOfWrong				int						not null,
	Attempt_Quiz			smallint				not null,
	Attempt_Section			smallint				not null,
	Attempt_Account			smallint				not null,
	constraint PK_Attempt primary key (AttemptId),
	constraint FK_Attempt_Quiz foreign key (Attempt_Quiz,Attempt_Section)
		references Quiz (QuizId,Section_Quiz),
	constraint FK_Attempt_Account foreign key (Attempt_Account)
		references Account (AccId)
)

-- 10. Table (Enrollement )
create table Enrollment
(
	EnrollmentNo				smallint Identity(1,1)	not null,
	Progress					Decimal(5,2)			not null check(Progress <= 100) default(0),
	Status						varchar(25)				not null check(Status in ('Completed','Incomplete')),
	Enrollment_Course			smallint				not null,
	Enrollment_Account			smallint				not null,
	constraint PK_Enrollment primary key (EnrollmentNo),
	constraint FK_Enrollment_Course foreign key (Enrollment_Course)
		references Course (CourseId),
	constraint FK_Enrollment_Account foreign key (Enrollment_Account)
		references Account (AccId)
)

-- 11. Table (Review)
create table Review
(
	ReviewId					smallint Identity(1,1)	not null,
	ReviewText					text					null,
	Ratings						Decimal(3,2)						not null check(Ratings >= 0.0 and Ratings <= 5.0),
	Review_Course				smallint				not null,
	Review_Account				smallint				not null,
	constraint PK_Review primary key (ReviewId),
	constraint FK_Review_Course foreign key (Review_Course)
		references Course (CourseId),
	constraint FK_Review_Account foreign key (Review_Account)
		references Account (AccId)
)

-- 12. Table (Message)
create table Message
(
	MsgId					smallint Identity(1,1)		not null,
	MsgDate					datetime					not null default(getdate()),
	MsgText					text						not null,
	Message_Account			smallint					not null,
	constraint PK_Message primary key (MsgId),
	constraint FK_Message_Account foreign key (Message_Account)
		references Account (AccId)
)

-- 13. Table (QnA)
create table QnA
(
	QnAId					smallint Identity(1,1)		not null,
	QnATitle				text						not null,
	PostDate				datetime					not null default(getdate()),
	QnA_Msg					smallint					not null,
	QnA_Course				smallint					not null,
	constraint PK_QnA primary key (QnAId),
	constraint FK_QnA_Msg foreign key (QnA_Msg)
		references Message (MsgId),
	constraint FK_QnA_Course foreign key (QnA_Course)
		references Course (CourseId),
)


insert into Account(FullName,DOB,Email,ContactNo,Password,Photo,LinkedIn)
values 
('Chang Guan Quan', '2000-01-01','changguanquan@gmail.com','12345678','1234','Photo','www.linkedin.com/changguanquan'),
('Maria Garcia', '1995-05-15','maria.garcia@example.com','87654321','1234','Photo','www.linkedin.com/mariagarcia'),
('John Smith', '1988-12-22','john.smith@example.com','23456789','1234','Photo','www.linkedin.com/johnsmith'),
('Aisha Khan', '1993-07-08','aisha.khan@example.com','34567890','1234','Photo','www.linkedin.com/aishakhan'),
('David Brown', '1985-03-30','david.brown@example.com','45678901','1234','Photo','www.linkedin.com/davidbrown'),
('Li Wei', '1999-09-19','li.wei@example.com','56789012','1234','Photo','www.linkedin.com/liwei'),
('Anna Ivanova', '1992-11-11','anna.ivanova@example.com','67890123','1234','Photo','www.linkedin.com/annaivanova'),
('Carlos Sanchez', '1990-02-20','carlos.sanchez@example.com','78901234','1234','Photo','www.linkedin.com/carlossanchez'),
('Fatima Bint Ali', '1997-04-10','fatima.ali@example.com','89012345','1234','Photo','www.linkedin.com/fatimaali'),
('Mohammed El-Sayed', '1986-08-25','mohammed.sayed@example.com','90123456','1234','Photo','www.linkedin.com/mohammedsayed'),
('Elena Petrova', '1994-03-05','elena.petrova@example.com','11234567','1234','Photo','www.linkedin.com/elenapetrova'),
('Robert Johnson', '1983-12-12','robert.johnson@example.com','22345678','1234','Photo','www.linkedin.com/robertjohnson'),
('Sofia Martinez', '1996-07-18','sofia.martinez@example.com','33456789','1234','Photo','www.linkedin.com/sofiamartinez'),
('Akira Yamamoto', '1989-06-14','akira.yamamoto@example.com','44567890','1234','Photo','www.linkedin.com/akirayamamoto'),
('Isabella Rossi', '1991-09-28','isabella.rossi@example.com','55678901','1234','Photo','www.linkedin.com/isabellarossi'),
('George Williams', '1987-05-17','george.williams@example.com','66789012','1234','Photo','www.linkedin.com/georgewilliams'),
('Yuki Tanaka', '1998-10-04','yuki.tanaka@example.com','77890123','1234','Photo','www.linkedin.com/yukitanaka'),
('Emma Dubois', '1984-01-22','emma.dubois@example.com','88901234','1234','Photo','www.linkedin.com/emmadubois'),
('Hassan Ahmed', '1990-11-06','hassan.ahmed@example.com','99012345','1234','Photo','www.linkedin.com/hassanahmed'),
('Laura Müller', '1993-02-18','laura.muller@example.com','10123456','1234','Photo','www.linkedin.com/lauramuller');

insert into Educator(EducatorId,Organisation,ProfessionalTitle,YearsOfExperience,FieldOfStudy,HighestDegree)
values 
(1,'Ngee Ann Polytechnic','Professor',10,'Computer Science','PhD Degree'),
(3,'Singapore Polytechnic','Professor',20,'Engineering','Master Degree'),
(5,'Temasek Polytechnic','Senior Lecturer',15,'Information Technology','PhD Degree'),
(7,'Republic Polytechnic','Associate Professor',12,'Mechanical Engineering','PhD Degree'),
(9,'Nanyang Polytechnic','Lecturer',8,'Business Administration','Master Degree'),
(11,'Institute of Technical Education','Professor',22,'Electrical Engineering','PhD Degree'),
(13,'Singapore Management University','Assistant Professor',5,'Economics','PhD Degree'),
(15,'National University of Singapore','Professor',30,'Biochemistry','PhD Degree'),
(17,'Nanyang Technological University','Associate Professor',18,'Physics','PhD Degree'),
(19,'Singapore University of Technology and Design','Senior Lecturer',14,'Architecture','Master Degree')
