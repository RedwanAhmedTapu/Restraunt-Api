const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnavailableTimeSlotSchema = new Schema({
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: 'TimeSlot',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('UnavailableTimeSlot', UnavailableTimeSlotSchema,'UnavailableTimeSlotSchema');
