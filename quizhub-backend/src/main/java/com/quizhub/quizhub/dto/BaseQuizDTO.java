package com.quizhub.quizhub.dto;

import com.quizhub.quizhub.model.Quiz;
import com.quizhub.quizhub.model.QuizVisibility;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseQuizDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private int timeLimit;
    private QuizVisibility visibility;
    private String topics;           // Common field for all types
    private Integer numberOfQuestions; // Common field for all types

    public BaseQuizDTO(Quiz quiz) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.description = quiz.getDescription();
        this.difficulty = quiz.getDifficulty();
        this.timeLimit = quiz.getTimeLimit();
        this.visibility = quiz.getVisibility();
        this.topics = quiz.getTopics();
        this.numberOfQuestions = quiz.getNumberOfQuestions();
    }
}
