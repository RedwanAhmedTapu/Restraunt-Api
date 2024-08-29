const express = require('express');
const router = express.Router();
const Email = require('../models/email-Collection-model');

router.get('/', async (req, res) => {
    const email = await Email.find();
    res.json(email);
});

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const existingEmail = await Email.findOne({ email });

        if (existingEmail) {
            return res.status(200).json({ message: "Email already exists" });
        }

        const newEmail = new Email({ email });

        await newEmail.save();

        res.status(200).json({ message: "Email added successfully", email: newEmail });
    } catch (error) {
        console.error("Error adding email:", error);
        res.status(500).json({ error: "Server error, could not add email" });
    }
});


module.exports = router;
