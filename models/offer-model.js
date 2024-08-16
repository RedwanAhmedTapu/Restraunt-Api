const mongoose = require('mongoose');

const offerPackSchema = new mongoose.Schema({
    name: String,
    foodId: [String],
    startTime: Date,
    endTime: Date,
    image: String
},{ collection: 'Offers' });

module.exports = mongoose.model('Offers', offerPackSchema);
