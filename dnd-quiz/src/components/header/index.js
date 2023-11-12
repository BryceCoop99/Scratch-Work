// Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Header = () => {
  const navigate = useNavigate();
  
  const goToHome = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container" onClick={goToHome}>
        <h1>QuestMind</h1>
      </div>
      <nav className="navbar">
        <button className="nav-button" onClick={() => navigate('/dndRace')}>Race Quiz</button>
        <button className="nav-button" onClick={() => navigate('/dndClass')}>Class Quiz</button>
      </nav>
    </header>
  );
};

export default Header;
