const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    story: String,
    chefProfiles: [
        {
            name: String,
            specialty: String,
            image: String
        }
    ]
});

module.exports = mongoose.model('About', aboutSchema);
