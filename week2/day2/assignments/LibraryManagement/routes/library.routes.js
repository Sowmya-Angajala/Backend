const express = require("express");
const router = express.Router();
const controller = require("../controllers/library.controller");
const { validateBookData, borrowLimitMiddleware } = require("../middleware/library.middleware");


// Add a book
router.post("/books", validateBookData, controller.addBook);


// Get books (optional ?status=available&title=foo)
router.get("/books", controller.getBooks);


// Delete a book by id (only if not borrowed)
router.delete("/books/:id", controller.deleteBook);


// Borrow a book (apply borrow limit middleware) -> expects { borrowerName }
router.patch("/borrow/:id", borrowLimitMiddleware, controller.borrowBook);


// Return a book
router.patch("/return/:id", controller.returnBook);


module.exports = router;