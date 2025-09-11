const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/add-user
router.post('/add-user', userController.addUser);

// GET /api/get-users
router.get('/get-users', userController.getUsers);

// GET /api/user-rentals/:userId
router.get('/user-rentals/:userId', userController.getUserRentals);

module.exports = router;
