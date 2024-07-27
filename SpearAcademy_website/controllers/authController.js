const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodeMailer = require('../config/nodeMailer.js');
require('dotenv').config();
const Account = require('../models/account');

// Generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Handle password reset request
const requestPasswordReset = async (req, res , next) => {
  try{
    let identity;
    let isEmail;
    let user;
    
    // Get the email or account ID from the request parameters 
    if (!isNaN(req.params.identity)) {
        identity = req.params.identity;
        isEmail = false;
    }
    else if (req.params.identity) {
        identity = req.params.identity;
        isEmail = true;
    }

    if(isEmail){
      user = await Account.getAccountByEmail(identity); // Find the user by email
    }else{
      user = await Account.getAccountById(identity); // Find the user by email
    }

    
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // User does not exist
    }
  
    const email = user.Email; // Get the email from the user object
    const otp = generateOTP(); // Generate OTP

    let payload = {
      email,
      otp
    };
    const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, { expiresIn: '10m' }); // Create a JWT with the OTP
  
    await nodeMailer.sendOTP(email, otp); // Send the OTP email
    
    // Set the token in body for the next handler
    req.body.token = token;
  
    next();
    
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP' }); // Error sending
  }
};

// Handle password reset
const resetPassword = async (req, res, next) => {
  let identity = req.identity; // Get the email from the request body
  const otp = req.body.otp; // Get the OTP from the request body
  const newPassword = req.body.newPassword; // Get the new password from the request body
  const token = req.body.token; // Get the reset token from the request body

  let user;
  let isEmail = false;

  // Verify the token and OTP
  try {
    // Get the email or account ID from the request parameters 
    if (!isNaN(req.params.identity)) {
      identity = req.params.identity;
      isEmail = false;
    }
    else if (req.params.identity) {
      identity = req.params.identity;
      isEmail = true;
    }

    if(isEmail){
      user = await Account.getAccountByEmail(identity); // Find the user by email
    }else{
      user = await Account.getAccountById(identity); // Find the user by email
    }

    const email = user.Email; // Get the email from the

    if (!user || !token) {
      return res.status(400).json({ message: 'Invalid request' }); // User does not exist or token not set
    }

    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET); // Verify the JWT

    if (decoded.otp !== otp || decoded.email !== email) {
      return res.status(400).json({ message: 'Invalid OTP' }); // OTP does not match
    }

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'OTP expired or invalid' }); // Token verification failed
  }

  // Hash the new password and reset the password
  try{
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    const resetedPassUser = await Account.resetPassword(identity, hashedPassword); // Reset the password

    next();
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Error resetting password' }); // Error resetting the password
  }
};

const requestDeleteAccount = async (req, res, next) => {
  const accId = req.params.accId; // Get the email from the request body
  try{
    const user = await Account.getAccountById(accId); // Find the user by email
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // User does not exist
    }
  
    const email = user.Email; // Get the email from the user object
    const otp = generateOTP(); // Generate OTP

    let payload = {
      email,
      otp
    };
    const token = jwt.sign(payload, process.env.DELETE_ACCOUNT_TOKEN_SECRET, { expiresIn: '10m' }); // Create a JWT with the OTP
  
    await nodeMailer.sendOTP(email, otp); // Send the OTP email
    
    // Set the identity and token in the next handler
    req.identity = accId;
    req.body.token = token;
  
    next();
    
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Error sending OTP' }); // Error sending
  }
}

const deleteAccount = async (req, res, next) => {
  const accId = req.identity; // Get the email from the request body
  const otp = req.body.otp; // Get the OTP from the request body
  const token = req.body.token; // Get the reset token from the request body

  // Verify the token and OTP
  try {
    const user = await Account.getAccountById(accId); // Find the user by email
    const email = user.Email; // Get the email from the

    // User does not exist or token not set
    if (!user || !token) {
      return res.status(400).json({ message: 'Invalid request' }); 
    }

    const decoded = jwt.verify(token, process.env.DELETE_ACCOUNT_TOKEN_SECRET); // Verify the JWT

    if (decoded.otp !== otp || decoded.email !== email) {
      return res.status(400).json({ message: 'Invalid OTP' }); // OTP does not match
    }

  }catch(error){
    console.log(error);
    res.status(400).json({ message: "Error Deleting Account" }); // Token verification failed
  }

  // Hash the new password and reset the password
  try{
    const deletedUser = await Account.deleteAccount(accId); // Reset the password

    if (!deletedUser) {
      return res.status(404).json({ message: 'Account not found' }); // Error resetting the password
    }

    next();
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Error deleting account' }); // Error resetting the password
  }
}
module.exports = {
  requestPasswordReset,
  resetPassword,
  requestDeleteAccount,
  deleteAccount
};
