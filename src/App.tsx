import React, { useEffect } from 'react';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Auth } from './components/Auth';
import { QuizSettings } from './components/QuizSettings';
import { useQuizStore } from './store';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const {
    questions,
    isQuizComplete,
    user,
    setUser,
    isDarkMode,
    toggleDarkMode,
  } = useQuizStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || 'User',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-bg' : 'bg-gray-100'}`}>
      <Toaster position="top-right" />
      
      <header className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`ml-2 text-2xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                Real Estate Training Quiz
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`text-sm ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
                {user.displayName}
              </span>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'bg-dark-hover' : 'bg-gray-100'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => auth.signOut()}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!questions.length && !isQuizComplete && <QuizSettings />}
        {questions.length > 0 && !isQuizComplete && <Quiz />}
        {isQuizComplete && <Results />}
      </main>
    </div>
  );
}