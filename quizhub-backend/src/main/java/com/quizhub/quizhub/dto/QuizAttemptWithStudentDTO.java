package com.quizhub.quizhub.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizAttemptWithStudentDTO {
    private Long attemptId;
    private Long quizId;
    private Long studentId;
    private String studentName; // additional field for the student's name
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Float score;
    private List<QuestionResponseDTO> responses; // assuming you have a DTO for responses
}
