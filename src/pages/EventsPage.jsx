import { useEffect, useState } from 'react';
import axios from 'axios';

const EventsPage = ({ baseUrl }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error(`Error retrieving events: ${error}`);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [baseUrl]);

  if (loading) return <p>Loading Event Data...</p>;
  if (error) return <p>Failed to Load Event Data.</p>;

  return (
    <>
      <h1>Events</h1>
    </>
  );
};

export default EventsPage;
