import express from 'express';
import cors from 'cors';
import ics from 'ics-js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello from the server!' });
});

app.get('/api/calendar.ics', (req, res) => {
  const cal = ics.buildEvent({
    title: 'Community Picnic',
    start: [2025, 6, 1, 12, 0],
    duration: { hours: 2 },
    location: 'Village Green',
    description: 'Join us for a picnic!',
  });

  res.setHeader('Content-Disposition', 'attachment; filename=event.ics');
  res.setHeader('Content-Type', 'text/calendar');
  res.send(cal);
});

export default app;
