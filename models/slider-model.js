const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    imageUrl: String
});

module.exports = mongoose.model('Slider', sliderSchema);
