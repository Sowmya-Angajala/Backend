const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Utility: Read students data from db.json
const readData = () => {
  try {
    const data = fs.readFileSync("db.json");
    return JSON.parse(data);
  } catch (err) {
    return { students: [] };
  }
};

// Utility: Write students data to db.json
const writeData = (data) => {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

// POST /students → Add a new student
app.post("/students", (req, res) => {
  const students = readData().students;
  const newStudent = { id: Date.now(), ...req.body };
  students.push(newStudent);
  writeData({ students });
  res.status(201).json(newStudent);
});

// GET /students → Fetch all students
app.get("/students", (req, res) => {
  const students = readData().students;
  if (students.length === 0) {
    return res.json({ message: "No students found" });
  }
  res.json(students);
});

// GET /students/:id → Fetch student by ID
app.get("/students/:id", (req, res) => {
  const students = readData().students;
  const student = students.find((s) => s.id == req.params.id);
  if (!student) {
    return res.json({ message: "No students found" });
  }
  res.json(student);
});

// PUT /students/:id → Update student record
app.put("/students/:id", (req, res) => {
  const data = readData();
  const students = data.students;
  const index = students.findIndex((s) => s.id == req.params.id);

  if (index === -1) {
    return res.json({ message: "No students found" });
  }

  students[index] = { ...students[index], ...req.body };
  writeData({ students });
  res.json(students[index]);
});

// DELETE /students/:id → Delete student record
app.delete("/students/:id", (req, res) => {
  const data = readData();
  const students = data.students;
  const updatedStudents = students.filter((s) => s.id != req.params.id);

  if (updatedStudents.length === students.length) {
    return res.json({ message: "No students found" });
  }

  writeData({ students: updatedStudents });
  res.json({ message: "Student deleted successfully" });
});

// GET /students/search?course=<course> → Filter students by enrolled course
app.get("/students/search", (req, res) => {
  const { course } = req.query;
  const students = readData().students;
  const filtered = students.filter(
    (s) => s.course.toLowerCase() === course?.toLowerCase()
  );

  if (filtered.length === 0) {
    return res.json({ message: "No students found" });
  }

  res.json(filtered);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
