import './stylesheet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginButton from './components/LoginButton';
import Home from './pages/Home';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';
import EventDetails from './pages/EventDetails';

const baseUrl = import.meta.env.VITE_HOSTED_URI;

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div>
        <Navbar />
        {isAuthenticated ? (
          <Routes>
            <Route path='/' element={<Home baseUrl={baseUrl} />} />
            <Route path='/events' element={<EventsPage baseUrl={baseUrl} />} />
            <Route path='/events/:eventId' element={<EventDetails />} />
          </Routes>
        ) : (
          <LoginButton baseUrl={baseUrl} />
        )}
      </div>
    </Router>
  );
};

export default App;
