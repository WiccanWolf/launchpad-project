import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import {
  addEvent,
  addToGoogle,
  getEvents,
  getOrganisers,
  signUp,
  staffSignIn,
} from './routes/controllers/index.controller.js';

const PORT = 5100;
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, { dbName: 'events_sample' });

app.get('/events', getEvents);
app.get('/organisers', getOrganisers);
app.post('/events', addEvent);
app.post('/events/:eventiD/signup', signUp);
app.post('/events/calendar', addToGoogle);
app.post('/staff-login', staffSignIn);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
