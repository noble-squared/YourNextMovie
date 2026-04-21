import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [ authenticated, setAuthenticated ] = useState(false)
  return (
    <nav className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="HomeButton">
          Your Next Movie
        </Link>
      </div>
      <div className="otherLinks">
        {authenticated ? (
          <>
          <p>Welcome, person who shouldn't be seeing this! This logic is unimplemented!</p>
          </>
        )
        : (
        <>
          <Link to="/login" className="LoginButton">
            Log in
          </Link>
          <p>Sign Up</p>
        </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
