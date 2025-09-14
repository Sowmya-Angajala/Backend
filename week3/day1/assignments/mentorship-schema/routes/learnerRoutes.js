const express = require('express');
const router = express.Router();
const learnerController = require('../controllers/learnerController');

router.post('/', learnerController.createLearner);
router.delete('/:id', learnerController.deleteLearner);

module.exports = router;
