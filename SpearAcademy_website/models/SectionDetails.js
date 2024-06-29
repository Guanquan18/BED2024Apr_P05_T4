// Entirely Created By: Sairam (S10259930H)

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Section {
    constructor(SectionNo, SectionTitle, Video) {
        this.SectionNo = SectionNo;
        this.SectionTitle = SectionTitle;
        this.Video = Video;
    }

    // Getting Section by CourseId, SectionNo
    static async getSectionDetailsById(CourseId,SectionNo) {
    const connection = await sql.connect(dbConfig); // Connect to the database

    const sqlQuery = `SELECT * FROM SectionDetails WHERE Section_Course = @id and SectionNo = @no`; // Parameterized query

    const request = connection.request(); // Prepare the request with parameters
    request.input("id", CourseId);
    request.input("no", SectionNo);
    const result = await request.query(sqlQuery);  // Execute the query
 
    connection.close(); // Close the connection

    return result.recordset[0] // Return the section details or null if not found
        ? new Section(
            result.recordset[0].SectionNo,
            result.recordset[0].SectionTitle,
            result.recordset[0].Video
        )
        : null; // Handle section not found
    }
}

module.exports = Section;
