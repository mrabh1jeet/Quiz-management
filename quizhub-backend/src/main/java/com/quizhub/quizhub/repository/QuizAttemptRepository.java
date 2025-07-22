package com.quizhub.quizhub.repository;

import com.quizhub.quizhub.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    // Find all attempts for a given quiz and student
    List<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);

    // Find all attempts for a given quiz and student where end_time is null (active attempt)
    List<QuizAttempt> findByQuizIdAndStudentIdAndEndTimeIsNull(Long quizId, Long studentId);

    List<QuizAttempt> findByStudentId(Long studentId);

    List<QuizAttempt> findByQuizId(Long quizId);

}
