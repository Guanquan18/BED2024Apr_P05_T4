const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "SpearAcademy API",
    description: `
      This API compliments the progression of education in Southeast Asia as a proper education system plays a pivotal role in preparing the region for various economic, social and technological changes. Taking inspiration from some already existing systems such as Udemy and Reddit, this API, SpearAcademyAPI, powers the learning process in a much more collaborative and efficient way and the functions of SpearAcademy include::

      - Course Management: Create, update, retrieve, and delete courses along with associated media (images, videos).
      - Section Management: Manage detailed sections within courses, including CRUD operations and media uploads.
      - Account Management: Handle user accounts with secure authentication and personal detail updates.
      - Educator Management: Manage educator profiles and their qualifications.
      - Quiz Management: Comprehensive handling of quizzes, questions, and options to support interactive learning.
      - Comment and QnA Management: Enable commenting on courses and QnA sessions to enhance communication.

      **Key Features:**
      - Secure media upload handling using Multer for both images and videos.
      - Data validation using custom middleware to ensure data integrity.
      - Integration with Swagger UI for interactive API documentation and testing.
      - Structured and scalable design for easy extension and maintenance.

      **Requirements:**
      - Node.js and Express for server-side operations.
      - MSSQL for database management.
      - Multer for handling file uploads.
      - Swagger for API documentation.

      This API is designed to be robust and scalable, supporting the complex needs of a modern LMS while ensuring ease of use and security.
    `,
  },
  host: "localhost:3000", // Replace with your actual host if needed
  schemes: ["http", "https"], // List of supported schemes (http, https)
  basePath: "/", // Base path for the API
  tags: [
    {
      name: "Courses",
      description: "Endpoints related to course management",
    },
    {
      name: "Sections",
      description: "Endpoints related to section management within courses",
    },
    {
      name: "Accounts",
      description: "Endpoints related to user account management",
    },
    {
      name: "Educators",
      description: "Endpoints related to educator management",
    },
    {
      name: "Quizzes",
      description: "Endpoints related to quiz management",
    },
    {
      name: "Comments",
      description: "Endpoints related to comment management",
    },
    {
      name: "QnA",
      description: "Endpoints related to QnA management",
    },
  ],
  definitions: {}, // Define the schema for your API objects if needed
};

swaggerAutogen(outputFile, routes, doc);
