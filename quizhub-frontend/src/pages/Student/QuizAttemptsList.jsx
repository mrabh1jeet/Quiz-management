import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuizAttemptsList() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch attempts for the current user from the new endpoint
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        // Get the logged-in user id from localStorage (adjust as needed)
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("User not logged in.");
        const response = await axios.get(`http://localhost:8080/attempts/all/${userId}`);
        setAttempts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setError(err.message || "Error fetching attempts");
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  // Handle viewing an attempt
  const handleView = (attemptId) => {
    // Navigate to a view page for full quiz details; adjust route as needed
    navigate(`/quiz-attempt/view/${attemptId}`);
  };

  // Handle deleting an attempt
  const handleDelete = async (attemptId) => {
    try {
      await axios.delete(`http://localhost:8080/attempts/${attemptId}`);
      setAttempts(prev => prev.filter(a => a.attemptId !== attemptId));
    } catch (err) {
      console.error("Error deleting attempt:", err);
      alert("Error deleting attempt");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p>Loading quiz attempts...</p>
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
        <h1 className="text-3xl font-bold mb-6">My Quiz Attempts</h1>
        <table className="w-full bg-slate-800 rounded shadow">
          <thead>
            <tr>
              <th className="p-3 border-b border-slate-700">Attempt ID</th>
              <th className="p-3 border-b border-slate-700">Quiz ID</th>
              <th className="p-3 border-b border-slate-700">Quiz Title</th>
              <th className="p-3 border-b border-slate-700">Visibility</th>
              <th className="p-3 border-b border-slate-700">Score</th>
              <th className="p-3 border-b border-slate-700">Start Time</th>
              <th className="p-3 border-b border-slate-700">End Time</th>
              <th className="p-3 border-b border-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.attemptId} className="text-center">
                <td className="p-3 border-b border-slate-700">{attempt.attemptId}</td>
                <td className="p-3 border-b border-slate-700">{attempt.quizId}</td>
                <td className="p-3 border-b border-slate-700">{attempt.quizTitle}</td>
                <td className="p-3 border-b border-slate-700">{attempt.quizVisibility}</td>
                <td className="p-3 border-b border-slate-700">{attempt.score}</td>
                <td className="p-3 border-b border-slate-700">{new Date(attempt.startTime).toLocaleString()}</td>
                <td className="p-3 border-b border-slate-700">
                  {attempt.endTime ? new Date(attempt.endTime).toLocaleString() : "In Progress"}
                </td>
                <td className="p-3 border-b border-slate-700">
                  <button
                    onClick={() => handleView(attempt.attemptId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(attempt.attemptId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan="8" className="p-3">
                  No attempts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizAttemptsList;
