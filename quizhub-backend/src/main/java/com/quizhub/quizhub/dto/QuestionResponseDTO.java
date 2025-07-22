package com.quizhub.quizhub.dto;

import lombok.Data;

@Data
public class QuestionResponseDTO {
    private Long responseId;
    private Long questionId;
    private String studentResponse;
    private Boolean isCorrect;
    private Boolean hintUsed;
    private Float score;
    private Integer timeTaken;
    private String correctAnswer; // A comma-separated string if multiple answers exist.
}
