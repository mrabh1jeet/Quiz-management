package com.quizhub.quizhub.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizhub.quizhub.dto.FilteredQuizRequest;
import com.quizhub.quizhub.model.*;
import com.quizhub.quizhub.repository.QuizRepository;
import com.quizhub.quizhub.repository.QuestionRepository;
import com.quizhub.quizhub.repository.TopicRepository;
import com.quizhub.quizhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilteredQuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Creates a filtered quiz based on the provided filter criteria and user ID.
     * If fewer questions are available than requested (but at least one exists), the quiz is created with those available questions.
     * If no questions match the filters, an error is thrown.
     *
     * @param request the filtered quiz criteria.
     * @param userId  the ID of the user generating the quiz.
     * @return the created Quiz entity.
     * @throws Exception if any retrieval or conversion errors occur.
     */
    public Quiz createFilteredQuiz(FilteredQuizRequest request, Long userId) throws Exception {
        // 1. Retrieve the user generating the quiz.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Retrieve all topics for the provided topic IDs.
        List<Topic> topics = topicRepository.findAllById(request.getTopicIds());
        if (topics.isEmpty()) {
            throw new RuntimeException("No topics found for the provided IDs.");
        }

//        this is the error code
//3.
//        List<Question> allQuestions = questionRepository.findByTopic_IdIn(
//                request.getTopicIds(),
//                PageRequest.of(0, request.getNumberOfQuestions() * 2) // Fetch extra for randomness.
//        );

        // 3. Fetch questions that match the selected topics.
        DifficultyLevel difficultyEnum = DifficultyLevel.valueOf(request.getDifficulty().toUpperCase());
        List<Question> allQuestions = questionRepository.findByTopic_IdInAndDifficulty(
                request.getTopicIds(),
                difficultyEnum,
                PageRequest.of(0, request.getNumberOfQuestions() * 2) // Fetch extra for randomness
        );


//        this is for debuging the error for creating the hard level quiz
//        List<Question> allQuestions = questionRepository.findByTopic_IdIn(request.getTopicIds());


        if (allQuestions.isEmpty()) {
            throw new RuntimeException("No questions available for the selected topics.");
        }

        // 4. Filter questions based on difficulty.
        String requestedDifficulty = request.getDifficulty().toUpperCase(); // Convert to uppercase for enum comparison
        List<Question> filteredQuestions = allQuestions.stream()
                .filter(q -> q.getDifficulty() != null && q.getDifficulty().name().equalsIgnoreCase(requestedDifficulty))
                .collect(Collectors.toList());

        // 5. If no questions match, return an error (DO NOT CREATE A QUIZ).
        if (filteredQuestions.isEmpty()) {
            throw new RuntimeException("No questions available for difficulty: " + request.getDifficulty());
        }

        // 6. Randomize the filtered questions.
        Collections.shuffle(filteredQuestions);

        // 7. Determine the actual number of questions to use.
        int actualNumber = Math.min(request.getNumberOfQuestions(), filteredQuestions.size());
        List<Long> questionIds = filteredQuestions.stream()
                .limit(actualNumber)
                .map(Question::getId)
                .collect(Collectors.toList());

        if (questionIds.isEmpty()) {
            throw new RuntimeException("Error: No valid questions available after filtering.");
        }

        // 8. Convert question IDs and filter criteria to JSON.
        String questionIdsJson = objectMapper.writeValueAsString(questionIds);
        String filterCriteriaJson = objectMapper.writeValueAsString(request);

        // 9. Convert topic names to a comma-separated string.
        String topicsString = topics.stream()
                .map(Topic::getName)
                .collect(Collectors.joining(", "));

        // 10. Build and save the Quiz entity.
        Quiz quiz = Quiz.builder()
                .generatedBy(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .numberOfQuestions(actualNumber)
                .difficulty(request.getDifficulty())
                .topics(topicsString)
                .timeLimit(request.getTimeLimit() != null ? request.getTimeLimit() : 0)
                .questionIds(questionIdsJson)
                .visibility(QuizVisibility.FILTERED)
                .filterCriteria(filterCriteriaJson)
                .build();

        return quizRepository.save(quiz);
    }



//    /**
//     * Demonstrates how to update the questionIds field of an existing quiz.
//     *
//     * @param quizId     the ID of the quiz to update.
//     * @param questionId the question ID to add or remove.
//     * @param add        true to add the question, false to remove.
//     * @return the updated Quiz entity.
//     * @throws Exception if any conversion or retrieval errors occur.
//     */
//    public Quiz updateQuizQuestionIds(Long quizId, Long questionId, boolean add) throws Exception {
//        Quiz quiz = quizRepository.findById(quizId)
//                .orElseThrow(() -> new RuntimeException("Quiz not found"));
//
//        // Convert stored JSON string to a List<Long>
//        List<Long> questionIds = objectMapper.readValue(
//                quiz.getQuestionIds(),
//                objectMapper.getTypeFactory().constructCollectionType(List.class, Long.class)
//        );
//
//        if (add) {
//            if (!questionIds.contains(questionId)) {
//                questionIds.add(questionId);
//            }
//        } else {
//            questionIds.remove(questionId);
//        }
//        // Convert back to JSON string and update the quiz.
//        quiz.setQuestionIds(objectMapper.writeValueAsString(questionIds));
//        return quizRepository.save(quiz);
//    }
}
