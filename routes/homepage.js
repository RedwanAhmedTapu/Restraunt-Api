const express = require('express');
const router = express.Router();
const Slider = require('../models/slider-model');

router.get('/', async (req, res) => {
    const sliders = await Slider.find();
    res.json({
        imageSlider: sliders,
        introductoryText: 'Welcome to our Mediterranean restaurant!',
        callToAction: {
            viewMenu: '/menu',
            specialOffers: '/specials'
        }
    });
});

module.exports = router;
