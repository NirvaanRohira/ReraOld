import React, { useEffect, useState } from 'react';
import { getUserResults } from '../services/quizService';
import { useQuizStore } from '../store';
import { QuizResult } from '../types';
import { History, ArrowLeft } from 'lucide-react';
import { TOPIC_NAMES } from '../services/quizService';

export function QuizHistory() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isDarkMode, toggleHistory } = useQuizStore();

  useEffect(() => {
    const fetchResults = async () => {
      if (user) {
        try {
          const userResults = await getUserResults(user.uid);
          setResults(userResults);
        } catch (error) {
          console.error('Error fetching results:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-dark-text' : ''}`}>Quiz History</h2>
        </div>
        <button
          onClick={toggleHistory}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Quiz
        </button>
      </div>

      {results.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
          <p className="text-lg">No quiz history available yet.</p>
          <p className="mt-2">Complete your first quiz to see your results here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className={`${
                isDarkMode ? 'bg-dark-card' : 'bg-white'
              } rounded-lg shadow-md p-6`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-dark-text' : ''}`}>
                    {TOPIC_NAMES[result.topic as keyof typeof TOPIC_NAMES]} Quiz
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(result.date).toLocaleDateString()} at{' '}
                    {new Date(result.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-dark-text' : ''}`}>
                    {((result.score / result.totalQuestions) * 100).toFixed(1)}%
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.score} / {result.totalQuestions} correct
                  </p>
                </div>
              </div>
              
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>Incorrect Questions: {result.incorrectQuestions.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}