const express = require("express");
const router = express.Router();
const {
  createResource,
  getResources,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Create a resource (admin or moderator)
router.post("/", verifyToken, authorizeRoles("admin", "moderator"), createResource);

// Get all resources
router.get("/", verifyToken, getResources);

// Update resource
router.put("/:id", verifyToken, authorizeRoles("admin", "moderator"), updateResource);

// Delete resource
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteResource);

module.exports = router;
