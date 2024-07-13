  /* 
Function Created
Sairam (S10255930H)
- app.get("/courses-creator/:creator", CoursesController.getCourseByCreator);
- app.get("/courses-with-sections-id/:CourseId", CoursesController.getCourseWithSectionById);
- app.put("/courses-id/:CourseId",CoursesController.updateCourse); 
- app.get("/sectionDetails-id/:id/:SectionNo", SectionDetailsController.getSectionDetailsById);
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
- 
-
-

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


const validateCourse = require("./middlewares/validateCourse");  // Import the validateCourse middleware. Created by Sairam
const validateAccount = require("./middlewares/validateAccount");  // Import the validateAccount middleware. Created by Chang Guan Quan
const validateEducator = require("./middlewares/validateEducator"); // Import the accountController. Created by Chang Guan Quan

const CoursesController = require("./controllers/coursesController"); // Import the CoursesController. Created by Sairam
const SectionDetailsController = require("./controllers/sectionDetailsController"); // Import the SectionDetailsController. Created by Sairam
const accountController = require("./controllers/accountController"); // Import the accountController. Created by Chang Guan Quan
const educatorController = require("./controllers/educatorController"); // Import the educatorController. Created by Chang Guan Quan

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




// Routes for handling course-related requests (Created by: Sairam)
app.get("/courses-creator/:creator", CoursesController.getCourseByCreator); // Get courses by creator
app.get("/courses-with-sections-id/:CourseId", CoursesController.getCourseWithSectionById); // Get course and section by ID
app.put("/courses-id/:CourseId",validateCourse, CoursesController.updateCourse); // Update course by ID

// Routes for handling sections-related requests (Created by: Sairam)
app.get("/sectionDetails-id/:id/:SectionNo", SectionDetailsController.getSectionDetailsById);

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.get("/accounts", accountController.getAllAccounts);
app.get("/account/:accId", accountController.getAccountById);
app.post("/account/login", validateAccount.validateEmailPassword, accountController.verifyAccount);
app.post("/account/signup/createAccount",validateAccount.validateEmailPassword, accountController.createAccount);
app.put("/account/update/verifyPersonalDetails/:accId",validateAccount.validatePersonalDetails, accountController.updateAccount);

// Routes for handling educator-related requests (Created by: Chang Guan Quan)
app.post("/educator/createEducator/:eduId", validateEducator.validateQualification, educatorController.createEducator);

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