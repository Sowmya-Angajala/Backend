const Member = require('../models/memberModel');
const Book = require('../models/bookModel');

// Add new member
exports.addMember = async (req, res) => {
    try {
        const { name, email } = req.body;
        const member = await Member.create({ name, email });
        res.status(201).json(member);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Borrow book
exports.borrowBook = async (req, res) => {
    try {
        const { memberId, bookId } = req.body;
        const member = await Member.findById(memberId);
        const book = await Book.findById(bookId);

        if (!member || !book) return res.status(404).json({ message: "Member or Book not found" });
        if (book.status === "borrowed") return res.status(400).json({ message: "Book is already borrowed" });

        book.status = "borrowed";
        book.borrowers.push(member._id);
        member.borrowedBooks.push(book._id);

        await book.save();
        await member.save();

        res.status(200).json({ message: "Book borrowed successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Return book
exports.returnBook = async (req, res) => {
    try {
        const { memberId, bookId } = req.body;
        const member = await Member.findById(memberId);
        const book = await Book.findById(bookId);

        if (!member || !book) return res.status(404).json({ message: "Member or Book not found" });

        book.status = "available";
        book.borrowers.pull(member._id);
        member.borrowedBooks.pull(book._id);

        await book.save();
        await member.save();

        res.status(200).json({ message: "Book returned successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get borrowed books of a member
exports.getMemberBorrowedBooks = async (req, res) => {
    try {
        const { memberId } = req.params;
        const member = await Member.findById(memberId).populate('borrowedBooks', 'title author status');
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(member.borrowedBooks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
