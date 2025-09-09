const Library = require("../models/library.model");


// Helper to calculate overdue fees: Rs. 10 per day (partial days count as full day)
const calculateOverdueFees = (dueDate, returnDate) => {
if (!dueDate || !returnDate) return 0;
const msPerDay = 24 * 60 * 60 * 1000;
const diff = returnDate.setHours(0,0,0,0) - new Date(dueDate).setHours(0,0,0,0);
const daysLate = Math.ceil(diff / msPerDay);
if (daysLate <= 0) return 0;
return daysLate * 10; // Rs. 10 per day
};


// Add a new book
const addBook = async (req, res) => {
try {
const { title, author } = req.body;
const book = new Library({ title, author, status: "available" });
await book.save();
return res.status(201).json({ message: "Book added successfully", data: book });
} catch (err) {
console.error(err);
return res.status(500).json({ message: "Internal Server Error", error: err.message });
}
};


// Borrow a book
const borrowBook = async (req, res) => {
try {
const bookId = req.params.id;
const borrowerName = req.body.borrowerName || req.borrowerName;


const book = await Library.findById(bookId);
if (!book) return res.status(404).json({ message: "Book not found" });


if (book.status === "borrowed") {
return res.status(409).json({ message: "Book already borrowed", data: { id: bookId } });
}


// Update borrow details
const borrowDate = new Date();
const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days


book.status = "borrowed";
book.borrowerName = borrowerName;
book.borrowDate = borrowDate;
book.dueDate = dueDate;
book.returnDate = null;
// overdueFees stays as-is


await book.save();
return res.status(200).json({ message: "Book borrowed successfully", data: book });
} catch (err) {
console.error(err);
return res.status(500).json({ message: "Internal Server Error", error: err.message });
}
};


// Return a book
const returnBook = async (req, res) => {
module.exports = { addBook, borrowBook, returnBook, getBooks, deleteBook };