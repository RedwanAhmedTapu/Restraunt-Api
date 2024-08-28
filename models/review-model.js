const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    image:String
});

module.exports = mongoose.model('Review', reviewSchema);
