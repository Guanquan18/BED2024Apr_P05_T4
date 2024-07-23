const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  // Extract the token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); // Unauthorized if no token
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    
    if (err) {
      return res.status(403).json({ message: "Forbidden" });  // Forbidden if token is invalid
    }

    // Check user role for authorization (replace with your logic)
    const authorizedRoles = {
      "/books": ["member", "librarian"], // Anyone can view books
      "/books/[0-10]+/availability": ["librarian"], // Only librarians can update availability
    };

    const requestedEndpoint = req.url;  // Get the requested endpoint
    const userRole = decoded.role;  // Get the user role from the decoded token

    // Check if the user role is authorized to access the requested endpoint
    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
      }
    );

    if (!authorizedRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

module.exports = verifyJWT;