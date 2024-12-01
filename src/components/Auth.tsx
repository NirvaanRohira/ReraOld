import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useQuizStore } from '../store';
import { BookOpen, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { isDarkMode, toggleDarkMode } = useQuizStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
          toast.success('Account created successfully!');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message.includes('auth/') 
        ? 'Invalid email or password'
        : error.message
      );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-dark-bg' : 'bg-gray-100'}`}>
      <header className={`${isDarkMode ? 'bg-dark-card' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`ml-2 text-2xl font-bold ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                Real Estate Training Quiz
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-dark-hover' : 'bg-gray-100'}`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${isDarkMode ? 'bg-dark-card' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-dark-text' : 'text-gray-900'}`}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDarkMode
                      ? 'bg-dark-hover border-dark-border text-dark-text'
                      : 'border border-gray-300'
                  }`}
                  required
                  minLength={2}
                />
              </div>
            )}
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDarkMode
                    ? 'bg-dark-hover border-dark-border text-dark-text'
                    : 'border border-gray-300'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-dark-text' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDarkMode
                    ? 'bg-dark-hover border-dark-border text-dark-text'
                    : 'border border-gray-300'
                }`}
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm hover:underline ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}