Create database BED_Draft

-- 1. Table (Account)

create table Account
(
	AccId		smallint Identity(1,1)		not null,
	FullName	varchar(50)					not null,
	DOB			date						not null CHECK(DOB <= getdate()),
	Email		varchar(100)				not null unique,
	ContactNo	char(8)						not null unique,
	Password	varchar(150)				not null unique, 
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
	Institute			varchar(100)	null,
	FieldOfStudy		varchar(100)	null,
	HighestDegree		varchar(150)	not null,
	constraint PK_Educator primary key (EducatorId),
	constraint FK_Educator_EducatorId foreign key (EducatorId)
		references Account (AccId)
)

-- 4. Table (Courses)
create table Course
(
	CourseId			smallint Identity(1,1)	not null,
	CourseTitle			varchar(150)			not null,
	Description			Text					not null,
	Price				decimal(10,2)			not null,
	Label				varchar(100)			null,
	Badge				varchar(100)			null,
	Thumbnail			varchar(150)			not null,
	LastUpdated			smalldatetime			not null default(getdate()),
	Creator				smallint				not null unique,
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
	Explanation				varchar(150)			null,
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
	Ratings						int						not null check(Ratings between 1 and 5),
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


