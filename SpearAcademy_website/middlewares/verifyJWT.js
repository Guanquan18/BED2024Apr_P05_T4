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

        "/authenticated": ["Student", "Educator"], // Any signed in users can access this endpoint

        /*  Chang Guan Quan's Paths   */
        "/account/[0-9]+": ["Student", "Educator"], // Any signed in users can view their profile details
        "/account/updatePersonalDetails/[0-9]+": ["Student", "Educator"], // Any signed in users can update personal details
        "/account/updateProfilePicture/[0-9]+": ["Student", "Educator"], // Any signed in users can update profile picture
        "/account/updateSocialMedia/[0-9]+": ["Student", "Educator"], // Any signed in users can update social media
        "/account/resetPassword/[0-9]+": ["Student", "Educator"], // Any signed in users can reset password
        "/account/requestDeleteAccountOTP/[0-9]+": ["Student", "Educator"], // Any signed in users can request OTP for account deletion
        "/account/deleteAccount/[0-9]+": ["Student", "Educator"], // Any signed in users can delete account
        "/account/updateSocialMedia/[0-9]+": ["Student", "Educator"], // Any signed in users can update social media
        "/account/updatePassword/[0-9]+": ["Student", "Educator"], // Any signed in users can update password

        /*  Chang Guan Quan's Paths   */
        "/educator/createEducator/[0-9]+": ["Educator"], // Only Educators can create Educators
        "/educator/[0-9]+": ["Educator"], // Only Educators can view Educators
        "/educator/update/[0-9]+": ["Educator"], // Only Educators can update Educators

        /*  S.Sairam's Paths   */
        "/courses-creator/[0-9]+" : ["Educator"], // Only Educators can view their courses
        "/courses" : ["Student"], // Students can view all courses in student.html
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

      // Ensure that the user can only access their own Account data if params secifies an account ID
      if(req.params.accId){
        req.params.accId = decoded.AccId;
      }
      // Ensure that the user can only access their own Account data if params secifies an account ID
      if(req.params.eduId){
        req.params.eduId = decoded.AccId;
      }

      req.account = decoded; // Attach decoded user information to the request object
      next();
    });
}



module.exports = {
  verifyJWT
};
