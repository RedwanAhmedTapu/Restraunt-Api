const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    category: String,
    images: [String]
});

module.exports = mongoose.model('Gallery', gallerySchema);
