const User = require('../models/user');
const bcrypt = require("bcrypt");   // Import bcrypt for password hashing
const jwt = require("jsonwebtoken");    // Import jsonwebtoken for creating tokens
require('dotenv').config(); // Import dotenv for environment variables


const registerUser = async (req, res) => {
    let user = req.body;
    const username = user.username;
    const password = user.password;

    try {

        // Check if the username already exists
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = {
            username: user.username,
            passwordHash: hashedPassword,
            role: user.role
        }

        const newUser = await User.registerUser(user);
        res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user.");
    }
}

const loginUser = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Check if the username exists
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create a token
        const payload = {
            id: user.userId,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3600s" }); // Expires in 1 hour
        
        return res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
}

module.exports = {
    registerUser,
    loginUser
};