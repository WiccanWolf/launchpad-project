import mongoose from 'mongoose';
import {
  EventModel,
  OrganiserModel,
  EventSignup,
  StaffModel,
} from '../models/index.model.js';
import { google } from 'googleapis';

export const getEvents = (req, res) => {
  EventModel.find()
    .then((events) => {
      console.log(events);
      res.json(events);
    })
    .catch((err) => res.json(err));
};

export const getOrganisers = async (_req, res) => {
  try {
    const organisers = await OrganiserModel.find()
      .populate('organiser', 'firstName lastName email')
      .populate('events');
    res.json(organisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load organisers' });
  }
};

export const addEvent = async (req, res) => {
  try {
    console.log('Incoming Data: ', req.body);
    if (!req.body.name || !req.body.date) {
      return res.status(400).json({
        message: 'Missing Required Fields',
        required: ['Name', 'Date'],
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signUp = async (req, res) => {
  const { email } = req.body;
  const { eventId } = req.param;

  try {
    const signup = new EventSignup({ email, eventId });
    await signup.save();
    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during Signup' });
  }
};

export const addToGoogle = async (req, res) => {
  const { token, event } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.start },
        end: { dateTime: event.end },
      },
    });
    res.status(200).json({
      message: 'Event added to google calendar',
      eventLink: response.data.htmlLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to insert event' });
  }
};

export const staffSignIn = async () => {
  const { email, password } = req.body;
  try {
    const staff = await StaffModel.findOne({ email: email });

    if (!staff || !staff.passwordHash) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isMatching = await bcrypt.compare(password, staff.passwordHash);
    if (!isMatching) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    res.status(200).json({
      message: 'Staff Login Successful',
      staff: {
        _id: staff._id,
        email: staff.email,
        name: staff.name,
      },
    });
  } catch (err) {
    console.error(`Login Error: ${err}`);
    res.status(500).json({ message: 'Server Error During Login' });
  }
};
