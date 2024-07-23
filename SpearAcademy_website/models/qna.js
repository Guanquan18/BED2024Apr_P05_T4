const sql = require("mssql");  // Import mssql
const dbConfig = require("../dbConfig");  // Import database configuration

class QnA {  // Defining a QnA class to represent QnA entries in the database with properties
    constructor(id, QnAtitle, QnApostDate, courseId) {
        this.id = id;
        this.QnAtitle = QnAtitle;
        this.QnApostDate = QnApostDate;
        this.courseId = courseId;
    }

    // Static method to get QnA entries by CourseId
    static async getQnAByCourseId(courseId) {
        try {
            const connection = await sql.connect(dbConfig);
            
            const sqlQuery = `
                SELECT QnA.QnAId, QnA.QnATitle, QnA.PostDate, QnA.QnA_Course
                FROM QnA
                WHERE QnA.QnA_Course = @courseId
            `;
            
            const request = connection.request();
            request.input("courseId", sql.SmallInt, courseId);  // Input parameter for the query
            const result = await request.query(sqlQuery);
            
            connection.close();
            
            if (result.recordset.length > 0) {
                return result.recordset.map(record => new QnA(
                    record.QnAId,
                    record.QnATitle,
                    record.PostDate,
                    record.QnA_Course
                ));
            } else {
                return "No QnA entries found for this Course"; // Message indicating no entries found
            }
        } catch (error) {
            console.error("Error retrieving QnA entries:", error);
            throw new Error("An error occurred while retrieving QnA entries.");
        }
    }
}

module.exports = QnA;
