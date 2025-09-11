const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes
router.post("/users", userController.createUser);
router.post("/users/:userId/address", userController.addAddress);
router.get("/users/summary", userController.getUsersSummary);
router.get("/users/:userId", userController.getUserDetails);
router.delete("/users/:userId/address/:addressId", userController.deleteAddress);

module.exports = router;
