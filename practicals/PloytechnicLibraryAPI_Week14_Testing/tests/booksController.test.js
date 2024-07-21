// booksController.test.js

const booksController = require("../controllers/bookController");
const Book = require("../models/book");

// Mock the Book model
jest.mock("../models/book.js"); // Replace with the actual path to your Book model

describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = [
      { id: 1, title: "The Lord of the Rings" },
      { id: 2, title: "The Hitchhiker's Guide to the Galaxy" },
    ];

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const req = {};
    const res = {
      json: jest.fn(), // Mock the res.json function
    };

    await booksController.getAllBooks(req, res);

    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
    expect(res.json).toHaveBeenCalledWith(mockBooks); // Check the response body
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});

describe("booksController.updateBookAvailability", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock calls before each test
    });

    it("should update book availability and return the updated book", async () => {
        const initialBooks = [
          { bookId: 1, title: "The Lord of the Rings", author: "John", availability: "Y" },
          { bookId: 2, title: "The Hitchhiker's Guide to the Galaxy", author: "Cena", availability: "Y" },
        ];
    
        const updatedBook = { id: 1, title: "The Lord of the Rings", availability: "N" };
    
        // Mock the Book.getAllBooks function to return the initial data
        Book.getAllBooks.mockResolvedValue(initialBooks);
    
        // Mock the Book.updateBookAvailability function to return the updated book
        Book.updateBookAvailability.mockResolvedValue(updatedBook);
    
        const req = {
          params: { bookId: 1 },
          body: { availability: "N" } // New availability
        };
        const res = {
          status: jest.fn().mockReturnThis(), // Mock the res.status function
          json: jest.fn(), // Mock the res.json function
        };
    
        await booksController.updateBookAvailability(req, res);
    
        expect(Book.getAllBooks).toHaveBeenCalledTimes(1); // Check if getAllBooks was called
        expect(Book.updateBookAvailability).toHaveBeenCalledTimes(1); // Check if updateBookAvailability was called
        expect(Book.updateBookAvailability).toHaveBeenCalledWith(1, "N"); // Check if the method was called with correct parameters
        expect(res.status).toHaveBeenCalledWith(200); // Check the response status
        expect(res.json).toHaveBeenCalledWith(updatedBook); // Check the response body
      });

    it("should handle book not found and return a 404 status with error message", async () => {
        const mockBooks = [
            { id: 1, title: "The Lord of the Rings", availability: "Y" },
            { id: 2, title: "The Hitchhiker's Guide to the Galaxy", availability: "Y" },
        ];

        // Mock the Book.getAllBooks function to return the mock data
        Book.getAllBooks.mockResolvedValue(mockBooks);

        const req = {
            params: { bookId: 3 }, // Book ID not in the mock data
            body: { availability: "N" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await booksController.updateBookAvailability(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Book not found." });
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const errorMessage = "Database error";
        Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = {
            params: { bookId: 1 },
            body: { availability: "N" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await booksController.updateBookAvailability(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error updating book availability.");
    });

});