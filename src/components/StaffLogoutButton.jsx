import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const StaffLogoutButton = ({ baseUrl = import.meta.env.VITE_HOSTED_URI }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('staffAuth');
      localStorage.removeItem('token');
      sessionStorage.removeItem('staffAuth');
      const response = await fetch(`${baseUrl}staff-logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        },
      });

      await fetch(`${baseUrl}clear-session`, {
        method: 'POST',
        credentials: 'include',
      });

      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        onCloseComplete: () => {
          window.location.href = '/';
        },
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('staffAuth');
      localStorage.removeItem('token');
      toast({
        title: 'Client Session Cleared',
        description: 'Server Logout Failed, but local session was cleared.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        onCloseComplete: () => {
          window.location.href = '/';
        },
      });
    }
  };

  return (
    <Button
      colorScheme='red'
      onClick={handleLogout}
      variant='outline'
      size='sm'
      _hover={{ bg: 'red.50' }}
    >
      Staff Logout
    </Button>
  );
};

export default StaffLogoutButton;
