package com.quizhub.quizhub.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long responseId;

    private Long questionId;
    private String studentResponse;
    private Boolean isCorrect;
    private Boolean hintUsed;
    private Float score;
    private Integer timeTaken;

    @ManyToOne
    @JoinColumn(name = "attempt_id", nullable = false)
    @JsonBackReference
    private QuizAttempt quizAttempt;

    // saveResponse() could be implemented in the service layer after persisting
}
