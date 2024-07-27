const Educator = require("../models/educator");
const Account = require("../models/account");
const jwt = require("jsonwebtoken");    // Import jsonwebtoken for creating tokens
require('dotenv').config(); // Import dotenv for environment variables

const createEducator = async (req, res) => {
    const eduId = req.params.eduId;
    const newEducatorData = req.body;

    try {
        const existingEducator = await Account.getAccountById(eduId);
        console.log(existingEducator);
        
        if (!existingEducator) {
            return res.status(406).json({ message: "Educator already exists. Please login to continue." });
        }

        const educator = await Educator.createEducator(eduId, newEducatorData);
        res.status(201).json(educator);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding Educator.");
    }
};

const getEducatorById = async (req, res) => {
    const eduId = req.params.eduId;
    try {
        const educator = await Educator.getEducatorById(eduId);

        if (!educator) {
            return res.status(404).json({ message: "Educator not found." });
        }
        res.json(educator);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving educator. Please try again later." });
    }
}

const updateEducator = async (req, res) => {
    const eduId = req.params.eduId;
    const newEducatorData = req.body;

    try {
        const educator = await Educator.getEducatorById(eduId);
        if (!educator) {
            return res.status(404).json({ message: "Educator not found." });
        }

        const updatedEducator = await Educator.updateEducator(eduId, newEducatorData);
        res.status(200).json(updatedEducator);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating educator. Please try again later." });
    }

};

module.exports = { 
    createEducator,
    getEducatorById,
    updateEducator
};