import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid header'>
        <a className='navbar-brand' href='/'>
          Community Events Platform
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collpase'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            {isAuthenticated && (
              <li className='nav-item'>
                <a
                  className='nav-link active'
                  aria-current='page'
                  href='/homepage'
                >
                  Home
                </a>
              </li>
            )}
          </ul>
          {isAuthenticated && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
