import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const StaffLogoutButton = ({ baseUrl }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}staff-logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Logged out successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        navigate('/');
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
