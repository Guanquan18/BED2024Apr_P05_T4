// Entirely Created By: Sairam (S10259930H)
const sectionController = require("../controllers/sectionDetailController");
const Section = require("../models/sectionDetail");

// Mock the Course model
jest.mock("../models/sectionDetail");


describe("sectionController.getSectionDetailsById", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          id: "1",
          sectionNo: "1"
        }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should fetch section details and send them as JSON", async () => {
      const mockSectionDetails = {
        SectionNo: 1,
        SectionTitle: "Introduction",
        Video: "intro.mp4"
      };
  
      Section.getSectionDetailsById.mockResolvedValue(mockSectionDetails);
  
      await sectionController.getSectionDetailsById(req, res);
  
      expect(Section.getSectionDetailsById).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith(mockSectionDetails);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  
    it("should return 404 if section is not found", async () => {
      Section.getSectionDetailsById.mockResolvedValue(null);
  
      await sectionController.getSectionDetailsById(req, res);
  
      expect(Section.getSectionDetailsById).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Section not found");
      expect(res.json).not.toHaveBeenCalled();
    });
  
    it("should handle errors and return 500", async () => {
      const errorMessage = "Database Error";
      Section.getSectionDetailsById.mockRejectedValue(new Error(errorMessage));
  
      await sectionController.getSectionDetailsById(req, res);
  
      expect(Section.getSectionDetailsById).toHaveBeenCalledWith(1, 1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Error retrieving Section");
      expect(res.json).not.toHaveBeenCalled();
    });
  });
describe("sectionController.updateSectionDetails", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          id: "1",
          sectionNo: "1"
        },
        body: {
          SectionTitle: "Updated Title"
        },
        file: {
          filename: "video.mp4"
        }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should update section details and send them as JSON", async () => {
      const mockUpdatedSection = {
        SectionNo: 1,
        SectionTitle: "Updated Title",
        Video: "../videos/video.mp4"
      };
  
      Section.updateSectionDetails.mockResolvedValue(mockUpdatedSection);
  
      await sectionController.updateSectionDetails(req, res);
  
      expect(Section.updateSectionDetails).toHaveBeenCalledWith(1, 1, {
        SectionTitle: "Updated Title",
        Video: "../videos/video.mp4"
      });
      expect(res.json).toHaveBeenCalledWith(mockUpdatedSection);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  
    it("should return 404 if section is not found", async () => {
      Section.updateSectionDetails.mockResolvedValue(null);
  
      await sectionController.updateSectionDetails(req, res);
  
      expect(Section.updateSectionDetails).toHaveBeenCalledWith(1, 1, {
        SectionTitle: "Updated Title",
        Video: "../videos/video.mp4"
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Section not found');
      expect(res.json).not.toHaveBeenCalled();
    });
  
    it("should handle errors and return 500", async () => {
      const errorMessage = "Update Section Error";
      Section.updateSectionDetails.mockRejectedValue(new Error(errorMessage));
  
      await sectionController.updateSectionDetails(req, res);
  
      expect(Section.updateSectionDetails).toHaveBeenCalledWith(1, 1, {
        SectionTitle: "Updated Title",
        Video: "../videos/video.mp4"
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error updating section');
      expect(res.json).not.toHaveBeenCalled();
    });
  });
describe("createSection", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          courseId: "1"
        },
        body: {
          SectionTitle: "New Section"
        },
        file: {
          filename: "new-video.mp4"
        }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should create a new section and send it as JSON", async () => {
      const mockCreatedSection = {
        SectionNo: 1,
        SectionTitle: "New Section",
        Video: "../videos/new-video.mp4"
      };
  
      Section.createSection.mockResolvedValue(mockCreatedSection);
  
      await sectionController.createSection(req, res);
  
      expect(Section.createSection).toHaveBeenCalledWith(1, {
        SectionTitle: "New Section",
        Video: "../videos/new-video.mp4"
      });
      expect(res.json).toHaveBeenCalledWith(mockCreatedSection);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  
    it("should return 404 if section creation fails", async () => {
      Section.createSection.mockResolvedValue(null);
  
      await sectionController.createSection(req, res);
  
      expect(Section.createSection).toHaveBeenCalledWith(1, {
        SectionTitle: "New Section",
        Video: "../videos/new-video.mp4"
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Section not created');
      expect(res.json).not.toHaveBeenCalled();
    });
  
    it("should handle errors and return 500", async () => {
      const errorMessage = "Error creating section";
      Section.createSection.mockRejectedValue(new Error(errorMessage));
  
      await sectionController.createSection(req, res);
  
      expect(Section.createSection).toHaveBeenCalledWith(1, {
        SectionTitle: "New Section",
        Video: "../videos/new-video.mp4"
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error creating section');
      expect(res.json).not.toHaveBeenCalled();
    });
  });
describe("deleteSectionDetails", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {
          sectionNo: "1"
        }
      };
  
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
  
      jest.clearAllMocks();
    });
  
    it("should successfully delete section details and send a 204 response", async () => {
      Section.deleteSectionDetails.mockResolvedValue(true);
  
      await sectionController.deleteSectionDetails(req, res);
  
      expect(Section.deleteSectionDetails).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledWith('successfully deleted');
    });
  
    it("should return 404 if section details are not found", async () => {
      Section.deleteSectionDetails.mockResolvedValue(false);
  
      await sectionController.deleteSectionDetails(req, res);
  
      expect(Section.deleteSectionDetails).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Section details not found');
    });
  
    it("should handle errors and return 500", async () => {
      const errorMessage = "Error deleting section details";
      Section.deleteSectionDetails.mockRejectedValue(new Error(errorMessage));
  
      await sectionController.deleteSectionDetails(req, res);
  
      expect(Section.deleteSectionDetails).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error deleting section details');
    });
  });