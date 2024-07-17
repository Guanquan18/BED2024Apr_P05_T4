// Entirely Created By: Sairam (S10259930H)

const sql = require("mssql"); // Import the mssql module
const dbConfig = require("../dbConfig"); // Import the database configuration

class Courses {
  // Constructor to initialize course properties
    constructor(CourseId, CourseTitle, SmallDescription, Description, Label, Badge, Thumbnail, LastUpdated, Creator, Ratings, Fullname) {
        this.CourseId = CourseId;
        this.CourseTitle = CourseTitle;
        this.SmallDescription = SmallDescription;
        this.Description = Description;
        this.Label = Label;
        this.Badge = Badge;
        this.Thumbnail = Thumbnail;
        this.LastUpdated = LastUpdated;
        this.Creator = Creator;
        this.Ratings = Ratings; 
        this.Fullname = Fullname;
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
     // Getting all course   Created By: Sairam (S10259930H)
    static async getCourses() {
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
                ISNULL(cr.Ratings, 0) AS Ratings,
                a.Fullname
            FROM Course c
            LEFT JOIN (
                SELECT 
                    Review_Course, 
                    AVG(Ratings) AS Ratings
                FROM Review
                GROUP BY Review_Course
            ) cr ON c.CourseId = cr.Review_Course
            LEFT JOIN Account a ON c.Creator = a.AccId
        `; // Parameterized query

        const request = connection.request();

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
                course.Ratings,
                course.Fullname
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
    // Static method to update course icon  Created By: Sairam (S10259930H)
    static async updateCourseIcon(CourseId, newIconData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE Course SET Thumbnail = @icon WHERE CourseId = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", CourseId)
    request.input("icon",newIconData.Thumbnail);

    await request.query(sqlQuery);

    connection.close();

    return this.getCourseWithSectionById(CourseId); // returning the updated course data
    }
    // Static method to create course details  Created By: Sairam (S10259930H)
    static async createCourse(creatorId, newCourseData) {
    const connection = await sql.connect(dbConfig); // Connect to the database
    
    // Base SQL query for creating a new course
    let sqlQuery = 'INSERT INTO Course (Creator, CourseTitle, SmallDescription, Description, Thumbnail';
    let values = ['@CreatorId', '@CourseTitle', '@SmallDescription', '@Description', '@CourseIcon'];
    const request = connection.request();
    
    // Handle mandatory fields
    request.input('CreatorId', creatorId);
    request.input('CourseTitle', newCourseData.CourseTitle);
    request.input('SmallDescription', newCourseData.SmallDescription);
    request.input('Description', newCourseData.Description);
    request.input('CourseIcon', newCourseData.Thumbnail);
    
    // Handle optional fields
    if (newCourseData.Label !== undefined) {
        sqlQuery += ', Label';
        values.push('@Label');
        request.input('Label', newCourseData.Label);
    }
    if (newCourseData.Badge !== undefined) {
        sqlQuery += ', Badge';
        values.push('@Badge');
        request.input('Badge', newCourseData.Badge);
    }
    
    // Complete the SQL query
    sqlQuery += ', LastUpdated) VALUES (' + values.join(', ') + ', getdate()); SELECT SCOPE_IDENTITY() AS id;';
    
    // Execute the query and retrieve the ID of the inserted record
    const result = await request.query(sqlQuery);
    const newCourseId = result.recordset[0].id;
    
    connection.close();
    
    // Return the newly created course with its sections (assuming a method exists)
    return this.getCourseByCreator(creatorId);
    }
    // Static method to delete course details  Created By: Sairam (S10259930H)
    static async deleteCourseAndDetails(courseId) {
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
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from Question table
                DELETE qu
                FROM Question qu
                INNER JOIN Quiz q ON qu.Section_Question = q.Section_Quiz
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from Quiz table 
                DELETE q
                FROM Quiz q
                INNER JOIN SectionDetails sd ON q.Section_Quiz = sd.SectionNo
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from SectionDetails table
                DELETE sd
                FROM SectionDetails sd
                INNER JOIN Course c ON sd.Section_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from Review table
                DELETE r
                FROM Review r
                INNER JOIN Course c ON r.Review_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from QnA table
                DELETE qna
                FROM QnA qna
                INNER JOIN Course c ON qna.QnA_Course = c.CourseId
                WHERE c.CourseId = @CourseId;

                -- Delete from Course table
                DELETE c
                FROM Course c
                WHERE c.CourseId = @CourseId;

                COMMIT TRANSACTION;
            `;

            const request = connection.request();
            request.input('CourseId', courseId);

            // Execute the query
            const result = await request.query(sqlQuery);
            connection.close();
            console.log(result.rowsAffected);
            return result.rowsAffected.some(count => count > 0);
        } catch (error) {
            console.error('Error deleting course and details:', error);
            throw error;
        }
    }

}

module.exports = Courses;
