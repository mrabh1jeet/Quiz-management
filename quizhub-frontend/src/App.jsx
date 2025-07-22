// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Registration from './pages/Registration';


// // educator
// import EducatorQuizzesList from './pages/Educator/EducatorQuizzesList';
// import EducatorDashboard from './pages/Educator/EducatorDashboard';
// import Question from './pages/Educator/Questions'
// import AddQuestion from './pages/Educator/AddQuestion';
// import CreateQuiz from './pages/Educator/CreateQuiz'
// import QuizHistoryDisplay from './pages/Educator/QuizHistoryDisplay';

// // student
// import StudentDashboard from './pages/Student/StudentDashboard';
// import CreateFilteredQuiz from './pages/Student/CreateFilteredQuiz';
// import FilteredQuiz from './pages/Student/FilteredQuiz';
// import QuizAttempt from './pages/Student/QuizAttempt';
// import QuizAttemptsList from './pages/Student/QuizAttemptsList';
// import QuizAttemptView from './pages/Student/QuizAttemptView';
// import PublicQuizList from './pages/Student/PublicQuizList';
// import PrivateQuizSearch from './pages/Student/PrivateQuizSearch';

// // Admin
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import ManageUsers from './pages/Admin/ManageUsers';


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Registration />} />

//       {/* student */}
//       <Route path="/student-dashboard" element={<StudentDashboard/>} />
//       <Route path='/create-filtered-quiz' element={<CreateFilteredQuiz/>} />
//       <Route path='/filtered-quiz' element={<FilteredQuiz/>}/>
//       <Route path="private-quiz" element={<PrivateQuizSearch/>} />
//       <Route path="public-quiz" element={<PublicQuizList/>} />
//       <Route path="/take-quiz/:quizId" element={<QuizAttempt />} />
//       <Route path="/my-quiz-attempts" element={<QuizAttemptsList/>} />
//       <Route path="/quiz-attempt/view/:attemptId" element={<QuizAttemptView/>} />


//       {/* educator */}
//       <Route path="/educator-dashboard" element={<EducatorDashboard/>}/>
//       <Route path="/add-question" element={<AddQuestion/>} />
//       <Route path="/create-quiz" element={<CreateQuiz/>} />
//       <Route path="/my-quizzes" element={<EducatorQuizzesList/>} />
//       <Route path="/my-questions" element={<Question/>} />
//       <Route path="/quiz-details/:quizId" element={<QuizHistoryDisplay/>}/>

//       {/* Admin */}
//       <Route path="/admin-dashboard" element={<AdminDashboard />} />
//       <Route path="/manage-users" element={<ManageUsers />} />
      
//     </Routes>
//   );
// }

// export default App;


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute

// educator
import EducatorQuizzesList from './pages/Educator/EducatorQuizzesList';
import EducatorDashboard from './pages/Educator/EducatorDashboard';
import Question from './pages/Educator/Questions';
import AddQuestion from './pages/Educator/AddQuestion';
import CreateQuiz from './pages/Educator/CreateQuiz';
import QuizHistoryDisplay from './pages/Educator/QuizHistoryDisplay';

// student
import StudentDashboard from './pages/Student/StudentDashboard';
import CreateFilteredQuiz from './pages/Student/CreateFilteredQuiz';
import FilteredQuiz from './pages/Student/FilteredQuiz';
import QuizAttempt from './pages/Student/QuizAttempt';
import QuizAttemptsList from './pages/Student/QuizAttemptsList';
import QuizAttemptView from './pages/Student/QuizAttemptView';
import PublicQuizList from './pages/Student/PublicQuizList';
import PrivateQuizSearch from './pages/Student/PrivateQuizSearch';

// Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import AdminRegistration from './pages/Admin/AdminRegistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Student Routes (Protected) */}
      <Route
        path="/student-dashboard"
        element={<ProtectedRoute element={StudentDashboard} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/create-filtered-quiz"
        element={<ProtectedRoute element={CreateFilteredQuiz} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/filtered-quiz"
        element={<ProtectedRoute element={FilteredQuiz} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/private-quiz"
        element={<ProtectedRoute element={PrivateQuizSearch} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/public-quiz"
        element={<ProtectedRoute element={PublicQuizList} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/take-quiz/:quizId"
        element={<ProtectedRoute element={QuizAttempt} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/my-quiz-attempts"
        element={<ProtectedRoute element={QuizAttemptsList} allowedRoles={["STUDENT"]} />}
      />
      <Route
        path="/quiz-attempt/view/:attemptId"
        element={<ProtectedRoute element={QuizAttemptView} allowedRoles={["STUDENT", "EDUCATOR"]} />}
      />

      {/* Educator Routes (Protected) */}
      <Route
        path="/educator-dashboard"
        element={<ProtectedRoute element={EducatorDashboard} allowedRoles={["EDUCATOR"]} />}
      />
      <Route
        path="/add-question"
        element={<ProtectedRoute element={AddQuestion} allowedRoles={["EDUCATOR"]} />}
      />
      <Route
        path="/create-quiz"
        element={<ProtectedRoute element={CreateQuiz} allowedRoles={["EDUCATOR"]} />}
      />
      <Route
        path="/my-quizzes"
        element={<ProtectedRoute element={EducatorQuizzesList} allowedRoles={["EDUCATOR"]} />}
      />
      <Route
        path="/my-questions"
        element={<ProtectedRoute element={Question} allowedRoles={["EDUCATOR"]} />}
      />
      <Route
        path="/quiz-details/:quizId"
        element={<ProtectedRoute element={QuizHistoryDisplay} allowedRoles={["EDUCATOR"]} />}
      />

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute element={AdminDashboard} allowedRoles={["ADMIN"]} />}
      />
      <Route
        path="/manage-users"
        element={<ProtectedRoute element={ManageUsers} allowedRoles={["ADMIN"]} />}
      />
      <Route
        path="/add-admin"
        element={<ProtectedRoute element={AdminRegistration} allowedRoles={["ADMIN"]} />}
      />
    </Routes>
  );
}

export default App;
