const express = require('express');
const router = express.Router();
const Menu = require('../models/menu-model');
const category = require('./../models/Category-model')
// GET method to retrieve menu items by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const menuItems = await Menu.find(category ? { category } : {});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category', async (req, res) => {
  try {

    const CategroyList = await category.find();
    // console.log('CategroyList')
    res.json(CategroyList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST method to add a new menu item
router.post('/', async (req, res) => {
  try {
    const existingMenuItem = await Menu.findOne({ name: req.body.name });
    if (existingMenuItem) {
      return res.status(400).json({ message: 'This item is already added.' });
    }

    const menuItem = new Menu(req.body);
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
