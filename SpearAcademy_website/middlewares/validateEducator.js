const Joi = require("joi");

const validateQualification = (req, res, next) => {
  const schema = Joi.object({
    professionalTitle: Joi.string().required(),
    organisation: Joi.string().required(),
    highestDegree: Joi.string().required(),
    yearsOfExperience: Joi.number().integer().min(0).required(),
    fieldOfStudy: Joi.string().required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  next(); // If validation passes, proceed to the next route handler
}

module.exports = {
  validateQualification,
};