const mongoose = require("mongoose");
const Review=require("../models/review-model")

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
  allergy: {
    type: Boolean,
    default: true,
  },
  callories: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review', 
  }],
});

module.exports = mongoose.model("Menu", menuSchema);
