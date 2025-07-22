package com.quizhub.quizhub.service;

import com.quizhub.quizhub.dto.QuestionResponseDTO;
import com.quizhub.quizhub.dto.QuizAttemptDTO;
import com.quizhub.quizhub.dto.QuizAttemptWithStudentDTO;
import com.quizhub.quizhub.model.*;
import com.quizhub.quizhub.repository.*;
import com.quizhub.quizhub.strategy.AdvancedScoringStrategy;
import com.quizhub.quizhub.strategy.ScoringStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.SpringVersion;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private QuestionResponseRepository questionResponseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ScoringStrategy scoringStrategy;

    @Autowired
    private AdvancedScoringStrategy advancedScoringStrategy;


    public QuizAttempt startQuiz(Long quizId, Long studentId) {
        // Check for an existing active attempt to prevent duplicate entries
        List<QuizAttempt> activeAttempts = quizAttemptRepository.findByQuizIdAndStudentIdAndEndTimeIsNull(quizId, studentId);

        // If there's an active attempt, return it instead of creating a new one
        if (!activeAttempts.isEmpty()) {
            return activeAttempts.get(0);
        }

        // Create a new attempt if no active attempt exists
        QuizAttempt attempt = QuizAttempt.builder()
                .quizId(quizId)
                .studentId(studentId)
                .startTime(LocalDateTime.now())
                .build();
        return quizAttemptRepository.save(attempt);
    }

    public QuizAttempt submitQuiz(Long attemptId, List<QuestionResponse> responses) {
        // Log the attempt ID and responses for debugging
        System.out.println("Processing submission for attemptId: " + attemptId);
        System.out.println("Number of responses: " + (responses != null ? responses.size() : 0));

        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        // Set end time for the attempt
        LocalDateTime endTime = LocalDateTime.now();
        attempt.setEndTime(endTime);

        float totalScore = 0F;

        // For each response, calculate a score, set timeTaken, and mark correctness
        for (QuestionResponse response : responses) {
            // Get the question from the repository
            Optional<Question> questionOpt = questionRepository.findById(response.getQuestionId());

            if (questionOpt.isPresent()) {
                Question question = questionOpt.get();
                boolean isCorrect = false;
                float score = 0F;

                // Check if the student response is correct based on question type
                if (response.getStudentResponse() != null && !response.getStudentResponse().trim().isEmpty()) {
                    List<String> correctOptions = question.getCorrectOptions();

                    if (question.getQuestionType() == QuestionType.TRUE_FALSE) {
                        // For TRUE_FALSE questions, direct comparison
                        isCorrect = correctOptions.contains(response.getStudentResponse().trim());
                    } else if (question.getQuestionType() == QuestionType.MCQ) {
                        // For MCQ questions, check if the selected option is in the correct options
                        isCorrect = correctOptions.contains(response.getStudentResponse().trim());
                    }

                    // Calculate score based on difficulty and correctness using the scoring strategy
                    if (isCorrect) {
                        boolean hintUsed = response.getHintUsed() != null && response.getHintUsed();
                        score = advancedScoringStrategy.calculateScore(question.getDifficulty(), hintUsed);
                    }
                }

                totalScore += score;
            

                // Calculate time taken for this question in seconds
                // Each response should have its own time tracking
                int timeTaken = 0;
                if (response.getTimeTaken() != null) {
                    // If timeTaken is already set in the response, use that value
                    timeTaken = response.getTimeTaken();
                } else if (attempt.getStartTime() != null && endTime != null) {
                    // Fallback to calculating from attempt start to end time
                    // This is not ideal as it doesn't track per-question time
                    Duration duration = Duration.between(attempt.getStartTime(), endTime);
                    timeTaken = (int) duration.getSeconds();
                }

                // Set the calculated values
                response.setIsCorrect(isCorrect);
                response.setScore(score);
                response.setTimeTaken(timeTaken);
            } else {
                // Question not found, set default values
                response.setIsCorrect(false);
                response.setScore(0F);
                response.setTimeTaken(0);
            }

            // Associate the response with the current attempt
            response.setQuizAttempt(attempt);
        }

        // Set responses in the attempt object
        attempt.setResponses(responses);

        // Set total score for the attempt
        attempt.setScore(totalScore);

        // Save the attempt first to ensure it exists in the database
        attempt = quizAttemptRepository.save(attempt);

        // Save all responses
        questionResponseRepository.saveAll(responses);

        return attempt;
    }

    public List<QuizAttempt> getAttemptsByQuizAndStudent(Long quizId, Long studentId) {
        return quizAttemptRepository.findByQuizIdAndStudentId(quizId, studentId);
    }


    // New method: Get all attempts for a given student
    public List<QuizAttempt> getAttemptsByStudent(Long studentId) {
        return quizAttemptRepository.findByStudentId(studentId);
    }


    public List<QuizAttemptDTO> getAttemptsWithQuizInfo(Long studentId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(studentId);
        return attempts.stream().map(attempt -> {
            QuizAttemptDTO dto = new QuizAttemptDTO();
            dto.setAttemptId(attempt.getAttemptId());
            dto.setQuizId(attempt.getQuizId());
            dto.setStudentId(attempt.getStudentId());
            dto.setStartTime(attempt.getStartTime());
            dto.setEndTime(attempt.getEndTime());
            dto.setScore(attempt.getScore());
            // Fetch quiz details for each attempt
            Optional<Quiz> quizOpt = quizRepository.findById(attempt.getQuizId());
            if (quizOpt.isPresent()) {
                dto.setQuizTitle(quizOpt.get().getTitle());
                dto.setQuizVisibility(quizOpt.get().getVisibility().name());
            } else {
                dto.setQuizTitle("N/A");
                dto.setQuizVisibility("N/A");
            }
            return dto;
        }).collect(Collectors.toList());
    }


    public void deleteAttempt(Long attemptId) {
        quizAttemptRepository.deleteById(attemptId);
    }


    public QuizAttemptDTO getAttemptDetails(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found with ID: " + attemptId));

        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setAttemptId(attempt.getAttemptId());
        dto.setQuizId(attempt.getQuizId());
        dto.setStudentId(attempt.getStudentId());
        dto.setStartTime(attempt.getStartTime());
        dto.setEndTime(attempt.getEndTime());
        dto.setScore(attempt.getScore());

        // Fetch quiz details using the quizId stored in the attempt
        Optional<Quiz> quizOpt = quizRepository.findById(attempt.getQuizId());
        if (quizOpt.isPresent()) {
            Quiz quiz = quizOpt.get();
            dto.setQuizTitle(quiz.getTitle());
            dto.setQuizDescription(quiz.getDescription());
            dto.setQuizVisibility(quiz.getVisibility().name());
        } else {
            dto.setQuizTitle("N/A");
            dto.setQuizDescription("N/A");
            dto.setQuizVisibility("N/A");
        }

        // Fetch student name using studentId
        Optional<User> userOpt = userRepository.findById(attempt.getStudentId());
        dto.setStudentName(userOpt.map(User::getUsername).orElse("N/A"));

        // Map each QuestionResponse to a DTO including correct answers
        List<QuestionResponseDTO> responseDTOs = attempt.getResponses().stream().map(response -> {
            QuestionResponseDTO rDto = new QuestionResponseDTO();
            rDto.setResponseId(response.getResponseId());
            rDto.setQuestionId(response.getQuestionId());
            rDto.setStudentResponse(response.getStudentResponse());
            rDto.setIsCorrect(response.getIsCorrect());
            rDto.setHintUsed(response.getHintUsed());
            rDto.setScore(response.getScore());
            rDto.setTimeTaken(response.getTimeTaken());

            // Fetch the question to obtain correct answer(s)
            Optional<Question> qOpt = questionRepository.findById(response.getQuestionId());
            if (qOpt.isPresent()) {
                Question q = qOpt.get();
                List<String> correctOptions = q.getCorrectOptions();
                rDto.setCorrectAnswer(String.join(", ", correctOptions));
            } else {
                rDto.setCorrectAnswer("N/A");
            }
            return rDto;
        }).collect(Collectors.toList());

        dto.setResponses(responseDTOs);

        return dto;
    }

    public List<QuizAttemptWithStudentDTO> getAttemptsByQuizWithStudentName(Long quizId) {
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(quizId);
        return attempts.stream().map(attempt -> {
            QuizAttemptWithStudentDTO dto = new QuizAttemptWithStudentDTO();
            dto.setAttemptId(attempt.getAttemptId());
            dto.setQuizId(attempt.getQuizId());
            dto.setStudentId(attempt.getStudentId());
            dto.setStartTime(attempt.getStartTime());
            dto.setEndTime(attempt.getEndTime());
            dto.setScore(attempt.getScore());
            // Map responses if needed; otherwise, you can leave this empty or map them via a helper method.
            // For example:
            // dto.setResponses(mapQuestionResponses(attempt.getResponses()));
            // Now, fetch the student's name
            Optional<User> userOpt = userRepository.findById(attempt.getStudentId());
            dto.setStudentName(userOpt.map(User::getUsername).orElse("N/A"));
            return dto;
        }).collect(Collectors.toList());
    }

}