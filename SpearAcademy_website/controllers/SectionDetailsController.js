// Entirely Created By: Sairam (S10259930H)
const Section = require("../models/SectionDetails");
// getting sections by id
const getSectionDetailsById = async (req, res) => {
    // Parse CourseId and SectionNo from request parameters
    const courseId = parseInt(req.params.id);
    const sectionNo = parseInt(req.params.SectionNo); 
    try {
      const section = await Section.getSectionDetailsById(courseId,sectionNo);   // Fetch section details using CourseId and SectionNo
      if (!section) {
        return res.status(404).send("Section not found");  // Handle case where section is not found
      }
      res.json(section);  // Send section details as JSON response
    } catch (error) {
      console.error(error);  // Log error and send server error response
      res.status(500).send("Error retrieving Section");
    }
  };

  module.exports = {
    getSectionDetailsById
  };