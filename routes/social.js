const express = require('express');
const router = express.Router();
const Social = require('../models/social-model');

router.get('/', async (req, res) => {
    const socialLinks = await Social.find();
    res.json(socialLinks);
});

module.exports = router;
