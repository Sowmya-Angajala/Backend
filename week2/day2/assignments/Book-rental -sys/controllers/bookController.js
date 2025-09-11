const Book = require('../models/Book');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author required' });

    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json({ message: 'Book created', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated', book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    // Remove book
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Remove this book from all users' rentedBooks arrays
    await User.updateMany(
      { rentedBooks: book._id },
      { $pull: { rentedBooks: book._id } }
    );

    res.json({ message: 'Book deleted and user references updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rentBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid userId or bookId' });
    }

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ message: 'User or Book not found' });

    // avoid duplicate rentals
    const alreadyRented = user.rentedBooks.some(id => id.equals(book._id));
    if (alreadyRented) return res.status(409).json({ message: 'Book already rented by user' });

    user.rentedBooks.push(book._id);
    book.rentedBy.push(user._id);

    await user.save();
    await book.save();

    res.json({ message: 'Book rented', user, book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid userId or bookId' });
    }

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ message: 'User or Book not found' });

    // Remove references
    user.rentedBooks = user.rentedBooks.filter(id => !id.equals(book._id));
    book.rentedBy = book.rentedBy.filter(id => !id.equals(user._id));

    await user.save();
    await book.save();

    res.json({ message: 'Book returned', user, book });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookRenters = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('rentedBy');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ renters: book.rentedBy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
