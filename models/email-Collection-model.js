const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
    }
}); 
const Reservation = mongoose.model('Email', EmailSchema,'EmailSchema');

module.exports=Reservation;

