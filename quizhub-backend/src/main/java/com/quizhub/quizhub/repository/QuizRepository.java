package com.quizhub.quizhub.repository;

import com.quizhub.quizhub.model.Quiz;
import com.quizhub.quizhub.model.QuizVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    // Using generatedBy.id to fetch quizzes for a specific user
    List<Quiz> findByGeneratedBy_Id(Long userId);

    // Fetch a quiz by its id and by the id of the user who generated it
    Optional<Quiz> findByIdAndGeneratedBy_Id(Long id, Long userId);

    // Get all quizzes
    List<Quiz> findAll();

    // Get filtered quizzes for a specific user
    List<Quiz> findByGeneratedBy_IdAndVisibility(Long userId, QuizVisibility visibility);

    List<Quiz> findByVisibility(QuizVisibility visibility);

    Optional<Quiz> findByPrivateCode(String privateCode);


}
