import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useQuizStore } from '../store';

export function ChatGPTInput() {
  const [input, setInput] = useState('');
  const { setQuestions, isDarkMode } = useQuizStore();

  const parseQuestions = (text: string) => {
    try {
      const questions = text.split('\n\n').map((questionBlock, index) => {
        const lines = questionBlock.split('\n');
        const questionText = lines[0].replace(/^\d+\.\s*/, '');
        const options = lines.slice(1, 5).map(line => line.replace(/^[a-d]\)\s*/, ''));
        const correctAnswer = lines.find(line => line.toLowerCase().includes('correct'))?.split(':')[1].trim() || options[0];
        const explanation = lines.find(line => line.toLowerCase().includes('explanation'))?.split(':')[1].trim() || 'No explanation provided';
        
        return {
          id: index + 1,
          text: questionText,
          options,
          correctAnswer,
          explanation,
          topic: 'Real Estate',
        };
      });

      return questions;
    } catch (error) {
      console.error('Error parsing questions:', error);
      return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions = parseQuestions(input);
    if (questions) {
      setQuestions(questions);
    } else {
      alert('Unable to parse questions. Please check the format and try again.');
    }
  };

  return (
    <div className={`max-w-2xl mx-auto mt-8 p-6 ${isDarkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow-md`}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-text' : ''}`}>
          Paste ChatGPT Response
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`w-full h-64 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isDarkMode
              ? 'bg-dark-hover border-dark-border text-dark-text'
              : 'border border-gray-300'
          }`}
          placeholder="Paste your ChatGPT response here..."
        />
        
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Quiz
          </button>
        </div>
      </form>

      <div className={`mt-4 text-sm ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
        <p className="font-semibold mb-2">Expected format:</p>
        <pre className={`${isDarkMode ? 'bg-dark-hover' : 'bg-gray-50'} p-4 rounded-lg overflow-x-auto`}>
{`1. What is RERA?
a) Real Estate Regulation Act
b) Real Estate Reform Act
c) Real Estate Registration Act
d) Real Estate Regulatory Authority
Correct: d) Real Estate Regulatory Authority
Explanation: RERA stands for Real Estate Regulatory Authority...

2. Next question...`}
        </pre>
      </div>
    </div>
  );
}