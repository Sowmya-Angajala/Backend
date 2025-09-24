class Book {
  constructor() {
    this.books = new Map(); // userId -> books array
  }

  getUserBooks(userId) {
    if (!this.books.has(userId)) {
      this.books.set(userId, []);
    }
    return this.books.get(userId);
  }

  getAllBooks(userId) {
    return this.getUserBooks(userId);
  }

  getBookById(userId, bookId) {
    const books = this.getUserBooks(userId);
    return books.find(book => book.id === bookId);
  }

  addBook(userId, bookData) {
    const books = this.getUserBooks(userId);
    const newBook = {
      id: require('uuid').v4(),
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    books.push(newBook);
    return newBook;
  }

  updateBook(userId, bookId, updateData) {
    const books = this.getUserBooks(userId);
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) return null;
    
    books[bookIndex] = {
      ...books[bookIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    return books[bookIndex];
  }

  deleteBook(userId, bookId) {
    const books = this.getUserBooks(userId);
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) return false;
    
    books.splice(bookIndex, 1);
    return true;
  }

  addBulkBooks(userId, booksArray) {
    const books = this.getUserBooks(userId);
    const newBooks = booksArray.map(bookData => ({
      id: require('uuid').v4(),
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    books.push(...newBooks);
    return newBooks;
  }
}

module.exports = new Book();