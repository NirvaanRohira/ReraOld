import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MINUTES_PER_QUESTION = 1.2; // 1.2 minutes per question = 1 hour for 50 questions

export function Quiz() {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    setAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    isDarkMode,
  } = useQuizStore();

  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.floor(questions.length * MINUTES_PER_QUESTION * 60); // Convert to seconds
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error('Time\'s up! Quiz automatically submitted.');
      completeQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, completeQuiz]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  const handleOptionSelect = (option: string) => {
    setAnswer(currentQuestion.id, option);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const getTimerColor = () => {
    const totalTime = questions.length * MINUTES_PER_QUESTION * 60;
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 50) return 'text-green-500';
    if (percentage > 25) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-medium ${isDarkMode ? 'text-dark-text' : 'text-gray-500'}`}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className={`flex items-center gap-2 ${getTimerColor()}`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className={`w-full h-2 ${isDarkMode ? 'bg-dark-hover' : 'bg-gray-200'} rounded-full`}>
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                userAnswers[currentQuestion.id] === option
                  ? isDarkMode 
                    ? 'bg-blue-900/50 border-2 border-blue-500'
                    : 'bg-blue-100 border-2 border-blue-500'
                  : isDarkMode
                    ? 'bg-dark-hover hover:bg-dark-hover/80'
                    : 'bg-gray-50 hover:bg-gray-100'
              } ${isDarkMode ? 'text-dark-text' : ''}`}
            >
              <span className="font-medium">
                {String.fromCharCode(97 + index)}.
              </span>{' '}
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentQuestionIndex === 0
              ? 'text-gray-400 cursor-not-allowed'
              : isDarkMode
                ? 'text-blue-400 hover:bg-dark-hover'
                : 'text-blue-600 hover:bg-blue-50'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={completeQuiz}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'text-blue-400 hover:bg-dark-hover'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}