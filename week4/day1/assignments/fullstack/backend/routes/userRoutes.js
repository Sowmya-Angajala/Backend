const express = require("express");
const router = express.Router();
const { getAllUsers, getProfile, updateProfile } = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
