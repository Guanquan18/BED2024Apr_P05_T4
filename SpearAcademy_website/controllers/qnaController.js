const QnA = require('../models/qna');  // Import the QnA model

// Controller method to get QnA entries by CourseId
const getQnAByCourseId = async (req, res) => {
    try {
        const courseId = parseInt(req.params.courseId); // Get CourseId from URL parameters

        if (isNaN(courseId)) {
            return res.status(400).send("Invalid Course ID"); // Handle invalid CourseId
        }

        const qnaEntries = await QnA.getQnAByCourseId(courseId);

        if (Array.isArray(qnaEntries) && qnaEntries.length > 0) {
            res.json(qnaEntries); // Send QnA entries as JSON response
        } else {
            res.status(404).send("No QnA entries found for this Course"); // Handle no entries found
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving QnA entries"); // Handle server errors
    }
};

module.exports = {
    getQnAByCourseId
};
