// Entirely Created By: Sairam (S10259930H)

// Import the Section model
const Section = require("../models/sectionDetail");

// Controller function to get section details by ID
// Created By: Sairam (S10259930H)
const getSectionDetailsById = async (req, res) => {
  // Parse CourseId and SectionNo from request parameters
  const courseId = parseInt(req.params.id);
  const sectionNo = parseInt(req.params.sectionNo); 
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

// Controller function to Update section details
// Created By: Sairam (S10259930H)
const updateSectionDetails = async (req, res) => {
const CourseId = parseInt(req.params.id); // Parse course ID from request parameters
const sectionNo = parseInt(req.params.sectionNo);

try {
  const sectionTitle = req.body.SectionTitle; // Get section title from request body

  let newSectionDetail = {};
  if (sectionTitle) {
    newSectionDetail.SectionTitle = sectionTitle; // Update section title if provided
  }
  if (req.file) {
    newSectionDetail.Video = '../videos/' + req.file.filename; // Update video if file is provided
  }

  const updatedSection = await Section.updateSectionDetails(CourseId, sectionNo, newSectionDetail); // Update section details using the model function

  if (!updatedSection) {
    return res.status(404).send('Section not found'); // Handle case where section is not found
  }

  res.json(updatedSection); // Send success response
} catch (error) {
  console.error("Update Section Error:", error);
  res.status(500).send('Error updating section');
}
};

// Controller function to create section details
// Created By: Sairam (S10259930H)
const createSection = async (req, res) => {
const courseId = parseInt(req.params.courseId); // Parse course ID from request parameters

try {
    // Extract section details from request body
    const newSectionData = {
        SectionTitle: req.body.SectionTitle,
        Video: '../videos/' + req.file.filename,
    };

    // Call the model method to create a new section
    const createdSection = await Section.createSection(courseId, newSectionData); // Call the model method to create a new section

    if (!createdSection) {
        return res.status(404).send('Section not created'); // Handle case where section creation fails
    }

    res.json(createdSection); // Send success response with created section data
} catch (error) {
    console.error('Error creating section:', error);
    res.status(500).send('Error creating section');
}
};

// Controller function to Delete section details
// Created By: Sairam (S10259930H)
const deleteSectionDetails = async (req, res) => {
const sectionNo = parseInt(req.params.sectionNo); // Extract section number from request parameters

try {
    // Call the model method to delete section details
    const success = await Section.deleteSectionDetails(sectionNo);
    console.log(success)

    if (!success) {
      // Handle case where section details are not found
        return res.status(404).send('Section details not found');
    }

    res.status(204).send('successfully deleted');  // Send success response for deletion
} catch (error) {
    console.error('Error deleting section details:', error);
    res.status(500).send('Error deleting section details');
}
};

module.exports = {
getSectionDetailsById,
updateSectionDetails,
createSection,
deleteSectionDetails
};