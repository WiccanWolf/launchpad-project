import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <Button
        variant='outline'
        colorScheme='red'
        size='sm'
        onClick={() =>
          logout({
            returnTo: `https://flourishcommunity.netlify.app/`,
          })
        }
      >
        Log Out
      </Button>
    );
  }

  return null;
};

export default LogoutButton;
