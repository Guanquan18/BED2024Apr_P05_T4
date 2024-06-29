// Entirely Created By: Sairam (S10259930H)

const sql = require("mssql"); // Import the mssql module
const dbConfig = require("../dbConfig"); // Import the database configuration

class Courses {
  // Constructor to initialize course properties
    constructor(CourseId, CourseTitle, SmallDescription, Description, Label, Badge, Thumbnail, LastUpdated, Creator, Ratings) {
        this.CourseId = CourseId;
        this.CourseTitle = CourseTitle;
        this.SmallDescription = SmallDescription;
        this.Description = Description;
        this.Label = Label;
        this.Badge = Badge;
        this.Thumbnail = Thumbnail;
        this.LastUpdated = LastUpdated;
        this.Creator = Creator;
        this.Ratings = Ratings; // Include AvgRatings in the constructor
    }

    // Getting course by Creator  Created By: Sairam (S10259930H)
    static async getCourseByCreator(Creator) {
        const connection = await sql.connect(dbConfig); // Connect to the database
        // SQL query to get courses by creator with average ratings
        const sqlQuery = `
            SELECT 
                c.CourseId, 
                c.CourseTitle, 
                c.SmallDescription, 
                c.Description, 
                c.Label, 
                c.Badge, 
                c.Thumbnail, 
                c.LastUpdated, 
                c.Creator,
                cr.Ratings
            FROM Course c
            LEFT JOIN (
                SELECT 
                    Review_Course, 
                    AVG(Ratings) AS Ratings
                FROM Review
                GROUP BY Review_Course
            ) cr ON c.CourseId = cr.Review_Course
            WHERE c.Creator = @creator;
        `; // Parameterized query

        const request = connection.request();
        request.input("creator", Creator); // Ensure the correct SQL data type

        const result = await request.query(sqlQuery);

        connection.close(); // Close the connection

        return result.recordset.length > 0
            ? result.recordset.map(course => new Courses(
                course.CourseId,
                course.CourseTitle,
                course.SmallDescription,
                course.Description,
                course.Label,
                course.Badge,
                course.Thumbnail,
                course.LastUpdated,
                course.Creator,
                course.Ratings
            ))
            : []; // Return an empty array if no courses are found
    }

    // Getting course by Id  Created By: Sairam (S10259930H)
    static async getCourseById(CourseId) {
      const connection = await sql.connect(dbConfig); // Connect to the database
      // SQL query to get course by ID
      const sqlQuery = `SELECT  
                        CourseId, 
                        CourseTitle, 
                        SmallDescription, 
                        Description, 
                        ISNULL(Label, 'No Label') AS Label,
                        ISNULL(Badge, 'No Badge') AS Badge,
                        Thumbnail,
                        FORMAT(LastUpdated, 'dddd dd MMM yyyy hh:mm tt') AS LastUpdated 
                        FROM Course WHERE CourseId = @id`; // Parameterized query
                    
      const request = connection.request();
      request.input("id", CourseId); // Ensure the correct SQL data type
      const result = await request.query(sqlQuery); // Close the connection
  
      connection.close();
  
      return result.recordset[0]
        ? new Courses(
            result.recordset[0].CourseId,
            result.recordset[0].CourseTitle,
            result.recordset[0].SmallDescription,
            result.recordset[0].Description,
            result.recordset[0].Label,
            result.recordset[0].Badge,
            result.recordset[0].Thumbnail,
            result.recordset[0].LastUpdated,
          )
        : null; // Handle Course not found
    }

     // Static method to update course details  Created By: Sairam (S10259930H)
    static async updateCourse(CourseId, newCourseData) {
      const connection = await sql.connect(dbConfig); // Connect to the database
    
       // Base SQL query for updating course
      let sqlQuery = 'UPDATE Course SET ';
      const fields = [];
      const request = connection.request();
    
      // Check each field and add to query if defined
      if (newCourseData.CourseTitle !== undefined) {
        fields.push('CourseTitle = @CourseTitle');
        request.input('CourseTitle', newCourseData.CourseTitle);
      }
      if (newCourseData.SmallDescription !== undefined) {
        fields.push('SmallDescription = @SmallDescription');
        request.input('SmallDescription', newCourseData.SmallDescription);
      }
      if (newCourseData.Description !== undefined) {
        fields.push('Description = @Description');
        request.input('Description', newCourseData.Description);
      }
      if (newCourseData.Label !== undefined) {
        fields.push('Label = @Label');
        request.input('Label', newCourseData.Label);
      }
      if (newCourseData.Badge !== undefined) {
        fields.push('Badge = @Badge');
        request.input('Badge', newCourseData.Badge);
      }
    
      // If no fields are provided for update, return early
      if (fields.length === 0) {
        throw new Error('No fields provided for update');
      }
    
      // Join the fields to the query
      sqlQuery += fields.join(', ') + ', LastUpdated = getdate() WHERE CourseId = @id';
      request.input('id', CourseId);
    
      // Execute the query
      await request.query(sqlQuery);
    
      connection.close();
    
      return this.getCourseById(CourseId);
    }    
}

module.exports = Courses;
