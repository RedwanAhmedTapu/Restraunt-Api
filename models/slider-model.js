const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    title:String,
    heading:String,
    description:String,
    imageUrl: String
});

module.exports = mongoose.model('Slider', sliderSchema);
