const Book = require('../models/book');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAllBooks();
        res.json(books);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving books");
    }
};

const updateBookAvailability = async (req, res) => {
    const bookId = req.params.bookId;
    const newBookAvailability = req.body.availability;

    try {
        const books = await Book.getAllBooks();
        let existingBook = false;
        books.forEach(book => {
            if(book.bookId == bookId){
                existingBook = true;
            }
        });

        if (!existingBook){
            return res.status(404).json({ message: "Book not found." });;
        }

        const book = await Book.updateBookAvailability(bookId, newBookAvailability);
        res.status(200).json(book);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating book availability.");
    }
};

module.exports = {
    getAllBooks,
    updateBookAvailability
};