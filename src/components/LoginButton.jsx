import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return (
      <>
        <div className='center-button'>
          <Button variant='success' onClick={() => loginWithRedirect()}>
            Log In
          </Button>
        </div>
        <p className='coffee'>Very Dark Brown | #3C2519</p>
        <p className='taupe'>Dark Brown | #5C4033</p>
        <p className='chestnut'>Lighter Dark Brown | #7B5E55</p>
        <p className='cocoa-brown'>Medium Light Brown | #A67B50</p>
        <p className='warm-sand'>Slightly Darker Light Brown | #C4A484</p>
        <p className='beige'>Light Brown | #D2B48C</p>
      </>
    );
  }
};

export default LoginButton;
