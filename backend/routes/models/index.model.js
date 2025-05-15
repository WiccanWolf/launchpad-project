import db from '../../db/connection.js';

export const fetchEvents = async () => {
  try {
    let results = await db.find({});
    return results;
  } catch (err) {
    console.error(`Error fetching events: ${err}`);
  }
};
