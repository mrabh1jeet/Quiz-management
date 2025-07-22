import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hintsUsed, setHintsUsed] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  const displayStartTimeRef = useRef(new Date());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizResponse = await axios.get(`http://localhost:8080/quizzes/details/${quizId}`);
        let quizData = quizResponse.data;

        if (!quizData.questions && quizData.questionIds) {
          let questionIds = [];
          try {
            questionIds = JSON.parse(quizData.questionIds);
          } catch (parseError) {
            throw new Error("Error parsing question IDs.");
          }
          if (questionIds.length > 0) {
            const questionsResponse = await axios.get(`http://localhost:8080/questions/batch`, {
              params: { ids: questionIds },
              paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            });
            quizData.questions = questionsResponse.data;
          }
        }

        if (!quizData.questions || quizData.questions.length === 0) {
          throw new Error("No questions available for this quiz.");
        }

        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit);
        displayStartTimeRef.current = new Date();
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message || "Error loading quiz. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (quiz && currentQuestionIndex > 0) {
      const previousQuestion = quiz.questions[currentQuestionIndex - 1];
      const previousQuestionId = previousQuestion.id;
      const now = new Date();
      const timeSpentSeconds = Math.floor((now - displayStartTimeRef.current) / 1000);

      setQuestionTimes(prevTimes => ({
        ...prevTimes,
        [previousQuestionId]: (prevTimes[previousQuestionId] || 0) + timeSpentSeconds
      }));

      displayStartTimeRef.current = now;
    }
  }, [currentQuestionIndex, quiz]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleHint = (questionId) => {
    setHintsUsed(prev => ({ ...prev, [questionId]: true }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      const currentQuestionId = currentQuestion.id;
      const now = new Date();
      const timeSpentSeconds = Math.floor((now - displayStartTimeRef.current) / 1000);
      setQuestionTimes(prev => ({
        ...prev,
        [currentQuestionId]: (prev[currentQuestionId] || 0) + timeSpentSeconds
      }));

      const responses = quiz.questions.map(question => {
        const qId = question.id;
        return {
          questionId: qId,
          studentResponse: answers[qId] || "",
          hintUsed: hintsUsed[qId] || false,
          timeTaken: questionTimes[qId] || 0
        };
      });

      let currentAttemptId = attemptId;
      if (!currentAttemptId) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error("User not logged in.");
        }
        const attemptResponse = await axios.post(`http://localhost:8080/attempts/start`, null, {
          params: { quizId, studentId: userId }
        });
        currentAttemptId = attemptResponse.data.attemptId;
        setAttemptId(currentAttemptId);
      }

      console.log('Submitting responses:', responses, 'for attemptId:', currentAttemptId);
      await axios.post(`http://localhost:8080/attempts/submit`, responses, {
        params: { attemptId: currentAttemptId }
      });
      navigate(`/quiz-attempt/view/${currentAttemptId}`);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Error submitting quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading quiz...</p>
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
        <p className="text-xl">No questions available for this quiz.</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <div className="mb-4">
          <span className="text-lg">
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
          </span>
        </div>

        <div className="bg-slate-800 p-6 rounded shadow mb-4">
          <h2 className="text-2xl font-semibold mb-2 flex items-center justify-between">
            <span>
              Question {currentQuestionIndex + 1}: {currentQuestion.questionText || currentQuestion.content}
            </span>
            {currentQuestion.difficulty && (
              <span className={`
                px-2 py-1 rounded text-sm font-semibold
                ${currentQuestion.difficulty.toUpperCase() === 'EASY' ? 'bg-green-600/20 text-green-400' :
                  currentQuestion.difficulty.toUpperCase() === 'MEDIUM' ? 'bg-yellow-600/20 text-yellow-400' :
                  'bg-red-600/20 text-red-400'}
              `}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            )}
          </h2>
          {currentQuestion.hint && (
            <div className="mb-4">
              <button
                onClick={() => handleHint(currentQuestion.id)}
                disabled={hintsUsed[currentQuestion.id]}
                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm mr-2"
              >
                {hintsUsed[currentQuestion.id] ? 'Hint Used' : 'Show Hint'}
              </button>
              {hintsUsed[currentQuestion.id] && (
                <div className="mt-2 p-3 bg-yellow-800 rounded">
                  <p><strong>Hint:</strong> {currentQuestion.hint}</p>
                  <p className="text-xs text-yellow-300 mt-1">Note: Using a hint reduces your score by 25%</p>
                </div>
              )}
            </div>
          )}
          <div>
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((option, idx) => (
                <div key={idx} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-red-400">No options available for this question.</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
          >
            Previous
          </button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;
