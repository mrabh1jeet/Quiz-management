# 📚 QuizHub

**QuizHub** is a full-featured Quiz Management System designed for educational platforms. It supports **role-based user interaction with auth**, **quiz creation**, **public ,private and filtered quizzes**, **real-time quiz attempts**, and **detailed quiz attempt history** — all in one seamless experience.

Built with:
- 🖥️ **Frontend**: React
- ⚙️ **Backend**: Java Spring Boot (MVC Architecture)
- 💾 **Database**: MySQL

---

## 🚀 Major Features

### 👥 Role-Based User Management
- **Admin**: Manage all users.
- **Educator**: Create quizzes(Private and Public), view student analytics(quiz attempt history), add and manage questions.
- **Student**: Attempt quizzes, track performance, generate filtered quizzes.

### 📝 Quiz Creation
- Educators can create:
  - **MCQs**
  - **True/False Questions**
- Create **Public** and **Private Quizzes**:
  - Private quizzes require a **quiz code** to join.
  - Public quizzes are accessible to all users.
- Add **Hints** to questions (using them reduces score).
- Set **total time limit for Quiz**.

### 🎯 Filtered Quiz System
- Students can generate **custom quizzes** by selecting:
  - **Topic**
  - **Difficulty Level**
  - **Number of Questions**
  - **Time Per Question**
- Based on the selected filters, the system randomly pulls questions from the **public question pool**.

### 📈 Analytics Dashboard
- Educators can view detailed analytics of:
  - Quiz attempts
  - Detailed quiz attempt history by the Student

---

## 🧩 Minor Features

### 🧠 Hint System
- Each question can include a hint.
- Students can use hints at the cost of reduced points.

### ⏲️ Timer Functionality
- Total quiz time can be enforced.
- Time taken on that Question

### 🔍 Search Functionality for PrivateQuizzes
- Users can search quizzes by:
  - **The private Code Provided By the Educator**

### 🗃️ Question Bank Management
- Educators manage a question bank with:
  - Question & Options
  - Question type
  - Topic
  - Difficulty
  - Hints
---

## 🛠 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Frontend     | React              |
| Backend      | Java Spring Boot (MVC) |
| Database     | MySQL              |

---