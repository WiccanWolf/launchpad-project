import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: { type: String, requried: true },
  description: String,
  location: {
    zip_code: String,
    address: String,
    city: String,
  },
  date: { type: Date, required: true },
  image: String,
});

const OrganiserSchema = new mongoose.Schema(
  {
    timestamp_day: Date,
    organiser: {
      email: String,
      firstName: String,
      lastName: String,
      passwordHash: { type: String },
    },
    events: [EventSchema],
  },
  { collection: 'Events' }
);

const EventSignupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  signupTime: { type: Date, default: Date.now },
});

export const EventSignup = mongoose.model('EventSignup', EventSignupSchema);
export const EventModel = mongoose.model('Events', OrganiserSchema);
