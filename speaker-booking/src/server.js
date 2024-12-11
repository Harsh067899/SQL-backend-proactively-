const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Enable CORS for frontend
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',      // MySQL host
  user: 'root',           // MySQL username
  password: 'Gyan@2003',  // MySQL password
  database: 'speaker'     // Your database name
});

// Connect to MySQL and log status
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database with ID:', db.threadId);
});

// Middleware to parse JSON
app.use(express.json());

// Route to fetch all users
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// Fetch all speakers
app.get('/api/speakers', (req, res) => {
  const query = `
    SELECT s.id, s.first_name, s.last_name, s.expertise, s.price_per_session 
    FROM speaker s
    INNER JOIN user u ON s.user_id = u.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching speakers:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch speakers' });
    }
    res.json(results);
  });
});

// Fetch time slots for a specific speaker
app.get('/api/speakers/:speakerId/time-slots', (req, res) => {
  const speakerId = req.params.speakerId;

  const query = `
    SELECT id, start_time, end_time, status 
    FROM timeslots 
    WHERE speaker_id = ? AND status = 'available'
  `;

  db.query(query, [speakerId], (err, results) => {
    if (err) {
      console.error('Error fetching time slots for speaker:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch time slots' });
    }
    res.json(results);
  });
});

// Book an appointment
app.post('/api/appointments', (req, res) => {
  const { userId, speakerId, timeSlotId } = req.body;

  if (!userId || !speakerId || !timeSlotId) {
    return res.status(400).json({ error: 'User ID, Speaker ID, and Time Slot ID are required' });
  }

  const checkSlotQuery = `
    SELECT * FROM timeslots 
    WHERE id = ? AND status = 'available'
  `;

  db.query(checkSlotQuery, [timeSlotId], (err, slots) => {
    if (err) {
      console.error('Error checking time slot availability:', err.stack);
      return res.status(500).json({ error: 'Failed to check time slot availability' });
    }

    if (slots.length === 0) {
      return res.status(400).json({ error: 'Time slot is not available' });
    }

    const insertAppointmentQuery = `
      INSERT INTO appointment (appointment_date, status, userId, speakerId, timeSlotId) 
      VALUES (NOW(), 'booked', ?, ?, ?)
    `;

    db.query(insertAppointmentQuery, [userId, speakerId, timeSlotId], (err, results) => {
      if (err) {
        console.error('Error booking appointment:', err.stack);
        return res.status(500).json({ error: 'Failed to book appointment' });
      }

      const updateSlotQuery = `
        UPDATE timeslots 
        SET status = 'booked' 
        WHERE id = ?
      `;

      db.query(updateSlotQuery, [timeSlotId], (updateErr) => {
        if (updateErr) {
          console.error('Error updating time slot status:', updateErr.stack);
          return res.status(500).json({ error: 'Failed to update time slot status' });
        }

        res.json({ message: 'Appointment booked successfully', appointmentId: results.insertId });
      });
    });
  });
});

// Add a time slot for a speaker
app.post('/api/speakers/:speakerId/time-slots', (req, res) => {
  const speakerId = req.params.speakerId;
  const { start_time, end_time } = req.body;

  if (!start_time || !end_time) {
    return res.status(400).json({ error: 'Start time and end time are required' });
  }

  const insertTimeSlotQuery = `
    INSERT INTO timeslots (speaker_id, start_time, end_time, status)
    VALUES (?, ?, ?, 'available')
  `;

  db.query(insertTimeSlotQuery, [speakerId, start_time, end_time], (err, results) => {
    if (err) {
      console.error('Error adding time slot:', err.stack);
      return res.status(500).json({ error: 'Failed to add time slot' });
    }
    res.status(201).json({ message: 'Time slot added successfully', timeSlotId: results.insertId });
  });
});

// Fetch time slots for a specific speaker
app.get('/api/speakers/:speakerId/time-slots', (req, res) => {
  const speakerId = req.params.speakerId;

  const query = `
    SELECT id, start_time, end_time, status 
    FROM timeslots 
    WHERE speaker_id = ? AND status = 'available'
  `;

  db.query(query, [speakerId], (err, results) => {
    if (err) {
      console.error('Error fetching time slots for speaker:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch time slots' });
    }
    res.json(results);
  });
});


// Fetch all appointments
app.get('/api/appointments', (req, res) => {
  const query = `
    SELECT a.id, u.first_name, u.last_name, s.expertise, a.appointment_date, ts.start_time 
    FROM appointment a
    INNER JOIN user u ON a.userId = u.id
    INNER JOIN speaker s ON a.speakerId = s.id
    INNER JOIN timeslots ts ON a.timeSlotId = ts.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching appointments:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
    res.json(results);
  });
});

app.post('/api/appointments', (req, res) => {
  const { speakerId, timeSlotId } = req.body;

  if (!speakerId || !timeSlotId) {
      return res.status(400).json({ error: 'Speaker ID and Time Slot ID are required' });
  }

  const checkSlotQuery = `
      SELECT * FROM timeslots WHERE id = ? AND status = 'available'
  `;

  db.query(checkSlotQuery, [timeSlotId], (err, slots) => {
      if (err) {
          console.error('Error checking time slot availability:', err.stack);
          return res.status(500).json({ error: 'Failed to check time slot availability' });
      }

      if (slots.length === 0) {
          return res.status(400).json({ error: 'Time slot is not available' });
      }

      const insertAppointmentQuery = `
          INSERT INTO appointment (appointment_date, status, speakerId, timeSlotId)
          VALUES (NOW(), 'booked', ?, ?)
      `;

      db.query(insertAppointmentQuery, [speakerId, timeSlotId], (err, results) => {
          if (err) {
              console.error('Error booking appointment:', err.stack);
              return res.status(500).json({ error: 'Failed to book appointment' });
          }

          // Update the time slot status to 'booked'
          const updateSlotQuery = `
              UPDATE timeslots SET status = 'booked' WHERE id = ?
          `;
          db.query(updateSlotQuery, [timeSlotId], (updateErr) => {
              if (updateErr) {
                  console.error('Error updating time slot status:', updateErr.stack);
                  return res.status(500).json({ error: 'Failed to update time slot status' });
              }

              res.json({ message: 'Appointment booked successfully' });
          });
      });
  });
});

// Get available time slots for a speaker
app.get('/api/speakers/:speakerId/time-slots', (req, res) => {
  const speakerId = req.params.speakerId;
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0); // Start from 9 AM

  const timeSlots = [];
  for (let i = 0; i < 8; i++) {
      const slotStart = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

      timeSlots.push({
          id: i + 1, // Slot ID (for simplicity)
          start_time: slotStart,
          end_time: slotEnd,
          status: 'available' // You can fetch slot status from DB
      });
  }

  res.json(timeSlots); // Return the available time slots
});

app.post('/api/appointments', (req, res) => {
  const { speakerId, timeSlotId } = req.body;

  // Check if the time slot is already booked (for example, by querying the database)
  const slotBooked = checkIfSlotBooked(speakerId, timeSlotId); // This should be a function that checks the database

  if (slotBooked) {
      return res.json({ status: 'already_booked', message: 'This time slot has already been booked.' });
  }

  // Proceed to block the time slot and create the appointment if not booked
  createAppointment(speakerId, timeSlotId)
      .then(() => {
          res.json({ status: 'success', message: 'Session booked successfully!' });
      })
      .catch(err => {
          console.error('Error creating appointment:', err);
          res.json({ status: 'error', message: 'Booking failed. Please try again later.' });
      });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
