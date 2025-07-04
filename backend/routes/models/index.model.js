import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    image: String,
    duration: { type: String },
    location: {
      zip_code: String,
      address: String,
      city: String,
    },
    organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  },
  { collection: 'events' }
);

const OrganiserSchema = new mongoose.Schema(
  {
    timestamp_day: Date,
    organiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  { collection: 'Organisers' }
);

const EventSignupSchema = new mongoose.Schema({
  email: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  signupTime: { type: Date, default: Date.now },
});

const StaffSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'Staff' },
});

export const EventModel = mongoose.model('Event', EventSchema);
export const OrganiserModel = mongoose.model('Organiser', OrganiserSchema);
export const EventSignup = mongoose.model('EventSignup', EventSignupSchema);
export const StaffModel = mongoose.model('Staff', StaffSchema);
