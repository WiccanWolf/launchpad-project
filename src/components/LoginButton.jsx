import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return (
      <div className='center-button'>
        <Button variant='outline-dark' onClick={() => loginWithRedirect()}>
          Log In
        </Button>
        <p className='coffee'>Coffee | #4B3621</p>
        <p className='taupe'>Taupe | #483C32</p>
        <p className='chestnut'>Chestnut | #964B00</p>
        <p className='cocoa-brown'>Cocoa Brown | #A9746E</p>
        <p className='warm-sand'>Warm Sand | #D4BFAA</p>
        <p className='beige'>Beige | #F5F5DC</p>
      </div>
    );
  }
};

export default LoginButton;
