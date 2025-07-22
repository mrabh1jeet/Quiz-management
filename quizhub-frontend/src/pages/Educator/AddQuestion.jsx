import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddQuestion() {
  const navigate = useNavigate();
  
  // Form state for new question.
  const [questionData, setQuestionData] = useState({
    questionText: '',
    questionType: 'MCQ', // MCQ or TRUE_FALSE
    difficulty: 'EASY',
    hint: '',
    topic: null,       // Will store the selected topic object
    // For MCQ: dynamic options; for TRUE_FALSE we'll ignore these.
    options: [''],
    // For MCQ: an array of option texts; for TRUE_FALSE, we'll store a single string.
    correctOptions: [],
  });
  
  // Topics state for the dropdown.
  const [topics, setTopics] = useState([]);
  // For inline "Add New Topic" feature.
  const [addingTopic, setAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios.get('http://localhost:8080/topics/getall-topics')
      .then(response => setTopics(response.data))
      .catch(error => console.error('Error fetching topics:', error));
  };

  // Handler for simple input changes.
  const handleInputChange = (field, value) => {
    setQuestionData(prev => ({
      ...prev,
      [field]: value,
    }));
    // When changing question type, reset options & correctOptions.
    if (field === 'questionType') {
      if (value === 'TRUE_FALSE') {
        setQuestionData(prev => ({
          ...prev,
          // For TRUE_FALSE, fixed options and no dynamic option input.
          options: ['True', 'False'],
          correctOptions: [],
        }));
      } else if (value === 'MCQ') {
        setQuestionData(prev => ({
          ...prev,
          options: [''],
          correctOptions: [],
        }));
      }
    }
  };

  // Handle topic dropdown changes.
  const handleTopicChange = (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setAddingTopic(true);
    } else {
      const topicId = parseInt(value, 10);
      const selectedTopic = topics.find(t => t.id === topicId);
      setQuestionData(prev => ({
        ...prev,
        topic: selectedTopic,
      }));
      setAddingTopic(false);
    }
  };

  // Handler for creating a new topic inline.
  const handleCreateTopic = () => {
    axios.post('http://localhost:8080/topics/create-topic', { name: newTopicName })
      .then(response => {
        fetchTopics();
        // Set the newly created topic as selected.
        setQuestionData(prev => ({
          ...prev,
          topic: response.data,
        }));
        setNewTopicName('');
        setAddingTopic(false);
      })
      .catch(error => console.error('Error creating new topic:', error));
  };

  // For MCQ: Handle change for option text.
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    // If the option text changes and it was selected as correct,
    // update its value in the correctOptions array.
    const oldValue = updatedOptions[index];
    updatedOptions[index] = value;
    setQuestionData(prev => ({
      ...prev,
      options: updatedOptions,
      correctOptions: prev.correctOptions.map(opt => (opt === oldValue ? value : opt))
    }));
  };

  // Add a new empty option field (only for MCQ).
  const handleAddOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  // For MCQ: Toggle correct option checkbox.
  const handleCheckboxChange = (option) => {
    let updatedCorrectOptions = questionData.correctOptions ? [...questionData.correctOptions] : [];
    if (updatedCorrectOptions.includes(option)) {
      updatedCorrectOptions = updatedCorrectOptions.filter(opt => opt !== option);
    } else {
      updatedCorrectOptions.push(option);
    }
    setQuestionData(prev => ({
      ...prev,
      correctOptions: updatedCorrectOptions,
    }));
  };

  // For TRUE_FALSE: Handle radio button change.
  const handleTrueFalseChange = (e) => {
    setQuestionData(prev => ({
      ...prev,
      correctOptions: [e.target.value],
    }));
  };

  // Submit handler for creating a new question.
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build payload using the fields expected by your endpoint.
    const payload = {
      questionText: questionData.questionText,
      questionType: questionData.questionType,
      difficulty: questionData.difficulty,
      hint: questionData.hint,
      // For MCQ, include options and correctOptions. For TRUE_FALSE, options are fixed.
      options: questionData.options,
      correctOptions: questionData.correctOptions,
    };

    if (!questionData.topic) {
      alert('Please select a topic.');
      return;
    }
    
    // Assuming userId is stored in localStorage.
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found!');
      return;
    }
    
    axios.post('http://localhost:8080/questions/create', payload, {
      params: {
        topicId: questionData.topic.id,
        userId: userId
      }
    })
    .then(response => {
      alert('Question created successfully!');
      navigate('/educator-dashboard');
    })
    .catch(error => {
      console.error('Error creating question:', error);
      alert('Error creating question. Please try again.');
    });
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-4">Add New Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
        {/* Question Text */}
        <div>
          <label className="block font-semibold mb-1">Question Text:</label>
          <textarea
            value={questionData.questionText}
            onChange={(e) => handleInputChange('questionText', e.target.value)}
            className="w-full p-2 rounded bg-slate-700"
            rows={3}
            required
          />
        </div>

        {/* Question Type */}
        <div>
          <label className="block font-semibold mb-1">Question Type:</label>
          <select
            value={questionData.questionType}
            onChange={(e) => handleInputChange('questionType', e.target.value)}
            className="w-full p-2 rounded bg-slate-700"
          >
            <option value="MCQ">MCQ</option>
            <option value="TRUE_FALSE">TRUE_FALSE</option>
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block font-semibold mb-1">Difficulty:</label>
          <select
            value={questionData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full p-2 rounded bg-slate-700"
          >
            <option value="EASY">EASY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HARD">HARD</option>
          </select>
        </div>

        {/* Hint */}
        <div>
          <label className="block font-semibold mb-1">Hint:</label>
          <textarea
            value={questionData.hint}
            onChange={(e) => handleInputChange('hint', e.target.value)}
            className="w-full p-2 rounded bg-slate-700"
            rows={2}
          />
        </div>

        {/* Topic Dropdown with "Add New Topic" */}
        <div>
          <label className="block font-semibold mb-1">Topic:</label>
          <select
            value={questionData.topic?.id || ''}
            onChange={handleTopicChange}
            className="w-full p-2 rounded bg-slate-700"
            required
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            <option value="add_new">Add New Topic...</option>
          </select>
          {addingTopic && (
            <div className="mt-2 flex items-center">
              <input
                type="text"
                placeholder="New Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="p-2 rounded bg-slate-700 mr-2"
                required
              />
              <button
                type="button"
                onClick={handleCreateTopic}
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Create Topic
              </button>
            </div>
          )}
        </div>

        {/* Options / True-False Selection */}
        {questionData.questionType === 'MCQ' ? (
          <div>
            <label className="block font-semibold mb-1">Options:</label>
            {questionData.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="p-2 rounded bg-slate-700 mr-2 flex-1"
                  required
                />
                <input
                  type="checkbox"
                  checked={questionData.correctOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="mr-1"
                />
                <span>Correct</span>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 mt-2"
            >
              Add Option
            </button>
          </div>
        ) : (
          // TRUE_FALSE: fixed radio buttons for "True" and "False"
          <div>
            <label className="block font-semibold mb-1">Select the Correct Answer:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="trueFalse"
                  value="True"
                  checked={questionData.correctOptions[0] === 'True'}
                  onChange={handleTrueFalseChange}
                  className="mr-1"
                />
                True
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="trueFalse"
                  value="False"
                  checked={questionData.correctOptions[0] === 'False'}
                  onChange={handleTrueFalseChange}
                  className="mr-1"
                />
                False
              </label>
            </div>
          </div>
        )}

        {/* Created By (Display Only) */}
        <div>
          <label className="block font-semibold mb-1">Created By:</label>
          <p className="p-2 rounded bg-slate-700">
            {localStorage.getItem('username') || 'Educator'}
          </p>
        </div>

        {/* Submit and Back Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-white"
          >
            Create Question
          </button>
          <button
            type="button"
            onClick={() => navigate('/educator-dashboard')}
            className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestion;
