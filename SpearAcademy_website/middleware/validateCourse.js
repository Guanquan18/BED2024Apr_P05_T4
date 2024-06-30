const Joi = require("joi");

const validateCourse = (req, res, next) => {
  const schema = Joi.object({
    CourseTitle: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Course title is required',
      'string.min': 'Course title should have a minimum length of {#limit}',
      'string.max': 'Course title should not exceed {#limit} characters'
    }),
    SmallDescription: Joi.string().min(3).max(255).required().messages({
      'string.empty': 'Small description is required',
      'string.min': 'Small description should have a minimum length of {#limit}',
      'string.max': 'Small description should not exceed {#limit} characters'
    }),
    Description: Joi.string().min(10).required().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description should have a minimum length of {#limit}'
    }),
    Label: Joi.string().allow(null, '').max(50).messages({
      'string.max': 'Label should not exceed {#limit} characters'
    }),
    Badge: Joi.string().allow(null, '').max(50).messages({
      'string.max': 'Badge should not exceed {#limit} characters'
    }),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    // Extract validation errors from Joi's validation result
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateCourse;
