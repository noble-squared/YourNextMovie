import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  //I asked for AI's help here. Everytime I hit logout it would direct me to the authentication page, which would immediately redirect me to the profile page again
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/authentication');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error signing out:', error.message);
      } else {
        console.error('Error signing out:', error);
      }
    }
  };

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
            <div><button type="button" onClick={handleLogout}>Logout</button></div>
            <Link to="/profile">View Profile</Link>
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
