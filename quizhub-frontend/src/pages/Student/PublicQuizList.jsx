import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PublicQuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/quizzes/public')
      .then(response => {
        setQuizzes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching public quizzes:", error);
        setError("Error fetching public quizzes.");
        setLoading(false);
      });
  }, []);

  const handleTakeQuiz = (quizId) => {
    navigate(`/take-quiz/${quizId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p>Loading public quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 flex flex-col">
      <div className="container mx-auto flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Public Quizzes</h1>
        {quizzes.length === 0 ? (
          <p className="text-center text-xl">No public quizzes available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-2">{quiz.title}</h2>
                <p className="mb-2">{quiz.description}</p>
                <p className="mb-1"><strong>Difficulty:</strong> {quiz.difficulty}</p>
                <p className="mb-1"><strong>Topics:</strong> {quiz.topics}</p>
                <p className="mb-1"><strong>Questions:</strong> {quiz.numberOfQuestions}</p>
                <p className="mb-4"><strong>Time Limit:</strong> {quiz.timeLimit} sec</p>
                <button
                  onClick={() => handleTakeQuiz(quiz.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Take Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Back button at the bottom */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleBack}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default PublicQuizList;
