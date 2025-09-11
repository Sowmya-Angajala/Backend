const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');


// Route 1: Create user
router.post('/add-user', controller.addUser);


// Route 2: Add profile to user
router.post('/add-profile/:userId', controller.addProfile);


// Route 3: Get users (support filter by ?profile=github)
router.get('/get-users', controller.getUsers);


// Route 4: Search
router.get('/search', controller.search);


// Route 5: Update profile
router.put('/update-profile/:userId/:profileName', controller.updateProfile);


// Route 6: Delete profile
router.delete('/delete-profile/:userId/:profileName', controller.deleteProfile);


module.exports = router;