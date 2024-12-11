
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

const { google } = require('googleapis');

const calendar = google.calendar('v3');
const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const createCalendarEvent = async (eventDetails) => {
  const res = await calendar.events.insert({
    auth,
    calendarId: 'primary',
    resource: eventDetails,
  });
  return res.data;
};