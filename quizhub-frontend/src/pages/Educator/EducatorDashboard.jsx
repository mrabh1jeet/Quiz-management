import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EducatorDashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve username from localStorage (assumed to be set on login)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // If not logged in, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove JWT token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="relative bg-slate-900 text-slate-200 min-h-screen">
      {/* Navbar */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-5 max-w-7xl">
          <nav className="flex flex-col md:flex-row justify-between items-center py-4 gap-4 md:gap-0">
            {/* Logo */}
            <a href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <div className="bg-indigo-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold">Q</div>
              <span>QuizHub</span>
            </a>
            {/* Navigation Links */}
            <div className="flex gap-6 w-full md:w-auto justify-center flex-wrap">
              <a href="/my-questions" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">
                My Questions
              </a>
              <a href="/my-quizzes" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">
                My Quizzes
              </a>
              <a href="/create-quiz" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">
                Create Quiz
              </a>
              <a href="/add-question" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">
                Add Question
              </a>
            </div>
            {/* Logout and Welcome */}
            <div className="flex gap-4 items-center w-full md:w-auto justify-center">
              <span className="text-slate-300 text-lg">Welcome, {username}!</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 px-4 py-2 rounded text-white hover:bg-indigo-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Background Welcome Message */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <h1 className="text-7xl font-bold">
          Welcome, {username}!
        </h1>
      </div>
    </div>
  );
}

export default EducatorDashboard;
