import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain='dev-otqn1is3gkroi07u.us.auth0.com'
    clientId='sBEnQvFZ8Y99G7XW3MvyY8jE1zsVKpnT'
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <App />
  </Auth0Provider>
);
