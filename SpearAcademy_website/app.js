  /* 
Function Created
Sairam (S10255930H)
- app.get("/courses-creator/:creator", coursesController.getCourseByCreator); // Get courses by creator=
- app.get("/courses", coursesController.getCourses); // Get courses by creator
- app.get("/courses-with-sections-id/:CourseId", coursesController.getCourseWithSectionById); // Get course and section by ID
- app.put("/courses-id/:CourseId",validateCourse, coursesController.updateCourse); // Update course by ID
- app.put("/courses-icon/:CourseId", imageupload.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID
- app.post("/new-course/:creatorId", imageupload.single('Thumbnail'), validateCourse,coursesController.createCourse); // Post new course
- app.delete("/delete-course/:courseId", coursesController.deleteCourseAndDetails); // delete new course
- app.get("/sectionDetails-id/:id/:SectionNo", sectionDetailsController.getSectionDetailsById); // Get sections by sectiion no and CourseId
- app.put("/sectionDetails/:id/:SectionNo", videoupload.single('Video'),validateSection,sectionDetailsController.updateSectionDetails); // Update sections by sectiion no and CourseId
- app.post("/new-sectionDetails/:courseId", videoupload.single('Video'),validateSection,sectionDetailsController.createSection); // Post sections by CourseId
- app.delete("/delete-sectionDetails/:sectionNo", sectionDetailsController.deleteSectionDetails); // Delete sections by sectiion no
- const CoursesController = require("./controllers/CoursesController");
- const SectionDetailsController = require("./controllers/SectionDetailsController");
- const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
- const validateSection = require("./middlewares/validateSection"); // Import the validateSection. Created by Sairam

Chang Guan Quan (S10257825A)
Account routes
- app.get("/accounts", accountController.getAllAccounts);
- app.get("/account/:accId", accountController.getAccountById);
- app.post("/account/login", validateAccount.validateEmailPassword, accountController.loginAccount);
- app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
- app.put("/account/update/updatePersonalDetails",validateAccount.validatePersonalDetails, validateAccount.verifyJWT, accountController.updateAccount);

Eductor routes
- app.post("/educator/createEducator", validateEducator.validateQualification,validateAccount.verifyJWT, educatorController.createEducator);


Pey Zhi Xun (S10258774E)
- app.post("/api/quizzes", quizController.createQuiz);
- app.get("/api/quizzes", quizController.getAllQuizzes);
- app.get("/api/quizzes/:quizId", quizController.getQuizById);
- app.put("/api/quizzes/:quizId", quizController.updateQuiz);
- app.delete("/api/quizzes/:quizId", quizController.deleteQuiz);
- app.get("/api/questions/:quizId", questionController.getQuestionsByQuizId);
- app.get("/api/options/:questionNo", optionController.getOptionsByQuestionNo);
- const quizRouter = require("./controllers/quizController");
- const questionRouter = require("./controllers/questionController");
- const optionRouter = require("./controllers/optionController"); 


Keshwindren Gandipanh (S10259469C)
- app.get("/comments-QnA/:qnaId", commentsController.getCommentsByQnAId); 
- app.get("/comments/:id", commentsController.getCommentById);  
- app.post("/comments", commentsController.createComment);  
- app.delete("/comments/:id", commentsController.deleteComment);
- app.put("/comments/:id", commentsController.updateComment); 
- app.get("/QnA/:courseId", qnaController.getQnAByCourseId);  
*/
  
const express = require("express"); // Import the Express module
const sql = require("mssql"); // Import the mssql module
const dbConfig = require("./dbConfig"); // Import the database configuration
const bodyParser = require("body-parser"); // Import body-parser for parsing request bodies
const staticMiddleware = express.static("public"); // Middleware to serve static files from the public folder
const multer = require("multer"); // Import multer for handling file uploads
const path = require('path'); // Import path module for working with file and directory paths
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

// Multer configuration for iamge upload 
// // Created By: Sairam (S10259930H)
const imagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/courses'); // Destination folder for uploaded files.
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const imageupload = multer({ storage: imagestorage }); // Initialize multer with storage configuration,

// Multer configuration for video upload 
// // Created By: Sairam (S10259930H)
const videostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const videoupload = multer({ storage: videostorage }); // Initialize multer with storage configuration

const verifyJWT = require("./middlewares/verifyJWT"); // Import the verifyJWT middleware. Created by Chang Guan Quan

