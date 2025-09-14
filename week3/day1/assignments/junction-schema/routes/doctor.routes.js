const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");

router.post("/", doctorController.createDoctor);
router.get("/:id/patients", doctorController.getPatientsByDoctor);
router.get("/:id/consultations/count", doctorController.getDoctorConsultationCount);
router.delete("/:id", doctorController.softDeleteDoctor);

module.exports = router;
