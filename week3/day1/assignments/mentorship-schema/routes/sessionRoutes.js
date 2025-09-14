const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.put('/archive/:id', sessionController.archiveSession);
router.get('/mentor/:id', sessionController.getSessionsByMentor);
router.get('/learner/:id', sessionController.getSessionsByLearner);

// Advanced queries
router.get('/recent', sessionController.getRecentSessions);
router.get('/mentor/:id/learner-count', sessionController.countLearnersForMentor);
router.get('/learner/:id/mentors', sessionController.getMentorsForLearner);
router.get('/:id/learners', sessionController.getLearnersForSession);
router.get('/learners/more-than-3', sessionController.getActiveLearnersMoreThanThree);

module.exports = router;
