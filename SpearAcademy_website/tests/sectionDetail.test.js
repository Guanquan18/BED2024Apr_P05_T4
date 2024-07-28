// Entirely Created By: Sairam (S10259930H)
const sql = require("mssql");
const Section = require("../models/sectionDetail"); // Adjust the path as necessary

jest.mock("mssql"); // Mock the mssql library to control its behavior in tests

// Test suite for the Section.getSectionDetailsById method
describe("Section.getSectionDetailsById", () => {
  let mockConnection;
  let mockRequest;
     // Setup before each test case
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks for sql.connect and its return value
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    // Mock the sql.connect method to return the mock connection
    sql.connect = jest.fn().mockResolvedValue(mockConnection);
  });

  it("should fetch section details by CourseId and SectionNo", async () => {
    const mockSectionDetails = {
      SectionNo: 1,
      SectionTitle: "Introduction",
      Video: "intro.mp4"
    };

    // Mock the result of the query
    mockRequest.query.mockResolvedValue({ recordset: [mockSectionDetails] });

    const courseId = 1;
    const sectionNo = 1;

    // Call the method
    const result = await Section.getSectionDetailsById(courseId, sectionNo);

    // Assertions
    expect(mockConnection.request).toHaveBeenCalledTimes(1);
    expect(mockRequest.input).toHaveBeenCalledWith('id', courseId);
    expect(mockRequest.input).toHaveBeenCalledWith('no', sectionNo);
    expect(mockConnection.close).toHaveBeenCalledTimes(1);

    // Check that the result matches the mock data
    expect(result).toEqual(new Section(
      mockSectionDetails.SectionNo,
      mockSectionDetails.SectionTitle,
      mockSectionDetails.Video
    ));
  });

  it("should return null if section is not found", async () => {
    // Mock the result of the query to return an empty recordset
    mockRequest.query.mockResolvedValue({ recordset: [] });

    const courseId = 1;
    const sectionNo = 99; // Assume this section does not exist

    // Call the method
    const result = await Section.getSectionDetailsById(courseId, sectionNo);

    // Assertions
    expect(mockConnection.request).toHaveBeenCalledTimes(1);
    expect(mockRequest.input).toHaveBeenCalledWith('id', courseId);
    expect(mockRequest.input).toHaveBeenCalledWith('no', sectionNo);
    expect(mockConnection.close).toHaveBeenCalledTimes(1);

    // Check that the result is null
    expect(result).toBeNull();
  });

  it("should handle errors and throw an exception", async () => {
    const errorMessage = "Database Error";
    mockRequest.query.mockRejectedValue(new Error(errorMessage));

    const courseId = 1;
    const sectionNo = 1;

    // Call the method and expect it to throw an error
    await expect(Section.getSectionDetailsById(courseId, sectionNo)).rejects.toThrow(errorMessage);

    // Assertions
    expect(mockConnection.request).toHaveBeenCalledTimes(1);
    expect(mockRequest.input).toHaveBeenCalledWith('id', courseId);
    expect(mockRequest.input).toHaveBeenCalledWith('no', sectionNo);
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
  });
});
// Test suite for the Section.updateSectionDetails method
describe("Section.updateSectionDetails", () => {
    let mockConnection;
    let mockRequest;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      // Setup mocks for sql.connect and its return value
      mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn(),
      };
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      // Mock the sql.connect method to return the mock connection
      sql.connect = jest.fn().mockResolvedValue(mockConnection);
  
      // Mock the getSectionDetailsById method
      Section.getSectionDetailsById = jest.fn();
    });
  
    it("should update section details with all fields provided", async () => {
      const mockSectionDetails = {
        SectionNo: 1,
        SectionTitle: "Updated Title",
        Video: "updatedVideo.mp4"
      };
  
      // Mock the result of the query
      mockRequest.query.mockResolvedValue({});
  
      // Mock the getSectionDetailsById method to return the updated section
      Section.getSectionDetailsById.mockResolvedValue(mockSectionDetails);
  
      const courseId = 1;
      const sectionNo = 1;
      const newSectionDetail = {
        SectionTitle: "Updated Title",
        Video: "updatedVideo.mp4"
      };
  
      // Call the method
      const result = await Section.updateSectionDetails(courseId, sectionNo, newSectionDetail);
  
      // Assertions
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionTitle', newSectionDetail.SectionTitle);
      expect(mockRequest.input).toHaveBeenCalledWith('Video', newSectionDetail.Video);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
  
      // Check that the result matches the mock data
      expect(result).toEqual(mockSectionDetails);
    });
  
    it("should update section details with some fields provided", async () => {
      const mockSectionDetails = {
        SectionNo: 1,
        SectionTitle: "Updated Title",
        Video: "originalVideo.mp4"
      };
  
      // Mock the result of the query
      mockRequest.query.mockResolvedValue({});
  
      // Mock the getSectionDetailsById method to return the updated section
      Section.getSectionDetailsById.mockResolvedValue(mockSectionDetails);
  
      const courseId = 1;
      const sectionNo = 1;
      const newSectionDetail = {
        SectionTitle: "Updated Title"
      };
  
      // Call the method
      const result = await Section.updateSectionDetails(courseId, sectionNo, newSectionDetail);
  
      // Assertions
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionTitle', newSectionDetail.SectionTitle);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
  
      // Check that the result matches the mock data
      expect(result).toEqual(mockSectionDetails);
    });
  
    it("should throw an error if no fields are provided for update", async () => {
      const courseId = 1;
      const sectionNo = 1;
      const newSectionDetail = {};
  
      // Call the method and expect it to throw an error
      await expect(Section.updateSectionDetails(courseId, sectionNo, newSectionDetail)).rejects.toThrow('No fields provided for update');
  
      // Assertions
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).not.toHaveBeenCalled();
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
  
    it("should handle errors and throw an exception", async () => {
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage));
  
      const courseId = 1;
      const sectionNo = 1;
      const newSectionDetail = {
        SectionTitle: "Updated Title"
      };
  
      // Call the method and expect it to throw an error
      await expect(Section.updateSectionDetails(courseId, sectionNo, newSectionDetail)).rejects.toThrow(errorMessage);
  
      // Assertions
      expect(mockConnection.request).toHaveBeenCalledTimes(1);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionTitle', newSectionDetail.SectionTitle);
      expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
      expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
});
// Test suite for the Section.createSection method
describe("Section.createSection", () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks for sql.connect and its return value
        mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn(),
        };
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock the sql.connect method to return the mock connection
        sql.connect = jest.fn().mockResolvedValue(mockConnection);

        // Mock the getSectionDetailsById method
        Section.getSectionDetailsById = jest.fn();
    });

    it("should create a new section and return the section details", async () => {
        const mockSectionDetails = {
            SectionNo: 1,
            SectionTitle: "New Section",
            Video: "newVideo.mp4"
        };

        // Mock the result of the query
        mockRequest.query.mockResolvedValue({ recordset: [{ SectionNo: 1 }] });

        // Mock the getSectionDetailsById method to return the new section
        Section.getSectionDetailsById.mockResolvedValue(mockSectionDetails);

        const courseId = 1;
        const newSectionData = {
            SectionTitle: "New Section",
            Video: "newVideo.mp4"
        };

        // Call the method
        const result = await Section.createSection(courseId, newSectionData);

        // Assertions
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
        expect(mockRequest.input).toHaveBeenCalledWith('SectionTitle', newSectionData.SectionTitle);
        expect(mockRequest.input).toHaveBeenCalledWith('Video', newSectionData.Video);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);

        // Check that the result matches the mock data
        expect(result).toEqual(mockSectionDetails);
    });

    it("should handle errors and throw an exception", async () => {
        const errorMessage = "Database Error";
        mockRequest.query.mockRejectedValue(new Error(errorMessage));

        const courseId = 1;
        const newSectionData = {
            SectionTitle: "New Section",
            Video: "newVideo.mp4"
        };

        // Call the method and expect it to throw an error
        await expect(Section.createSection(courseId, newSectionData)).rejects.toThrow(errorMessage);

        // Assertions
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('CourseId', courseId);
        expect(mockRequest.input).toHaveBeenCalledWith('SectionTitle', newSectionData.SectionTitle);
        expect(mockRequest.input).toHaveBeenCalledWith('Video', newSectionData.Video);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
});
// Test suite for the Section.deleteSectionDetails method
describe("Section.deleteSectionDetails", () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mocks for sql.connect and its return value
        mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn(),
        };
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        // Mock the sql.connect method to return the mock connection
        sql.connect = jest.fn().mockResolvedValue(mockConnection);
    });

    it("should delete section details and return true if rows were affected", async () => {
        // Mock the result of the query
        mockRequest.query.mockResolvedValue({ rowsAffected: [1, 1, 1, 1] });

        const sectionNo = 1;

        // Call the method
        const result = await Section.deleteSectionDetails(sectionNo);

        // Assertions
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);

        // Check that the result is true
        expect(result).toBe(true);
    });

    it("should return false if no rows were affected", async () => {
        // Mock the result of the query to return no affected rows
        mockRequest.query.mockResolvedValue({ rowsAffected: [0, 0, 0, 0] });

        const sectionNo = 1;

        // Call the method
        const result = await Section.deleteSectionDetails(sectionNo);

        // Assertions
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);

        // Check that the result is false
        expect(result).toBe(false);
    });

    it("should handle errors and throw an exception", async () => {
        const errorMessage = "Database Error";
        mockRequest.query.mockRejectedValue(new Error(errorMessage));

        const sectionNo = 1;

        // Call the method and expect it to throw an error
        await expect(Section.deleteSectionDetails(sectionNo)).rejects.toThrow(errorMessage);

        // Assertions
        expect(mockConnection.request).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith('SectionNo', sectionNo);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
    });
});
    