const express = require("express");
const router = express.Router();
const About = require("../models/about-model");
const uploadMiddlewareabout = require("../middleware/upload-photo-about");

// GET About Information
router.get("/", async (req, res) => {
  try {
    const about = await About.find();

    res.status(200).json(about);
  } catch (error) {
    console.error("Error fetching About information:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST request to upload About content with multiple chefs' images
router.post("/", uploadMiddlewareabout, async (req, res) => {
  const { story, chefProfiles } = req.body;
  console.log(req.body);

  // Assign uploaded image URLs to corresponding chef profiles
  const updatedChefProfiles = chefProfiles.map((profile, index) => ({
    ...profile,
    image: req.uploadedFiles[index], // Assign the corresponding uploaded image URL
  }));

  try {
    const about = new About({
      story,
      chefProfiles: updatedChefProfiles,
    });

    await about.save();
    res.status(200).json({ message: "About content uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload about content" });
  }
});

// DELETE request to delete an About entry by ID
router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAbout = await About.findByIdAndDelete(id);
  
      if (!deletedAbout) {
        return res.status(404).json({ message: "About entry not found" });
      }
  
      res.status(200).json({ message: "About entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting About entry:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  // Update an About entry by ID
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      console.log(updatedData)
  
      // Ensure the ID is valid and the resource exists
      const updatedAbout = await About.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedAbout) {
        return res.status(404).json({ message: 'About entry not found' });
      }
  
      res.json(updatedAbout);
    } catch (error) {
      console.error('Error updating about entry:', error);
      res.status(500).json({ message: 'Failed to update about entry' });
    }
  }); 

module.exports = router;
