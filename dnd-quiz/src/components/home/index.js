// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero">
        <h2>Welcome to QuestMind</h2>
        <p>Discover your inner character with our personality-matching quizzes!</p>
      </section>
      <section className="quiz-selection">
        <div className="quiz-card" onClick={() => navigate('/dndClass')}>
          <h3>D&D Class Quiz</h3>
          <p>Which Dungeons & Dragons class fits your personality? Take the quiz and find out!</p>
        </div>
        {/* New QuizRace card */}
        <div className="quiz-card" onClick={() => navigate('/dndRace')}>
          <h3>D&D Race Quiz</h3>
          <p>Find out which Dungeons & Dragons race aligns with your personality!</p>
        </div>
        <div className="quiz-card" onClick={() => navigate('/charSheet')}>
          <h3>Char Sheet</h3>
          <p>Start creating your character sheet!</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
