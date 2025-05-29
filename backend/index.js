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
  authenticateToken,
  checkStaffSession,
  clearSession,
  createOrganiser,
  getEvents,
  getOrganisers,
  signUp,
  staffLogout,
  staffSignIn,
  verifyStaffSession,
} from './routes/controllers/index.controller.js';
import MongoStore from 'connect-mongo';

const PORT = 5100;
const app = express();

mongoose.connect(process.env.ATLAS_URI, { dbName: 'events_sample' });

app.use(
  cors({
    origin: 'https://flourishcommunity.netlify.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

const sessionStore = MongoStore.create({
  mongoUrl: process.env.ATLAS_URI,
  dbName: 'events_sample',
  collectionName: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'wmoYNBFoVwT3',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.get('/events', getEvents);
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ userId: req.user.id, staffId: req.user.id, ...req.user });
});

app.get('/organisers', getOrganisers);
app.get('/check-staff-session', checkStaffSession);
app.get('/staff/dashboard', verifyStaffSession, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', staff: req.session.staff });
});

app.post('/events', addEvent);
app.post('/events/:eventId/signup', signUp);
app.post('/events/calendar', addToGoogle);

app.post('/clear-session', clearSession);
app.post('/staff-login', staffSignIn);
app.post('/staff-logout', staffLogout);
app.post('/staff', addStaff);
app.post('/organisers', createOrganiser);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
