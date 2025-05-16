import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5100/events');
        setEvents(response.data);
      } catch (error) {
        console.error(`Error retrieving events: ${error}`);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) return <p>Loading Event Data...</p>;
  if (error) return <p>Failed to Load Event Data.</p>;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <>
      <h1>Events</h1>
      <div className='events-container'>
        <ul>
          {currentEvents.map((eventWrapper, index) => (
            <li key={eventWrapper._id || index}>
              <h2>
                <strong>Organiser: </strong>
                {eventWrapper.organiser.firstName}{' '}
                {eventWrapper.organiser.lastName}
              </h2>
              <p>
                Date of wrapper event:{' '}
                {new Date(eventWrapper.timestamp_day).toLocaleDateString()}
              </p>
              <h3>
                <strong>Individual Events</strong>
              </h3>
              <ul>
                {eventWrapper.events.map((singleEvent) => (
                  <li key={singleEvent._id}>
                    <strong>{singleEvent.name}</strong>
                    <br />
                    <em>{new Date(singleEvent.date).toLocaleDateString()}</em>
                    <br />
                    Location: {singleEvent.location.address},{' '}
                    {singleEvent.location.city}, (
                    {singleEvent.location.zip_code}) <br />
                    <img className='event-image' src={singleEvent.image} />
                    Description: {singleEvent.description}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className='pagination-controls'>
        <Button
          variant='success'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant='success'
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default EventsPage;
