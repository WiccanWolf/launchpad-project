import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${
            import.meta.env.VITE_CONSUMER_KEY
          }`
        );
        setEvents(response.data._embedded.events);
      } catch (error) {
        console.error(`Error retrieving events: ${error}`);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading Event Data...</p>;
  if (error) return <p>Failed to Load Event Data.</p>;

  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <ul className='event-list'>
        {events.map((event) => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <img src={event.images[0].url} />
            <h3>
              {event.dates.start.localDate} | {event.dates.start.localTime}
            </h3>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
