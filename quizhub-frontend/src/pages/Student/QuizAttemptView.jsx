import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizAttemptView() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attemptDetails, setAttemptDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user role from localStorage (Assuming it's stored after login)
  const userRole = localStorage.getItem("role"); // 'STUDENT' or 'EDUCATOR'

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/attempts/${attemptId}`);
        setAttemptDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching attempt details:", err);
        setError(err.message || "Error fetching attempt details");
        setLoading(false);
      }
    };

    fetchAttemptDetails();
  }, [attemptId]);

  const handleBack = () => {
    if (userRole === "STUDENT") {
      navigate("/my-quiz-attempts"); // Redirect student to student dashboard
    } else if (userRole === "EDUCATOR") {
      navigate("/educator-dashboard"); // Redirect educator to educator dashboard
    } else {
      navigate(-1); // Default fallback (go back one step)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p>Loading attempt details...</p>
      </div>
    );
  }

  if (error || !attemptDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <p className="text-red-500">{error || "No attempt details found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Attempt Details</h1>
        <div className="bg-slate-800 p-4 rounded mb-4">
          <p><strong>Attempt ID:</strong> {attemptDetails.attemptId}</p>
          <p><strong>Quiz ID:</strong> {attemptDetails.quizId}</p>
          <p><strong>Quiz Title:</strong> {attemptDetails.quizTitle}</p>
          <p><strong>Description:</strong> {attemptDetails.quizDescription}</p>
          <p><strong>Visibility:</strong> {attemptDetails.quizVisibility}</p>
          <p><strong>Score:</strong> {attemptDetails.score}</p>
          <p><strong>Start Time:</strong> {new Date(attemptDetails.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {attemptDetails.endTime ? new Date(attemptDetails.endTime).toLocaleString() : "In Progress"}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Responses:</h2>
        <ul className="bg-slate-800 p-4 rounded">
          {attemptDetails.responses.map(response => (
            <li key={response.responseId} className="border-b border-slate-700 py-2">
              <p><strong>Question ID:</strong> {response.questionId}</p>
              <p><strong>Your Answer:</strong> {response.studentResponse}</p>
              <p><strong>Correct Answer:</strong> {response.correctAnswer}</p>
              <p><strong>Score:</strong> {response.score}</p>
              <p><strong>Time Taken:</strong> {response.timeTaken} sec</p>
              <p><strong>Hint Used:</strong> {response.hintUsed ? "Yes" : "No"}</p>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizAttemptView;
