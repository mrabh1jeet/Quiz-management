import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EducatorQuizzesList() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [privateQuizzes, setPrivateQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the logged-in educator's userId from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (!userId) throw new Error("User not logged in.");

        // Fetch public quizzes
        const publicResponse = await axios.get(`http://localhost:8080/quizzes/public/${userId}`);
        setPublicQuizzes(publicResponse.data);

        // Fetch private quizzes
        const privateResponse = await axios.get(`http://localhost:8080/quizzes/private/${userId}`);
        setPrivateQuizzes(privateResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || "Error fetching quizzes");
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleViewQuiz = (quizId) => {
    // Navigate to quiz detail page (or edit page)
    navigate(`/quiz-details/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8080/quizzes/${quizId}`);
      // Remove quiz from state
      setPublicQuizzes(prev => prev.filter(q => q.id !== quizId));
      setPrivateQuizzes(prev => prev.filter(q => q.id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert("Error deleting quiz");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p>Loading quizzes...</p>
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
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Quizzes</h1>

        <h2 className="text-2xl font-semibold mb-4">Public Quizzes</h2>
        {publicQuizzes.length > 0 ? (
          <table className="w-full bg-slate-800 rounded shadow mb-8">
            <thead>
              <tr>
                <th className="p-3 border-b border-slate-700">Quiz ID</th>
                <th className="p-3 border-b border-slate-700">Title</th>
                <th className="p-3 border-b border-slate-700">Difficulty</th>
                <th className="p-3 border-b border-slate-700">Topics</th>
                <th className="p-3 border-b border-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publicQuizzes.map((quiz) => (
                <tr key={quiz.id} className="text-center">
                  <td className="p-3 border-b border-slate-700">{quiz.id}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.title}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.difficulty}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.topics}</td>
                  <td className="p-3 border-b border-slate-700">
                    <button
                      onClick={() => handleViewQuiz(quiz.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                    >
                      attempts
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No public quizzes found.</p>
        )}

        <h2 className="text-2xl font-semibold mb-4">Private Quizzes</h2>
        {privateQuizzes.length > 0 ? (
          <table className="w-full bg-slate-800 rounded shadow">
            <thead>
              <tr>
                <th className="p-3 border-b border-slate-700">Quiz ID</th>
                <th className="p-3 border-b border-slate-700">Title</th>
                <th className="p-3 border-b border-slate-700">Difficulty</th>
                <th className="p-3 border-b border-slate-700">Topics</th>
                <th className="p-3 border-b border-slate-700">Private Code</th>
                <th className="p-3 border-b border-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {privateQuizzes.map((quiz) => (
                <tr key={quiz.id} className="text-center">
                  <td className="p-3 border-b border-slate-700">{quiz.id}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.title}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.difficulty}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.topics}</td>
                  <td className="p-3 border-b border-slate-700">{quiz.privateCode}</td>
                  <td className="p-3 border-b border-slate-700">
                    <button
                      onClick={() => handleViewQuiz(quiz.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                    >
                      attempts
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No private quizzes found.</p>
        )}

        {/* Back Button Section */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default EducatorQuizzesList;
