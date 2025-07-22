import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FilteredQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Replace with your authentication method; here we use localStorage.
  const userId = localStorage.getItem('userId');

  const fetchFilteredQuizzes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/quizzes/filtered/${userId}`);
      setQuizzes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching filtered quizzes:', err);
      setError('Failed to load quizzes.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFilteredQuizzes();
    } else {
      setError('User not logged in');
      setLoading(false);
    }
  }, [userId]);

  const handleTakeQuiz = (quizId) => {
    navigate(`/take-quiz/${quizId}`);
  };

  const handleViewHistory = (quizId) => {
    navigate(`/quiz-history/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8080/quizzes/${quizId}`);
      fetchFilteredQuizzes();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz.');
    }
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col">
      {/* Page Heading */}
      <header className="py-8">
        <h1 className="text-3xl font-bold text-center">Filtered Quizzes</h1>
      </header>

      {/* Quiz Cards */}
      <main className="container mx-auto p-5 flex-1">
        {quizzes.length === 0 ? (
          <p className="text-center text-xl">No quizzes available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-slate-800 p-6 rounded-lg shadow-md flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-slate-400 mb-2">{quiz.description}</p>
                <p className="mb-1"><strong>Difficulty:</strong> {quiz.difficulty}</p>
                <p className="mb-1"><strong>Topics:</strong> {quiz.topics}</p>
                <p className="mb-1"><strong>Number of Questions:</strong> {quiz.numberOfQuestions}</p>
                <p className="mb-4"><strong>Time Limit:</strong> {quiz.timeLimit} seconds</p>
                
                {/* Full width Take Quiz/Test Again Button */}
                
                {/* Conditionally render History and Delete buttons if quiz was attempted */}
                  <div className="flex gap-2">
                <button
                  onClick={() => handleTakeQuiz(quiz.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mb-4"
                  >
                  {quiz.attempted ? 'Test Again' : 'Take Quiz'}
                </button>
                    {quiz.attempted && (
                    <button
                      onClick={() => handleViewHistory(quiz.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-4"
                    >
                      View History
                    </button>
                    )}
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mb-4"
                    >  
                      Delete
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Centered Back Button */}
      <footer className="py-8">
        <div className="flex justify-center">
          <button
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
          >
            Back
          </button>
        </div>
      </footer>
    </div>
  );
}

export default FilteredQuiz;
