const { google } = require('googleapis');

// Set up OAuth2 client
const auth = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Function to create Google Calendar event
const createCalendarEvent = async (eventDetails) => {
  const calendar = google.calendar('v3');
  
  // Authenticate using OAuth2
  auth.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  // Create the event
  const res = await calendar.events.insert({
    auth,
    calendarId: 'primary',
    resource: eventDetails,  // Event details passed in
  });
  return res.data;  // Return event data (e.g., event ID, status)
};

module.exports = { createCalendarEvent };
