// Entirely Created By: Sairam (S10259930H)
const Course = require("../models/Course"); // Import the Course model

// Controller function to get courses by creator.  Created By: Sairam (S10259930H)
const getCourseByCreator = async (req, res) => {
  const creator = parseInt(req.params.creator); // Parse creator ID from request parameters
  try {
    const course = await Course.getCourseByCreator(creator); // Fetch courses by creator from the model
    if (!course) {
      return res.status(404).send("Course not found");  // Return 404 if no courses found
    }
    res.json(course); // Send the course data as JSON response
  } catch (error) {
    console.error(error); // Log error to the console
    res.status(500).send("Error retrieving course"); // Send 500 status code for server error
  }
};

// Controller function to get course and section by ID.  Created By: Sairam (S10259930H)
const getCourseWithSectionById = async (req, res) => {
  const id = parseInt(req.params.CourseId);  // Parse the CourseId from request parameters
  try {
    const course = await Course.getCourseWithSectionById(id); // Attempt to fetch course details by id
    if (!course) {
      return res.status(404).send("Course not found"); // Handle case where no course is found
    }
    res.json(course);
  } catch (error) {
    console.error(error);  // Log and respond with server error if retrieval fails
    res.status(500).send("Error retrieving course");
  }
};


// Controller function to update a course.  Created By: Sairam (S10259930H)
const updateCourse = async (req, res) => {
  const CourseId = parseInt(req.params.CourseId); // Parse course ID from request parameters
  const newCourseData = req.body; // Get new course data from request body

  try {
    const updatedCourse = await Course.updateCourse(CourseId, newCourseData); // Update the course in the model
    if (!updatedCourse) {
      return res.status(404).send("Course not found"); // Return 404 if course not found
    }
    res.json(updatedCourse); // Send the updated course data as JSON response
  } catch (error) {
    console.error(error);  // Log error to the console
    res.status(500).send("Error updating Course"); // Send 500 status code for server error
  }
};
module.exports = {
  getCourseByCreator,
  getCourseWithSectionById,
  updateCourse,
};