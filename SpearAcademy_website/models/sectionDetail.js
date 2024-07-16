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
    // Static method to create  section details  Created By: Sairam (S10259930H)
    static async createSection(courseId, newSectionData) {
        const connection = await sql.connect(dbConfig); // Connect to the database

        try {
            // Base SQL query for creating a new section
            let sqlQuery = 'INSERT INTO SectionDetails (Section_Course, SectionTitle, Video';
            let values = ['@CourseId', '@SectionTitle', '@Video'];
            const request = connection.request();
            
            // Handle mandatory fields
            request.input('CourseId', courseId);
            request.input('SectionTitle', newSectionData.SectionTitle);
            request.input('Video', newSectionData.Video);
            
            // Complete the SQL query
            sqlQuery += ') VALUES (' + values.join(', ') + '); SELECT SCOPE_IDENTITY() AS SectionNo;';
            
            // Execute the query and retrieve SectionNo
            const result = await request.query(sqlQuery);
            const sectionNo = result.recordset[0].SectionNo;
            
            connection.close();
            
            // Assuming you have a method to fetch updated section details by courseId and sectionNo
            return await this.getSectionDetailsById(courseId, sectionNo);
        } catch (error) {
            console.error('Error creating section:', error);
            throw error;
        }
    }
    // Static method to delete section details  Created By: Sairam (S10259930H)
    static async deleteSectionDetails(sectionNo) {
        const connection = await sql.connect(dbConfig);
    
        try {
            const sqlQuery = `
                BEGIN TRANSACTION;
    
                -- Delete from [Option] table
                DELETE o
                FROM [Option] o
                INNER JOIN Question qu ON o.Quiz_Option = qu.Quiz_Question
                INNER JOIN Quiz q ON qu.Section_Question = q.Section_Quiz
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                WHERE sd.SectionNo = @SectionNo;
    
                -- Delete from Question table
                DELETE qu
                FROM Question qu
                INNER JOIN Quiz q ON qu.Section_Question = q.Section_Quiz
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                WHERE sd.SectionNo = @SectionNo;
    
                -- Delete from Quiz table 
                DELETE q
                FROM Quiz q
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                WHERE sd.SectionNo = @SectionNo;
    
                -- Delete from SectionDetails table
                DELETE sd
                FROM SectionDetails sd
                WHERE sd.SectionNo = @SectionNo;
    
                COMMIT TRANSACTION;
            `;
    
            const request = connection.request();
            request.input("SectionNo", sectionNo);
    
            // Execute the query
            const result = await request.query(sqlQuery);
            connection.close();
            console.log(result.rowsAffected)
            return result.rowsAffected.some(count => count > 0)
        } catch (error) {
            console.error('Error deleting section details:', error);
            throw error;
        }
    }
    
      
}

module.exports = Section;
