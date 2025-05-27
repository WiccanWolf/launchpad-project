import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const ProtectedStaffRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const toast = useToast();
  const baseUrl = import.meta.env.VITE_HOSTED_URI;

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`${baseUrl}check-staff-session`, {
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);

        if (!data.isAuthenticated) {
          toast({
            title: 'Session expired',
            description: 'Please log in again',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Session verification error:', error);
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, [baseUrl, toast]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    children || <Outlet />
  ) : (
    <Navigate to='/staff-login' replace />
  );
};
