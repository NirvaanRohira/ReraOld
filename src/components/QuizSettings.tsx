import React, { useState } from 'react';
import { useQuizStore } from '../store';
import { getRandomQuestions, TOPIC_NAMES } from '../services/questionService';
import { Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth } from '../firebase';

export function QuizSettings() {
  const { quizSettings, updateQuizSettings, isDarkMode, setQuestions } = useQuizStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<keyof typeof TOPIC_NAMES>('general');

  const startQuiz = async () => {
    if (!auth.currentUser) {
      toast.error('Please sign in to start a quiz');
      return;
    }

    setIsLoading(true);
    try {
      const randomQuestions = await getRandomQuestions(quizSettings.numberOfQuestions, selectedTopic);
      if (randomQuestions.length === 0) {
        toast.error('No questions available in the selected topic');
        return;
      }
      setQuestions(randomQuestions);
      toast.success('Quiz generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error generating quiz');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className={`p-8 rounded-lg shadow-md ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}>
        <Brain className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
          Start New Quiz
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-dark-text' : 'text-gray-700'}`}>
              Select Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value as keyof typeof TOPIC_NAMES)}
              className={`w-full p-3 rounded-md ${
                isDarkMode
                  ? 'bg-dark-hover border-dark-border text-dark-text'
                  : 'border border-gray-300'
              }`}
            >
              {Object.entries(TOPIC_NAMES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-dark-text' : 'text-gray-700'}`}>
              Number of Questions
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quizSettings.numberOfQuestions}
              onChange={(e) =>
                updateQuizSettings({
                  numberOfQuestions: Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)),
                })
              }
              className={`w-full p-3 rounded-md text-center text-lg ${
                isDarkMode
                  ? 'bg-dark-hover border-dark-border text-dark-text'
                  : 'border border-gray-300'
              }`}
            />
          </div>
        </div>

        <button
          onClick={startQuiz}
          disabled={isLoading}
          className={`w-full py-3 px-6 mt-6 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
        </button>
      </div>

      <p className={`mt-4 text-sm ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
        Questions will be randomly selected from our {TOPIC_NAMES[selectedTopic]} question bank
      </p>
    </div>
  );
}