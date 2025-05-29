import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import {
  StaffModel,
  OrganiserModel,
  EventModel,
} from './routes/models/index.model.js';

dotenv.config();

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const seedDB = async () => {
  const uri = process.env.ATLAS_URI;

  try {
    await mongoose.connect(uri, { dbName: 'events_sample' });
    console.log(`Connected to MongoDB.`);

    await Promise.all([
      StaffModel.deleteMany({}),
      EventModel.deleteMany({}),
      OrganiserModel.deleteMany({}),
    ]);

    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const staff = await StaffModel.create({
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        passwordHash: await bcrypt.hash('password123', 10),
      });

      const eventsData = Array.from({ length: randomInt(1, 6) }, () => ({
        name: faker.lorem.words(3),
        description: faker.lorem.paragraphs(2),
        date: faker.date.future(),
        image: faker.image.url(),
        location: {
          zip_code: faker.location.zipCode(),
          address: faker.location.streetAddress(),
          city: faker.location.city(),
        },
        organiser: staff._id,
      }));

      const createdEvents = await EventModel.insertMany(eventsData);
      console.log(
        `Created ${createdEvents.length} events for staff ${staff._id}`
      );
      const eventIds = createdEvents.map((e) => e._id);

      await OrganiserModel.create({
        timestamp_day: new Date(),
        organiser: staff._id,
        events: eventIds,
      });
      console.log(
        `Seeded organiser ${i + 1} with ${eventIds.length} event(s).`
      );
    }
    console.log(`Database seeded successfully.`);
  } catch (err) {
    console.error(`Seeding Error: ${err}`);
  } finally {
    await mongoose.disconnect();
    console.log(`Disconnected from MongoDB`);
  }
};

seedDB();
