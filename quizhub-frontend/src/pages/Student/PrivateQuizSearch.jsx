import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PrivateQuizSearch() {
  const [code, setCode] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!code.trim()) {
      alert("Please enter a private quiz code.");
      return;
    }
    axios.get('http://localhost:8080/quizzes/private', { params: { code } })
      .then(response => {
        setQuiz(response.data);
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching private quiz:", error);
        setError("Quiz not found. Please check the code.");
        setQuiz(null);
      });
  };

  const handleTakeQuiz = (quizId) => {
    navigate(`/take-quiz/${quizId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Search Private Quiz</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter Private Quiz Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-2 rounded-l border border-slate-600 bg-slate-700 text-slate-200"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {quiz && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md">
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
      )}
      {/* Back button at the bottom */}
      <div className="mt-6">
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

export default PrivateQuizSearch;
