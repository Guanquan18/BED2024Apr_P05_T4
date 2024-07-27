const Joi = require("joi");

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
    .pattern(/^\d{4}\/\d{2}\/\d{2}$/) // Ensure the format is yyyy/MM/dd
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
  const [year, month, day] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
    return value; // Valid date
  }
  return helpers.error("any.invalid"); // Invalid date
};

const validateSocialMedia = (req, res, next) => {
  const schema = Joi.object({
    linkedIn: Joi.string().uri().optional(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next(); // If validation passes, proceed to the next route handler
}

const validatePassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(4).max(20).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next(); // If validation passes, proceed to the next route handler
}

module.exports = {
  validateEmailPassword, 
  validatePersonalDetails,
  validateSocialMedia
};