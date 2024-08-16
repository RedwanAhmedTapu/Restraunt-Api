const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
    required: true, 
  }], 
  price: {
    type: Number,
    required: true,
  },
  offer: {
    type: Boolean,
    default: false,
  },
  offerPrice: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  promotionalLine: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
