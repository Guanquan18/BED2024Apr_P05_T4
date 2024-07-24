// courseController.test.js

const courseController = require("../controllers/courseController");
const Course = require("../models/course");

// Mock the Course model
jest.mock("../models/course");

// Test suite for the getCourseByCreator in courseController
describe("courseController.getCourseByCreator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch courses by creator and return a JSON response", async () => {
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
          Ratings: 4.5
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
          Ratings: 4.7
        }
      ];
      // Mock the Course model method to return the mock data
    Course.getCourseByCreator.mockResolvedValue(mockCourses);
       // Mock request and response objects
    const req = { params: { creator: 1 } }; // The creator ID being requested
    const res = {
      json: jest.fn(), // Mock function to handle JSON response
      status: jest.fn().mockReturnThis(), // Mock function to chain status and return response
      send: jest.fn(), // Mock function to handle sending responses
    };
    // Call the controller method with mocked request and response
    await courseController.getCourseByCreator(req, res);

    expect(Course.getCourseByCreator).toHaveBeenCalledWith(1); // Check that the Course model method was called with the correct creator ID
    expect(res.json).toHaveBeenCalledWith(mockCourses); // Check that the response's json method was called with the correct data
  });

  it("should return 404 if no courses found", async () => {
    // Mock the Course model method to return an empty result (no courses found)
    Course.getCourseByCreator.mockResolvedValue(null);

     // Mock request and response objects
    const req = { params: { creator: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    // Call the controller method with mocked request and response
    await courseController.getCourseByCreator(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Course not found");
  });

  it("should handle errors and return a 500 status", async () => {
    Course.getCourseByCreator.mockRejectedValue(new Error("Database error"));

    const req = { params: { creator: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await courseController.getCourseByCreator(req, res);
    // Check that the response's status method was called with 500
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving course");
  });
});

// Test suite for the getCourses method in courseController
describe("courseController.getCourses", () => {
    // Before each test, clear all mocks to ensure a clean state
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test case for a successful fetch of all courses
    it("should fetch all courses and return a JSON response", async () => {
      // Mock data to simulate the response from the Courses model
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
          Ratings: 4.5
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
          Ratings: 4.7
        }
      ];
  
      // Mock the Courses model's getCourses method to resolve with mock data
      Course.getCourses.mockResolvedValue(mockCourses);
  
      // Mock request and response objects
      const req = {};
      const res = {
        json: jest.fn(), // Mock json method to capture JSON responses
        status: jest.fn().mockReturnThis(), // Mock status method and chain it
        send: jest.fn(), // Mock send method to capture plain text responses
      };
  
      // Call the controller's getCourses method
      await courseController.getCourses(req, res);
  
      // Assertions to verify the controller's behavior
      expect(Course.getCourses).toHaveBeenCalledTimes(1); // Ensure getCourses was called once
      expect(res.json).toHaveBeenCalledWith(mockCourses); // Verify that the correct data was sent in the response
    });
  
    // Test case for when no courses are found
    it("should return 404 if no courses found", async () => {
      // Mock the Courses model's getCourses method to resolve with null (no courses)
      Course.getCourses.mockResolvedValue(null);
  
      // Mock request and response objects
      const req = {};
      const res = {
        json: jest.fn(), // Mock json method to capture JSON responses
        status: jest.fn().mockReturnThis(), // Mock status method and chain it
        send: jest.fn(), // Mock send method to capture plain text responses
      };
  
      // Call the controller's getCourses method
      await courseController.getCourses(req, res);
  
      // Assertions to verify the controller's behavior
      expect(res.status).toHaveBeenCalledWith(404); // Verify that a 404 status was set in the response
      expect(res.send).toHaveBeenCalledWith("Courses not found"); // Verify that the correct error message was sent
    });
  
    // Test case for handling errors during course retrieval
    it("should handle errors and return a 500 status", async () => {
      // Mock the Courses model's getCourses method to reject with an error
      Course.getCourses.mockRejectedValue(new Error("Database error"));
  
      // Mock request and response objects
      const req = {};
      const res = {
        json: jest.fn(), // Mock json method to capture JSON responses
        status: jest.fn().mockReturnThis(), // Mock status method and chain it
        send: jest.fn(), // Mock send method to capture plain text responses
      };
  
      // Call the controller's getCourses method
      await courseController.getCourses(req, res);
  
      // Assertions to verify the controller's behavior
      expect(res.status).toHaveBeenCalledWith(500); // Verify that a 500 status was set in the response
      expect(res.send).toHaveBeenCalledWith("Error retrieving courses"); // Verify that the correct error message was sent
    });
});

// Test suite for the getCourseWithSectionById method in courseController
describe("courseController.getCourseWithSectionById", () => {
beforeEach(() => {
    jest.clearAllMocks();
});

it("should fetch a course with sections and return a JSON response", async () => {
    const mockCourse = [
    {
        CourseId: 1,
        CourseTitle: "AI Basics",
        SmallDescription: "Introduction to AI",
        Description: "Detailed course on AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "ai.jpg",
        LastUpdated: new Date(),
        Sections: [
        {
            SectionNo: 1,
            SectionTitle: "Introduction to AI",
            Video: "intro_ai.mp4"
        },
        {
            SectionNo: 2,
            SectionTitle: "AI Fundamentals",
            Video: "ai_fundamentals.mp4"
        }
        ]
    }
    ];
    // Mock the Course.getCourseWithSectionById method to return mockCourse
    Course.getCourseWithSectionById.mockResolvedValue(mockCourse);

    const req = { params: { courseId: "1" } };
    const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    };
     // Verify that the method was called with the correct parameter
    await courseController.getCourseWithSectionById(req, res);

    expect(Course.getCourseWithSectionById).toHaveBeenCalledWith(1);
     // Verify that the response contains the mock course data
    expect(res.json).toHaveBeenCalledWith(mockCourse);
});

it("should return 404 if no course found", async () => {
     // Mock the Course.getCourseWithSectionById method to return null
    Course.getCourseWithSectionById.mockResolvedValue(null);

    const req = { params: { courseId: "1" } };
    const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    };

    await courseController.getCourseWithSectionById(req, res);
     // Verify that the response status is set to 404
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Course not found");
});

it("should handle errors and return a 500 status", async () => {
    // Mock the Course.getCourseWithSectionById method to throw an error
    Course.getCourseWithSectionById.mockRejectedValue(new Error("Database error"));

    const req = { params: { courseId: "1" } };
    const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    };

    await courseController.getCourseWithSectionById(req, res);
      // Verify that the response status is set to 500
    expect(res.status).toHaveBeenCalledWith(500);
     // Verify that the response contains the appropriate error message
    expect(res.send).toHaveBeenCalledWith("Error retrieving course");
});
});

