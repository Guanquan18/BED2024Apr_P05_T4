-- drop database SpearAcademy_db
-- create database SpearAcademy_db

-- 1. Table (Account)
create table Account
(
	AccId		smallint Identity(1,1)		not null,
	FullName	varchar(50)					null,
	DOB			date						null CHECK(DOB <= getdate()),
	Email		varchar(100)				not null unique,
	ContactNo	char(8)						null unique,
	Password	varchar(150)				not null, 
	role            varchar(10)                             null,
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

-- 4. Table (Courses)
create table Course
(
	CourseId			smallint Identity(1,1)	not null,
	CourseTitle			varchar(150)			not null,
	SmallDescription	varchar(200)			not null,
	Description			Text					not null,
	Label				varchar(100)			null,
	Badge				varchar(100)			null,
	Thumbnail			text		not null,
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
	Section_Question		smallint				null,
	constraint PK_Question primary key (QuestionNo,Quiz_Question),
	constraint FK_Question_Quiz foreign key (Quiz_Question,Section_Question)
		references Quiz (QuizId,Section_Quiz)
)

-- 8. Table (Option)
create table [Option]
(
	OptionNo				smallint Identity(1,1)	not null,
	OptionName				varchar(200)			not null,
	Explanation				varchar(500)			null,
	IsCorrectOption			BIT					not null,
	Question_Option			smallint				not null,
	Quiz_Option				smallint				not null,
	constraint PK_Qption primary key (OptionNo,Question_Option),
	constraint FK_Option_Question foreign key (Question_Option,Quiz_Option)
		references Question (QuestionNo,Quiz_Question)
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
-- 12. Table (QnA)
create table QnA
(
	QnAId					smallint Identity(1,1)		not null,
	QnATitle				text						not null,
	PostDate				datetime					not null default(getdate()),
	QnA_Course				smallint					not null unique,
	constraint PK_QnA primary key (QnAId),
	constraint FK_QnA_Course foreign key (QnA_Course)
		references Course (CourseId),
)

-- 13. Table (Message)
create table Message
(
	MsgId					smallint Identity(1,1)		not null,
	MsgDate					datetime					not null default(getdate()),
	MsgText					text						not null,
	Message_Account			smallint					not null,
	Message_QnA				smallint					not null,
	constraint PK_Message primary key (MsgId),
	constraint FK_Message_Account foreign key (Message_Account)
		references Account (AccId),
	constraint FK_Message_QnA foreign key (Message_QnA)
		references QnA (QnAId)
)




insert into Account(FullName,DOB,Email,ContactNo,Password,role,Photo,LinkedIn) 
values 
('Chang Guan Quan', '2000-01-01','changguanquan@gmail.com','12345678','1234','Educator', 'Photo','www.linkedin.com/changguanquan'),
('Maria Garcia', '1995-05-15','maria.garcia@example.com','87654321','1234','Student','Photo','www.linkedin.com/mariagarcia'),
('John Smith', '1988-12-22','john.smith@example.com','23456789','1234','Educator','Photo','www.linkedin.com/johnsmith'),
('Aisha Khan', '1993-07-08','aisha.khan@example.com','34567890','1234','Student','Photo','www.linkedin.com/aishakhan'),
('David Brown', '1985-03-30','david.brown@example.com','45678901','1234','Educator','Photo','www.linkedin.com/davidbrown'),
('Li Wei', '1999-09-19','li.wei@example.com','56789012','1234','Student','Photo','www.linkedin.com/liwei'),
('Anna Ivanova', '1992-11-11','anna.ivanova@example.com','67890123','1234','Educator','Photo','www.linkedin.com/annaivanova'),
('Carlos Sanchez', '1990-02-20','carlos.sanchez@example.com','78901234','1234','Student','Photo','www.linkedin.com/carlossanchez'),
('Fatima Bint Ali', '1997-04-10','fatima.ali@example.com','89012345','1234','Educator','Photo','www.linkedin.com/fatimaali'),
('Mohammed El-Sayed', '1986-08-25','mohammed.sayed@example.com','90123456','1234','Student','Photo','www.linkedin.com/mohammedsayed'),
('Elena Petrova', '1994-03-05','elena.petrova@example.com','11234567','1234','Educator','Photo','www.linkedin.com/elenapetrova'),
('Robert Johnson', '1983-12-12','robert.johnson@example.com','22345678','1234','Student','Photo','www.linkedin.com/robertjohnson'),
('Sofia Martinez', '1996-07-18','sofia.martinez@example.com','33456789','1234','Educator','Photo','www.linkedin.com/sofiamartinez'),
('Akira Yamamoto', '1989-06-14','akira.yamamoto@example.com','44567890','1234','Student','Photo','www.linkedin.com/akirayamamoto'),
('Isabella Rossi', '1991-09-28','isabella.rossi@example.com','55678901','1234','Educator','Photo','www.linkedin.com/isabellarossi'),
('George Williams', '1987-05-17','george.williams@example.com','66789012','1234','Student','Photo','www.linkedin.com/georgewilliams'),
('Yuki Tanaka', '1998-10-04','yuki.tanaka@example.com','77890123','1234','Educator','Photo','www.linkedin.com/yukitanaka'),
('Emma Dubois', '1984-01-22','emma.dubois@example.com','88901234','1234','Student','Photo','www.linkedin.com/emmadubois'),
('Hassan Ahmed', '1990-11-06','hassan.ahmed@example.com','99012345','1234','Educator','Photo','www.linkedin.com/hassanahmed'),
('Laura Müller', '1993-02-18','laura.muller@example.com','10123456','1234','Student','Photo','www.linkedin.com/lauramuller');

-- Even Number AccountID Are Student 
INSERT INTO Student (StudentId)
VALUES 
(2),(4),(6),(8),(10),(12),(14),(16),(18),(20);

-- Odd Number AccountID Are Educator
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
(19,'Singapore University of Technology and Design','Senior Lecturer',14,'Architecture','Master Degree');

INSERT INTO Course (CourseTitle, SmallDescription, Description, Label, Badge, Thumbnail, Creator)
VALUES 
(	'Generalized AI for Beginners', 
	'An introduction to the fundamentals of Artificial Intelligence', 
	'This course provides a comprehensive introduction to the fundamentals of Artificial Intelligence, covering basic concepts, algorithms, and practical applications. Suitable for beginners with no prior experience in AI.', 
	'Best Selling',
	null,
	'https://i.ytimg.com/vi/UkZzM-jxLv4/maxresdefault.jpg', 
	1
),
(
    'Machine Learning with Python',
    'Learn essential machine learning techniques using Python programming language',
    'This course covers foundational machine learning algorithms, Python libraries such as scikit-learn, and practical applications in data science.',
    'Popular Course',
	null,
    'https://th.bing.com/th/id/OIP.P_3XeZcQ1lOx2bILTWvGgwHaEK?rs=1&pid=ImgDetMain',
    1
);
-- Insert into SectionDetails
INSERT INTO SectionDetails (SectionTitle, Video, Section_Course)
VALUES 
('Introduction to AI', 'intro_ai.mp4', 1),
('Advanced AI', 'advanced_ai.mp4', 1),
('Google AI Principles', 'google_ai_principles.mp4', 1);

-- Insert data into Quiz table
INSERT INTO Quiz (QuizTitle, Section_Quiz, Course_Quiz)
VALUES
('Advanced AI Quiz', 2, 1),
('Google AI Principles Quiz', 3, 1);


-- Insert data into Question table
INSERT INTO Question (QuestionTitle, Quiz_Question, Section_Question)
VALUES
('What is Artificial Intelligence (AI)?', 1, 2),
('Which machine learning technique requires labelled data?', 1, 2),
('Which type of problem does unsupervised learning solve?', 1, 2),
('Which data science library is used to plot 2D graphs?', 1, 2),
('When would you use a heatmap?', 1, 2),
('Why is framing your machine learning problem an important step?', 1, 2),
('Which of these are common responsible AI principles?', 2, 3),
('What does the responsible AI principle "transparency and explainability" refer to?', 2, 3),
('What is model drift?', 2, 3),
('Which of these are three components of a strong algorithmic audit?', 2, 3),
('The purpose of a technical audit is to _____.', 2, 3),
('What are the two common forms of continuous monitoring?', 2, 3),
('The NIST AI Risk Management Framework focuses its actions through which of the following four functions?', 2, 3),
('This NIST AI Risk Management Framework function is often related to compliance or evaluation?', 2, 3),
('Developers and deployers of "high-risk" AI systems will be required to implement which of the following?', 2, 3),
('What does "data minimization" refer to?', 2, 3);



-- Insert data into Option table
INSERT INTO [Option] (OptionName, Explanation, IsCorrectOption, Question_Option, Quiz_Option)
VALUES
('a branch of Mathematics', 'AI is a branch of Computer Science, not Mathematics.', 0, 1, 1),
('a subset of machine learning', 'Machine Learning is a subset of AI.', 0, 1, 1),
('a strategy to analyze data', 'Business Intelligence is a strategy to analyze data.', 0, 1, 1),
('a simulation of human intelligence', 'AI is the simulation of human intelligence by machines.', 1, 1, 1),
('unsupervised learning', 'Unsupervised learning doesn''t use labelled data like supervised learning; instead, it groups or interprets data based only on input data.', 0, 2, 1),
('transfer learning', 'Transfer learning allows you to add your data on top of a pre-trained model allowing you to train a new model that inherits the learnings from the previous model.', 0, 2, 1),
('supervised learning', 'Supervised learning is a technique that trains a machine-learning model with labeled data.', 1, 2, 1),
('reinforcement learning', 'Reinforcement learning allows a machine to learn through trial and error.', 0, 2, 1),
('regression', 'Regression problems are considered supervised learning.', 0, 3, 1),
('Classification', 'Classification problems are considered supervised learning.', 0, 3, 1),
('multi-class label classification', 'Multi-class label classification problems are considered supervised learning.', 0, 3, 1),
('clustering', 'Clustering is a common unsupervised learning technique.', 1, 3, 1),
('Matplotlib', 'Matplotlib is a widely used Python-based 2D plotting libraries.', 1, 4, 1),
('Pandas', 'Pandas allow you to work with solid data structures, n-dimensional matrices, and perform exploratory data analysis.', 0, 4, 1),
('Scikit-learn', 'Scikit-learn is data science library for training a custom model.', 0, 4, 1),
('Numpy', 'Numpy allows you to do numerical computing.', 0, 4, 1),
('to uncover outliers', 'Histograms help you uncover outliers by increasing the number of bins.', 0, 5, 1),
('to show correlations', 'Heatmaps show the correlation between features or how related one feature is to another.', 1, 5, 1),
('to show duplicate values', 'Heatmaps don''t help you uncover duplicate values.', 0, 5, 1),
('to plot numeric values', 'While a heatmap does show numeric values, those values are correlations.', 0, 5, 1),
('because selecting success metrics should wait until after training', 'Problem framing is also the time to define the metrics that will determine whether or not your implementation is successful.', 0, 6, 1),
('because machine learning is not a good solution to every problem', 'Machine learning is not the solution to every problem, and when used incorrectly, it can cause more harm than good.', 1, 6, 1),
('because most problems can be solved using machine learning', 'Most problems cannot (and should not) be solved using machine learning.', 0, 6, 1),
('because the predictive power of features needs to be explored', 'During the training process, you can explore features'' predictive power by removing, adding, and analyzing the impact.', 0, 6, 1),
('fairness, transparency, privacy, and accountability', 'Fairness, transparency, privacy, and accountability are four of the seven common responsible AI principles.', 1, 7, 2),
('programming, debugging, testing, and deploying', 'These are common tactics in software development.', 0, 7, 2),
('data collection, data cleaning, data analysis, and data reporting', 'These are common tactics used by data scientists.', 0, 7, 2),
('efficiency, productivity, profitability, and competitiveness', 'These principles are good for business, but are not responsible AI principles.', 0, 7, 2),
('Implement robust tests to identify bias.', 'This is the principle of "Fairness and Non-Discrimination".', 0, 8, 2),
('Communicate why and how AI is being used.', 'Communicating why and how AI is being used are core features of the "Transparency and Explainability" principle.', 1, 8, 2),
('Evaluate the societal and long-term effects of AI.', 'This is the principle of "Professional Responsibility".', 0, 8, 2),
('Use data minimization to protect personally identifiable information.', 'This is the principle of "Reliability and Safety".', 0, 8, 2),
('where you evaluate whether a statistically significant change has occurred in the data', 'This is data drift.', 0, 9, 2),
('where you evaluate the purpose and scoping of the AI application', 'This refers to one of the four components of continuous monitoring.', 0, 9, 2),
('where you evaluate whether the data exhibit characteristics that affect model performance, such as duplicate or incomplete data and improper data processing', 'This refers to data errors.', 0, 9, 2),
('where you evaluate whether there is a significant shift in the model performance or its accuracy', 'Evaluating model performance and accuracy are core to identifying whether model drift is occurring.', 1, 9, 2),
('data cleaning, manipulation, and assessment audits', 'Data cleaning, manipulation, and assessment audits are important parts of data preparation.', 0, 10, 2),
('model testing, assessment, and optimization audits', 'Model design, assessment, and optimization audits are important components of model development.', 0, 10, 2),
('planning, implementation, and assessment audits', 'Planning, implementation, and assessment audits are not part of an algorithmic audit.', 0, 10, 2),
('governance, empirical, and technical audits', 'Governance, empirical, and technical audits provide a holistic assessment for a strong algorithmic audit.', 1, 10, 2),
('determine whether model performance is discriminatory', 'This is an empirical audit.', 0, 11, 2),
('assess whether the system is performing as intended, not why it is or is not performing as intended', 'This is an empirical audit.', 0, 11, 2),
('determine whether appropriate policies and practices are in place to support responsible design, development, and deployment of an AI system', 'This is a governance audit.', 0, 11, 2),
('evaluate data inputs, model, and output to ensure alignment with responsible AI principles', 'Evaluating data inputs, model, and output to ensure alignment with responsible AI principles is the core function of a technical audit.', 1, 11, 2),
('governance and data continuous monitoring', 'Governance audits and data monitoring are important components of continuous monitoring, but do not refer to the general format of continuous monitoring.', 0, 12, 2),
('empirical and governance continuous monitoring', 'Empirical and governance refer to auditing procedures.', 0, 12, 2),
('technical and non-technical continuous monitoring', 'Technical and non-technical continuous monitoring are the two general formats of continuous monitoring.', 1, 12, 2),
('empirical and data continuous monitoring', 'Empirical audits and data monitoring are important components of continuous monitoring, but do not refer to the general format of continuous monitoring.', 0, 12, 2),
('Govern, Map, Measure, Manage', 'The four functions of the NIST AI RMF include: Govern, Map, Measure, and Manage.', 1, 13, 2),
('Collect, Assess, Clean, Transform', 'These are parts of data preparation.', 0, 13, 2),
('Set objectives, determine metrics, conduct regular audits, implement feedback loop', 'These are parts of the continuous monitoring process.', 0, 13, 2),
('Bias detection, bias management, education, and training', 'These are parts of bias identification and management.', 0, 13, 2),
('Manage', 'The Manage function entails allocating resources to address the mapped and measured benefits and risks on a regular basis and as defined by the govern function.', 0, 14, 2),
('Govern', 'The govern function focuses specifically on establishing appropriate governance mechanisms that support compliance and evaluation.', 1, 14, 2),
('Map', 'The map function enables the identification of benefits and risks and appropriate intervention points to maximize benefits and manage risks.', 0, 14, 2),
('Measure', 'The Measure function employs quantitative, qualitative, or mixed-method tools, techniques, and methodologies to analyze, assess, benchmark, and monitor AI risk and related impacts.', 0, 14, 2),
('Data Transformation', 'This is part of data preparation.', 0, 15, 2),
('Data Analysis', 'This is part of data preparation.', 0, 15, 2),
('Risk assessments', 'Developers and deployers of high-risk AI will be required to implement risk assessments and risk mitigation strategies.', 1, 15, 2),
('Data Cleaning', 'This is part of data preparation.', 0, 15, 2),
('Collect only the data you need to achieve the objective.', 'Data minimization--Collecting and using only the data you need--is a core component of respecting privacy.', 1, 16, 2),
('Collect a small amount of data to reduce redundancies.', 'Data minimization may not reduce the number of redundancies.', 0, 16, 2),
('Collect a small amount of data to save energy.', 'While reducing energy consumption is important, data minimization is a core component of data privacy.', 0, 16, 2),
('Collect a small amount of data to make your model more efficient.', 'Collecting a small or large amount of data may not affect model performance.', 0, 16, 2);




-- Insert into Review
INSERT INTO Review (ReviewText, Ratings, Review_Course, Review_Account)
VALUES 
('This is an excellent course for beginners. The content is well-structured and easy to understand.', 4.5, 1, 2),
('This course provides a good foundation, though it could use more advanced topics.', 4.0, 1, 4);


--Insert into QnA table
INSERT INTO QnA (QnATitle, QnA_Course)
VALUES 
('Discussion on Generalized AI', 1),
('Discussion Machine Learning', 2);


-- Insert multiple messages in one statement
INSERT INTO Message (MsgText, Message_Account, Message_QnA)
VALUES 
-- Messages related to QnAId 1 ('Discussion on Generalized AI')
('Can you explain the basic concepts of Generalized AI?', 2, 1),
('What are the practical applications of Generalized AI?', 4, 1),

-- Messages related to QnAId 2 ('Discussion Machine Learning')
('What are the best practices for machine learning model evaluation?', 6, 2),
('Can you recommend some advanced machine learning algorithms?', 8, 2);




