package com.quizhub.quizhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who created the quiz (could be a student or an educator)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User generatedBy;

    // Optional fields for educator-created quizzes
    private String title;
    private String description;

    // Number of questions in the quiz.
    // For filtered quizzes, this is specified by the user.
    // For educator-created quizzes, it can be computed from the added questions.
    private Integer numberOfQuestions;

    // Overall difficulty (EASY, MEDIUM, HARD).
    // For filtered quizzes, this is selected by the user.
    // For educator-created quizzes, it can be set manually or derived.
    private String difficulty;

    // Topics included in the quiz.
    // For filtered quizzes, stored as a comma-separated string or JSON array of topic IDs.
    // For educator-created quizzes, this can be derived from the questions or set manually.
    private String topics;

    // Total time limit for the quiz, in seconds.
    private int timeLimit;

    // Instead of a join table, store the list of question IDs as a JSON string or CSV.
    // For example: "[5,12,17,23]" or "5,12,17,23"
    @Column(columnDefinition = "TEXT")
    private String questionIds;

    // Timestamp when the quiz is generated or created.
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // Visibility of the quiz: "FILTERED", "PUBLIC", or "PRIVATE"
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private QuizVisibility visibility = QuizVisibility.FILTERED;

    // For private quizzes, a unique code to secure access.
    private String privateCode;

    // For filtered quizzes: store the filter criteria (numberOfQuestions, difficulty, topics, timeLimit)
    // as a JSON string for later review or auditing.
    @Column(columnDefinition = "TEXT")
    private String filterCriteria;
}