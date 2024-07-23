const Account = require("../models/account");
const bcrypt = require("bcrypt");   // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");    // Import jsonwebtoken for creating tokens
require('dotenv').config(); // Import dotenv for environment variables

const getAllAccounts = async (req, res) => {

    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving accounts. Please try again later." })
    }
};

const getAccountById = async (req, res) => {
    const accId = req.params.accId;
    
    try {
        const account = await Account.getAccountById(accId);

        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }
        res.json(account);
    } catch (error) {
        console.error(error);
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
            Role: account.role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour
        
        if (account.role === "Student"){
            return res.status(200).json({ token : token, homePage: "../student-pages/student.html" });
        }
        else{
            return res.status(200).json({ token : token, homePage: "../educator-pages/creator.html" });
        }
        
    } catch (error) {
        console.error(error);
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
            Role: account.role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour

        res.status(201).json({ token: token, message: "Account created successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating account. Please try again later." });
    }
};

const updateAccount = async (req, res) => {
    const accId = req.account.AccId;
    const newAccountData = req.body;

    try {
        // Check if account exists
        const existingAccount = await Account.getAccountById(accId);   
        if (!existingAccount) {
            return res.status(404).json({ message: "Account not found." });
        }

        const account = await Account.updateAccount(accId, newAccountData);
        res.status(201).json(account);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating account. Please try again later." });
    }
};

module.exports = { 
    getAllAccounts,
    getAccountById,
    loginAccount,
    createAccount,
    updateAccount
};