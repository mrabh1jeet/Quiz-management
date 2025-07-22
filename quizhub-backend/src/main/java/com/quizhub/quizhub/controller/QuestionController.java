package com.quizhub.quizhub.controller;

import com.quizhub.quizhub.model.Question;
import com.quizhub.quizhub.repository.QuestionRepository;
import com.quizhub.quizhub.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    private final IQuestionService questionService;

//    Creation of question[]
    @PostMapping("/create")
    public ResponseEntity<Question> createQuestion(
            @RequestBody Question question,
            @RequestParam Long topicId,
            @RequestParam Long userId) {
        Question createdQuestion = questionService.createQuestion(question, topicId, userId);
        return ResponseEntity.status(CREATED).body(createdQuestion);
    }

//    @GetMapping("/all")
//    public ResponseEntity<List<Question>> getAllQuestions() {
//        return ResponseEntity.ok(questionService.getAllQuestions());
//    }

    // Getting the particular user questions[]
    @GetMapping("/get-questions")
    public ResponseEntity<?> getAllQuestionsOfUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName();
            List<Question> questions = questionService.getQuestionsForUser(userName);
            if (questions.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No questions found for user: " + userName);
            }
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching questions: " + e.getMessage());
        }
    }

    // Update a question (only if created by the authenticated user)[]
    @PutMapping("/update-question/{questionId}")
    public ResponseEntity<?> editQuestion(@PathVariable Long questionId, @RequestBody Question updatedQuestion) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Use getQuestionById from the service (not findById)
            Question existingQuestion = questionService.getQuestionById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            // Check if the authenticated user is the creator of the question
            if (!existingQuestion.getCreatedBy().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You do not have permission to edit this question.");
            }

            // Update fields (assuming the entire updatedQuestion is provided by the frontend)
            existingQuestion.setQuestionText(updatedQuestion.getQuestionText());
            existingQuestion.setQuestionType(updatedQuestion.getQuestionType());
            existingQuestion.setOptions(updatedQuestion.getOptions());
            existingQuestion.setCorrectOptions(updatedQuestion.getCorrectOptions());
            existingQuestion.setHint(updatedQuestion.getHint());
            existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
            existingQuestion.setTopic(updatedQuestion.getTopic());

            // Save the updated question using the service's update method
            Question savedQuestion = questionService.updateQuestion(questionId, existingQuestion);
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating question: " + e.getMessage());
        }
    }

    // Delete a question (only if created by the authenticated user)[]
    @DeleteMapping("/delete-question/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // Use getQuestionById from the service
            Question existingQuestion = questionService.getQuestionById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            // Verify that the authenticated user is the owner of the question
            if (!existingQuestion.getCreatedBy().getUsername().equals(username)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You do not have permission to delete this question.");
            }

            // Delete the question
            questionService.deleteQuestion(questionId);
            return ResponseEntity.ok("Question deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Question not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting question: " + e.getMessage());
        }
    }

//    this is detailed view of the question []
    @GetMapping("/get-question/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable("id") Long id) {
        try {
            Optional<Question> question = questionService.getQuestionById(id);
            if (question.isPresent()) {
                return ResponseEntity.ok(question.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Question with ID " + id + " not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching question: " + e.getMessage());
        }
    }

//  getting the questions for quiz attempt[]
    @GetMapping("/batch")
    public ResponseEntity<List<Question>> getQuestionsByIds(@RequestParam List<Long> ids) {
        List<Question> questions = questionRepository.findAllById(ids);
        return ResponseEntity.ok(questions);
    }

}
