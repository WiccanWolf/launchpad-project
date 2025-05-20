import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { EventModel, StaffModel } from './routes/models/index.model.js';
import dotenv from 'dotenv';
dotenv.config();

const createStaffOrganiser = async () => {
  try {
    await mongoose.connect(
      `${process.env.ATLAS_URI}events_sample?retryWrites=true&w=majority`
    );
    const passwordHash = await bcrypt.hash('superSecretPassword123', 10);
    const newStaff = new StaffModel({
      email: 'wiccanwolfdev@gmail.com',
      firstName: 'Toni',
      lastName: 'Li',
      passwordHash,
    });
    const savedStaff = await newStaff.save();

    const newEvent = new EventModel({
      timestamp_day: new Date(),
      organiser: savedStaff._id,
      events: [],
    });

    await newEvent.save();
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};
createStaffOrganiser();
