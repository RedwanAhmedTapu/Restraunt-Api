const express = require('express');
const router = express.Router();
const Offer = require('../models/offer-model');
const Menu = require('../models/menu-model'); // Assuming the menu model is in this path

router.get('/', async (req, res) => {
    try {
        // Find all offers
        const offers = await Offer.find();

        // For each offer, find the corresponding menu items
        const offersWithMenuItems = await Promise.all(
            offers.map(async (offer) => {
                const menuItems = await Menu.find({
                    _id: { $in: offer.foodId }
                });

                return {
                    ...offer._doc,  // Spread offer document
                    menuItems      // Add menu items as a new field
                };
            })
        );

        res.json(offersWithMenuItems);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

module.exports = router;
