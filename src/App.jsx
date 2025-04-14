import React, { useEffect, useState } from 'react';
import { PenLine, Menu as Menu2, MoreVertical } from 'lucide-react';
import { questions } from './questions';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [coins, setCoins] = useState(0);
  const [timer, setTimer] = useState(30);

  const currentQuestion = questions[currentQuestionIndex];

  // Reset timer when component mounts or question changes
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

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimer(30);
  };

  const endGame = () => {
    setGameStarted(false);
  };

  const handleSubmit = () => {
    const isCorrect = selectedAnswers.every(
      (answer, index) => answer === currentQuestion.correctAnswer[index]
    );

    if (isCorrect) {
      setCoins(coins + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setTimer(30);
    } else {
      setGameStarted(false);
    }
  };

  const handleSelectAnswer = (option) => {
    if (selectedAnswers.length < 4 && !selectedAnswers.includes(option)) {
      setSelectedAnswers([...selectedAnswers, option]);
    }
  };

  const handleRemoveAnswer = (index) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers.splice(index, 1);
    setSelectedAnswers(newSelectedAnswers);
  };

  const getFilledQuestion = () => {
    const parts = currentQuestion.question.split('_____________');

    return parts.map((part, index) => {
      if (index === parts.length - 1) {
        return <span key={index}>{part}</span>;
      }

      return (
        <React.Fragment key={index}>
          {part}
          <span 
            className={`inline-block min-w-[100px] px-2 py-1 mx-1 rounded ${
              selectedAnswers[index] 
                ? 'bg-indigo-100 border-2 border-indigo-300 cursor-pointer' 
                : 'bg-gray-100 border-2 border-dashed border-gray-300'
            }`}
            onClick={() => selectedAnswers[index] && handleRemoveAnswer(index)}
          >
            {selectedAnswers[index] || ''}
          </span>
        </React.Fragment>
      );
    });
  };

  const renderProgressBars = () => {
    return (
      <div className="flex gap-1 mb-4">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index <= currentQuestionIndex ? 'bg-yellow-400' : 'bg-gray-200'
            }`}
          />
        ))}
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
      <div className="flex items-center justify-center h-[100vh] w-[100vw] p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          {!gameStarted ? (
            <>
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
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-black text-black font-medium hover:bg-gray-50 transition-colors"
                  style={{ backgroundColor: "white" }}
                  onClick={() => console.log('Back clicked')}
                >
                  Back
                </button>

                <button
                  className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  style={{ backgroundColor: "blue" }}
                  onClick={handleStartGame}
                >
                  Start
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Game Screen */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-600 text-lg">
                    0:{timer.toString().padStart(2, '0')}
                  </span>
                  <button
                    className="py-3 px-4 rounded-lg border-2 text-black"
                    style={{ backgroundColor: "white", borderColor: "gray" }}
                    onClick={endGame}
                  >
                    Quit
                  </button>
                </div>

                {renderProgressBars()}

                <div className="text-center space-y-5 text-gray-500 mb-4">
                  Select the missing words in the correct order.
                </div>

                <div className="text-lg text-gray-800 mb-6 p-4 bg-gray-50 rounded-lg">
                  {getFilledQuestion()}
                </div>

                <div className="flex gap-4 justify-center">
                  {currentQuestion.options.map((option, index) => (
                    !selectedAnswers.includes(option) && (
                      <button
                        key={index}
                        className=" p-4 rounded-lg border-2 text-left text-black transition-colors border-gray-200 hover:border-gray-300"
                        style={{ backgroundColor: "white", borderColor: "black" }}
                        onClick={() => handleSelectAnswer(option)}
                      >
                        {option}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="w-full mt-6 py-3 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={selectedAnswers.length !== 4}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;