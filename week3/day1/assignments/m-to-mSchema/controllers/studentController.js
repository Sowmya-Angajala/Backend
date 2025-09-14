const Student = require('../models/student');
const Enrollment = require('../models/enrollment');

// Create a student
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete a student & cascade deactivate enrollments
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await Enrollment.updateMany({ studentId: student._id }, { isActive: false });
    res.json({ message: 'Student and related enrollments deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active courses for a student
exports.getStudentCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.params.id, isActive: true })
      .populate({ path: 'courseId', match: { isActive: true } });

    const courses = enrollments.map(e => e.courseId).filter(Boolean);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
