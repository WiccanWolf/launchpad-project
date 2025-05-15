import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.ATLAS_URI || '';
const client = new MongoClient(connectionString, {
  tls: true,
  useUnifiedTopology: true,
});

let db;

const connectToDb = async () => {
  try {
    await client.connect();
    console.log(`Connected to the Database.`);
    db = client.db('events_sample');
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err}`);
  }
};

await connectToDb();

export default db;
