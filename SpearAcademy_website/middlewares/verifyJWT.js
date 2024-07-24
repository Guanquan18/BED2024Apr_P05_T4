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
        "/account/update/updatePersonalDetails": ["Student", "Educator"], // Any signed in users can update personal details
        "/educator/createEducator": ["Educator"], // Only Educators can create Educators

        "/courses-creator/[0-9]+" : ["Educator"], // Only Educators can view their courses
        "/courses" : ["Student"], // Students can view courses
        "/courses-with-sections-id/[0-9]+" : ["Student","Educator"],
        "/courses-id/[0-9]+" : ["Student","Educator"], 
        "/courses-icon/[0-9]+" : ["Student","Educator"],
        "/new-course/[0-9]+" : ["Student","Educator"],
        "/delete-course/[0-9]+" : ["Student","Educator"],

        "/sectionDetails-id/[0-9]+/[0-9]+" : ["Student","Educator"],
        "/sectionDetails/[0-9]+/[0-9]+" : ["Student","Educator"],
        "/new-sectionDetails/[0-9]+" : ["Student","Educator"],
        "/delete-sectionDetails/[0-9]+" : ["Student","Educator"],
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
