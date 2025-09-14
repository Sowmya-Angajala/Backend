const Course = require('../models/course');
const Enrollment = require('../models/enrollment');

// Create a course
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete a course & cascade deactivate enrollments
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    await Enrollment.updateMany({ courseId: course._id }, { isActive: false });
    res.json({ message: 'Course and related enrollments deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active students in a course
exports.getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.id, isActive: true })
      .populate({ path: 'studentId', match: { isActive: true } });

    const students = enrollments.map(e => e.studentId).filter(Boolean);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
