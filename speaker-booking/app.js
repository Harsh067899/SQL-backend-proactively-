const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const speakerRoutes = require('./src/routes/speakerRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const timeSlotRoutes = require('./src/routes/timeSlotRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');
// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', userRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/send-email', emailRoutes);
app.use('/api/calendar-event', calendarRoutes);

// Default route
app.get('/api/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// app.get('/api/speakers', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'speakerprofile.html'));
// });
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
