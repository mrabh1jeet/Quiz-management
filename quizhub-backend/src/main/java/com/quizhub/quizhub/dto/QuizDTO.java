package com.quizhub.quizhub.dto;

import com.quizhub.quizhub.model.Quiz;
import com.quizhub.quizhub.model.QuizVisibility;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private int timeLimit;
    private Integer numberOfQuestions;
    private String topics;
    private QuizVisibility visibility;
    private Long userId;
    // New field for question IDs
    private String questionIds;

    // Constructor to map Quiz entity to DTO
    public QuizDTO(Quiz quiz) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.description = quiz.getDescription();
        this.difficulty = quiz.getDifficulty();
        this.timeLimit = quiz.getTimeLimit();
        this.numberOfQuestions = quiz.getNumberOfQuestions();
        this.topics = quiz.getTopics();
        this.visibility = quiz.getVisibility();
        this.userId = quiz.getGeneratedBy() != null ? quiz.getGeneratedBy().getId() : null;
        this.questionIds = quiz.getQuestionIds();
    }
}
