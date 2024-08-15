const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: String,
    category: String,
    promoLine: String,
    image: String
  }, { collection: 'category' });  
  
module.exports = mongoose.model("category", CategorySchema);
