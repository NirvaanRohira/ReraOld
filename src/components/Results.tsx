import React from 'react';
import { useQuizStore } from '../store';
import { CheckCircle, XCircle, BookOpen, AlertCircle, RotateCcw } from 'lucide-react';

export function Results() {
  const { questions, userAnswers, isDarkMode, reset } = useQuizStore();

  const getAnswerStatus = (questionId: string) => {
    const userAnswer = userAnswers[questionId];
    if (!userAnswer) return 'unattempted';
    return userAnswer === questions.find(q => q.id === questionId)?.correctAnswer ? 'correct' : 'incorrect';
  };

  const results = questions.reduce(
    (acc, _) => {
      const status = getAnswerStatus(_.id);
      acc[status]++;
      return acc;
    },
    { correct: 0, incorrect: 0, unattempted: 0 }
  );

  const totalQuestions = questions.length;
  const percentage = ((results.correct / totalQuestions) * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-dark-text' : ''}`}>Quiz Results</h2>
          <button
            onClick={reset}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <RotateCcw className="w-5 h-5" />
            Start New Quiz
          </button>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {percentage}%
            </div>
            <div className={`grid grid-cols-3 gap-4 text-sm ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
              <div className="text-green-500">
                <div className="font-bold">{results.correct}</div>
                <div>Correct</div>
              </div>
              <div className="text-red-500">
                <div className="font-bold">{results.incorrect}</div>
                <div>Incorrect</div>
              </div>
              <div className="text-yellow-500">
                <div className="font-bold">{results.unattempted}</div>
                <div>Unattempted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-dark-text' : ''}`}>Detailed Analysis</h3>
        
        <div className="space-y-6">
          {questions.map((question, index) => {
            const status = getAnswerStatus(question.id);
            const userAnswer = userAnswers[question.id];
            
            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg ${
                  status === 'correct'
                    ? isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                    : status === 'incorrect'
                    ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
                    : isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div>
                    {status === 'correct' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : status === 'incorrect' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-dark-text' : ''}`}>
                      Question {index + 1}: {question.text}
                    </h4>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-dark-text' : ''}`}>
                      {status === 'unattempted' ? (
                        <p className="text-yellow-500 font-medium">Question not attempted</p>
                      ) : (
                        <p>Your answer: {userAnswer}</p>
                      )}
                      <p>Correct answer: {question.correctAnswer}</p>
                      <div className="mt-2 flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
                        <p className={isDarkMode ? 'text-dark-text' : 'text-gray-600'}>
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}