import axios from 'axios';
import { get } from 'mongoose';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const EventsPage = ({ baseUrl }) => {
  const [showSignupFormId, setShowSignupFormId] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  const capitaliseFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const generateGoogleCalendarUrl = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatDate = (date) =>
      date.toISOString().replace(/[-:]|(\.\d{3})/g, '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${formatDate(start)}/${formatDate(
      end
    )}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(
      event.location.address + ', ' + event.location.city
    )}&sf=true&output=xml`;
  };

  const downloadICS = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const pad = (n) => (n < 10 ? '0' + n : n);

    const formatICSDate = (date) => {
      date.getUTCFullYear().toString() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        'T' +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        'Z';

      const icsContent = `BEGIN:VCALENDAR
        VERSION:2.0
        BEGIN:VEVENT
        SUMMARY:${event.name}
        DTSTART:${formatICSDate(start)}
        DTEND:${formatICSDate(end)}
        LOCATION:${event.location.address}, ${event.location.city}
        DESCRIPTION:${event.description}
        END:VEVENT
        END:VCALENDAR`;

      const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event.name}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}events`);
        setEvents(response.data);
      } catch (error) {
        console.error(`Error retrieving events:`, error);
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
                    <strong>{capitaliseFirstLetter(singleEvent.name)}</strong>
                    <br />
                    <em>{new Date(singleEvent.date).toLocaleDateString()}</em>
                    <br />
                    <strong>Location:</strong> {singleEvent.location.address},{' '}
                    {singleEvent.location.city}, (
                    {singleEvent.location.zip_code}) <br />
                    <img className='event-image' src={singleEvent.image} />
                    <strong>Description:</strong> {singleEvent.description}
                    <div>
                      <Button
                        variant='info'
                        onClick={() =>
                          setShowSignupFormId(
                            showSignupFormId === singleEvent._id
                              ? null
                              : singleEvent._id
                          )
                        }
                      >
                        Sign Up
                      </Button>
                      {showSignupFormId === singleEvent._id && (
                        <div>
                          <input
                            type='email'
                            placeholder='Enter your Email'
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                          />
                          <Button
                            variant='primary'
                            onClick={() => {
                              console.log(
                                'Sign up email:',
                                emailInput,
                                'for event:',
                                singleEvent._id
                              );
                              alert(
                                `Signed up ${emailInput} for ${singleEvent.name}`
                              );
                              setEmailInput('');
                              setShowSignupFormId(null);
                            }}
                          >
                            Confirm
                          </Button>
                          <div>
                            <a
                              href={generateGoogleCalendarUrl(singleEvent)}
                              target='_blank'
                              rel='noreferrer'
                            >
                              <Button variant='secondary'>
                                Add to Google Calendar
                              </Button>
                            </a>
                            <Button
                              variant='secondary'
                              onClick={() => downloadICS(singleEvent)}
                            >
                              Download .ics
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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
