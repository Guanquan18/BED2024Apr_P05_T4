const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig'); // Ensure the path is correct

const router = express.Router();

// Middleware to connect to the database
router.use(async (req, res, next) => {
    try {
        req.pool = await sql.connect(dbConfig);
        next();
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send({ error: 'Database connection error' });
    }
});

// Update quiz
router.put('/quiz/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const { QuizTitle } = req.body;

    try {
        const result = await req.pool.request()
            .input('QuizId', sql.Int, quizId)
            .input('QuizTitle', sql.NVarChar, QuizTitle)
            .query('UPDATE Quiz SET QuizTitle = @QuizTitle WHERE QuizId = @QuizId');

    } catch (err) {
        console.error('Error updating quiz:', err);
        res.status(500).send({ error: 'Error updating quiz' });
    }
});

// Create quiz
router.post('/quiz', async (req, res) => {
    const { QuizTitle, Section_Quiz, Course_Quiz } = req.body;
    try {
        const result = await req.pool.request()
            .input('QuizTitle', sql.NVarChar, QuizTitle)
            .input('Section_Quiz', sql.Int, Section_Quiz)
            .input('Course_Quiz', sql.Int, Course_Quiz)
            .query('INSERT INTO Quiz (QuizTitle, Section_Quiz, Course_Quiz) OUTPUT INSERTED.QuizId VALUES (@QuizTitle, @Section_Quiz, @Course_Quiz)');
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});


// Fetch all quizzes
router.get('/quizzes', async (req, res) => {
    try {
        const result = await req.pool.request().query(`
            SELECT 
                Q.QuizId, 
                Q.QuizTitle, 
                Q.Section_Quiz, 
                COUNT(QU.QuestionNo) AS QuestionsCount
            FROM 
                Quiz Q
            LEFT JOIN 
                Question QU ON Q.QuizId = QU.Quiz_Question
            GROUP BY 
                Q.QuizId, Q.QuizTitle, Q.Section_Quiz
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching quizzes:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete quiz
router.delete('/quiz/:quizId', async (req, res) => {
    const { quizId } = req.params;

    try {
        // Get the Section_Quiz associated with the quizId
        const sectionResult = await req.pool.request()
            .input('quizId', sql.Int, quizId)
            .query('SELECT Section_Quiz FROM Quiz WHERE QuizId = @quizId');

        if (sectionResult.recordset.length === 0) {
            return res.status(404).send({ error: 'Quiz not found' });
        }

        const sectionQuiz = sectionResult.recordset[0].Section_Quiz;

        // Delete the quiz first
        await req.pool.request()
            .input('quizId', sql.Int, quizId)
            .query('DELETE FROM Quiz WHERE QuizId = @quizId');

        // Check if there are other quizzes referencing the same section
        const otherQuizzesResult = await req.pool.request()
            .input('sectionQuiz', sql.Int, sectionQuiz)
            .query('SELECT COUNT(*) as count FROM Quiz WHERE Section_Quiz = @sectionQuiz');

        if (otherQuizzesResult.recordset[0].count === 0) {
            // If no other quizzes reference the section, delete the section
            await req.pool.request()
                .input('sectionQuiz', sql.Int, sectionQuiz)
                .query('DELETE FROM SectionDetails WHERE SectionNo = @sectionQuiz');
        }

        res.send({ message: 'Quiz and related sections deleted successfully' });
    } catch (err) {
        console.error('Error deleting quiz:', err);
        res.status(500).send({ error: 'Error deleting quiz' });
    }
});


// Export the router
module.exports = router;
