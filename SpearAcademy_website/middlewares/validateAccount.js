const Joi = require("joi");

const validateEmailPassword = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(20).required(),
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
      .pattern(/^[0-9]{8}$/) // Updated pattern to allow exactly 8 digits
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

module.exports = {
  validateEmailPassword, 
  validatePersonalDetails,
};