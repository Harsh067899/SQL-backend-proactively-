const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',      // MySQL host
  user: 'root',           // MySQL username
  password: 'Gyan@2003',  // MySQL password
  database: 'NEWDB'     // Your database name
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

// Add speaker profile
app.post('/api/speakers', (req, res) => {
  const { first_name, last_name, bio, expertise, price_per_session } = req.body;

  db.query(
    'INSERT INTO speakers (first_name, last_name, bio, expertise, price_per_session, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [first_name, last_name, bio, expertise, price_per_session],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add speaker profile' });
      }
      res.status(201).json({ message: 'Speaker profile created' });
    }
  );
});

// Route to fetch speaker profiles
app.get('/api/speakers', (req, res) => {
  db.query('SELECT * FROM speakers', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch speakers' });
    }
    res.json(results);
  });
});

// Route to fetch available time slots for a speaker
app.get('/api/speakers/:id/time-slots', (req, res) => {
  const speakerId = req.params.id;
  db.query(
    'SELECT * FROM time_slots WHERE speaker_id = ? AND is_blocked = 0',
    [speakerId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch time slots' });
      }
      res.json(results);
    }
  );
});

// Booking session
app.post('/api/appointments', (req, res) => {
  const { speaker_id, time_slot_id } = req.body;

  // Check if the slot is available
  db.query(
    'SELECT * FROM time_slots WHERE id = ? AND is_blocked = 0',
    [time_slot_id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: 'Time slot is unavailable' });
      }

      // Book the session and block the time slot
      db.query(
        'INSERT INTO appointments (speaker_id, time_slot_id) VALUES (?, ?)',
        [speaker_id, time_slot_id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to book appointment' });
          }

          // Block the time slot
          db.query(
            'UPDATE time_slots SET is_blocked = 1 WHERE id = ?',
            [time_slot_id],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to block time slot' });
              }

              // Send email notification
              sendEmailNotification(speaker_id, time_slot_id);

              res.status(201).json({ message: 'Session booked' });
            }
          );
        }
      );
    }
  );
});

// Function to send email notifications
const sendEmailNotification = (speakerId, timeSlotId) => {
  db.query('SELECT * FROM speakers WHERE id = ?', [speakerId], (err, speakerResults) => {
    if (err || speakerResults.length === 0) {
      return console.error('Speaker not found');
    }

    const speaker = speakerResults[0];

    db.query('SELECT * FROM time_slots WHERE id = ?', [timeSlotId], (err, slotResults) => {
      if (err || slotResults.length === 0) {
        return console.error('Time slot not found');
      }

      const timeSlot = slotResults[0];

      // Set up email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'study528@gmail.com',
          pass: 'Gyan@2003',
        },
      });

      const mailOptions = {
        from: 'your_email@gmail.com',
        to: speaker.email,
        subject: 'Session Booking Confirmation',
        text: `Your session is booked on ${timeSlot.start_time}.`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    });
  });
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
