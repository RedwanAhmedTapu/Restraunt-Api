const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/multer-photo-upload');

const Menu = require('../models/menu-model');
const Category = require('../models/Category-model');
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

// POST method to add a new menu item
router.post('/',uploadMiddleware, async (req, res) => {
  try {
    const existingMenuItem = await Menu.findOne({ name: req.body.name });
    const imageUrl = req.file.publicUrl;
    if (existingMenuItem) {
      return res.status(400).json({ message: 'This item is already added.' });
    }

    const menuItem = new Menu({...req.body,image:imageUrl});
    const newMenuItem = await menuItem.save();
    res.status(200).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE method to delete a menu item by ID
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Menu item ID is required.' });
    }

    const deletedMenuItem = await Menu.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT method to update a menu item by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const imageUrl = req.file ? req.file.publicUrl : undefined;
    console.log(id,"kk")

    if (imageUrl) {
      updatedData.image = imageUrl; // Update image URL if a new image is uploaded
    }

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category', async (req, res) => {
  try {

    const CategroyList = await Category.find();
    res.json(CategroyList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/category', uploadMiddleware, async (req, res) => {
  try {
      const { name, category, promoLine } = req.body;
      const imageUrl = req.file.publicUrl; 
      console.log(imageUrl,"kk")
      
      const categories = new Category({
          name,
          category,
          promoLine,
          image:imageUrl
      });

      await categories.save();
      res.json(categories);
  } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).send('Failed to create slider');
  }
});
router.delete('/category', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Menu item ID is required.' });
    }

    const deletedCategoryItem = await Category.findByIdAndDelete(id);
    if (!deletedCategoryItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// PUT method to update a category by ID
router.put('/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, promoLine } = req.body;
    const imageUrl = req.file ? req.file.publicUrl : undefined;

    const updatedData = {
      name,
      category,
      promoLine,
      ...(imageUrl && { image: imageUrl }) 
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true 
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).send('Failed to update category');
  }
});

module.exports = router;
