import { fetchEvents } from '../models/index.model.js';

export const getEvents = (req, res) => {
  fetchEvents().then((events) => {
    res.status(200).send(events);
  });
};
