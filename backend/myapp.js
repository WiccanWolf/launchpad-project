import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const seedDB = async () => {
  const uri = process.env.ATLAS_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected correctly to server.');
    const collection = client.db('events_sample').collection('Events');

    let timeSeriesData = [];

    for (let i = 0; i < 5000; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      let newDay = {
        timestamp_day: faker.date.past(),
        organiser: {
          email: faker.internet.email({ firstName, lastName }),
          firstName,
          lastName,
        },
        events: [],
      };

      for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
        let newEvent = {
          name: faker.lorem.word(),
          description: faker.lorem.paragraphs(2),
          location: {
            zip_code: faker.location.zipCode('######' || '#######'),
            address: faker.location.streetAddress({ useFullAddress: true }),
            city: faker.location.city(),
          },
          date: faker.date.future(),
        };
        newDay.events.push(newEvent);
      }
      timeSeriesData.push(newDay);
    }
    await collection.insertMany(timeSeriesData);
    console.log('Database seeded with artificial data.');
  } catch (err) {
    console.error(err.stack);
  }
};

seedDB();
