const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    platform: String,
    url: String
});

module.exports = mongoose.model('Social', socialSchema);
