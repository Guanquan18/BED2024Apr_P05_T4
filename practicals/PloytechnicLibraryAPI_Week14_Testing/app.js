const express = require("express"); // Import the Express module
const sql = require("mssql"); // Import the mssql module
const dbConfig = require("./dbConfig"); // Import the database configuration
const bodyParser = require("body-parser"); // Import body-parser for parsing request bodies

// import middlewares
const verifyJWT = require("./middlewares/validateUser");
// import controllers
const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");


const app = express(); // Create an Express application
const port = process.env.PORT || 3000; // Use environment variable or default port

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.get("/books", verifyJWT, bookController.getAllBooks);
app.put("/books/:bookId/availability", verifyJWT, bookController.updateBookAvailability);

app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);


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