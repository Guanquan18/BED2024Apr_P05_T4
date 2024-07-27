const express = require('express');
const sql = require('mssql');
const dbConfig = require('../config/dbConfig');
const verifyJWT = require('../middlewares/verifyJWT');

const firstpath = '/api/questions';

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

// Get questions for a quiz
router.get('/:quizId/questions', 
    async (req, res, next) => {
        let url = req.url;
        req.url = `${firstpath}${url}`;
        next();
    },
    verifyJWT.verifyJWT,
    
    async (req, res) => {
    const { quizId } = req.params;
    try {
        const result = await req.pool.request()
            .input('quizId', sql.Int, quizId)
            .query('SELECT * FROM Question WHERE Quiz_Question = @quizId');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

module.exports = router;
