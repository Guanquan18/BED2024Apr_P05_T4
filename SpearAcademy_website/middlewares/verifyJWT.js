const jwt = require("jsonwebtoken");
require('dotenv').config();

function verifyJWT(req, res, next) {
    // Extract the token from the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" }); // Unauthorized if no token
    }
  
    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      
      if (err) {
        return res.status(403).json({ message: "Forbidden" });  // Forbidden if token is invalid
      }
  
      // Check user role for authorization (replace with your logic)
      const authorizedRoles = {

        /*  Chang Guan Quan's Paths   */
        "/account/update/updatePersonalDetails/[0-9]+": ["Student", "Educator"], // Any signed in users can update personal details
        "/educator/createEducator/[0-9]+": ["Educator"], // Only Educators can create Educators

        /*  S.Sairam's Paths   */
        "/courses-creator/[0-9]+" : ["Educator"], // Only Educators can view their courses
        "/courses" : ["Student", "Educator"], // Students and Educator can view all courses in student.html
        "/courses-with-sections-id/[0-9]+" : ["Educator"], // Only Educators can view their courses and sections
        "/courses-id/[0-9]+" : ["Educator"], // Only Educators can update course details
        "/courses-icon/[0-9]+" : ["Educator"],// Only Educators can update course icon
        "/new-course/[0-9]+" : ["Educator"],// Only Educators can create courses
        "/delete-course/[0-9]+" : ["Educator"],// Only Educators can delete their courses

        /*  S.Sairam's Paths   */
        "/sectionDetails-id/[0-9]+/[0-9]+" : ["Educator"],// Only Educators can view their sectionDetails
        "/sectionDetails/[0-9]+/[0-9]+" : ["Educator"],// Only Educators update their sectionDetails
        "/new-sectionDetails/[0-9]+" : ["Educator"],// O// Only Educators can create their sectionDetails
        "/delete-sectionDetails/[0-9]+" : ["Educator"],// Only Educators can delete their sectionDetails

        /*  PeyZhiXun's Paths   */
        "/api/quizzes/[0-9]+" : ["Educator"],// Only Educators can view quizzes
        "/api/quizzes" : ["Educator"],// Only Educators can view quizzes
        "/api/questions/[0-9]+/questions" : ["Educator"],// Only Educators can view questions
        "/api/options/[0-9]+" : ["Educator"],// Only Educators can view options

        /*  Keshwindren's Paths   */
        "/comments-QnA/[0-9]+" : ["Educator"],// Students and Educators can view comments
        "/comments/[0-9]+" : ["Educator"],// Students and Educators can view comments
        "/comments" : ["Educator"],// Students and Educators can view comments
      };

      const requestedEndpoint = req.url;  // Get the requested endpoint
      const accountRole = decoded.Role;  // Get the user role from the decoded token

      // Check if the user role is authorized to access the requested endpoint
      const authorizedRole = Object.entries(authorizedRoles).find(
        ([endpoint, roles]) => {
          const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
          return regex.test(requestedEndpoint) && roles.includes(accountRole);
        }
      );
  
      if (!authorizedRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.account = decoded; // Attach decoded user information to the request object
      next();
    });
}

module.exports = {
  verifyJWT
};
