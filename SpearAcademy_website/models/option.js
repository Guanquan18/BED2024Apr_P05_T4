const express = require('express');
const sql = require('mssql');
const dbConfig = require('../config/dbConfig'); // Ensure the path is correct

const router = express.Router();


router.post('/', async (req, res) => {
    const { OptionName, IsCorrectOption, Explanation, Question_Option } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('OptionName', sql.NVarChar, OptionName)
            .input('IsCorrectOption', sql.Bit, IsCorrectOption)
            .input('Explanation', sql.NVarChar, Explanation)
            .input('Question_Option', sql.Int, Question_Option)
            .query('INSERT INTO Option (OptionName, IsCorrectOption, Explanation, Question_Option) OUTPUT INSERTED.OptionNo VALUES (@OptionName, @IsCorrectOption, @Explanation, @Question_Option)');
        
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error creating option:', error);
        res.status(500).json({ error: 'Error creating option' });
    }
});

// Get options for a question
router.get('/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        const connection = await sql.connect(dbConfig);
        const result = await connection.request()
            .input('QuestionId', sql.Int, questionId)
            .query("SELECT * FROM [Option] WHERE Question_Option = @QuestionId");
        connection.close();
        res.status(200).send(result.recordset);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching options', error: err.message });
    }
});

module.exports = router;
