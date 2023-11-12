import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import
import './App.css';
import Header from './components/header';
import HomePage from './components/home';
import QuizClass from './quizzes/class';
import QuizRace from './quizzes/race';
import CombinedQuiz from './quizzes/quiz';
import CharSheet from './quizzes/charSheet';

function App() {
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const handleQuizSelect = (quizName) => {
    setCurrentQuiz(quizName);
  };

  return (
    <Router>
      <div className="App">
        <Header onQuizSelect={handleQuizSelect} />
        <Routes>
          <Route path="/" element={<HomePage onQuizSelect={handleQuizSelect} />} />
          {/* <Route path="/dndQuiz" element={<CombinedQuiz />} /> */}
          <Route path="/charSheet" element={<CharSheet />} />
          <Route path="/dndRace" element={<QuizRace />} />
          <Route path="/dndClass" element={<QuizClass />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
