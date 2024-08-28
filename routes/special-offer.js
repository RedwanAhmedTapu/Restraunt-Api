const express = require("express");
const router = express.Router();
const Offer = require("../models/offer-model");
const Menu = require("../models/menu-model");
const uploadMiddleware = require("../middleware/multer-photo-upload");

// POST route to create a new offer with image upload
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const { discount, items } = req.body;
    const imageUrl = req.file.publicUrl;

    const offer = new Offer({
      ...req.body,
      foodId: JSON.parse(req.body.items),
      image: imageUrl,
    });

    await offer.save();
    res.status(200).json(offer);

    const offerFoodsId = JSON.parse(items);

    for (let offerId of offerFoodsId) {
      const foundOfferedmenu = await Menu.findOne({ _id: offerId });
      
      if (foundOfferedmenu) {
        foundOfferedmenu.offer = true;
        foundOfferedmenu.offerPrice = (foundOfferedmenu.price - (foundOfferedmenu.price * (discount * 0.01))).toFixed(2);
        await foundOfferedmenu.save(); 
      } else {
        console.log(`Menu item with ID ${offerId} not found.`);
      }
    }
  } catch (error) {
    console.error("Error creating offer:", error);
    if (!res.headersSent) {
      res.status(500).send("Failed to create offer");
    }
  }
});

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

// DELETE route to remove an offer
router.delete('/', async (req, res) => {
    try {
      const { id } = req.query; // Extract offer ID from query parameters
  
      // Find the offer to delete
      const offer = await Offer.findById(id);
  
      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }
  
      // Update related menu items
      const offerFoodsId = offer.foodId;
  
      for (let offerId of offerFoodsId) {
        const foundOfferedmenu = await Menu.findOne({ _id: offerId });
  
        if (foundOfferedmenu) {
          foundOfferedmenu.offer = false;
          foundOfferedmenu.offerPrice = undefined; // or reset to original price if needed
          await foundOfferedmenu.save();
        } else {
          console.log(`Menu item with ID ${offerId} not found.`);
        }
      }
  
      // Delete the offer
      await Offer.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
      console.error('Error deleting offer:', error);
      res.status(500).json({ error: 'Failed to delete offer' });
    }
  });


module.exports = router;