const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
const validateSection = require("./middlewares/validateSection"); // Import the validateSection. Created by Sairam
const validateAccount = require("./middlewares/validateAccount");  // Import the validateAccount middleware. Created by Chang Guan Quan
const validateEducator = require("./middlewares/validateEducator"); // Import the accountController. Created by Chang Guan Quan

const coursesController = require("./controllers/courseController"); // Import the coursesController. Created by Sairam
const sectionDetailsController = require("./controllers/sectionDetailController"); // Import the cectionDetailController. Created by Sairam
const accountController = require("./controllers/accountController"); // Import the accountController. Created by Chang Guan Quan
const educatorController = require("./controllers/educatorController"); // Import the educatorController. Created by Chang Guan Quan
const qnaController = require("./controllers/qnaController"); // importing the qna controller module Created by Keshwindren
const commentsController = require("./controllers/commentsController"); // importing the comments controller module Created by Keshwindren

const quizRouter = require("./controllers/quizController"); // Import the quizController. Created by PeyZhiXun
const questionRouter = require("./controllers/questionController"); // Import the questionController. Created by PeyZhiXun
const optionRouter = require("./controllers/optionController"); // Import the optionController. Created by PeyZhiXun


const app = express(); // Create an Express application
const port = process.env.PORT || 3000; // Use environment variable or default port

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware); // Mount the static middleware

// Route to serve the login page HTML file (login page)
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/login-signup-pages/login.html");
});




// Routes for handling course-related requests (Created by: Sairam S10259930)
app.get("/courses-creator/:creator", verifyJWT.verifyJWT, coursesController.getCourseByCreator); // Get courses by creator
app.get("/courses", verifyJWT.verifyJWT, coursesController.getCourses); // Get courses by creator
app.get("/courses-with-sections-id/:courseId", verifyJWT.verifyJWT, coursesController.getCourseWithSectionById); // Get course and section by ID
app.put("/courses-id/:courseId", verifyJWT.verifyJWT, validateCourse, coursesController.updateCourse); // Update course by ID
app.put("/courses-icon/:courseId", verifyJWT.verifyJWT, imageupload.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID
app.post("/new-course/:creatorId", verifyJWT.verifyJWT, imageupload.single('Thumbnail'), validateCourse,coursesController.createCourse); // Post new course
app.delete("/delete-course/:courseId", verifyJWT.verifyJWT, coursesController.deleteCourseAndDetails); // delete new course

// Routes for handling sections-related requests (Created by: Sairam S10259930)
app.get("/sectionDetails-id/:id/:sectionNo", verifyJWT.verifyJWT, sectionDetailsController.getSectionDetailsById); // Get sections by sectiion no and CourseId
app.put("/sectionDetails/:id/:sectionNo", verifyJWT.verifyJWT, videoupload.single('Video'),validateSection,sectionDetailsController.updateSectionDetails); // Update sections by sectiion no and CourseId
app.post("/new-sectionDetails/:courseId", verifyJWT.verifyJWT, videoupload.single('Video'),validateSection,sectionDetailsController.createSection); // Post sections by CourseId
app.delete("/delete-sectionDetails/:sectionNo", verifyJWT.verifyJWT, sectionDetailsController.deleteSectionDetails); // Delete sections by sectiion no

// Routes for handling account-related requests (Created by: Chang Guan Quan)
app.get("/accounts", accountController.getAllAccounts);
app.get("/account/:accId", accountController.getAccountById);
app.post("/account/login", validateAccount.validateEmailPassword, accountController.loginAccount);
app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
app.put("/account/update/updatePersonalDetails",validateAccount.validatePersonalDetails, verifyJWT.verifyJWT, accountController.updateAccount);

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.post("/educator/createEducator", validateEducator.validateQualification,verifyJWT.verifyJWT, educatorController.createEducator);

// Mount the routers for handling quiz-related requests (Created by: Pey Zhi Xun)
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/api/options", optionRouter);

// Routes for handling comment requests (Created by: Keshwindren S10259469C)
app.get("/comments-QnA/:qnaId", commentsController.getCommentsByQnAId);  //get route to retrieve all message data from the database 
app.get("/comments/:id", commentsController.getCommentById);  
app.post("/comments", commentsController.createComment);  // put route for the posting of comments
app.delete("/comments/:id", commentsController.deleteComment); // delete route to handle comment deletion
app.put("/comments/:id", commentsController.updateComment); // Put route to handle comment update

// Routes for handling qna requests (Created by: Keshwindren S10259469C)
app.get("/QnA/:courseId", qnaController.getQnAByCourseId);  //get route to retrieve all qna data from the database 
// Routes for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server and connect to the database
app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);

});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});