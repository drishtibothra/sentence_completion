import React from 'react';
import { Rocket, Brain, Target, ArrowRight, Code2, PenLine } from 'lucide-react';

function App() {
  return (
    <div className="h-screen w-[100vw] bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-900">
              Sentence Construction
            </div>
            <a
              href="#features"
              className="ml-auto text-gray-600 hover:text-gray-900 font-bold text-2xl"
            >
              &#8942;
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}

      <div className="text-center p-5 bg-gray-100 font-sans h-[100vh] w-[100vw] flex justify-center items-center flex-col">
        <div className="flex justify-center mb-6">
          <PenLine className="h-10 w-8 text-gray-700" />
        </div>
        <div className='w-[40vw] flex flex-col justify-center items-center'>
          <h1 className="text-3xl font-bold mb-4 text-black">Sentence Construction</h1>
          <p className="text-lg text-slate-400 mb-6">
            Select the correct words to complete the sentence by arranging the provided options in the right order.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 justify-center items-center">
          <div className="text-center border-r-2 border-slate-300 space-x-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1">Time Per Question</h3>
            <p className="text-lg font-light text-gray-500">30 sec</p>
          </div>

          <div className="text-center border-r-2 border-slate-300 space-x-5">
            <h3 className="text-sm font-bold text-gray-700 mb-1">Total Questions</h3>
            <p className="text-lg font-light text-gray-500">10</p>
          </div>

          <div className="text-center border-r-2 border-slate-300">
            <h3 className="text-sm font-bold text-gray-700 mb-1">Coins</h3>
            <div className="flex items-center justify-center">
              <span className="text-lg font-light text-gray-500">0</span>
              <span className="text-yellow-400 ml-1">●</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 h-[5vh] w-[15vw] px-4 rounded-lg border-blue-600 text-blue-600 border-2 font-medium flex items-center justify-center"
            style={{ backgroundColor: "white" }}
            onClick={() => console.log('Back clicked')}
          >
            Back
          </button>
          <button
            className="flex-1 h-[5vh] w-[15vw] px-4 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-center"
            style={{ backgroundColor: "blue " }}
            onClick={() => console.log('Start clicked')}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;