import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function QuizAttemptsList() {
  // Instead of using userId, we now get the quizId from the URL
  const { quizId } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch attempts for the given quiz using its quizId
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        // Call the endpoint that returns all attempts for the quiz
        const response = await axios.get(`http://localhost:8080/attempts/quiz/${quizId}`);
        setAttempts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attempts:", err);
        setError(err.message || "Error fetching attempts");
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [quizId]);

  const handleDetailed = (attemptId) => {
    navigate(`/quiz-attempt/view/${attemptId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p className="text-xl">Loading attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Attempts for Quiz {quizId}</h1>
        <table className="min-w-full bg-slate-800 rounded shadow">
          <thead>
            <tr>
              <th className="p-3 border-b border-slate-700 text-left">Attempt ID</th>
              <th className="p-3 border-b border-slate-700 text-left">Student ID</th>
              <th className="p-3 border-b border-slate-700 text-left">Student Name</th>
              <th className="p-3 border-b border-slate-700 text-left">Score</th>
              <th className="p-3 border-b border-slate-700 text-left">Start Time</th>
              <th className="p-3 border-b border-slate-700 text-left">End Time</th>
              <th className="p-3 border-b border-slate-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.attemptId} className="hover:bg-slate-700">
                <td className="p-3 border-b border-slate-700">{attempt.attemptId}</td>
                <td className="p-3 border-b border-slate-700">{attempt.studentId}</td>
                <td className="p-3 border-b border-slate-700">
                  {attempt.studentName ? attempt.studentName : "N/A"}
                </td>
                <td className="p-3 border-b border-slate-700">{attempt.score}</td>
                <td className="p-3 border-b border-slate-700">
                  {new Date(attempt.startTime).toLocaleString()}
                </td>
                <td className="p-3 border-b border-slate-700">
                  {attempt.endTime ? new Date(attempt.endTime).toLocaleString() : "In Progress"}
                </td>
                <td className="p-3 border-b border-slate-700">
                  <button
                    onClick={() => handleDetailed(attempt.attemptId)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Detailed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Centered Back Button */}
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

export default QuizAttemptsList;
