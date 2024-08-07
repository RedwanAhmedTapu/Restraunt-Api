const express = require('express');
const router = express.Router();
const Contact = require('../models/contact-model');

router.get('/', async (req, res) => {
    const contact = await Contact.findOne();
    res.json(contact);
});

module.exports = router;
