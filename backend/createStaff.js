import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { EventModel } from './routes/models/index.model.js';
import dotenv from 'dotenv';
dotenv.config();

const createStaffOrganiser = async () => {
  await mongoose.connect(process.env.ATLAS_URI);
  const passwordHash = await bcrypt.hash('superSecretPassword123', 10);
  const newEvent = new EventModel({
    timestamp_day: new Date(),
    organiser: {
      email: 'example@staff.com',
      firstName: 'Toni',
      lastName: 'Li',
      passwordHash: passwordHash,
    },
    events: [],
  });

  await newEvent.save();
};
createStaffOrganiser();
