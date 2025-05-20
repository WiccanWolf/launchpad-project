import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

const LoginButton = ({ baseUrl }) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Login successful');
    } else {
      setMessage(data.message || 'Login failed');
    }
  };
  if (!isAuthenticated) {
    return (
      <>
        <div className='center-button'>
          <Button
            variant='success'
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  scope:
                    'openid profile email https://www.googleapis.com/auth/calendar.events',
                },
              })
            }
          >
            Log In
          </Button>
        </div>
        <form onSubmit={handleLogin}>
          <h2>Staff Login</h2>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit'>Log In</button>
          {message && <p>{message}</p>}
        </form>
      </>
    );
  }
};

export default LoginButton;
