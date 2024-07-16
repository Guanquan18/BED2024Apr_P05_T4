// Entirely Created By: Sairam (S10259930H)
const Section = require("../models/sectionDetails");
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
 
// Update section details
const updateSectionDetails = async (req, res) => {
  const CourseId = parseInt(req.params.id); // Parse course ID from request parameters
  const sectionNo = parseInt(req.params.SectionNo);

  try {
    const sectionTitle = req.body.SectionTitle; // Get section title from request body

    let newSectionDetail = {};
    if (sectionTitle) {
      newSectionDetail.SectionTitle = sectionTitle; // Update section title if provided
    }
    if (req.file) {
      newSectionDetail.Video = '../videos/' + req.file.filename; // Update video if file is provided
    }

    const updatedSection = await Section.updateSectionDetails(CourseId, sectionNo, newSectionDetail);

    if (!updatedSection) {
      return res.status(404).send('Section not found'); // Handle case where section is not found
    }

    res.json(updatedSection); // Send success response
  } catch (error) {
    console.error("Update Section Error:", error);
    res.status(500).send('Error updating section');
  }
};


module.exports = {
getSectionDetailsById,
updateSectionDetails
};