// Test suite for the updateCourse method in courseController
describe("courseController.updateCourse", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update course and return updated details", async () => {
      const mockCourseAfterUpdate = {
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "ai.jpg",
        LastUpdated: new Date().toISOString(),
        Sections: []
      };
  
      // Mock the Course.updateCourse method
      Course.updateCourse.mockResolvedValue(mockCourseAfterUpdate);
      const req = {
        params: { courseId: "1" },
        body: {
          CourseTitle: "Advanced AI",
          SmallDescription: "Introduction to Advanced AI",
          Description: "Detailed course on advanced AI"
        }
      };
  
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourse(req, res);
      // Verify that the method was called with the correct parameter
      expect(Course.updateCourse).toHaveBeenCalledWith(1, {
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI"
      });
      // Verify that the response contains the updated course data
      expect(res.json).toHaveBeenCalledWith(mockCourseAfterUpdate);
    });
  
    it("should return 404 if course not found", async () => {
      // Mock updateCourse to return null to simulate a non-existent course
      Course.updateCourse.mockResolvedValue(null);
  
      const req = {
        params: { courseId: "999" },
        body: {
          CourseTitle: "Non-existent Course",
          SmallDescription: "Does not exist",
          Description: "No details available"
        }
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourse(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Course not found");
    });
  
    it("should handle errors and return a 500 status", async () => {
      const errorMessage = "Database Error";
      // Mock the Course.updateCourse method to throw an error
      Course.updateCourse.mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { courseId: "1" },
        body: {
          CourseTitle: "Advanced AI",
          SmallDescription: "Introduction to Advanced AI",
          Description: "Detailed course on advanced AI"
        }
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourse(req, res);
       // Verify that the response status is set to 500
      expect(res.status).toHaveBeenCalledWith(500);
        // Verify that the response contains the appropriate error message
      expect(res.send).toHaveBeenCalledWith("Error updating Course");
    });
});

