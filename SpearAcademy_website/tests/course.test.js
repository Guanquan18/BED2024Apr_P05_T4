// Entirely Created By: Sairam (S10259930H)
const sql = require("mssql");
const Course = require("../models/course"); // Adjust the path as necessary

jest.mock("mssql"); // Mock the mssql library to control its behavior in tests
// Testing the Course.getCourseByCreator
describe("Course.getCourseByCreator", () => {
    let mockConnection, mockRequest;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test to ensure isolation
    });

    it("should retrieve courses by the creator from the database", async () => {
        // Mock data to simulate the response from the database
        const mockCourses = [
            {
                CourseId: 1,
                CourseTitle: "AI Basics",
                SmallDescription: "Introduction to Artificial Intelligence",
                Description: "Detailed course on the basics of AI",
                Label: "AI",
                Badge: "Top Rated",
                Thumbnail: "ai.jpg",
                LastUpdated: new Date(),
                Creator: 123,
                Ratings: 4.5,
            },
            {
                CourseId: 2,
                CourseTitle: "Global Warming Awareness",
                SmallDescription: "Understanding global warming and its impact",
                Description: "In-depth course on global warming and climate change",
                Label: "Climate Change",
                Badge: "Advanced",
                Thumbnail: "global_warming.jpg",
                LastUpdated: new Date(),
                Creator: 123,
                Ratings: 4.7,
            }
        ];

        // Mock the request object that simulates querying the database
        mockRequest = {
            input: jest.fn().mockReturnThis(), // Mock input method for chaining
            query: jest.fn().mockResolvedValue({ recordset: mockCourses }), // Mock query method to return mock data
        };
        
        // Mock the connection object returned by sql.connect
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest), // Mock the request method of the connection
            close: jest.fn().mockResolvedValue(undefined), // Mock the close method of the connection
        };

        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);

        // Call the method under test
        const courses = await Course.getCourseByCreator(123);

        // Assertions to verify the expected behavior
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Verify connection setup
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Verify connection close
        expect(courses).toHaveLength(2); // Verify the number of courses returned
        expect(courses[0]).toBeInstanceOf(Course); // Check if the first course is an instance of Courses
        expect(courses[0].CourseId).toBe(1); // Verify properties of the first course
        expect(courses[0].CourseTitle).toBe("AI Basics");
        expect(courses[0].SmallDescription).toBe("Introduction to Artificial Intelligence");
        expect(courses[0].Description).toBe("Detailed course on the basics of AI");
        expect(courses[0].Label).toBe("AI");
        expect(courses[0].Badge).toBe("Top Rated");
        expect(courses[0].Thumbnail).toBe("ai.jpg");
        expect(courses[0].Creator).toBe(123);
        expect(courses[0].Ratings).toBe(4.5);

        // Add assertions for the second course
        expect(courses[1]).toBeInstanceOf(Course); // Check if the second course is an instance of Courses
        expect(courses[1].CourseId).toBe(2); // Verify properties of the second course
        expect(courses[1].CourseTitle).toBe("Global Warming Awareness");
        expect(courses[1].SmallDescription).toBe("Understanding global warming and its impact");
        expect(courses[1].Description).toBe("In-depth course on global warming and climate change");
        expect(courses[1].Label).toBe("Climate Change");
        expect(courses[1].Badge).toBe("Advanced");
        expect(courses[1].Thumbnail).toBe("global_warming.jpg");
        expect(courses[1].Creator).toBe(123);
        expect(courses[1].Ratings).toBe(4.7);
    });

    it("should handle errors when retrieving courses by creator", async () => {
        const errorMessage = "Database Error";
        // Mock sql.connect to throw an error
        sql.connect.mockRejectedValue(new Error(errorMessage));

        // Verify that the method under test throws an error
        await expect(Course.getCourseByCreator(123)).rejects.toThrow(errorMessage);
    });

    it("should ensure connection is closed even if an error occurs", async () => {
        const errorMessage = "Database Error";
        // Mock the request object that simulates querying the database
        mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockRejectedValue(new Error(errorMessage)), // Mock query method to throw an error
        };

        // Mock the connection object returned by sql.connect
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);

        // Verify that connection close is called even if an error occurs
        await expect(Course.getCourseByCreator(123)).rejects.toThrow(errorMessage);
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure close is called
    });
});
// Testing the Course.getCourses
describe("Course.getCourses", () => {
    let mockConnection, mockRequest;

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock function calls before each test
    });

    it("should retrieve all courses from the database", async () => {
        // Mock data to simulate the response from the database
        const mockCourses = [
            {
                CourseId: 1,
                CourseTitle: "AI Basics",
                SmallDescription: "Introduction to Artificial Intelligence",
                Description: "Detailed course on the basics of AI",
                Label: "AI",
                Badge: "Top Rated",
                Thumbnail: "ai.jpg",
                LastUpdated: new Date(),
                Creator: 123,
                Ratings: 4.5,
                Fullname: "John Doe"
            },
            {
                CourseId: 2,
                CourseTitle: "Global Warming Awareness",
                SmallDescription: "Understanding global warming and its impact",
                Description: "In-depth course on global warming and climate change",
                Label: "Climate Change",
                Badge: "Advanced",
                Thumbnail: "global_warming.jpg",
                LastUpdated: new Date(),
                Creator: 123,
                Ratings: 4.7,
                Fullname: "Jane Smith"
            }
        ];

        // Mock the request object that simulates querying the database
        mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: mockCourses }),
        };
        // Mock the connection object returned by sql.connect
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);

        // Call the method under test
        const courses = await Course.getCourses();

        // Assertions to verify the expected behavior
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Verify connection setup
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Verify connection close
        expect(courses).toHaveLength(2); // Verify the number of courses returned
        expect(courses[0]).toBeInstanceOf(Course); // Check if the first course is an instance of Courses
        expect(courses[0].CourseId).toBe(1); // Verify properties of the first course
        expect(courses[0].CourseTitle).toBe("AI Basics");
        expect(courses[0].SmallDescription).toBe("Introduction to Artificial Intelligence");
        expect(courses[0].Description).toBe("Detailed course on the basics of AI");
        expect(courses[0].Label).toBe("AI");
        expect(courses[0].Badge).toBe("Top Rated");
        expect(courses[0].Thumbnail).toBe("ai.jpg");
        expect(courses[0].Creator).toBe(123);
        expect(courses[0].Ratings).toBe(4.5);
        expect(courses[0].Fullname).toBe("John Doe");

        // Add assertions for the second course
        expect(courses[1]).toBeInstanceOf(Course); // Check if the second course is an instance of Courses
        expect(courses[1].CourseId).toBe(2); // Verify properties of the second course
        expect(courses[1].CourseTitle).toBe("Global Warming Awareness");
        expect(courses[1].SmallDescription).toBe("Understanding global warming and its impact");
        expect(courses[1].Description).toBe("In-depth course on global warming and climate change");
        expect(courses[1].Label).toBe("Climate Change");
        expect(courses[1].Badge).toBe("Advanced");
        expect(courses[1].Thumbnail).toBe("global_warming.jpg");
        expect(courses[1].Creator).toBe(123);
        expect(courses[1].Ratings).toBe(4.7);
        expect(courses[1].Fullname).toBe("Jane Smith");
    });

    it("should handle errors when retrieving courses", async () => {
        const errorMessage = "Database Error";
        // Mock sql.connect to throw an error
        sql.connect.mockRejectedValue(new Error(errorMessage));

        // Verify that the method under test throws an error
        await expect(Course.getCourses()).rejects.toThrow(errorMessage);
    });

    it("should ensure connection is closed even if an error occurs", async () => {
        const errorMessage = "Database Error";
        // Mock the request object that simulates querying the database
        mockRequest = {
            query: jest.fn().mockRejectedValue(new Error(errorMessage)), // Mock query method to throw an error
        };

        // Mock the connection object returned by sql.connect
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);

        // Verify that connection close is called even if an error occurs
        await expect(Course.getCourses()).rejects.toThrow(errorMessage);
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure close is called
    });
});
// Testing the Course.getCourseWithSectionById
describe("Course.getCourseWithSectionById", () => {
    // Clear any mocked calls before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve a course with multiple sections by CourseId", async () => {
        // Mock data with flat structure as returned by the query
        const mockData = [
            {
                CourseId: 1,
                CourseTitle: "AI Basics",
                SmallDescription: "Introduction to AI",
                Description: "Detailed course on AI",
                Label: "AI",
                Badge: "Top Rated",
                Thumbnail: "ai.jpg",
                SectionNo: 1,
                SectionTitle: "Introduction to AI",
                Video: "intro_ai.mp4"
            },
            {
                CourseId: 1,
                CourseTitle: "AI Basics",
                SmallDescription: "Introduction to AI",
                Description: "Detailed course on AI",
                Label: "AI",
                Badge: "Top Rated",
                Thumbnail: "ai.jpg",
                SectionNo: 2,
                SectionTitle: "AI Fundamentals",
                Video: "ai_fundamentals.mp4"
            }
        ];
        // Mock request and connection objects
        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: mockData }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };
        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
        // Call the function under test
        const result = await Course.getCourseWithSectionById(1);

        // Assertions
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(1);
        expect(result[0].Sections).toHaveLength(2);
        expect(result[0].Sections[0].SectionNo).toBe(1);
        expect(result[0].Sections[0].SectionTitle).toBe("Introduction to AI");
        expect(result[0].Sections[0].Video).toBe("intro_ai.mp4");
        expect(result[0].Sections[1].SectionNo).toBe(2);
        expect(result[0].Sections[1].SectionTitle).toBe("AI Fundamentals");
        expect(result[0].Sections[1].Video).toBe("ai_fundamentals.mp4");
    });

    it("should return null if no course is found", async () => {
         // Mock empty result to simulate no courses found
        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [] }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };
        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
        // Call the function under test
        const result = await Course.getCourseWithSectionById(999);
         // Verify result is null when no course is found
        expect(result).toBeNull();
    });

    it("should handle errors during database query", async () => {
        const errorMessage = "Database Error";
        
        // Mock the request object that simulates querying the database
        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockRejectedValue(new Error(errorMessage)), // Mock query method to throw an error
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);

        // Verify that connection close is called even if an error occurs
        await expect(Course.getCourseWithSectionById(1)).rejects.toThrow(`Error fetching course with sections: ${errorMessage}`);
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure close is called
    });
});
// Testing the Course.updateCourse
describe("Course.updateCourse", () => {
    let mockConnection;
    let mockRequest;
    
    beforeEach(() => {
      jest.clearAllMocks();
  
      // Setup mocks for sql.connect and its return value
      mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({}),
      };
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      // Mock the sql.connect method to return the mock connection
      sql.connect = jest.fn().mockResolvedValue(mockConnection);
  
      // Mock the getCourseWithSectionById method
      Course.getCourseWithSectionById = jest.fn().mockResolvedValue({
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "ai.jpg",
        Sections: [], // Expecting an empty array for Sections
      });
    });
  
    it("should update course and retrieve updated details", async () => {
      const mockCourseAfterUpdate = {
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "ai.jpg",
        Sections: [] // Expecting an empty array for Sections
      };
  
      // Call the update method
      const result = await Course.updateCourse(1, {
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
      });
  
      // Assertions
      expect(sql.connect).toHaveBeenCalledTimes(1);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.close).toHaveBeenCalledTimes(1); // Verify close is called once
      expect(result).toEqual(mockCourseAfterUpdate); // Verify updated values
    });
  
    it("should throw an error if no fields are provided for update", async () => {
          // Verify that an error is thrown when no fields are provided
      await expect(Course.updateCourse(1, {})).rejects.toThrow(
        "No fields provided for update"
      );
    });
  
    it("should handle errors during database query", async () => {
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage));
    // Verify that an error is thrown and connection is closed
      await expect(
        Course.updateCourse(1, {
          CourseTitle: "Advanced AI",
          SmallDescription: "Introduction to Advanced AI",
          Description: "Detailed course on advanced AI",
        })
      ).rejects.toThrow(errorMessage);
    });
});
  // Testing the Course.updateCourseIcon
