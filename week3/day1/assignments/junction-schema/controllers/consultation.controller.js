const Consultation = require("../models/consultation.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");

// POST /consultations
exports.createConsultation = async (req, res) => {
  try {
    const { doctorId, patientId, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !doctor.isActive || !patient || !patient.isActive) {
      return res.status(400).json({ error: "Both doctor and patient must be active" });
    }

    const consultation = await Consultation.create({ doctorId, patientId, notes });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /consultations/recent
exports.getRecentConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ isActive: true })
      .populate("doctorId", "name specialization")
      .populate("patientId", "name age gender")
      .sort({ consultedAt: -1 })
      .limit(5);
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
