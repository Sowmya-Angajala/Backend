const Library = require("../models/library.model");


// Validation middleware for creating a new book
const validateBookData = (req, res, next) => {
const { title, author } = req.body;
if (!title || !author) {
return res.status(400).json({ message: "Incomplete Data", details: "title and author are required" });
}
next();
};


// Borrowing limit middleware: ensures a user doesn't have > 3 borrowed books
// Expects req.body.borrowerName when borrowing
const borrowLimitMiddleware = async (req, res, next) => {
try {
const borrowerName = req.body.borrowerName || req.query.borrowerName || req.params.borrowerName;
if (!borrowerName) {
return res.status(400).json({ message: "Incomplete Data", details: "borrowerName is required to borrow a book" });
}


// count borrowed books (status === 'borrowed') for this borrower
const activeBorrowCount = await Library.countDocuments({ borrowerName, status: "borrowed" });
if (activeBorrowCount >= 3) {
return res.status(409).json({ message: "Borrowing limit exceeded", details: `User ${borrowerName} already has ${activeBorrowCount} borrowed books` });
}


// pass borrowerName down to handler if needed
req.borrowerName = borrowerName;
next();
} catch (err) {
console.error(err);
res.status(500).json({ message: "Internal Server Error", error: err.message });
}
};


module.exports = { validateBookData, borrowLimitMiddleware };