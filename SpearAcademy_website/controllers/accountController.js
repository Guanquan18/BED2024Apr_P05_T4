const Account = require("../models/account");

const getAllAccounts = async (req, res) => {

    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving accounts.");
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
        res.status(500).send("Error retrieving account.");
    }
};

const verifyAccount = async (req, res) => {
    const accountData = req.body;

    try {
        const account = await Account.verifyAccount(accountData);

        if (!account) {
            return res.status(404).json({ message: "Invalid email or password." });
        }
        return res.status(200).json(account);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Authentication user.");
    }
};

const createAccount = async (req, res) => {
    const newAccountData = req.body;

    try {
        const account = await Account.createAccount(newAccountData);

        if (!account) {
            return res.status(406).json({ message: "Account already exists. Please login to continue." });
        }
        res.status(201).json(account);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding account.");
    }
};

const updateAccount = async (req, res) => {
    const accId = req.params.accId;
    const newAccountData = req.body;

    try {
        const account = await Account.updateAccount(accId, newAccountData);
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }
        res.status(201).json(account);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating account.");
    }
};

module.exports = { 
    getAllAccounts,
    getAccountById,
    verifyAccount,
    createAccount,
    updateAccount
};