const express = require('express');
const { getAllSpeakers, addSpeaker } = require('../controllers/speakerController');
const router = express.Router();

router.get('/', getAllSpeakers);
router.post('/', addSpeaker); // Role-based access control required here (e.g., admin-only)

module.exports = router;
