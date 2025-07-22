// CreateFilteredQuiz.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Adjust as needed

const CreateFilteredQuiz = () => {
  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [timeLimit, setTimeLimit] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]); // will store numbers
  const [message, setMessage] = useState('');

  // Assume userId is available (replace with auth context if needed)
  const userId = localStorage.getItem('userId');

  // Fetch available topics from the new endpoint on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/topics/getall-topics`);
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
    fetchTopics();
  }, []);

  // Handle checkbox selection for topics (storing as numbers)
  const handleTopicChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const checked = e.target.checked;
    if (checked) {
      setSelectedTopics([...selectedTopics, value]);
    } else {
      setSelectedTopics(selectedTopics.filter((id) => id !== value));
    }
  };

  // Submit the filtered quiz form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredQuizRequest = {
      title,
      description,
      numberOfQuestions: Number(numberOfQuestions),
      difficulty,
      topicIds: selectedTopics,
      timeLimit: timeLimit ? Number(timeLimit) : 0,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/quizzes/filtered?userId=${userId}`,
        filteredQuizRequest
      );
      setMessage(`Quiz created successfully with ID: ${response.data.id}`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setMessage('Error creating quiz. Please adjust your filters.');
    }
    // console.log(filteredQuizRequest);
  };

  // Function for navigating back using browser history
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen">
      <section className="py-16">
        <div className="container mx-auto px-5 max-w-7xl">
          <h1 className="text-3xl font-bold text-center mb-8">Create a Filtered Quiz</h1>
          <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-md shadow-md">
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Title (optional):</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:border-indigo-600"
                placeholder="Enter quiz title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Description (optional):</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:border-indigo-600"
                placeholder="Enter quiz description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Number of Questions:</label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                required
                className="w-full p-2 rounded bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:border-indigo-600"
                placeholder="e.g. 3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:border-indigo-600"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Select Topics:</label>
              <div className="border border-slate-600 rounded p-2 bg-slate-700">
                {topics.length > 0 ? (
                  topics.map((topic) => (
                    <div key={topic.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={topic.id}
                        onChange={handleTopicChange}
                        className="mr-2"
                      />
                      <span>{topic.name}</span>
                    </div>
                  ))
                ) : (
                  <p>Loading topics...</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Time Limit (seconds, optional):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full p-2 rounded bg-slate-700 text-slate-200 border border-slate-600 focus:outline-none focus:border-indigo-600"
                placeholder="e.g. 60"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors"
            >
              Create Quiz
            </button>
          </form>
          {message && <p className="mt-4 text-center text-lg">{message}</p>}
          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateFilteredQuiz;
