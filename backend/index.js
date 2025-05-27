import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import {
  addEvent,
  addStaff,
  addToGoogle,
  checkStaffSession,
  createOrganiser,
  getEvents,
  getOrganisers,
  signUp,
  staffLogout,
  staffSignIn,
  verifyStaffSession,
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
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'HelloW0rld',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

mongoose.connect(process.env.ATLAS_URI, { dbName: 'events_sample' });

app.get('/events', getEvents);
app.get('/organisers', getOrganisers);
app.get('/check-staff-session', checkStaffSession);
app.get('/staff/dashboard', verifyStaffSession, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', staff: req.session.staff });
});

app.post('/events', addEvent);
app.post('/events/:eventId/signup', signUp);
app.post('/events/calendar', addToGoogle);

app.post('/staff-login', staffSignIn);
app.post('/staff-logout', staffLogout);
app.post('/staff', addStaff);
app.post('/organisers', createOrganiser);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
