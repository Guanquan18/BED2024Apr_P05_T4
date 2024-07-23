// Entirely Created By: Sairam (S10259930H)
// Import Joi for schema validation
const Joi = require("joi");

// Middleware function to validate section data
const validateSection = (req, res, next) => {
    // Log request body and file for inspection and debugging
    console.log("Request body in validation:", req.body);
    console.log("Request file in valiation:", req.file); 

    // Define the validation schema for section data using Joi
    const schema = Joi.object({
        SectionTitle: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Section title is required', // Error message for empty section title
            'string.min': 'Section title should have a minimum length of {#limit}', // Error message for section title below minimum length
            'string.max': 'Section title should not exceed {#limit} characters' // Error message for section title exceeding maximum length
        }),
        
    });

    const validation = schema.validate(req.body, { abortEarly: false }); // Validate req.body as an object

    if (validation.error) {
        console.error(validation.error); // Log the validation error for debugging
        const errors = validation.error.details.map((error) => error.message);
        return res.status(400).json({ message: "Validation error", errors });
    }

    next(); // Proceed to the route handler if validation passes
};

module.exports = validateSection;
