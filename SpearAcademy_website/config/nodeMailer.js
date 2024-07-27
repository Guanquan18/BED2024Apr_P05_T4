const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Mailtrap SMTP server
  port: 587, // Port number
  auth: {
    user: process.env.YOUR_MAILTRAP_USERNAME, // Mailtrap SMTP username
    pass: process.env.YOUR_MAILTRAP_PASSWORD  // Mailtrap SMTP password
  }
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: 'SpearAcademy@gmail.com', // Sender address
      to: email, // Receiver address
      subject: 'Password Reset OTP', // Subject line
      text: `Your OTP for password reset is: ${otp}. It has a validity of 10 minutes.` // Email body
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendOTP };
