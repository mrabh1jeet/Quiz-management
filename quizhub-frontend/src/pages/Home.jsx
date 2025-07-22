import React from 'react';
import '../index.css'; // Assuming you have Tailwind set up in your project

function QuizHub() {

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen">
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-5 max-w-7xl">
          <nav className="flex flex-col md:flex-row justify-between items-center py-4 gap-4 md:gap-0">
            {/* Logo Positioned First */}
            <a href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <div className="bg-indigo-600 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold">Q</div>
              <span>QuizHub</span>
            </a>

            {/* Navigation Links with Bigger Font */}
            <div className="flex gap-6 w-full md:w-auto justify-center flex-wrap">
              <a href="/login" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">Home</a>
              <a href="/login" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">Quizzes</a>
              <a href="/login" className="text-slate-400 font-medium text-lg hover:text-indigo-600 transition-colors">Create</a>
            </div>

            {/* Login & Signup Buttons */}
            <div className="flex gap-4 items-center w-full md:w-auto justify-center">
              <button className="px-5 py-2 rounded-md text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors" 
              onClick={() => (window.location.href = "/login")} >
                Log in / Signup
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="py-16 text-center">
        <h1 className="text-3xl font-bold">Create and share <span className="text-indigo-600">interactive quizzes</span></h1>
        <br />
        <p className="text-lg text-slate-400">Engage learners with easy-to-build quizzes.</p>
        <br />
        <br />
        <button className="px-5 py-2 rounded-md text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        onClick={() => (window.location.href = "/login")} >Get Started</button>
      </section>
    </div>
  );
}

export default QuizHub;


