import express from 'express';
import cors from 'cors';
import './loadEnvironment.mjs';
import { events } from './routes/events';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello from the server!' });
});

app.use('/events', events);

export default app;
