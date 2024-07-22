const Joi = require("joi");
const jwt = require("jsonwebtoken");

const validateEmailPassword = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
    role: Joi.string().valid("Student", "Educator").optional(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: `Validation failed. ${errors}`, errors });
  }

  next(); // If validation passes, proceed to the next route handler
};

const validatePersonalDetails = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    contactNo: Joi.string()
      .pattern(/^[0-9]{10,}$/) // Ensure the phone number is at least 10 digits
      .required(),
    dob: Joi.string().required()
      .pattern(/^\d{2}\/\d{2}\/\d{4}$/) // Ensure the format is dd/MM/yyyy
      .custom(customDateValidation, "custom date validation")
      .required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next(); // If validation passes, proceed to the next route handler
}

const customDateValidation = (value, helpers) => {
  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
    return value; // Valid date
  }
  return helpers.error("any.invalid"); // Invalid date
};

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
  validateEmailPassword, 
  validatePersonalDetails,
  verifyJWT
};