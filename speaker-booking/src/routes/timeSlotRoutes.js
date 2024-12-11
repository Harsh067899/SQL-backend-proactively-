const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

console.log(appointmentController);  // This should log { bookSession: [Function: bookSession] }
console.log(appointmentController.bookSession);  // Log bookSession to confirm it's being imported correctly

// Define routes for time slots
router.post('/create', appointmentController.createTimeSlot); // Example route to create time slot
router.get('/', appointmentController.getAllTimeSlots); // Example route to get all time slots
router.post('/book', appointmentController.bookSession);  // Make sure to reference the function properly

module.exports = router;
