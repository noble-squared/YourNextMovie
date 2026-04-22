import type React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <nav className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="HomeButton">
          Your Next Movie
        </Link>
      </div>
      <div className="otherLinks">
        {(!loading && user) ? (
          <>
            <p>Logout</p>
            <p>View Profile</p>
          </>
        )
        : (
        <>
          <Link to="/authentication" className="LoginButton">
            Log in
          </Link>
        </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
