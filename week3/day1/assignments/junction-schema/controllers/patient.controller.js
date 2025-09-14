const Patient = require("../models/patient.model");
const Consultation = require("../models/consultation.model");

// POST /patients
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /patients/:id/doctors
exports.getDoctorsByPatient = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.params.id, isActive: true })
      .populate({ path: "doctorId", select: "name specialization" });
    const doctors = consultations.map(c => c.doctorId);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /patients?gender=Male
exports.getPatientsByGender = async (req, res) => {
  try {
    const { gender } = req.query;
    const patients = await Patient.find({ gender, isActive: true });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /patients/:id
exports.softDeletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ patientId: req.params.id }, { isActive: false });
    res.json({ message: "Patient and related consultations soft-deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
