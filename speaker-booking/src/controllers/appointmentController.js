// src/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const TimeSlot = require('../models/TimeSlot');

// Controller to book a session
const bookSession = async (req, res) => {
  try {
    const { user_id, speaker_id, date, time } = req.body;

    // Check if the time slot is available
    const timeSlot = await TimeSlot.findOne({ where: { speaker_id, date, time } });

    if (!timeSlot) {
      return res.status(400).json({ error: 'Time slot not found' });
    }

    if (timeSlot.is_booked) {
      return res.status(400).json({ error: 'Time slot unavailable' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      user_id,
      speaker_id,
      date,
      time
    });

    // Block the time slot
    await timeSlot.update({ is_booked: true });

    res.status(201).json({ appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to create a time slot
const createTimeSlot = async (req, res) => {
  try {
    const { speaker_id, date, time } = req.body;

    // Check if time slot already exists
    const existingSlot = await TimeSlot.findOne({ where: { speaker_id, date, time } });

    if (existingSlot) {
      return res.status(400).json({ error: 'Time slot already exists' });
    }

    // Create a new time slot
    const timeSlot = await TimeSlot.create({
      speaker_id,
      date,
      time,
      is_booked: false
    });

    res.status(201).json({ timeSlot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get all time slots
const getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.findAll();
    res.status(200).json({ timeSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { bookSession, createTimeSlot, getAllTimeSlots };
