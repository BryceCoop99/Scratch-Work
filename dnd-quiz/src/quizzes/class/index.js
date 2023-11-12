import React, { useState, useEffect } from "react";
import "./index.css";
import { classQuestions } from "../../data/questionsAll";

const tallyScores = (answers) => {
  // Initialize scores object
  const scores = {};

  // Calculate scores
  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex !== null) {
      const selectedClasses =
        classQuestions[questionIndex].classes[answerIndex].split(",");
      selectedClasses.forEach((cls) => {
        scores[cls] = scores[cls] ? scores[cls] + 1 : 1;
      });
    }
  });

  // Sort the classes by score to find the top two
  const sortedClasses = Object.keys(scores).sort(
    (a, b) => scores[b] - scores[a]
  );
  const topClass = sortedClasses[0];
  const secondClass = sortedClasses[1];

  return { topClass, secondClass };
};

export default function QuizClass() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(
    Array(classQuestions.length).fill(null)
  );
  const [result, setResult] = useState("");
  const [secondResult, setSecondResult] = useState("");
  const [showSecondClass, setShowSecondClass] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    classQuestions.length
  );
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Shuffle the classQuestions array
    classQuestions.sort(() => Math.random() - 0.5);
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
      setErrorMessage(""); // Clear error message when an option is selected
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { topClass, secondClass } = tallyScores(answers);
    setResult(`Your class is: ${topClass}`);
    setSecondResult(`Your second class alignment is: ${secondClass}`);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers(Array(classQuestions.length).fill(null));
    setResult("");
    setSecondResult("");
    setShowSecondClass(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setAnswers(Array(numberOfQuestions).fill(null)); // Adjust the answers array to the selected number of classQuestions
  };

  const selectNumberOfQuestions = (num) => {
    setNumberOfQuestions(num);
    setSelectedOption(num);
    if (num === "All") {
      setNumberOfQuestions(classQuestions.length);
    }
  };

  return (
    <div className="quiz-container">
      <h1>D&D Class Finder Quiz</h1>
      {!quizStarted ? (
        // <div className="start-screen">
        //   <h2>Select the number of Questions:</h2>
        //   {Array.from({ length: Math.floor(classQuestions.length / 5) }, (_, i) => (i + 1) * 5)
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
          <button onClick={() => startQuiz(classQuestions.length)}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {result === "" ? (
            <form onSubmit={handleSubmit}>
              <div className="question">
                <h2>{classQuestions[currentQuestionIndex].text}</h2>
                <div className="options">
                  {classQuestions[currentQuestionIndex].options.map(
                    (option, oIndex) => (
                      <label key={oIndex}>
                        <input
                          type="radio"
                          name={`question_${currentQuestionIndex}`}
                          checked={answers[currentQuestionIndex] === oIndex}
                          onChange={() => handleOptionChange(oIndex)}
                        />
                        {option}
                      </label>
                    )
                  )}
                </div>
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              {currentQuestionIndex > 0 && (
                <button type="button" onClick={handlePreviousQuestion}>
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
              <button onClick={() => setShowSecondClass(!showSecondClass)}>
                {showSecondClass ? "Hide" : "Show"} second class alignment
              </button>
              {showSecondClass && <div className="result">{secondResult}</div>}
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
