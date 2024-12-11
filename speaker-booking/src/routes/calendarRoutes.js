const express = require('express');
const router = express.Router();
const { CalendarEvent } = require('../models/CalendarEvent'); // Ensure you have a CalendarEvent model defined or modify as needed.

// Create a new calendar event
router.post('/create', async (req, res) => {
  const { title, description, startTime, endTime } = req.body;

  try {
    // Validate input
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: 'Title, startTime, and endTime are required.' });
    }

    // Create the calendar event
    const newEvent = await CalendarEvent.create({ title, description, startTime, endTime });
    res.status(201).json({ message: 'Calendar event created successfully.', event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create calendar event.' });
  }
});

// Retrieve all calendar events
router.get('/', async (req, res) => {
  try {
    const events = await CalendarEvent.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve calendar events.' });
  }
});

// Update a calendar event
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, startTime, endTime } = req.body;

  try {
    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    // Update event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    await event.save();

    res.status(200).json({ message: 'Calendar event updated successfully.', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update calendar event.' });
  }
});

// Delete a calendar event
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await CalendarEvent.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Calendar event not found.' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Calendar event deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete calendar event.' });
  }
});

module.exports = router;
