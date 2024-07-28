  /* 
Function Created
Team
- app.post("/account/login", validateAccount.validateEmailPassword, accountController.loginAccount);

Sairam (S10255930H)
- app.get("/courses-creator/:creator", verifyJWT.verifyJWT, coursesController.getCourseByCreator); // Get courses by creator=
- app.get("/courses", verifyJWT.verifyJWT, coursesController.getCourses); // Get courses by creator
- app.get("/courses-with-sections-id/:CourseId", verifyJWT.verifyJWT, coursesController.getCourseWithSectionById); // Get course and section by ID
- app.put("/courses-id/:CourseId",verifyJWT.verifyJWT,validateCourse, coursesController.updateCourse); // Update course by ID
- app.put("/courses-icon/:CourseId", verifyJWT.verifyJWT,imageUploadCourse.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID
- app.post("/new-course/:creatorId", verifyJWT.verifyJWT,imageUploadCourse.single('Thumbnail'), validateCourse,coursesController.createCourse); // Post new course
- app.delete("/delete-course/:courseId", verifyJWT.verifyJWT,coursesController.deleteCourseAndDetails); // delete new course
- app.get("/sectionDetails-id/:id/:SectionNo", verifyJWT.verifyJWT,sectionDetailsController.getSectionDetailsById); // Get sections by sectiion no and CourseId
- app.put("/sectionDetails/:id/:SectionNo", verifyJWT.verifyJWT,videoUploadCourse.single('Video'),validateSection,sectionDetailsController.updateSectionDetails); // Update sections by sectiion no and CourseId
- app.post("/new-sectionDetails/:courseId", verifyJWT.verifyJWT,videoUploadCourse.single('Video'),validateSection,sectionDetailsController.createSection); // Post sections by CourseId
- app.delete("/delete-sectionDetails/:sectionNo", verifyJWT.verifyJWT,sectionDetailsController.deleteSectionDetails); // Delete sections by sectiion no
- const CoursesController = require("./controllers/CoursesController");
- const SectionDetailsController = require("./controllers/SectionDetailsController");
- const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
- const validateSection = require("./middlewares/validateSection"); // Import the validateSection. Created by Sairam

Chang Guan Quan (S10257825A)
Account routes
- app.get("/account/:accId", accountController.getAccountById);
- app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
- app.put("/account/update/updatePersonalDetails/:accId", verifyJWT.verifyJWT, validateAccount.validatePersonalDetails, accountController.updateAccount);
- app.put("/account/updateProfilePicture/:accId", verifyJWT.verifyJWT, imageUploadProfile.single('ProfilePicture'), accountController.updateAccount);
- app.put("/account/updateSocialMedia/:accId", verifyJWT.verifyJWT, validateAccount.validateSocialMedia, accountController.updateAccount);
- app.post("/account/requestResetPassOTP/:identity", authController.requestPasswordReset, accountController.setToken);
- app.post("/account/resetPassword/:identity", accountController.getTokenHandler, authController.resetPassword, accountController.deleteTokenHandler);
- app.post("/account/requestDeleteAccountOTP/:accId", verifyJWT.verifyJWT, authController.requestDeleteAccount, accountController.setToken);
- app.delete("/account/deleteAccount/:accId", verifyJWT.verifyJWT, accountController.getTokenHandler, authController.deleteAccount, accountController.deleteTokenHandler);
Eductor routes
- app.post("/educator/createEducator/:eduId", verifyJWT.verifyJWT, validateEducator.validateQualification, educatorController.createEducator);
- app.get("/educator/:eduId",verifyJWT.verifyJWT, educatorController.getEducatorById);
- app.put("/educator/update/:eduId", verifyJWT.verifyJWT, validateEducator.validateQualification, educatorController.updateEducator);

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
const dbConfig = require("./config/dbConfig"); // Import the database configuration
const bodyParser = require("body-parser"); // Import body-parser for parsing request bodies
const staticMiddleware = express.static("public"); // Middleware to serve static files from the public folder
const multer = require("multer"); // Import multer for handling file uploads
const path = require('path'); // Import path module for working with file and directory paths
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

// Multer configuration for image upload
// Created By: Guan Quan (S10257825A)
const imageStorageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/profiles'); // Destination folder for uploaded files.
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const imageUploadProfile = multer({ storage: imageStorageProfile }); // Initialize multer with storage configuration

// Multer configuration for image upload 
// // Created By: Sairam (S10259930H)
const imageStorageCource = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/courses'); // Destination folder for uploaded files.
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const imageUploadCourse = multer({ storage: imageStorageCource }); // Initialize multer with storage configuration,

// Multer configuration for video upload 
// // Created By: Sairam (S10259930H)
const videoStorageCourse = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const videoUploadCourse = multer({ storage: videoStorageCourse }); // Initialize multer with storage configuration

const verifyJWT = require("./middlewares/verifyJWT"); // Import the verifyJWT middleware. Created by Chang Guan Quan

const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
const validateSection = require("./middlewares/validateSection"); // Import the validateSection. Created by Sairam
const validateAccount = require("./middlewares/validateAccount");  // Import the validateAccount middleware. Created by Chang Guan Quan
const validateEducator = require("./middlewares/validateEducator"); // Import the accountController. Created by Chang Guan Quan

const coursesController = require("./controllers/courseController"); // Import the coursesController. Created by Sairam
const sectionDetailsController = require("./controllers/sectionDetailController"); // Import the cectionDetailController. Created by Sairam
const accountController = require("./controllers/accountController"); // Import the accountController. Created by Chang Guan Quan
const authController = require("./controllers/authController"); // Import the authController. Created by Chang Guan Quan
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
  res.sendFile(__dirname + "/public/login-signup-pages/index.html");
});
app.post("/authenticated", verifyJWT.verifyJWT, (req, res) => {  // Check if user is authenticated and redirect to the appropriate home page 
  try{
    if (req.account.Role === "Student") {
      res.status(200).json({ homePage: "../student-pages/student.html" });
    } else {
      res.status(200).json({ homePage: "../educator-pages/creator.html" });
    }
  }catch{
    res.status(400);
  }
});

// Route for team component
app.post("/account/login", validateAccount.validateEmailPassword, accountController.loginAccount); // Post route for login

// Routes for handling course-related requests (Created by: Sairam S10259930)
app.get("/courses-creator/:creator", verifyJWT.verifyJWT, coursesController.getCourseByCreator); // Get courses by creator
app.get("/courses", verifyJWT.verifyJWT, coursesController.getCourses); // Get courses by creator
app.get("/courses-with-sections-id/:courseId", verifyJWT.verifyJWT, coursesController.getCourseWithSectionById); // Get course and section by ID
app.put("/courses-id/:courseId", verifyJWT.verifyJWT, validateCourse, coursesController.updateCourse); // Update course by ID
app.put("/courses-icon/:courseId", verifyJWT.verifyJWT, imageUploadCourse.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID
app.post("/new-course/:creatorId", verifyJWT.verifyJWT, imageUploadCourse.single('Thumbnail'), validateCourse,coursesController.createCourse); // Post new course
app.delete("/delete-course/:courseId", verifyJWT.verifyJWT, coursesController.deleteCourseAndDetails); // delete new course

// Routes for handling sections-related requests (Created by: Sairam S10259930)
app.get("/sectionDetails-id/:id/:sectionNo", verifyJWT.verifyJWT, sectionDetailsController.getSectionDetailsById); // Get sections by sectiion no and CourseId
app.put("/sectionDetails/:id/:sectionNo", verifyJWT.verifyJWT, videoUploadCourse.single('Video'),validateSection,sectionDetailsController.updateSectionDetails); // Update sections by sectiion no and CourseId
app.post("/new-sectionDetails/:courseId", verifyJWT.verifyJWT, videoUploadCourse.single('Video'),validateSection,sectionDetailsController.createSection); // Post sections by CourseId
app.delete("/delete-sectionDetails/:sectionNo", verifyJWT.verifyJWT, sectionDetailsController.deleteSectionDetails); // Delete sections by sectiion no

// Routes for handling account-related requests (Created by: Chang Guan Quan)
app.get("/account/:accId", verifyJWT.verifyJWT, accountController.getAccountById);

app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount); // Post route for creating account
app.put("/account/updatePersonalDetails/:accId", verifyJWT.verifyJWT, validateAccount.validatePersonalDetails, accountController.updateAccount);  // Put route for updating personal details
app.put("/account/updateProfilePicture/:accId", verifyJWT.verifyJWT, imageUploadProfile.single('ProfilePicture'), accountController.updateAccount); // Put route for updating profile picture
app.put("/account/updateSocialMedia/:accId", verifyJWT.verifyJWT, validateAccount.validateSocialMedia, accountController.updateAccount);  // Put route for updating social media
app.post("/account/requestResetPassOTP/:identity", authController.requestPasswordReset, accountController.setToken);  // Post route for requesting OTP to reset password
app.post("/account/resetPassword/:identity", accountController.getTokenHandler, authController.resetPassword, accountController.deleteTokenHandler);  // Post route for resetting password
app.post("/account/requestDeleteAccountOTP/:accId", verifyJWT.verifyJWT, authController.requestDeleteAccount, accountController.setToken);  // Post route for requesting OTP to delete account
app.delete("/account/deleteAccount/:accId", verifyJWT.verifyJWT, accountController.getTokenHandler, authController.deleteAccount, accountController.deleteTokenHandler);  // Delete route for deleting account

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.post("/educator/createEducator/:eduId", verifyJWT.verifyJWT, validateEducator.validateQualification, educatorController.createEducator);
app.get("/educator/:eduId",verifyJWT.verifyJWT, educatorController.getEducatorById);
app.put("/educator/update/:eduId", verifyJWT.verifyJWT, validateEducator.validateQualification, educatorController.updateEducator);

// Mount the routers for handling quiz-related requests (Created by: Pey Zhi Xun)
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/api/options", optionRouter);

// Routes for handling comment requests (Created by: Keshwindren S10259469C)
app.get("/comments-QnA/:qnaId", verifyJWT.verifyJWT, commentsController.getCommentsByQnAId);  //get route to retrieve all message data from the database 
app.get("/comments/:id", verifyJWT.verifyJWT, commentsController.getCommentById);  
app.post("/comments", verifyJWT.verifyJWT, commentsController.createComment);  // put route for the posting of comments
app.delete("/comments/:id", verifyJWT.verifyJWT, commentsController.deleteComment); // delete route to handle comment deletion
app.put("/comments/:id", verifyJWT.verifyJWT, commentsController.updateComment); // Put route to handle comment update

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