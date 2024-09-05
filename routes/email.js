const express = require('express');
const router = express.Router();
const Email = require('../models/email-Collection-model');

router.get('/', async (req, res) => {
    const email = await Email.find();
    res.json(email);
});

router.post('/', async (req, res) => {
    try {
        const { email,name } = req.body;

        if (!email||!name) {
            return res.status(400).json({ error: "Email and Name is required" });
        }

        const existingEmail = await Email.findOne({ email });

        if (existingEmail) {
            return res.status(200).json({ message: "Email already exists" });
        }

        const newEmail = new Email({ email,name });

        await newEmail.save();

        res.status(200).json({ message: "Email added successfully", email: newEmail });
    } catch (error) {
        console.error("Error adding email:", error);
        res.status(500).json({ error: "Server error, could not add email" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the email by ID and delete it
        const deletedEmail = await Email.findByIdAndDelete(id);

        if (!deletedEmail) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json({ message: "Email deleted successfully", email: deletedEmail });
    } catch (error) {
        console.error("Error deleting email:", error);
        res.status(500).json({ error: "Server error, could not delete email" });
    }
});

module.exports = router;
