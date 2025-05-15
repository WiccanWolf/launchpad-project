import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: {
    zip_code: String,
    address: String,
    city: String,
  },
  date: Date,
});

const OrganiserSchema = new mongoose.Schema(
  {
    timestamp_day: Date,
    organiser: {
      email: String,
      firstName: String,
      lastName: String,
    },
    events: [EventSchema],
  },
  { collection: 'Events' }
);

const EventModel = mongoose.model('Events', OrganiserSchema);

export default EventModel;
