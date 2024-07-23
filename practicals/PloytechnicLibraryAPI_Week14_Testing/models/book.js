const sql = require('mssql');
const dbConfig = require('../dbConfig');

class Book {
    constructor(bookId, title, author, availability) {
        this.bookId = bookId;
        this.title = title;
        this.author = author;
        this.availability = availability;
    }

    static async getAllBooks(){
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `SELECT * FROM Books`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        let books = [];
        result.recordset.forEach(row => {
            let book = new Book(
                row.bookId,
                row.title,
                row.author,
                row.availability
            );
            books.push(book);
        });

        return books;

        
        // Convert rows to Account objects
    }

    static async updateBookAvailability(bookId, newBookAvailability){
        
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE Books SET availability = @newBookAvailability WHERE book_id = @bookId
                            SELECT * FROM Books WHERE book_id = @bookId;`;
        
        const request = connection.request();
        request.input("bookId", sql.Int, bookId);
        request.input("newBookAvailability", sql.Char(1), newBookAvailability);

        const result = await request.query(sqlQuery);
        
        connection.close();
        
        const row = result.recordset[0];
        
        return row ? new Book(
            row.bookId, 
            row.title, 
            row.author, 
            row.availability) 
        : null;

        // Convert rows to Account objects
    }
}

module.exports = Book;