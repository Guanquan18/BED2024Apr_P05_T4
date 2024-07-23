// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        bookId: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        bookId: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].bookId).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
    expect(books[1].bookId).toBe(2);
    expect(books[1].title).toBe("The Hitchhiker's Guide to the Galaxy");
    expect(books[1].author).toBe("Douglas Adams");
    expect(books[1].availability).toBe("N");
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    it("should update the availability of a book", async () => {
        // ... arrange: set up mock book data and mock database interaction
        const mockBookId = 1;
        const mockNewAvailability = "N";
        
        // ... act: call updateBookAvailability with the test data
        const mockBook = {
            bookId: 1,
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            availability: "N",
        };
        
        const mockRequest = {
          query: jest.fn().mockResolvedValue({ recordset: [mockBook] }),
          input: jest.fn().mockReturnThis(),
        };
        
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
        sql.connect.mockResolvedValue(mockConnection);

        const book = await Book.updateBookAvailability(mockBookId, mockNewAvailability);

        console.log(book);

        // ... assert: check if the database was updated correctly and the updated book is returned
        expect(sql.connect).toHaveBeenCalledTimes(1);
        expect(mockRequest.input).toHaveBeenCalledWith("bookId", sql.Int, mockBookId);
        expect(mockRequest.input).toHaveBeenCalledWith("newBookAvailability", sql.Char(1), mockNewAvailability);
        expect(mockRequest.query).toHaveBeenCalledTimes(1);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(book).toBeInstanceOf(Book);
        expect(book.bookId).toBe(1);
        expect(book.title).toBe("The Lord of the Rings");
        // Add more assertions for author and availability
        expect(book.author).toBe("J.R.R. Tolkien");
        expect(book.availability).toBe("N");
    });
  
    it("should return null if book with the given id does not exist", async () => {
        // ... arrange: set up mocks for a non-existent book id
        const mockBookId = 3;
        const mockNewAvailability = "N";

        // ... act: call updateBookAvailability
        const mockRequest = {
            query: jest.fn().mockResolvedValue({ recordset: [] }), // No books found
            input: jest.fn().mockReturnThis(),
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };
        sql.connect.mockResolvedValue(mockConnection);
    
        const book = await Book.updateBookAvailability(mockBookId, mockNewAvailability);

        // ... assert: expect the function to return null
        expect(book).toBeNull(); // Expect the result to be null

    });
  
    // Add more tests for error scenarios (e.g., database error)
    it("should handle errors and throw an exception", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
    
        await expect(Book.updateBookAvailability(1, "N")).rejects.toThrow(errorMessage);
    });
  });