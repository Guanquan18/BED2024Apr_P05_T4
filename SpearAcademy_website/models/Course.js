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
                ISNULL(cr.Ratings, 0) AS Ratings
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

    // Getting course and section by Id  Created By: Sairam (S10259930H)
    static async getCourseWithSectionById(CourseId) {
      const connection = await sql.connect(dbConfig);
  
      try {
          const sqlQuery = `
              SELECT 
                  c.CourseId, c.CourseTitle, c.SmallDescription, c.Description, 
                  ISNULL(c.Label, 'No Label') AS Label, 
                  ISNULL(c.Badge, 'No Badge') AS Badge,
                  c.Thumbnail, FORMAT(c.LastUpdated, 'dddd dd MMM yyyy hh:mm tt') AS LastUpdated,
                  s.SectionNo, s.SectionTitle, s.Video
              FROM Course c
              LEFT JOIN SectionDetails s ON c.CourseId = s.Section_Course
              WHERE c.CourseId = @id
          `;
  
          const request = connection.request();
          request.input("id", CourseId);
          const result = await request.query(sqlQuery);
  
          if (result.recordset.length === 0) {
              return null; // Handle case where course with given CourseId is not found
          }
  
          const courseWithSections = {};
          
          for (const row of result.recordset) {
              const courseId = row.CourseId;
              if (!courseWithSections[courseId]) {
                  courseWithSections[courseId] = {
                      CourseId: row.CourseId,
                      CourseTitle: row.CourseTitle,
                      SmallDescription: row.SmallDescription,
                      Description: row.Description,
                      Label: row.Label,
                      Badge: row.Badge,
                      Thumbnail: row.Thumbnail,
                      LastUpdated: row.LastUpdated,
                      Sections: [],
                  };
              }
              if (row.SectionNo !== null) { // Ensure there is section data
                  courseWithSections[courseId].Sections.push({
                      SectionNo: row.SectionNo,
                      SectionTitle: row.SectionTitle,
                      Video: row.Video,
                  });
              }
          }
  
          // Return the values (courses with sections) as an array
          return Object.values(courseWithSections);
      } catch (error) {
          throw new Error("Error fetching course with sections");
      } finally {
          await connection.close();
      }
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
    
      return this.getCourseWithSectionById(CourseId);
    }    
}

module.exports = Courses;
