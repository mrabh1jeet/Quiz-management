package com.quizhub.quizhub.dto;

import lombok.Data;
import java.util.List;

@Data
public class FilteredQuizRequest {
    // Optional title and description provided by the user
    private String title;
    private String description;

    // Number of questions the quiz should contain
    private Integer numberOfQuestions;

    // Overall difficulty level (e.g., EASY, MEDIUM, HARD)
    private String difficulty;

    // List of topic IDs to filter questions
    private List<Long> topicIds;

    // Optional time limit in seconds
    private Integer timeLimit;
}
