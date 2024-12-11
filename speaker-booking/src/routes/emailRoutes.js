const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { User } = require('../models/User'); // Assuming User model is already set up for user data.

const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email service (e.g., SendGrid, Mailgun, etc.)
  auth: {
    user: 'study528@gmail.com', // Your email
    pass: 'Gyan@2003'     // Your email password (consider using environment variables for security)
  }
});

// Send email verification link to new user
router.post('/sendVerificationEmail', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a verification link (for simplicity, we will assume this is a basic link)
    const verificationLink = `http://localhost:3000/verify/${user.id}`;

    // Set up the email options
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

module.exports = router;
