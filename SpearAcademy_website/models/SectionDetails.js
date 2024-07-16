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

    // Static method to update section details  Created By: Sairam (S10259930H)
    static async updateSectionDetails(CourseId, sectionDetailNo, newSectionDetail) {
        const connection = await sql.connect(dbConfig); // Connect to the database
    
        // Base SQL query for updating section
        let sqlQuery = 'UPDATE SectionDetails SET ';
        const fields = [];
        const request = connection.request();
    
        // Check each field and add to query if defined
        if (newSectionDetail.SectionTitle !== undefined) {
            fields.push('SectionTitle = @SectionTitle');
            request.input('SectionTitle', newSectionDetail.SectionTitle);
        }
        if (newSectionDetail.Video !== undefined) {
            fields.push('Video = @Video');
            request.input('Video', newSectionDetail.Video);
        }
    
        // If no fields are provided for update, return early
        if (fields.length === 0) {
            throw new Error('No fields provided for update');
        }
    
        // Join the fields to the query
        sqlQuery += fields.join(', ') + ' WHERE Section_Course = @CourseId and SectionNo = @SectionNo';
        request.input('CourseId', CourseId);
        request.input('SectionNo', sectionDetailNo);
    
        // Execute the query
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getSectionDetailsById(CourseId, sectionDetailNo);
    }
}

module.exports = Section;
