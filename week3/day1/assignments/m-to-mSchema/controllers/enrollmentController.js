const Enrollment = require('../models/enrollment');
const Student = require('../models/student');
const Course = require('../models/course');

// Enroll a student into a course
exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !student.isActive) return res.status(400).json({ error: 'Student not active or not found' });
    if (!course || !course.isActive) return res.status(400).json({ error: 'Course not active or not found' });

    const existing = await Enrollment.findOne({ studentId, courseId, isActive: true });
    if (existing) return res.status(400).json({ error: 'Already enrolled' });

    const enrollment = await Enrollment.create({ studentId, courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
