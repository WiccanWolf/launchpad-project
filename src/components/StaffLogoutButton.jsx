import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const StaffLogoutButton = ({ baseUrl }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}staff-logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.remoteItem('staffAuth');
        localStorage.remoteItem('token');
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme='red' onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default StaffLogoutButton;
