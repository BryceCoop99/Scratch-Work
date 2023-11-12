import React, { useState, useEffect } from "react";
import { raceQuestions } from "../../data/questionsAll";

const tallyRaceScores = (answers) => {
  const scores = {};

  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex !== null) {
      const selectedRaces = raceQuestions[questionIndex].races[answerIndex].split(",");
      selectedRaces.forEach((race) => {
        scores[race] = scores[race] ? scores[race] + 1 : 1;
      });
    }
  });

  const sortedRaces = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const topRace = sortedRaces[0];
  const secondRace = sortedRaces[1];

  return { topRace, secondRace };
};

export default function QuizRace() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(raceQuestions.length).fill(null));
  const [result, setResult] = useState("");
  const [secondResult, setSecondResult] = useState("");
  const [showSecondRace, setShowSecondRace] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(raceQuestions.length);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    raceQuestions.sort(() => Math.random() - 0.5);
  }, []);

  const handleOptionChange = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentQuestionIndex] === null) {
      setErrorMessage("Please select an option before continuing.");
    } else {
      setErrorMessage("");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { topRace, secondRace } = tallyRaceScores(answers);
    setResult(`Your race is: ${topRace}`);
    setSecondResult(`Your second race alignment is: ${secondRace}`);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(raceQuestions.length).fill(null));
    setResult("");
    setSecondResult("");
    setShowSecondRace(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setAnswers(Array(numberOfQuestions).fill(null));
  };

  const selectNumberOfQuestions = (num) => {
    setNumberOfQuestions(num);
    setSelectedOption(num);
    if (num === "All") {
      setNumberOfQuestions(raceQuestions.length);
    }
  };

  return (
    <div className="quiz-container">
      <h1>D&D Race Finder Quiz</h1>
      {!quizStarted ? (
        // <div className="start-screen">
        //   <h2>Select the number of questions:</h2>
        //   {Array.from({ length: Math.floor(raceQuestions.length / 5) }, (_, i) => (i + 1) * 5)
        //     .concat("All")
        //     .map((num, index) => (
        //       <button
        //         key={index}
        //         onClick={() => selectNumberOfQuestions(num)}
        //         className={selectedOption === num ? "selected" : ""}
        //       >
        //         {num === "All" ? "All Questions" : `${num} Questions`}
        //       </button>
        //     ))}
        //   <button onClick={startQuiz} disabled={numberOfQuestions === null}>
        //     Start Quiz
        //   </button>
        // </div>
        
        <div className="start-screen">
          <h2>Quiz:</h2>
          <button onClick={() => startQuiz(raceQuestions.length)}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {result === "" ? (
            <form onSubmit={handleSubmit}>
              <div className="question">
                <h2>{raceQuestions[currentQuestionIndex].text}</h2>
                <div className="options">
                  {raceQuestions[currentQuestionIndex].options.map((option, oIndex) => (
                    <label key={oIndex}>
                      <input
                        type="radio"
                        name={`question_${currentQuestionIndex}`}
                        checked={answers[currentQuestionIndex] === oIndex}
                        onChange={() => handleOptionChange(oIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              {currentQuestionIndex > 0 && (
                <button type="button" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                  Back
                </button>
              )}
              {currentQuestionIndex < numberOfQuestions - 1 && (
                <button type="button" onClick={handleNextQuestion}>
                  Next
                </button>
              )}
              {currentQuestionIndex === numberOfQuestions - 1 && (
                <button type="submit">Submit</button>
              )}
            </form>
          ) : (
            <>
              <div className="result">{result}</div>
              <button onClick={() => setShowSecondRace(!showSecondRace)}>
                {showSecondRace ? "Hide" : "Show"} second race alignment
              </button>
              {showSecondRace && <div className="result">{secondResult}</div>}
              <button onClick={resetQuiz} className="restart-button">
                Restart Quiz
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}