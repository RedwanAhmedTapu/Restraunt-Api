const express = require('express');
const router = express.Router();
const Slider = require('../models/slider-model');
const uploadMiddleware = require('../middleware/multer-photo-upload');

// POST route to create a new slider with image upload
router.post('/', uploadMiddleware, async (req, res) => {
    try {
        const { title, heading, description } = req.body;
        const imageUrl = req.file.publicUrl; // Construct the Google Drive file URL
        
        const slider = new Slider({
            title,
            heading,
            description,
            imageUrl
        });

        await slider.save();
        res.json(slider);
    } catch (error) {
        console.error('Error creating slider:', error);
        res.status(500).send('Failed to create slider');
    }
});

// GET route to retrieve all sliders
router.get('/', async (req, res) => {
    try {
        const sliders = await Slider.find();
        res.json(sliders);
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).send('Failed to fetch sliders');
    }
});

// DELETE route to delete a slider by ID
router.delete('/', async (req, res) => {
    try {
        const { id } = req.query;

        // Find and delete the slider by ID
        const slider = await Slider.findByIdAndDelete(id);

        if (!slider) {
            return res.status(404).send('Slider not found');
        }

        res.json({ message: 'Slider deleted successfully' });
    } catch (error) {
        console.error('Error deleting slider:', error);
        res.status(500).send('Failed to delete slider');
    }
});

// PUT route to update a slider by ID
router.put('/', async (req, res) => {
    try {
        const { id } = req.query;
        const { title, headline, description } = req.body;
        console.log(req.body)

        const updatedSlider = await Slider.findByIdAndUpdate(
            id,
            { title, headline, description },
            { new: true } 
        );

        if (!updatedSlider) {
            return res.status(404).send('Slider not found');
        }

        res.json(updatedSlider);
    } catch (error) {
        console.error('Error updating slider:', error);
        res.status(500).send('Failed to update slider');
    }
});


module.exports = router;
