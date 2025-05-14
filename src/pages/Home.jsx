import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h1>Welcome to the Home Page</h1>
      <Link to='/events'>Click for Events</Link>
    </>
  );
};

export default Home;
