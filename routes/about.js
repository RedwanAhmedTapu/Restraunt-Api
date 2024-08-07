const express = require('express');
const router = express.Router();
const About = require('../models/about-model');

router.get('/', async (req, res) => {
    const about = await About.findOne();
    res.json(about);
});

module.exports = router;
