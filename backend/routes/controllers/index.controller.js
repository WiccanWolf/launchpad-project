import EventModel from '../models/index.model.js';

export const getEvents = (req, res) => {
  EventModel.find()
    .then((events) => {
      console.log(events);
      res.json(events);
    })
    .catch((err) => res.json(err));
};
