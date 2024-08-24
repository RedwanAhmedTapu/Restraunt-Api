// time-slot-model.js

const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
});

// Specify the collection name as 'timeSlotSchema'
const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema, 'timeSlotSchema');

module.exports = TimeSlot;
