import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { getEvents } from './routes/controllers/index.controller.js';

const PORT = 5100;
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, { dbName: 'events_sample' });

app.get('/events', getEvents);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
