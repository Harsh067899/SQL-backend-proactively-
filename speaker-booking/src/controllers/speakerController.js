const { Speaker } = require('../models/Speaker'); // Ensure you're importing the Sequelize models correctly

// Get list of all speakers
const getAllSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.findAll();
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching speakers', error: error.message });
  }
};

// Add new speaker
const addSpeaker = async (req, res) => {
  try {
    const { first_name, last_name, bio } = req.body; // Ensure you receive the correct data
    const newSpeaker = await Speaker.create({ first_name, last_name, bio });
    res.status(201).json(newSpeaker);
  } catch (error) {
    res.status(500).json({ message: 'Error adding speaker', error: error.message });
  }
};

module.exports = { getAllSpeakers, addSpeaker };
