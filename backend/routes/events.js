import { Router } from 'express';
import db from '../db/connection';

export const events = () => {
  Router.get('/events', async (req, res) => {
    let collection = await db.collection('Events');
    let results = collection.find({}).limit(50).toArray();
    res.send(results).status(200);
  });
};
