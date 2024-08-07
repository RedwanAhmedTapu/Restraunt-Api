const express = require('express');
const router = express.Router();
const Menu = require('../models/menu-model');

// GET method to retrieve menu items
router.get('/', async (req, res) => {
    try {
        const foodMenu = await Menu.find({ category: 'Food' });
        const breakfastMenu = await Menu.find({ category: 'Breakfast' });
        const cocktailMenu = await Menu.find({ category: 'Cocktail' });
        res.json({
            foodMenu,
            breakfastMenu,
            cocktailMenu
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST method to add a new menu item
router.post('/', async (req, res) => {
    try {
        // Check if an item with the same name already exists
        const existingMenuItem = await Menu.findOne({ name: req.body.name });
        if (existingMenuItem) {
            return res.status(400).json({ message: 'This item is already added.' });
        }

        // Create a new menu item
        const menuItem = new Menu({
            name: req.body.name,
            image: req.body.image,
            details: req.body.details,
            ingredients: req.body.ingredients,
            price: req.body.price,
            offer: req.body.offer,
            offerPrice: req.body.offerPrice,
            type: req.body.type,
            promotionalLine: req.body.promotionalLine,
            available: req.body.available,
            category: req.body.category,
        });

        const newMenuItem = await menuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
