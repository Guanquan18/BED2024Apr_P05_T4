const Account = require("../models/account");
const bcrypt = require("bcrypt");   // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");    // Import jsonwebtoken for creating tokens
require('dotenv').config(); // Import dotenv for environment variables
const TokenStore = require('../services/tokenStore');

const getAccountById = async (req, res) => {
    const accId = parseInt(req.params.accId);
    
    try {
        const account = await Account.getAccountById(accId);

        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }
        res.json(account);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving account. Please try again later." });
    }
};

const loginAccount = async (req, res) => {
    const accountData = req.body;

    try {
        // Check if account exists
        const account = await Account.verifyAccount(accountData.email);   
        if (!account) {
            return res.status(401).json({ message: "Account does not exist." });
        }

         // Check if the password is correct
        const isPasswordMatch = await bcrypt.compare(accountData.password, account.PasswordHash);   // Compare password
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect credentials." });
        }
        // Create a token
        const payload = {
            AccId: account.AccId,
            Role: account.Role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour
        
        if (account.Role === "Student"){
            return res.status(200).json({ token : token, accId : account.AccId, homePage: "../student-pages/student.html" });
        }
        else{
            return res.status(200).json({ token : token, accId : account.AccId, homePage: "../educator-pages/creator.html" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "Error Authentication user. Please try again later." });
    }
};

const createAccount = async (req, res) => {
    let newAccountData = req.body;
    
    try {
        // Check if account exists
        const existingAccount = await Account.verifyAccount(newAccountData.email);   
        if (existingAccount) {
            return res.status(406).json({ message: "Account already exists. Please login to continue." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newAccountData.password, salt);

        newAccountData = {
            email: newAccountData.email,
            passwordHash: hashedPassword,
            role: newAccountData.role
        }

        const account = await Account.createAccount(newAccountData);

        // Create a token
        const payload = {
            AccId: account.AccId,
            Role: account.Role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour

        res.status(201).json({ token: token, accId : account.AccId, message: "Account created successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating account. Please try again later." });
    }
};

const updateAccount = async (req, res) => {
    const accId = req.params.accId;
    let newAccountData = {};

    // Check if there is a file for profile picture
    if (req.file){
        newAccountData.photo = '../Images/profiles/' + req.file.filename;
    }
    else{ newAccountData = { ...req.body }; }

    try {
        // Check if account exists
        const existingAccount = await Account.getAccountById(accId);   
        if (!existingAccount) {
            return res.status(404).json({ message: "Account not found." });
        }

        const account = await Account.updateAccount(accId, newAccountData);
        res.status(200).json(account);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating account. Please try again later." });
    }
};


const deleteAccount = async (req, res) => {
    const accId = req.params.accId;

    try {
        // Check if account exists
        const existingAccount = await Account.getAccountById(accId);   
        if (!existingAccount) {
            return res.status(404).json({ message: "Account not found." });
        }

        await Account.deleteAccount(accId);
        res.status(200).json({ message: "Account deleted successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting account. Please try again later." });
    }
}


/**
 * 
 * Functions to store and retrieve tokens from the token store
 * 
 */

// Retrieve a token
const getTokenHandler = async (req, res, next) => {
    
    let identity;   // Get the identity from the request body
    if (req.params.accId){
        identity = req.params.accId;
    }else{
        identity = req.identity;
    }
    
    try{
        const token = TokenStore.getToken(identity);
        if (token) {

            // Set the identity and token in the next handler
            req.identity = identity;
            req.body.token = token;
            next();
            
        } else {
            res.status(404).json({ message: 'Token not found' });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error retrieving token' });
    }
};

// Create and store a token
const setToken = (req, res) =>{
    try{
        const identity = req.identity;
        const token = req.body.token;
        TokenStore.storeToken(identity, token);

        res.json({ message: 'Token created and stored successfully' });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error storing token' });
    }
};

// Delete a token
const deleteTokenHandler = (req, res) => {
    let identity = req.identity;
    try{
        TokenStore.deleteToken(identity);
        res.status(200).json({ message: 'OTP Authentication successful' }); // Respond to the client
    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Error deleting token' });
    }
};

module.exports = { 
    getAccountById,
    loginAccount,
    createAccount,
    updateAccount,
    setToken,
    getTokenHandler,
    deleteTokenHandler,
    deleteAccount
};