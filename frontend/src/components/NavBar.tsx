import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import '../styles/NavBar.css';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser, signOut } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!currentUser) return '';
    if (currentUser.isAnonymous) return 'Guest';
    return currentUser.displayName || currentUser.email || 'User';
  };

  return (
    <>
      <header className="top-nav-container">
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`top-nav ${isOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          {/* <Link to="/quizzes" onClick={() => setIsOpen(false)}>Quizzes</Link> */}
          {/* <Link to="/about" onClick={() => setIsOpen(false)}>About</Link> */}
        </nav>
        <div className="nav-auth">
          {currentUser ? (
            <>
              <span className="nav-user-info">{getUserDisplayName()}</span>
              <button onClick={handleSignOut} className="nav-sign-out">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="nav-sign-in">
              Sign In
            </button>
          )}
        </div>
      </header>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default NavBar;