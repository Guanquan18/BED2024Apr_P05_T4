const Educator = require("../models/educator");
const jwt = require("jsonwebtoken");    // Import jsonwebtoken for creating tokens
require('dotenv').config(); // Import dotenv for environment variables

const createEducator = async (req, res) => {
    const eduId = req.params.eduId;
    const newEducatorData = req.body;

    try {
        const educator = await Educator.createEducator(eduId, newEducatorData);
        if (!educator) {
            return res.status(406).json({ message: "Educator already exists. Please login to continue." });
        }
        res.status(201).json(educator);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding Educator.");
    }
};

module.exports = { 
    createEducator
};