// Test suite for the updateCourseIcon method in courseController
describe("courseController.updateCourseIcon", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should update course icon and return updated details", async () => {
      const mockCourseAfterUpdate = {
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "../Images/courses/newIcon.jpg",
        LastUpdated: new Date().toISOString(),
        Sections: [],
      };
  
      // Mock the Courses.updateCourseIcon method
      Course.updateCourseIcon = jest.fn().mockResolvedValue(mockCourseAfterUpdate);
  
      const req = {
        params: { courseId: "1" },
        file: {
          filename: "newIcon.jpg" // Mock the file upload
        }
      };
  
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourseIcon(req, res);
      // Verify that the method was called with the correct parameters
      expect(Course.updateCourseIcon).toHaveBeenCalledWith(1, {
        Thumbnail: "../Images/courses/newIcon.jpg", // Verify the path
      });
       // Verify that the response contains the updated course data
      expect(res.json).toHaveBeenCalledWith(mockCourseAfterUpdate);
    });
  
    it("should return 404 if course not found", async () => {
        // Mock the Course.updateCourseIcon method to return null
      Course.updateCourseIcon = jest.fn().mockResolvedValue(null);
  
      const req = {
        params: { courseId: "999" },
        file: {
          filename: "nonExistentIcon.jpg"
        }
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourseIcon(req, res);
      // Verify that the response status is set to 404
      expect(res.status).toHaveBeenCalledWith(404);
      // Verify that the response contains the appropriate error message
      expect(res.send).toHaveBeenCalledWith("Course not found");
    });
  
    it("should handle errors and return a 500 status", async () => {
      const errorMessage = "Database Error";
      // Mock the Course.updateCourseIcon method to throw an error
      Course.updateCourseIcon = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { courseId: "1" },
        file: {
          filename: "newIcon.jpg"
        }
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
  
      await courseController.updateCourseIcon(req, res);
      // Verify that the response status is set to 500
      expect(res.status).toHaveBeenCalledWith(500);
      // Verify that the response contains the appropriate error message
      expect(res.send).toHaveBeenCalledWith("Error updating course icon");
    });
});
// Test suite for the createCourse method in courseController
describe("courseController.createCourse", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should create a new course and return its details", async () => {
      const mockCreatedCourse = {
        CourseId: 1,
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Label: "AI",
        Badge: "Top Rated",
        Thumbnail: "newIcon.jpg",
        LastUpdated: new Date().toISOString(),
        Sections: [],
      };
  
      // Mock the Course.createCourse method
      Course.createCourse = jest.fn().mockResolvedValue(mockCreatedCourse);
  
      const req = {
        params: { creatorId: "1" },
        body: {
          CourseTitle: "Advanced AI",
          SmallDescription: "Introduction to Advanced AI",
          Description: "Detailed course on advanced AI",
          Label: "AI",
          Badge: "Top Rated"
        },
        file: { filename: "newIcon.jpg" },
      };
  
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      // Call the controller method
      await courseController.createCourse(req, res);
      // Verify that the createCourse method was called with the correct parameters
      expect(Course.createCourse).toHaveBeenCalledWith(1, {
        CourseTitle: "Advanced AI",
        SmallDescription: "Introduction to Advanced AI",
        Description: "Detailed course on advanced AI",
        Thumbnail: '../Images/courses/newIcon.jpg',
        Label: "AI",
        Badge: "Top Rated"
      });
      // Verify that the response status is 201
      expect(res.status).toHaveBeenCalledWith(201);
      // Verify that the response contains the mock course data
      expect(res.json).toHaveBeenCalledWith(mockCreatedCourse);
    });
  
    it("should handle errors and return a 500 status", async () => {
      const errorMessage = "Database Error";
      // Mock the Course.createCourse method to throw an error
      Course.createCourse = jest.fn().mockRejectedValue(new Error(errorMessage));
  
      const req = {
        params: { creatorId: "1" },
        body: {
          CourseTitle: "Advanced AI",
          SmallDescription: "Introduction to Advanced AI",
          Description: "Detailed course on advanced AI",
        },
        file: { filename: "newIcon.jpg" },
      };
  
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      // Call the controller method
      await courseController.createCourse(req, res);
      // Verify that the response status is 500
      expect(res.status).toHaveBeenCalledWith(500);
      // Verify that the response contains the appropriate error message
      expect(res.send).toHaveBeenCalledWith("Error creating course");
    });
});
// Test suite for the deleteCoursAndDetails method in courseController
describe("courseController.deleteCourseAndDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the course and return a 204 status", async () => {
    // Mock the Course.deleteCourseAndDetails method to return true
    Course.deleteCourseAndDetails = jest.fn().mockResolvedValue(true);

    const req = {
      params: { courseId: "1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    // Call the controller method
    await courseController.deleteCourseAndDetails(req, res);
    // Verify that the deleteCourseAndDetails method was called with the correct parameter
    expect(Course.deleteCourseAndDetails).toHaveBeenCalledWith(1);
    // Verify that the response status is 204
    expect(res.status).toHaveBeenCalledWith(204);
    // Verify that the response contains the appropriate success message
    expect(res.send).toHaveBeenCalledWith('Course and associated details successfully deleted');
  });

  it("should return 404 if course details are not found", async () => {
     // Mock the Course.deleteCourseAndDetails method to return false
    Course.deleteCourseAndDetails = jest.fn().mockResolvedValue(false);

    const req = {
      params: { courseId: "999" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
     // Call the controller method
    await courseController.deleteCourseAndDetails(req, res);
    // Verify that the deleteCourseAndDetails method was called with the correct parameter
    expect(Course.deleteCourseAndDetails).toHaveBeenCalledWith(999);
    // Verify that the response status is 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Verify that the response contains the appropriate error message
    expect(res.send).toHaveBeenCalledWith('Course details not found');
  });

  it("should handle errors and return a 500 status", async () => {
    const errorMessage = "Database Error";
     // Mock the Course.deleteCourseAndDetails method to throw an error
    Course.deleteCourseAndDetails = jest.fn().mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { courseId: "1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
     // Call the controller method
    await courseController.deleteCourseAndDetails(req, res);
    // Verify that the deleteCourseAndDetails method was called with the correct parameter
    expect(Course.deleteCourseAndDetails).toHaveBeenCalledWith(1);
    // Verify that the response status is 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Verify that the response contains the appropriate error message
    expect(res.send).toHaveBeenCalledWith('Error deleting course and details');
  });
});


  
  
  


