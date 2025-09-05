const express = require("express");
const app = express();
const PORT = 3000;

const todoRoutes = require("./routes/todoRoutes");

app.use(express.json());

// Todo API routes
app.use("/todos", todoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
