const crypto = require('crypto');

// In-memory store for OTPs with expiry time
let otpStore = {};

// Expiry time for OTP (5 minutes)
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to generate a random OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999); // Generates a 6-digit OTP
};

// Function to send OTP (simulated as sending an email)
const sendOTP = (email) => {
  const otp = generateOTP();
  const currentTime = new Date().getTime();

  // Store OTP with its generation time
  otpStore[email] = { otp, createdAt: currentTime };
  
  // Log the OTP to verify it
  console.log(`OTP sent to ${email}: ${otp}`);
};

// Function to verify OTP
const verifyUserOTP = (email, otp) => {
  const otpData = otpStore[email];

  if (!otpData) {
    console.log(`No OTP found for ${email}`);
    return false; // No OTP stored for this email
  }

  // Check if OTP is expired
  const currentTime = new Date().getTime();
  if (currentTime - otpData.createdAt > OTP_EXPIRY_TIME) {
    console.log(`OTP expired for ${email}`);
    delete otpStore[email]; // Remove expired OTP
    return false; // OTP expired
  }

  // Verify OTP
  if (otpData.otp === parseInt(otp)) {
    console.log(`OTP verified for ${email}`);
    delete otpStore[email]; // OTP matched, remove from store
    return true; // OTP is correct
  }

  console.log(`Invalid OTP for ${email}`);
  return false; // OTP does not match
};

module.exports = { sendOTP, verifyUserOTP };
