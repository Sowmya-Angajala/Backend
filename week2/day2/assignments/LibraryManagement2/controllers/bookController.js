const Book = require('../models/bookModel');
const Member = require('../models/memberModel');

// Add new book
exports.addBook = async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await Book.create({ title, author });
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update book
exports.updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
        res.status(200).json(book);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete book
exports.deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByIdAndDelete(bookId);

        if (!book) return res.status(404).json({ message: "Book not found" });

        // Remove book from all members
        await Member.updateMany(
            { borrowedBooks: bookId },
            { $pull: { borrowedBooks: bookId } }
        );

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all borrowers of a book
exports.getBookBorrowers = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId).populate('borrowers', 'name email');
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.status(200).json(book.borrowers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
