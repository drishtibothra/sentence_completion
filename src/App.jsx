import React, { useEffect, useState } from 'react';
import { PenLine, Menu as Menu2, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { questions } from './questions';


function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [answerPositions, setAnswerPositions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [timer, setTimer] = useState(30);
  const [userResponses, setUserResponses] = useState([]);
  const [showDashboard, setShowDashboard] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];


  {/* Function to set the timer and reset it for every question */}
  useEffect(() => {
    let intervalId;
    if (gameStarted && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            handleSubmit();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, currentQuestionIndex]);


  {/* Function to handle the start of the game */}
  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setAnswerPositions({});
    setTimer(30);
    setUserResponses([]);
    setShowDashboard(false);
  };

  const goToDashboard = () => {
    setGameStarted(false);
  };

  {/* Function to handle the end of the game */}
  const endGame = () => {
    setGameStarted(false);
    setShowDashboard(true);
  };

  {/* Function to handle the submission of answers */}
  const handleSubmit = () => {
    const orderedAnswers = new Array(4).fill('');
    selectedAnswers.forEach((answer) => {
      const position = answerPositions[answer];
      if (position !== undefined) {
        orderedAnswers[position] = answer;
      }
    });

    const isCorrect = orderedAnswers.every(
      (answer, index) => answer === currentQuestion.correctAnswer[index]
    );

    if (isCorrect) {
      setCoins(coins + 1);
    }

    setUserResponses([...userResponses, {
      question: currentQuestion.question,
      userAnswer: orderedAnswers,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setAnswerPositions({});
      setTimer(30);
    } else {
      endGame();
    }
  };

  {/* Function to handle the option or the answer selected so that it can removed further */}
  const handleSelectAnswer = (option) => {
    if (selectedAnswers.length < 4 && !selectedAnswers.includes(option)) {
      const firstEmptyPosition = Array(4).fill(null)
        .findIndex((_, index) => !Object.values(answerPositions).includes(index));

      if (firstEmptyPosition !== -1) {
        setSelectedAnswers([...selectedAnswers, option]);
        setAnswerPositions({ ...answerPositions, [option]: firstEmptyPosition });
      }
    }
  };

  {/* Function to handle the removal of answers if clicked on the blank */}
  const handleRemoveAnswer = (position) => {
    const answerAtPosition = Object.keys(answerPositions)
      .find(key => answerPositions[key] === position);

    if (answerAtPosition) {
      const newSelectedAnswers = selectedAnswers.filter(answer => answer !== answerAtPosition);
      const newPositions = { ...answerPositions };
      delete newPositions[answerAtPosition];

      setSelectedAnswers(newSelectedAnswers);
      setAnswerPositions(newPositions);
    }
  };


  {/* Function to get the question from the .json file */}
  const getFilledQuestion = () => {
    const parts = currentQuestion.question.split('_____________');

    return parts.map((part, index) => {
      if (index === parts.length - 1) {
        return <span key={index}>{part}</span>;
      }

      const answerInPosition = Object.entries(answerPositions)
        .find(([_, pos]) => pos === index)?.[0];

      return (
        <React.Fragment key={index}>
          {part}
          <span
            className={`inline-block min-w-[100px] px-2 py-1 mx-1 rounded ${answerInPosition
                ? 'bg-indigo-100 border-2 border-indigo-300 cursor-pointer'
                : 'bg-gray-100 border-2 border-dashed border-gray-300'
              }`}
            onClick={() => answerInPosition && handleRemoveAnswer(index)}
          >
            {answerInPosition || ''}
          </span>
        </React.Fragment>
      );
    });
  };


  {/* Function to show the number of questions done in the form of progress bar */}
  const renderProgressBars = () => {
    return (
      <div className="flex gap-1 mb-4">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index <= currentQuestionIndex ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
          />
        ))}
      </div>
    );
  };

  {/* Function to calculate the score */}
  const calculateScore = () => {
    const correctAnswers = userResponses.filter(response => response.isCorrect).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  {/* Function to display the feedback for the user and render the dashboard */}
  const renderDashboard = () => {
    const score = calculateScore();

    return (
      <div className="w-[100vw] max-w-2xl h-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-green-600">{score}</span>
            </div>
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-green-600"
                strokeWidth="8"
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * score) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Your Score</p>
          <p className="text-gray-600">
            You got {userResponses.filter(r => r.isCorrect).length} out of {questions.length} questions correct
          </p>
        </div>
        <div className="w-full flex justify-center mb-4">
          <button
            className="w-[15vw] mt-8 py-3 px-4 rounded-lg bg-indigo-600 text-blue-600 font-medium hover:bg-indigo-700 transition-colors"
            onClick={handleStartGame}
            style={{ backgroundColor: "white", borderColor: "blue" }}
          >
            Play Again
          </button>
        </div>

        <div className="space-y-6">
          {userResponses.map((response, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {response.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className="text-gray-800 mb-2">Question {index + 1}</p>
                  <p className="text-gray-600 mb-2">{response.question}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Your answer: <span className="font-medium">{response.userAnswer.join(' ')}</span>
                    </p>
                    {!response.isCorrect && (
                      <p className="text-sm text-gray-500">
                        Correct answer: <span className="font-medium">{response.correctAnswer.join(' ')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-gray-50"> 
      {/* Header Bar */}
      <div className="bg-white w-full py-4 px-4 flex justify-between items-center border-b">
        <Menu2 className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
        <h2 className="text-lg font-medium text-gray-900">Sentence Construction</h2>
        <MoreVertical className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-900" />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full p-4">
        {showDashboard ? (
          renderDashboard()
        ) : !gameStarted ? (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            {/* Welcome Screen */}
            <div className="flex justify-center mb-6">
              <PenLine className="h-8 w-8 text-gray-700" />
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Sentence Construction
            </h1>

            <p className="text-center text-gray-600 mb-8">
              Select the correct words to complete the sentence by arranging
              the provided options in the right order.
            </p>

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center border-r-2 border-gray-200">
                <h3 className="text-sm text-gray-700 mb-1 font-bold">
                  Time Per Question
                </h3>
                <p className="text-lg font-semibold text-gray-400">30 sec</p>
              </div>

              <div className="text-center border-r-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-1">
                  Total Questions
                </h3>
                <p className="text-lg font-semibold text-gray-400">{questions.length}</p>
              </div>

              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-700 mb-1">
                  Coins
                </h3>
                <div className="flex items-center justify-center">
                  <span className="text-yellow-400 mb-1 mr-1">●</span>
                  <span className="text-lg font-semibold text-gray-400">{coins}</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 py-3 px-4 rounded-lg border-2 border-black text-black font-medium hover:bg-gray-50 transition-colors" style={{ backgroundColor: "white" }}
                onClick={() => console.log('Back clicked')}
              >
                Back
              </button>

              <button
                className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleStartGame} style={{ backgroundColor: "blue" }}
              >
                Start
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
            {/* Game Screen */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                {/* Time Left */}
                <span className="font-bold text-gray-600 text-lg">
                  0:{timer.toString().padStart(2, '0')}
                </span>
                {/* Quit button to end the game */}
                <button
                  className="py-3 px-4 rounded-lg border-2 text-black"
                  onClick={endGame} style={{ backgroundColor: "white", borderColor: "gray" }}
                >
                  Quit
                </button>
              </div>

              {/* Progress Bar */}
              {renderProgressBars()}

              <div className='text-center space-y-4 mb-4 text-gray-600'>
                Select the missing words in the correct order.
              </div>

              <div className="text-lg text-gray-800 mb-6 p-4 bg-gray-50 rounded-lg">
                {getFilledQuestion()}
              </div>


              <div className="flex justify-center gap-4">
                {currentQuestion.options.map((option, index) => (
                  !selectedAnswers.includes(option) && (
                    <button
                      key={index}
                      className=" p-4 rounded-lg border-2 text-left text-black transition-colors border-gray-200 hover:border-gray-300" style={{ backgroundColor: "white", borderColor: "gray" }}
                      onClick={() => handleSelectAnswer(option)}
                    >
                      {option}
                    </button>
                  )
                ))}
              </div>

              {/* Submission Button */}
              <button
                className="w-full mt-6 py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={selectedAnswers.length !== 4}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;