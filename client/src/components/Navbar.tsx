// client/src/components/Navbar.tsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = Auth.loggedIn();
  const userProfile = Auth.getProfile();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    Auth.logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            📋 Kanban Board
          </Link>
        </div>

        <div className="navbar-menu">
          {isLoggedIn ? (
            <div className="user-menu" ref={menuRef}>
              <button 
                className="user-menu-trigger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <div className="user-info">
                  <span className="username">
                    {userProfile?.username}
                  </span>
                  <div className="avatar">
                    {userProfile?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="dropdown-arrow">
                    {isMenuOpen ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {isMenuOpen && (
                <div className="dropdown-menu fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-username">{userProfile?.username}</p>
                    <p className="dropdown-role">Team Member</p>
                  </div>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;