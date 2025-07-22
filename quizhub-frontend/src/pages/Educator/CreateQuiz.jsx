import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";

// Utility: generate a random 6-character alphanumeric code for private quizzes.
const generatePrivateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function QuizCreationForm() {
  const navigate = useNavigate();

  // ------------------
  // Quiz Details State
  // ------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [timeLimit, setTimeLimit] = useState(60);
  const [visibility, setVisibility] = useState("PUBLIC");
  const [privateCode, setPrivateCode] = useState("");
  const [topics, setTopics] = useState([]); // all available topics
  const [selectedTopicIds, setSelectedTopicIds] = useState([]); // multiple topics selected
  const [newTopicName, setNewTopicName] = useState("");
  const [addingTopic, setAddingTopic] = useState(false);

  // ------------------
  // Questions Section State
  // ------------------
  const [questionMode, setQuestionMode] = useState("EXISTING"); // "EXISTING" or "NEW"
  const [existingQuestions, setExistingQuestions] = useState([]); // fetched for logged-in educator
  const [selectedExistingQuestionIds, setSelectedExistingQuestionIds] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]); // array of newly created question objects

  // For inline new question form (for a single new question at a time)
  const [newQuestionData, setNewQuestionData] = useState({
    questionText: "",
    questionType: "MCQ", // or "TRUE_FALSE"
    hint: "",
    options: [""],
    correctOptions: [],
    topicId: "" // dropdown for topics (only those selected in quiz details)
  });

  // ------------------
  // Fetch Topics & Existing Questions
  // ------------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/topics/getall-topics")
      .then((response) => setTopics(response.data))
      .catch((error) => console.error("Error fetching topics:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/questions/get-questions")
      .then((response) => setExistingQuestions(response.data))
      .catch((error) => console.error("Error fetching existing questions:", error));
  }, []);

  // ------------------
  // Handlers for Quiz Details
  // ------------------
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleDifficultyChange = (e) => setDifficulty(e.target.value);
  const handleTimeLimitChange = (e) => setTimeLimit(parseInt(e.target.value, 10));
  const handleVisibilityChange = (e) => setVisibility(e.target.value);
  useEffect(() => {
    if (visibility === "PRIVATE") {
      setPrivateCode(generatePrivateCode());
    } else {
      setPrivateCode("");
    }
  }, [visibility]);

  // Topics: using checkboxes for multi-select
  const handleTopicCheckboxChange = (e) => {
    const topicId = parseInt(e.target.value, 10);
    if (e.target.checked) {
      setSelectedTopicIds((prev) => [...prev, topicId]);
    } else {
      setSelectedTopicIds((prev) => prev.filter((id) => id !== topicId));
    }
  };

  // Inline "Add New Topic" handler
  const handleAddNewTopic = () => {
    if (!newTopicName.trim()) {
      alert("Enter a valid topic name.");
      return;
    }
    axios
      .post("http://localhost:8080/topics/create-topic", { name: newTopicName })
      .then((response) => axios.get("http://localhost:8080/topics/getall-topics"))
      .then((res) => {
        setTopics(res.data);
        setNewTopicName("");
        setAddingTopic(false);
      })
      .catch((error) => console.error("Error creating new topic:", error));
  };

  // ------------------
  // Handlers for Questions Section
  // ------------------
  const handleQuestionModeChange = (mode) => {
    setQuestionMode(mode);
  };

  // Filter existing questions based on selected difficulty and topics.
  const filteredExistingQuestions = existingQuestions.filter((q) => {
    const diffMatch = q.difficulty === difficulty;
    const topicId = q.topic?.id || q.topic;
    const topicMatch = selectedTopicIds.includes(topicId);
    return diffMatch && topicMatch;
  });

  const handleSelectExistingQuestion = (e) => {
    const questionId = parseInt(e.target.value, 10);
    if (questionId && !selectedExistingQuestionIds.includes(questionId)) {
      setSelectedExistingQuestionIds((prev) => [...prev, questionId]);
    }
  };

  const removeExistingQuestion = (questionId) => {
    setSelectedExistingQuestionIds((prev) => prev.filter((id) => id !== questionId));
  };

  // New Question Handlers
  const handleNewQuestionInputChange = (field, value) => {
    setNewQuestionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewQuestionOptionChange = (index, value) => {
    const updatedOptions = [...newQuestionData.options];
    const oldValue = updatedOptions[index];
    updatedOptions[index] = value;
    // If old value was in correct options, replace it with new value.
    setNewQuestionData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctOptions: prev.correctOptions.map((opt) =>
        opt === oldValue ? value : opt
      )
    }));
  };

  // Add a new empty option for MCQ.
  const handleAddOption = () => {
    setNewQuestionData((prev) => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  // Remove an option at a given index.
  const handleRemoveOption = (index) => {
    setNewQuestionData((prev) => {
      const updatedOptions = [...prev.options];
      const removed = updatedOptions.splice(index, 1)[0];
      const updatedCorrect = prev.correctOptions.filter((opt) => opt !== removed);
      return {
        ...prev,
        options: updatedOptions,
        correctOptions: updatedCorrect
      };
    });
  };

  // For MCQ: Toggle correct option checkbox.
  const handleCheckboxChange = (option) => {
    let updatedCorrect = newQuestionData.correctOptions ? [...newQuestionData.correctOptions] : [];
    if (updatedCorrect.includes(option)) {
      updatedCorrect = updatedCorrect.filter((opt) => opt !== option);
    } else {
      updatedCorrect.push(option);
    }
    setNewQuestionData((prev) => ({
      ...prev,
      correctOptions: updatedCorrect
    }));
  };

  // For TRUE_FALSE: Handle radio button change.
  const handleTrueFalseChange = (e) => {
    setNewQuestionData((prev) => ({
      ...prev,
      correctOptions: [e.target.value]
    }));
  };

  // Handler to add a new question via API.
  const handleSubmitNewQuestion = () => {
    if (!newQuestionData.questionText.trim()) {
      alert("Question text cannot be empty.");
      return;
    }
    if (newQuestionData.questionType === "MCQ") {
      if (
        newQuestionData.options.length === 0 ||
        newQuestionData.options.every((opt) => !opt.trim())
      ) {
        alert("Please provide at least one option.");
        return;
      }
      if (newQuestionData.correctOptions.length === 0) {
        alert("Please select at least one correct option.");
        return;
      }
    }

    const payload = {
      questionText: newQuestionData.questionText,
      questionType: newQuestionData.questionType,
      difficulty: difficulty, // inherit from quiz details
      hint: newQuestionData.hint,
      options: newQuestionData.questionType === "MCQ" ? newQuestionData.options : [],
      correctOptions: newQuestionData.correctOptions
    };

    // For new questions, restrict topic selection to topics chosen in the quiz details.
    if (selectedTopicIds.length === 0) {
      alert("Please select at least one topic in the quiz details.");
      return;
    }
    // Let the educator choose one topic for the new question.
    if (!newQuestionData.topicId) {
      alert("Please select a topic for the new question.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    axios
      .post("http://localhost:8080/questions/create", payload, {
        params: { topicId: newQuestionData.topicId, userId: userId }
      })
      .then((response) => {
        if (response.data && response.data.id) {
          setNewQuestions((prev) => [...prev, response.data]);
          // Reset new question form
          setNewQuestionData({
            questionText: "",
            questionType: "MCQ",
            hint: "",
            options: [""],
            correctOptions: [],
            topicId: ""
          });
        } else {
          alert("New question was not created. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error creating question:", error);
        alert("Error creating question. Please try again.");
      });
  };

  // Handler to remove a new question from the quiz.
  // If the question exists in the database (has an id), call the delete endpoint.
  const handleRemoveNewQuestion = (questionId) => {
    axios
      .delete(`http://localhost:8080/questions/delete-question/${questionId}`)
      .then(() => {
        setNewQuestions((prev) => prev.filter((q) => q.id !== questionId));
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
        alert("Error deleting question.");
      });
  };

  // Total number of questions = existing questions selected + new questions added.
  const numberOfQuestions = selectedExistingQuestionIds.length + newQuestions.length;

  // Handler to submit the quiz creation form.
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || selectedTopicIds.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }
    if (numberOfQuestions === 0) {
      alert("Please add at least one question to the quiz.");
      return;
    }

    const payload = {
      title,
      description,
      numberOfQuestions,
      difficulty,
      topics: selectedTopicIds.join(","), // store as comma-separated string
      timeLimit,
      questionIds: JSON.stringify([
        ...selectedExistingQuestionIds,
        ...newQuestions.map((q) => q.id)
      ]),
      visibility,
      privateCode: visibility === "PRIVATE" ? privateCode : null,
      filterCriteria: null // not applicable for educator-created quizzes
    };

    const userId = localStorage.getItem("userId");
    axios
      .post("http://localhost:8080/quizzes/create", payload, {
        params: { userId: userId }
      })
      .then((response) => {
        alert("Quiz created successfully!");
        navigate("/educator-dashboard");
      })
      .catch((error) => {
        console.error("Error creating quiz:", error);
        alert("Error creating quiz. Please try again.");
      });
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
        <form onSubmit={handleQuizSubmit} className="space-y-4">
          {/* Quiz Details Section */}
          <div>
            <label className="block font-semibold mb-1">Title:</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-2 rounded bg-slate-700"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-2 rounded bg-slate-700"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Difficulty:</label>
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                className="w-full p-2 rounded bg-slate-700"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Time Limit (sec):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={handleTimeLimitChange}
                className="w-full p-2 rounded bg-slate-700"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Select Topics:</label>
            <div className="border border-slate-600 rounded p-2 bg-slate-700">
              {topics.map((t) => (
                <div key={t.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={t.id}
                    checked={selectedTopicIds.includes(t.id)}
                    onChange={handleTopicCheckboxChange}
                    className="mr-2"
                  />
                  <span>{t.name}</span>
                </div>
              ))}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setAddingTopic(true)}
                  className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                >
                  Add New Topic
                </button>
                {addingTopic && (
                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      placeholder="New Topic Name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      className="p-2 rounded bg-slate-600 mr-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAddNewTopic}
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                    >
                      Create Topic
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Visibility:</label>
            <select
              value={visibility}
              onChange={handleVisibilityChange}
              className="w-full p-2 rounded bg-slate-700"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
            {visibility === "PRIVATE" && (
              <div className="mt-2">
                <p className="text-sm">
                  Generated Private Code: <span className="font-bold">{privateCode}</span>
                </p>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">Number of Questions: {numberOfQuestions}</p>
          </div>

          {/* Questions Section */}
          <div className="border p-4 rounded bg-slate-800">
            <h2 className="text-2xl font-semibold mb-4">Questions</h2>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => handleQuestionModeChange("EXISTING")}
                className={`px-4 py-2 rounded ${questionMode === "EXISTING" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Add Existing Question
              </button>
              <button
                type="button"
                onClick={() => handleQuestionModeChange("NEW")}
                className={`px-4 py-2 rounded ${questionMode === "NEW" ? "bg-blue-600" : "bg-gray-600"}`}
              >
                Add New Question
              </button>
            </div>

            {questionMode === "EXISTING" && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Select Existing Question:</label>
                <select
                  onChange={handleSelectExistingQuestion}
                  className="w-full p-2 rounded bg-slate-700"
                >
                  <option value="">Select a question</option>
                  {existingQuestions
                    .filter(q => q.difficulty === difficulty && selectedTopicIds.includes(q.topic?.id || q.topic))
                    .map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.questionText} ({q.topic?.name || "No Topic"})
                      </option>
                    ))}
                </select>
                <div className="mt-2">
                  {selectedExistingQuestionIds.map((id) => (
                    <div key={id} className="flex items-center justify-between bg-slate-600 p-2 rounded mb-1">
                      <span>Question ID: {id}</span>
                      <button
                        type="button"
                        onClick={() => removeExistingQuestion(id)}
                        className="text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionMode === "NEW" && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Add New Question</h3>
                <div>
                  <label className="block">Question Text:</label>
                  <textarea
                    value={newQuestionData.questionText}
                    onChange={(e) => handleNewQuestionInputChange("questionText", e.target.value)}
                    className="w-full p-2 rounded bg-slate-700"
                    rows={2}
                    required
                  />
                </div>
                <div className="mt-2">
                  <label className="block">Question Type:</label>
                  <select
                    value={newQuestionData.questionType}
                    onChange={(e) =>
                      handleNewQuestionInputChange("questionType", e.target.value)
                    }
                    className="w-full p-2 rounded bg-slate-700"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="TRUE_FALSE">TRUE_FALSE</option>
                  </select>
                </div>
                <div className="mt-2">
                  <label className="block">Hint (optional):</label>
                  <input
                    type="text"
                    value={newQuestionData.hint}
                    onChange={(e) => handleNewQuestionInputChange("hint", e.target.value)}
                    className="w-full p-2 rounded bg-slate-700"
                  />
                </div>
                {/* Topic selection for new question */}
                <div className="mt-2">
                  <label className="block font-semibold mb-1">Select Topic for this Question:</label>
                  <select
                    value={newQuestionData.topicId}
                    onChange={(e) =>
                      handleNewQuestionInputChange("topicId", e.target.value)
                    }
                    className="w-full p-2 rounded bg-slate-700"
                    required
                  >
                    <option value="">Select a topic</option>
                    {topics
                      .filter(t => selectedTopicIds.includes(t.id))
                      .map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                {newQuestionData.questionType === "MCQ" && (
                  <div className="mt-2">
                    <label className="block font-semibold">Options:</label>
                    {newQuestionData.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleNewQuestionOptionChange(index, e.target.value)}
                          className="p-2 rounded bg-slate-700 mr-2 flex-1"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="text-red-400 mr-2"
                        >
                          Remove
                        </button>
                        <input
                          type="checkbox"
                          checked={newQuestionData.correctOptions.includes(option)}
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
                )}
                {newQuestionData.questionType === "TRUE_FALSE" && (
                  <div className="mt-2">
                    <p className="font-semibold">Select Correct Answer:</p>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trueFalseCorrect"
                          value="True"
                          checked={newQuestionData.correctOptions[0] === "True"}
                          onChange={(e) => handleNewQuestionInputChange("correctOptions", ["True"])}
                          className="mr-1"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trueFalseCorrect"
                          value="False"
                          checked={newQuestionData.correctOptions[0] === "False"}
                          onChange={(e) => handleNewQuestionInputChange("correctOptions", ["False"])}
                          className="mr-1"
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleSubmitNewQuestion}
                    className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-white"
                  >
                    Add New Question
                  </button>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold">New Questions Added:</h4>
                  {newQuestions.map((q) => (
                    <div key={q.id} className="bg-slate-600 p-2 rounded mt-1 flex justify-between items-center">
                      <span>{q.questionText}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewQuestion(q.id)}
                        className="text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizCreationForm;
