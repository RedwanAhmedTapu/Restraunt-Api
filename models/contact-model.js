const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    address: String,
    mapUrl: String,
    phone: String,
    email: String,
    openingHours: {
        restaurant: String,
        bar: String
    }
});

module.exports = mongoose.model('Contact', contactSchema);
