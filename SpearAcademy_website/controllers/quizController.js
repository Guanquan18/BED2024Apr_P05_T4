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

// Fetch all quizzes
router.get('/', async (req, res) => {
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



// Create a new quiz with questions and options
router.post('/', async (req, res) => {
    const { QuizTitle, Section_Quiz, Course_Quiz, questions } = req.body;
    const transaction = new sql.Transaction(req.pool);

    try {
        await transaction.begin();

        const quizRequest = new sql.Request(transaction);
        quizRequest.input('QuizTitle', sql.NVarChar, QuizTitle);
        quizRequest.input('Section_Quiz', sql.Int, Section_Quiz);
        quizRequest.input('Course_Quiz', sql.Int, Course_Quiz);

        const quizResult = await quizRequest.query('INSERT INTO Quiz (QuizTitle, Section_Quiz, Course_Quiz) OUTPUT INSERTED.QuizId VALUES (@QuizTitle, @Section_Quiz, @Course_Quiz)');
        const quizId = quizResult.recordset[0].QuizId;

        for (const question of questions) {
            const questionRequest = new sql.Request(transaction);
            questionRequest.input('Quiz_Question', sql.Int, quizId);
            questionRequest.input('QuestionTitle', sql.NVarChar, question.QuestionTitle);
            questionRequest.input('Section_Question', sql.Int, Section_Quiz);

            const questionResult = await questionRequest.query('INSERT INTO Question (Quiz_Question, QuestionTitle, Section_Question) OUTPUT INSERTED.QuestionNo VALUES (@Quiz_Question, @QuestionTitle, @Section_Question)');
            const questionNo = questionResult.recordset[0].QuestionNo;

            for (const option of question.options) {
                const optionRequest = new sql.Request(transaction);
                optionRequest.input('Question_Option', sql.Int, questionNo);
                optionRequest.input('OptionName', sql.NVarChar, option.OptionName);
                optionRequest.input('Explanation', sql.NVarChar, option.Explanation);
                optionRequest.input('IsCorrectOption', sql.Bit, option.IsCorrectOption);
                optionRequest.input('Quiz_Option', sql.Int, quizId);

                await optionRequest.query('INSERT INTO [Option] (Question_Option, OptionName, Explanation, IsCorrectOption, Quiz_Option) VALUES (@Question_Option, @OptionName, @Explanation, @IsCorrectOption, @Quiz_Option)');
            }
        }

        await transaction.commit();
        res.status(201).json({ QuizId: quizId });
    } catch (error) {
        await transaction.rollback();
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});

// Delete Quiz
router.delete('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const transaction = new sql.Transaction(req.pool);

    try {
        await transaction.begin();

        const sectionResult = await transaction.request()
            .input('quizId', sql.Int, quizId)
            .query('SELECT Section_Quiz FROM Quiz WHERE QuizId = @quizId');

        if (sectionResult.recordset.length === 0) {
            console.log('Quiz not found');
            await transaction.rollback();
            return res.status(404).send({ error: 'Quiz not found' });
        }

        const sectionQuiz = sectionResult.recordset[0].Section_Quiz;
        const deleteOptionsResult = await transaction.request()
            .input('quizId', sql.Int, quizId)
            .query(`
                DELETE O FROM [Option] O
                INNER JOIN Question Q ON O.Question_Option = Q.QuestionNo
                WHERE Q.Quiz_Question = @quizId
            `);

        const deleteQuestionsResult = await transaction.request()
            .input('quizId', sql.Int, quizId)
            .query('DELETE FROM Question WHERE Quiz_Question = @quizId');

        const deleteQuizResult = await transaction.request()
            .input('quizId', sql.Int, quizId)
            .query('DELETE FROM Quiz WHERE QuizId = @quizId');

        const otherQuizzesResult = await transaction.request()
            .input('sectionQuiz', sql.Int, sectionQuiz)
            .query('SELECT COUNT(*) as count FROM Quiz WHERE Section_Quiz = @sectionQuiz');

        if (otherQuizzesResult.recordset[0].count === 0) {
            const deleteSectionResult = await transaction.request()
                .input('sectionQuiz', sql.Int, sectionQuiz)
                .query('DELETE FROM SectionDetails WHERE SectionNo = @sectionQuiz');
        }

        await transaction.commit();
        res.send({ message: 'Quiz and related sections deleted successfully' });
    } catch (err) {
        await transaction.rollback();
        console.error('Error deleting quiz:', err);
        res.status(500).send({ error: 'Error deleting quiz' });
    }
});

// Fetch specific quiz details including questions and options
router.get('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        const quizRequest = new sql.Request(req.pool);
        quizRequest.input('QuizId', sql.Int, quizId);
        const quizResult = await quizRequest.query(`
            SELECT Q.QuizId, Q.QuizTitle, QU.QuestionNo, QU.QuestionTitle, QU.Section_Question
            FROM Quiz Q
            LEFT JOIN Question QU ON Q.QuizId = QU.Quiz_Question
            WHERE Q.QuizId = @QuizId
        `);

        if (quizResult.recordset.length === 0) {
            return res.status(404).send({ error: 'Quiz not found' });
        }

        // Group questions by QuizId
        const quiz = {
            QuizId: quizResult.recordset[0].QuizId,
            QuizTitle: quizResult.recordset[0].QuizTitle,
            questions: []
        };

        const questionMap = new Map();
        quizResult.recordset.forEach(row => {
            if (row.QuestionNo) {
                questionMap.set(row.QuestionNo, {
                    QuestionNo: row.QuestionNo,
                    QuestionTitle: row.QuestionTitle,
                    Section_Question: row.Section_Question,
                    options: []
                });
            }
        });

        for (const [questionNo, question] of questionMap.entries()) {
            const optionsRequest = new sql.Request(req.pool);
            optionsRequest.input('QuestionNo', sql.Int, questionNo);
            const optionsResult = await optionsRequest.query(`
                SELECT OptionName, Explanation, IsCorrectOption
                FROM [Option]
                WHERE Question_Option = @QuestionNo
            `);
            question.options = optionsResult.recordset;
            quiz.questions.push(question);
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz details:', error.message);
        res.status(500).json({ error: error.message });
    }
});




router.put('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    const { QuizTitle, questions } = req.body;
    const transaction = new sql.Transaction(req.pool);

    try {
        await transaction.begin();

        // Update the quiz title
        await transaction.request()
            .input('QuizId', sql.Int, quizId)
            .input('QuizTitle', sql.NVarChar, QuizTitle)
            .query('UPDATE Quiz SET QuizTitle = @QuizTitle WHERE QuizId = @QuizId');

        // Delete existing questions and options before inserting the updated ones
        await transaction.request()
            .input('QuizId', sql.Int, quizId)
            .query(`
                DELETE O FROM [Option] O
                INNER JOIN Question Q ON O.Question_Option = Q.QuestionNo
                WHERE Q.Quiz_Question = @QuizId;
                DELETE FROM Question WHERE Quiz_Question = @QuizId;
            `);

        // Insert updated questions and options
        for (const question of questions) {


            const questionRequest = new sql.Request(transaction);
            questionRequest.input('Quiz_Question', sql.Int, quizId);
            questionRequest.input('QuestionTitle', sql.NVarChar, question.QuestionTitle);
            questionRequest.input('Section_Question', sql.Int, question.Section_Question);

            const questionResult = await questionRequest.query(`
                INSERT INTO Question (Quiz_Question, QuestionTitle, Section_Question) 
                OUTPUT INSERTED.QuestionNo 
                VALUES (@Quiz_Question, @QuestionTitle, @Section_Question)
            `);
            const questionNo = questionResult.recordset[0].QuestionNo;

            for (const option of question.options) {
                if (!option.OptionName || !option.Explanation) continue;  // Skip incomplete options
                const optionRequest = new sql.Request(transaction);
                optionRequest.input('Question_Option', sql.Int, questionNo);
                optionRequest.input('OptionName', sql.NVarChar, option.OptionName);
                optionRequest.input('Explanation', sql.NVarChar, option.Explanation);
                optionRequest.input('IsCorrectOption', sql.Bit, option.IsCorrectOption);
                optionRequest.input('Quiz_Option', sql.Int, quizId);

                await optionRequest.query(`
                    INSERT INTO [Option] (Question_Option, OptionName, Explanation, IsCorrectOption, Quiz_Option) 
                    VALUES (@Question_Option, @OptionName, @Explanation, @IsCorrectOption, @Quiz_Option)
                `);
            }
        }

        await transaction.commit();
        res.status(200).send({ message: 'Quiz updated successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error('Error updating quiz:', error);
        res.status(500).send({ error: 'Error updating quiz' });
    }
});









module.exports = router;
