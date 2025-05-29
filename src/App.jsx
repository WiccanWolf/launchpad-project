import { ChakraProvider, Box } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginButton from './components/LoginButton';
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import { extendTheme, Center } from '@chakra-ui/react';
import StaffSignIn from './pages/StaffSignIn';
import LoginSelection from './components/LoginSelection';
import StaffSignUp from './pages/StaffSignUp';
import { useEffect } from 'react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#F7F3F0',
      100: '#E6D5C7',
      200: '#D2B48C',
      300: '#C4A484',
      400: '#A67B50',
      500: '#7B5E55',
      600: '#5C4033',
      700: '#3C2519',
      800: '#2A1810',
      900: '#1A0F0A',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

const baseUrl = import.meta.env.VITE_HOSTED_URI;

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const isStaff = localStorage.getItem('staffAuth');

  useEffect(() => {
    if (!isLoading && (isAuthenticated || isStaff)) {
    }
  }, [isAuthenticated, isStaff, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ChakraProvider theme={theme}>
      <Center minH='100vh' bg='brand.50' px={4}>
        <Router>
          <Box minH='100vh' bg='gray.50'>
            {(isAuthenticated || isStaff) && <Navbar />}
            <Box as='main' pt='4'>
              <Routes>
                <Route
                  path='/'
                  element={
                    isAuthenticated || isStaff ? (
                      <Navigate to='/home' replace />
                    ) : (
                      <LoginSelection />
                    )
                  }
                />
                <Route
                  path='/home'
                  element={
                    isAuthenticated || isStaff ? (
                      <Home baseUrl={baseUrl} />
                    ) : (
                      <Navigate to='/' replace />
                    )
                  }
                />
                <Route
                  path='/user-login'
                  element={<LoginButton baseUrl={baseUrl} />}
                />
                <Route
                  path='/staff-login'
                  element={<StaffSignIn baseUrl={baseUrl} />}
                />
                <Route
                  path='/staff-signup'
                  element={<StaffSignUp baseUrl={baseUrl} />}
                />

                {isAuthenticated && (
                  <Route
                    path='/events'
                    element={
                      isAuthenticated ? (
                        <EventsPage baseUrl={baseUrl} />
                      ) : (
                        <Navigate to='/' replace />
                      )
                    }
                  />
                )}
              </Routes>
            </Box>
          </Box>
        </Router>
      </Center>
    </ChakraProvider>
  );
};

export default App;
