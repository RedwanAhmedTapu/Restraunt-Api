const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    numberOfPeople: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true,
    },
});

const Reservation = mongoose.model('Reservation', reservationSchema,'reservationSchema');

module.exports=Reservation;

