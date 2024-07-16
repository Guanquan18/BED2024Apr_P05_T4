  /* 
Function Created
Sairam (S10255930H)
- app.get("/courses-creator/:creator", CoursesController.getCourseByCreator);
- app.get("/courses-with-sections-id/:CourseId", CoursesController.getCourseWithSectionById);
- app.put("/courses-id/:CourseId",CoursesController.updateCourse); 
- app.get("/sectionDetails-id/:id/:SectionNo", SectionDetailsController.getSectionDetailsById);
- app.put("/courses-icon/:CourseId", imageupload.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID
- const CoursesController = require("./controllers/CoursesController");
- const SectionDetailsController = require("./controllers/SectionDetailsController");

Chang Guan Quan (S10257825A)
Account routes
- app.get("/accounts", accountController.getAllAccounts);
- app.get("/account/:accId", accountController.getAccountById);
- app.post("/account/login", validateAccount.validateEmailPassword, accountController.verifyAccount);
- app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
- app.put("/account/update/verifyPersonalDetails/:accId",validateAccount.validatePersonalDetails, accountController.updateAccount);

Eductor routes
- app.post("/educator/createEducator/:eduId", validateEducator.validateQualification, educatorController.createEducator);


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
- 
-
-
*/
  
const express = require("express"); // Import the Express module
const sql = require("mssql"); // Import the mssql module
const dbConfig = require("./dbConfig"); // Import the database configuration
const bodyParser = require("body-parser"); // Import body-parser for parsing request bodies
const staticMiddleware = express.static("public"); // Middleware to serve static files from the public folder
const multer = require("multer"); // Import multer for handling file uploads
const path = require('path'); // Import path module for working with file and directory paths

// Multer configuration for iamge upload Created by Sairam
const imagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/courses'); // Destination folder for uploaded files Created by Sairam
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const imageupload = multer({ storage: imagestorage }); // Initialize multer with storage configuration Created by Sairam

// Multer configuration for video upload Created by Sairam
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



const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
const validateSection = require("./middlewares/validateSection"); // Import the validateSection. Created by Sairam
const validateAccount = require("./middlewares/validateAccount");  // Import the validateAccount middleware. Created by Chang Guan Quan
const validateEducator = require("./middlewares/validateEducator"); // Import the accountController. Created by Chang Guan Quan

const coursesController = require("./controllers/courseController"); // Import the CoursesController. Created by Sairam
const sectionDetailsController = require("./controllers/sectionDetailController"); // Import the SectionDetailsController. Created by Sairam
const accountController = require("./controllers/accountController"); // Import the accountController. Created by Chang Guan Quan
const educatorController = require("./controllers/educatorController"); // Import the educatorController. Created by Chang Guan Quan

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

// Route to serve the signup page HTML file (signup page)
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/public/login-signup-pages/signup.html");
});

// Route to serve the student.html (TEAM 4 - Sairam, Pey Zhi Xun, Keshwindren Gandipanh, Chang Guan Quan)
app.get('/student', (req, res) => {
  res.sendFile(__dirname + "/public/student.html");
});

// Route to serve creator.html (Created By: Sairam)
app.get('/creator', (req, res) => {
  res.sendFile(__dirname + "/public/educator-pages/creator.html");
});

// Route to serve community.html
app.get('/community', (req, res) => {
  res.sendFile(__dirname + "/public/educator-pages/community.html");
});

// Route to serve profile.html
app.get('/profile', (req, res) => {
  res.sendFile(__dirname + "/public/educator-pages/profile.html");
});

// Serve quiz.html from a different route
app.get('/manage-quizzes', (req, res) => {
  res.sendFile(__dirname + "/public/educator-pages/manage-quizzes.html");
});


// Routes for handling course-related requests (Created by: Sairam)
app.get("/courses-creator/:creator", coursesController.getCourseByCreator); // Get courses by creator
app.get("/courses-with-sections-id/:CourseId", coursesController.getCourseWithSectionById); // Get course and section by ID
app.put("/courses-id/:CourseId",validateCourse, coursesController.updateCourse); // Update course by ID
app.put("/courses-icon/:CourseId", imageupload.single('Thumbnail'), coursesController.updateCourseIcon); // Update course by ID

// Routes for handling sections-related requests (Created by: Sairam)
app.get("/sectionDetails-id/:id/:SectionNo", sectionDetailsController.getSectionDetailsById);
app.put("/sectionDetails/:id/:SectionNo", videoupload.single('Video'),validateSection,sectionDetailsController.updateSectionDetails);

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.get("/accounts", accountController.getAllAccounts);
app.get("/account/:accId", accountController.getAccountById);
app.post("/account/login", validateAccount.validateEmailPassword, accountController.verifyAccount);
app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
app.put("/account/update/verifyPersonalDetails/:accId",validateAccount.validatePersonalDetails, accountController.updateAccount);

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.post("/educator/createEducator/:eduId", validateEducator.validateQualification, educatorController.createEducator);

// Mount the routers for handling quiz-related requests (Created by: Pey Zhi Xun)
app.use("/api/quizzes", quizRouter);
app.use("/api/questions", questionRouter);
app.use("/api/options", optionRouter);

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