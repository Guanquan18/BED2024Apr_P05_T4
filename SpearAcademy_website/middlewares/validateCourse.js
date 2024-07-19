// Entirely Created By: Sairam (S10259930H)

// Import Joi for input validation
const Joi = require("joi");

// Middleware function to validate course data
const validateCourse = (req, res, next) => {
   // Define the schema for course validation using Joi
  const schema = Joi.object({
    CourseTitle: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Course title is required', // Error message for empty course title
      'string.min': 'Course title should have a minimum length of {#limit}', // Error message for course title below minimum length
      'string.max': 'Course title should not exceed {#limit} characters' // Error message for course title exceeding maximum length
    }),
    SmallDescription: Joi.string().min(3).max(255).required().messages({
      'string.empty': 'Small description is required',  // Error message for empty small description
      'string.min': 'Small description should have a minimum length of {#limit}', // Error message for small description below minimum length
      'string.max': 'Small description should not exceed {#limit} characters' // Error message for small description exceeding maximum length
    }),
    Description: Joi.string().min(10).required().messages({
      'string.empty': 'Description is required', // Error message for empty description
      'string.min': 'Description should have a minimum length of {#limit}' // Error message for description below minimum length
    }),
    Label: Joi.string().allow(null, '').max(50).messages({
      'string.max': 'Label should not exceed {#limit} characters' // Error message for label exceeding maximum length
    }),
    Badge: Joi.string().allow(null, '').max(50).messages({
      'string.max': 'Badge should not exceed {#limit} characters' // Error message for badge exceeding maximum length
    }),
  });
  // Validate the request body against the schema
  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    // Extract validation errors from Joi's validation result
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateCourse;
