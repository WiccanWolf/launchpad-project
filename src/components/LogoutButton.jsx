import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  if (isAuthenticated) {
    return (
      <>
        <Button
          variant='outline-dark'
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log Out
        </Button>
        <br />
      </>
    );
  }
};

export default LogoutButton;
