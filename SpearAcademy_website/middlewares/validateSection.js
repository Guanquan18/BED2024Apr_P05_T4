const Joi = require("joi");

const validateSection = (req, res, next) => {
    console.log("Request body in validation:", req.body);
    console.log("Request file in valiation:", req.file); // Log req.body and req.file to inspect their contents

    const schema = Joi.object({
        SectionTitle: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Section title is required',
            'string.min': 'Section title should have a minimum length of {#limit}',
            'string.max': 'Section title should not exceed {#limit} characters'
        }),
        // Define other properties you expect in req.body here
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
