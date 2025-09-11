const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

// Add User
router.post("/add-user", controller.addUser);

// Add Profile
router.post("/add-profile", controller.addProfile);

// Get all profiles with user info
router.get("/profiles", controller.getProfiles);

module.exports = router;
