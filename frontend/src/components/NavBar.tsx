import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="top-nav-container">
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`top-nav ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        {/* <Link to="/quizzes" onClick={() => setIsOpen(false)}>Quizzes</Link> */}
        {/* <Link to="/about" onClick={() => setIsOpen(false)}>About</Link> */}
      </nav>
    </header>
  );
};

export default NavBar;