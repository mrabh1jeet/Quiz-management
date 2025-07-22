//package com.quizhub.quizhub.dto;
//
//import lombok.Data;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Data
//public class QuizAttemptDTO {
//    private Long attemptId;
//    private Long quizId;
//    private String quizTitle;
//    private String quizDescription;
//    private String quizVisibility;
//    private Long studentId;
//    private LocalDateTime startTime;
//    private LocalDateTime endTime;
//    private Float score;
//    private List<QuestionResponseDTO> responses;
//}

package com.quizhub.quizhub.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuizAttemptDTO {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private String quizDescription;
    private String quizVisibility;
    private Long studentId;
    private String studentName; // NEW field for student name
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Float score;
    private List<QuestionResponseDTO> responses;
}
