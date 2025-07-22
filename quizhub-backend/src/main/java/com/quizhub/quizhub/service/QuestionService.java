package com.quizhub.quizhub.service;

import com.quizhub.quizhub.model.Question;
import com.quizhub.quizhub.model.Topic;
import com.quizhub.quizhub.model.User;
import com.quizhub.quizhub.repository.QuestionRepository;
import com.quizhub.quizhub.repository.QuizRepository;
import com.quizhub.quizhub.repository.TopicRepository;
import com.quizhub.quizhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService implements IQuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private final UserRepository userRepository;

    @Override
    public Question createQuestion(Question question, Long topicId, Long userId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        User educator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Educator not found"));

        question.setTopic(topic);
        question.setCreatedBy(educator);

        return questionRepository.save(question);
    }

//    @Override
//    public List<Question> getAllQuestions() {
//        return questionRepository.findAll();
//    }

    @Override
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }

    @Override
    public Question updateQuestion(Long id, Question updatedData) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setQuestionText(updatedData.getQuestionText());
                    question.setOptions(updatedData.getOptions());
                    question.setCorrectOptions(updatedData.getCorrectOptions());
                    question.setHint(updatedData.getHint());
                    return questionRepository.save(question);
                })
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

//    @Override
//    public List<Question> getQuestionsForTopic(Long topicId, int numOfQuestions) {
//        Topic topic = topicRepository.findById(topicId)
//                .orElseThrow(() -> new RuntimeException("Topic not found"));
//
//        return questionRepository.findByTopic(topic, PageRequest.of(0, numOfQuestions));
//    }

//    @Override
//    public Question assignQuestionToQuiz(Long questionId, Long quizId) {
//        Question question = questionRepository.findById(questionId)
//                .orElseThrow(() -> new RuntimeException("Question not found"));
//
//        Quiz quiz = quizRepository.findById(quizId)
//                .orElseThrow(() -> new RuntimeException("Quiz not found"));
//
//        quiz.getQuestions().add(question);
//        quizRepository.save(quiz);
//
//        return question;
//    }

    //the questions accessed by the users who created
    @Override
    public List<Question> getQuestionsForUser(String username) {
        try {
            // Fetch the user based on the username
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Fetch questions associated with the user's ID
            return questionRepository.findByCreatedBy_Id(user.getId());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching questions for user: " + username, e);
        }
    }


}
