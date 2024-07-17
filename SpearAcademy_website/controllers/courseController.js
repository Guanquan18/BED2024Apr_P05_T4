// Entirely Created By: Sairam (S10259930H)
const Course = require('../models/Course'); // Import the Course model
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

// Controller function to all courses.  Created By: Sairam (S10259930H)
const getCourses = async (req, res) => {
  try {
    const courses = await Course.getCourses(); // Fetch courses by creator from the model
    if (!courses) {
      return res.status(404).send("Courses not found");  // Return 404 if no courses found
    }
    res.json(courses); // Send the course data as JSON response
  } catch (error) {
    console.error(error); // Log error to the console
    res.status(500).send("Error retrieving courses"); // Send 500 status code for server error
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

// Controller function to update a course icon.  Created By: Sairam (S10259930H)
const updateCourseIcon = async (req, res) => {
  const CourseId = parseInt(req.params.CourseId); // Parse course ID from request parameters

  try {
    const newCourseIcon = {
      Thumbnail: '../Images/courses/' + req.file.filename // Assuming you have handled file upload elsewhere
    };

    const updatedIcon = await Course.updateCourseIcon(CourseId, newCourseIcon);

    if (!updatedIcon) {
      return res.status(404).send('Course not found');
    }
    
    res.json(updatedIcon); // Send success response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating course');
  }
};
// Controller function to create a course.  Created By: Sairam (S10259930H)
const createCourse = async (req, res) => {
  const creatorId = parseInt(req.params.creatorId);
  try {
    // Initialize an object to hold the new course data
    let newCourseData = {};

    // Extract mandatory fields from the request body
    newCourseData.CourseTitle = req.body.CourseTitle;
    newCourseData.SmallDescription = req.body.SmallDescription;
    newCourseData.Description = req.body.Description;

    // Handle file upload for CourseIcon
    if (req.file) {
      newCourseData.Thumbnail = '../Images/courses/' + req.file.filename;
    }

    // Handle optional fields
    if (req.body.Label) {
      newCourseData.Label = req.body.Label;
    }
    if (req.body.Badge) {
      newCourseData.Badge = req.body.Badge;
    }

    // Call the model function to create a new course
    const createdCourse = await Course.createCourse(creatorId, newCourseData);

    // Send the created course as the response
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating course");
  }
};
// Controller function to delete  a course.  Created By: Sairam (S10259930H)
const deleteCourseAndDetails = async (req, res) => {
  const courseId = parseInt(req.params.courseId); // Extract course ID from request parameters

  try {
    // Call the model method to delete course and associated details
    const success = await Course.deleteCourseAndDetails(courseId);

    if (!success) {
      return res.status(404).send('Course details not found');
    }

    res.status(204).send('Course and associated details successfully deleted');
  } catch (error) {
    console.error('Error deleting course and details:', error);
    res.status(500).send('Error deleting course and details');
  }
};

module.exports = {
  getCourseByCreator,
  getCourses,
  getCourseWithSectionById,
  updateCourse,
  updateCourseIcon,
  createCourse,
  deleteCourseAndDetails
};