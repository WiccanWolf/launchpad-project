import './stylesheet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginButton from './components/LoginButton';
import Home from './pages/Home';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventsPage from './pages/EventsPage';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div>
        <Navbar />
        {isAuthenticated ? (
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/events' element={<EventsPage />} />
          </Routes>
        ) : (
          <LoginButton />
        )}
      </div>
    </Router>
  );
};

export default App;
