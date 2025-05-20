import { Link } from 'react-router-dom';
import AddEventForm from './AddEventForm';
import { useState } from 'react';

const Home = ({ baseUrl }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      {/* <button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? 'Cancel' : 'Add a New Event'}
      </button>
      {showForm && <AddEventForm baseUrl={baseUrl} />} */}
      <Link to='/events'>Click for Events</Link>
      <p className='coffee'>Very Dark Brown | #3C2519</p>
      <p className='taupe'>Dark Brown | #5C4033</p>
      <p className='chestnut'>Lighter Dark Brown | #7B5E55</p>
      <p className='cocoa-brown'>Medium Light Brown | #A67B50</p>
      <p className='warm-sand'>Slightly Darker Light Brown | #C4A484</p>
      <p className='beige'>Light Brown | #D2B48C</p>
    </>
  );
};

export default Home;
