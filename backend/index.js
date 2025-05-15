import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import { getEvents } from './routes/controllers/index.controller';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello from the server!' });
});

app.get('/events', getEvents);

export default app;
