import React, { useState, useEffect } from "react";
import { classQuestions, raceQuestions } from "../../data/questionsAll";

const combinedQuestions = [...classQuestions, ...raceQuestions];

const tallyScores = (answers, questions) => {
  const scores = {};

  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex !== null) {
      const selectedOptions = questions[questionIndex].options[answerIndex].split(",");
      selectedOptions.forEach((option) => {
        scores[option] = (scores[option] || 0) + 1;
      });
    }
  });

  const sortedOptions = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  return sortedOptions.slice(0, 2); // Return the top two options
};

export default function CombinedQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [classAnswers, setClassAnswers] = useState(Array(classQuestions.length).fill(null));
  const [raceAnswers, setRaceAnswers] = useState(Array(raceQuestions.length).fill(null));
  const [results, setResults] = useState({ class: "", secondClass: "", race: "", secondRace: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(classQuestions.length + raceQuestions.length);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    combinedQuestions.sort(() => Math.random() - 0.5);
  }, []);

  const handleOptionChange = (optionIndex) => {
    if (currentQuestionIndex < classQuestions.length) {
      const newClassAnswers = [...classAnswers];
      newClassAnswers[currentQuestionIndex] = optionIndex;
      setClassAnswers(newClassAnswers);
    } else {
      const raceIndex = currentQuestionIndex - classQuestions.length;
      const newRaceAnswers = [...raceAnswers];
      newRaceAnswers[raceIndex] = optionIndex;
      setRaceAnswers(newRaceAnswers);
    }
  };

  const handleNextQuestion = () => {
    if ((currentQuestionIndex < classQuestions.length && classAnswers[currentQuestionIndex] === null) ||
        (currentQuestionIndex >= classQuestions.length && raceAnswers[currentQuestionIndex - classQuestions.length] === null)) {
      setErrorMessage("Please select an option before continuing.");
    } else {
      setErrorMessage("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const topTwoClasses = tallyScores(classAnswers, classQuestions);
    const topTwoRaces = tallyScores(raceAnswers, raceQuestions);
    setResults({ 
      class: `Your class is: ${topTwoClasses[0]}`, 
      secondClass: `Your second class alignment is: ${topTwoClasses[1]}`,
      race: `Your race is: ${topTwoRaces[0]}`,
      secondRace: `Your second race alignment is: ${topTwoRaces[1]}`
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setClassAnswers(Array(classQuestions.length).fill(null));
    setRaceAnswers(Array(raceQuestions.length).fill(null));
    setResults({ class: "", secondClass: "", race: "", secondRace: "" });
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setClassAnswers(Array(classQuestions.length).fill(null));
    setRaceAnswers(Array(raceQuestions.length).fill(null));
  };

  return (
    <div className="quiz-container">
      <h1>D&D Quiz</h1>
      {!quizStarted ? (
        <div className="start-screen">
          <button onClick={startQuiz} disabled={numberOfQuestions === null}>Start Quiz</button>
        </div>
      ) : (
        <>
          {results.class === "" && results.race === "" ? (
            <form onSubmit={handleSubmit}>
              <div className="question">
                <h2>{combinedQuestions[currentQuestionIndex].text}</h2>
                <div className="options">
                  {combinedQuestions[currentQuestionIndex].options.map((option, oIndex) => (
                    <label key={oIndex}>
                      <input
                        type="radio"
                        name={`question_${currentQuestionIndex}`}
                        onChange={() => handleOptionChange(oIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              {currentQuestionIndex > 0 && (
                <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Back</button>
              )}
              {currentQuestionIndex < combinedQuestions.length - 1 && (
                <button type="button" onClick={handleNextQuestion}>Next</button>
              )}
              {currentQuestionIndex === combinedQuestions.length - 1 && (
                <button type="submit">Submit</button>
              )}
            </form>
          ) : (
            <>
              <div className="result">{results.class}</div>
              <div className="result">{results.secondClass}</div>
              <div className="result">{results.race}</div>
              <div className="result">{results.secondRace}</div>
              <button onClick={resetQuiz} className="restart-button">Restart Quiz</button>
            </>
          )}
        </>
      )}
    </div>
  );
}
