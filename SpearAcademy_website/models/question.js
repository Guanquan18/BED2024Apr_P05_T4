const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig'); // Ensure the path is correct

const router = express.Router();


router.post('/', async (req, res) => {
    const { QuestionTitle, Quiz_Question } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('QuestionTitle', sql.NVarChar, QuestionTitle)
            .input('Quiz_Question', sql.Int, Quiz_Question)
            .query('INSERT INTO Question (QuestionTitle, Quiz_Question) OUTPUT INSERTED.QuestionNo VALUES (@QuestionTitle, @Quiz_Question)');
        
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Error creating question' });
    }
});

// Get questions for a quiz
router.get('/:quizId/questions', async (req, res) => {
    const { quizId } = req.params;
    try {
        const connection = await sql.connect(dbConfig);
        const result = await connection.request()
            .input('QuizId', sql.Int, quizId)
            .query("SELECT * FROM Question WHERE Quiz_Question = @QuizId");
        connection.close();
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching questions', error: err.message });
    }
});

module.exports = router;
