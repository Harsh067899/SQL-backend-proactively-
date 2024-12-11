const express = require('express');
const router = express.Router();
const { bookSession } = require('../controllers/appointmentController');

router.post('/book', bookSession);  // Link the post request to the bookSession function

module.exports = router;
