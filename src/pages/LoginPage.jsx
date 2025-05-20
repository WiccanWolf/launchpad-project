import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    loginWithRedirect({
      authorizationParams: {
        scope: `openid profile email https://googleapis.com/auth/calendar.events`,
      },
    });
  }, [loginWithRedirect]);
  return <p>Redirecting to Login...</p>;
};

export default LoginPage;
