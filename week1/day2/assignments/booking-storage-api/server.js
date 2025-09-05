const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Utility: Read data from db.json
const readData = () => {
  const data = fs.readFileSync("db.json");
  return JSON.parse(data);
};

// Utility: Write data to db.json
const writeData = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

// ------------------- CRUD APIs -------------------

// POST /books → Add a new book
app.post("/books", (req, res) => {
  try {
    const books = readData();
    const newBook = req.body;

    if (!newBook.id || !newBook.title || !newBook.author || !newBook.year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    books.push(newBook);
    writeData(books);
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Error in POST /books:", err.message); // 👈 log exact issue
    res.status(500).json({ error: "Server error" });
  }
});

// GET /books → Retrieve all books
app.get("/books", (req, res) => {
  try {
    const books = readData();
    res.json(books);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /books/:id → Retrieve book by ID
app.get("/books/:id", (req, res) => {
  try {
    const books = readData();
    const book = books.find((b) => b.id == req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /books/:id → Update book by ID
app.put("/books/:id", (req, res) => {
  try {
    let books = readData();
    const index = books.findIndex((b) => b.id == req.params.id);

    if (index === -1) return res.status(404).json({ message: "Book not found" });

    books[index] = { ...books[index], ...req.body };
    writeData(books);

    res.json(books[index]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /books/:id → Delete book by ID
app.delete("/books/:id", (req, res) => {
  try {
    let books = readData();
    const newBooks = books.filter((b) => b.id != req.params.id);

    if (books.length === newBooks.length) {
      return res.status(404).json({ message: "Book not found" });
    }

    writeData(newBooks);
    res.json({ message: "Book deleted successfully" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- Search API -------------------

// GET /books/search?author=paulo&title=alchemist
app.get("/books/search", (req, res) => {
  try {
    const { author, title } = req.query;
    const books = readData();

    let results = books;

    if (author) {
      results = results.filter((b) =>
        b.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (title) {
      results = results.filter((b) =>
        b.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.json(results);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------- Handle 404 -------------------
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
