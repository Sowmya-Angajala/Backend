const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

router.post('/', mentorController.createMentor);
router.delete('/:id', mentorController.deleteMentor);
router.get('/no-sessions', mentorController.getMentorsWithoutActiveSessions);

module.exports = router;
