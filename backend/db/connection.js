import { MongoClient } from 'mongodb';
const connectionString = process.env.ATLAS_URI || '';
const client = new MongoClient(connectionString);
let connect;
try {
  connect = await client.connect();
} catch (error) {
  console.error(error);
}
let db = connect.db('events_sample');
export default db;
