// routes/menu.js
const express = require("express");
const router = express.Router();
const Menu = require("../models/menu-model");
const Review = require("../models/review-model");
const uploadMiddleware = require("../middleware/multer-photo-upload");

// POST route to add a review to a menu item
router.post("/:reviewId", uploadMiddleware,async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { name, rating, comment } = req.body;
    const imageUrl = req.file.publicUrl; // Construct the Google Drive file URL
    console.log(req.body,"gg")

    // Create a new review
    const newReview = new Review({
     ...req.body,
      image: imageUrl,
    });

    // Save the review
    await newReview.save();

    // Find the menu item and add the review
    const menu = await Menu.findById(reviewId);
    menu.reviews.push(newReview._id);
    await menu.save();

    res
      .status(200)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
});
router.get("/", async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
});

module.exports = router;
