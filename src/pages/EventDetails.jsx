import { useAuth0 } from '@auth0/auth0-react';

const EventDetails = ({ event }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const handleSignup = async () => {
    if (!isAuthenticated) {
      alert('Please log in to sign up for this event');
      return;
    }
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://www.googleapis.com/',
          scope: 'https://www.googleapis.com/auth/calendar.events',
        },
      });
      const res = await fetch(`/events/${event._id}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          event: {
            summary: event.title,
            description: event.description,
            location: event.location,
            start: event.startTime,
            end: event.endTime,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          "You've been signed up and the event was added to your calendar!"
        );
        console.log(`Google Calendar Link: ${data.link}`);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('There was a problem signing you up.');
    }
  };
  return (
    <>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <button onClick={handleSignup}>Sign Up & Add to Calendar</button>
    </>
  );
};

export default EventDetails;
