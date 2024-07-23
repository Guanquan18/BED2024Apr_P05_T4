const express = require('express');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

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

// Get options for a question
router.get('/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await req.pool.request()
            .input('questionId', sql.Int, questionId)
            .query('SELECT * FROM [Option] WHERE Question_Option = @questionId');
        if (result.recordset.length === 0) {
            console.log(`No options found for questionId: ${questionId}`);
            return res.status(404).send({ error: 'Options not found for this question' });
        }
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching options:', error);
        res.status(500).json({ error: 'Error fetching options' });
    }
});

module.exports = router;