describe("Course.updateCourseIcon", () => {
    let mockConnection;
    let mockRequest;
  
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Setup mocks for sql.connect and its return value
      mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({}),
      };
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      // Mock the sql.connect method to return the mock connection
      sql.connect = jest.fn().mockResolvedValue(mockConnection);
  
      // Mock the getCourseWithSectionById method
      Course.getCourseWithSectionById = jest.fn().mockResolvedValue({
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "newIcon.jpg", // Expecting updated icon
        LastUpdated: new Date().toISOString(),
        Sections: [],
      });
    });
  
    it("should update course icon and retrieve updated details", async () => {
      const newIconData = { Thumbnail: "newIcon.jpg" };
  
      // Call the update method
      const result = await Course.updateCourseIcon(1, newIconData);
  
      // Assertions
      expect(sql.connect).toHaveBeenCalledTimes(1);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith("id", 1);
      expect(mockRequest.input).toHaveBeenCalledWith("icon", newIconData.Thumbnail);
      expect(mockConnection.close).toHaveBeenCalledTimes(1); // Verify close is called once
      expect(result).toEqual({
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "newIcon.jpg", // Verify updated icon
        LastUpdated: expect.any(String),
        Sections: [],
      });
    });
  
    it("should handle errors during database query", async () => {
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage));
        // Verify that an error is thrown and connection is closed
      await expect(
        Course.updateCourseIcon(1, { Thumbnail: "newIcon.jpg" })
      ).rejects.toThrow(`Error updating course icon: ${errorMessage}`);
      
      // Ensure close is called even in case of an error
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
});
// Testing the Course.createCourse
describe("Course.createCourse", () => {
    let mockConnection;
    let mockRequest;
    // Setup mocks for sql.connect and its return value
    beforeEach(() => {
      jest.clearAllMocks();
      
      // Setup mocks for sql.connect and its return value
      mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock the input method of the request object
        query: jest.fn().mockResolvedValue({ recordset: [{ id: 1 }] }), // Mock the query method to return an id of 1
      };
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest), // Mock the request method to return the mockRequest
        close: jest.fn().mockResolvedValue(undefined), // Mock the close method to resolve without any value
      };
  
      // Mock the sql.connect method to return the mock connection
      sql.connect = jest.fn().mockResolvedValue(mockConnection);
  
      // Mock the getCourseByCreator method
      Course.getCourseByCreator = jest.fn().mockResolvedValue({
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: '../Images/courses/newIcon.jpg',
        LastUpdated: new Date().toISOString(),
        Sections: [],
      });
    });
  
    it("should create a new course and return its details", async () => {
      const newCourseData = {
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Thumbnail: '../Images/courses/newIcon.jpg', // Path to the uploaded file
        Label: "AI",
        Badge: "Top Rated"
      };
  
      // Call the createCourse method
      const result = await Course.createCourse(1, newCourseData);
  
      // Assertions
      expect(sql.connect).toHaveBeenCalledTimes(1);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith('CreatorId', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseTitle', newCourseData.CourseTitle);
      expect(mockRequest.input).toHaveBeenCalledWith('SmallDescription', newCourseData.SmallDescription);
      expect(mockRequest.input).toHaveBeenCalledWith('Description', newCourseData.Description);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseIcon', newCourseData.Thumbnail);
      expect(mockRequest.input).toHaveBeenCalledWith('Label', newCourseData.Label);
      expect(mockRequest.input).toHaveBeenCalledWith('Badge', newCourseData.Badge);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: '../Images/courses/newIcon.jpg', // Verify updated path
        LastUpdated: expect.any(String),  // Check that LastUpdated is a string
        Sections: [],
      });
    });
  
    it("should handle errors and ensure connection is closed", async () => {
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage));
  
      const newCourseData = {
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Thumbnail: '../Images/courses/newIcon.jpg', // Path to the uploaded file
        Label: "AI",
        Badge: "Top Rated"
      };
      // Verify that the function throws an error and connection is closed
      await expect(Course.createCourse(1, newCourseData)).rejects.toThrow(`Error creating course: ${errorMessage}`);
      
      // Ensure close is called even in case of an error
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
});
// Testing the Course.deleteCourseAndDetails 
describe("Course.deleteCourseAndDetails", () => {
    let mockConnection;
    let mockRequest;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      // Setup mocks for sql.connect and its return value
      mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock the input method of the request object
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }), // Mock the query method to simulate deletion
      };
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest), // Mock the request method to return the mockRequest
        close: jest.fn().mockResolvedValue(undefined), // Mock the close method to resolve without any value
      };
  
      // Mock the sql.connect method to return the mock connection
      sql.connect = jest.fn().mockResolvedValue(mockConnection);
    });
  
    it("should delete a course and its associated details", async () => {
      const courseId = 1;
  
      // Call the deleteCourseAndDetails method
      const result = await Course.deleteCourseAndDetails(courseId);
  
      // Assertions
      expect(sql.connect).toHaveBeenCalledTimes(1);
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toBe(true); // Check that result is true
    });
  
    it("should handle errors and ensure connection is closed", async () => {
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage));
  
      const courseId = 1;
        // Verify that the function throws an error and connection is closed
      await expect(Course.deleteCourseAndDetails(courseId)).rejects.toThrow(errorMessage);
  
      // Ensure close is called even in case of an error
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
 });
  
  
  
  
  
  
  
