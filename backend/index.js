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
  deleteEvent,
  getEvents,
  getOrganisers,
  signUp,
  staffLogout,
  staffSignIn,
  verifyStaffSession,
} from './routes/controllers/index.controller.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import MongoStore from 'connect-mongo';

const PORT = 5100;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event_images',
    allowed_format: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});
const upload = multer({ storage });

mongoose.connect(process.env.ATLAS_URI, { dbName: 'events_sample' });

app.use(
  cors({
    origin: 'https://flourishcommunity.netlify.app',
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

app.post('/events', upload.single('image'), addEvent);
app.post('/events/:eventId/signup', signUp);
app.post('/events/calendar', addToGoogle);

app.post('/clear-session', clearSession);
app.post('/staff-login', staffSignIn);
app.post('/staff-logout', staffLogout);
app.post('/staff-signup', addStaff);
app.post('/organisers', createOrganiser);

app.delete('/events/:eventId', verifyStaffSession, deleteEvent);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
