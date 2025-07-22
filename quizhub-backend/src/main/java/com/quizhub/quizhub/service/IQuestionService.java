package com.quizhub.quizhub.service;

import com.quizhub.quizhub.model.Question;

import java.util.List;
import java.util.Optional;

public interface IQuestionService {
    Question createQuestion(Question question, Long topicId, Long userId);
//    List<Question> getAllQuestions();
    Optional<Question> getQuestionById(Long id);
    Question updateQuestion(Long id, Question updatedData);
    void deleteQuestion(Long id);
//    List<Question> getQuestionsForTopic(Long topicId, int numOfQuestions);
//    Question assignQuestionToQuiz(Long questionId, Long quizId);
    List<Question> getQuestionsForUser(String userName);
}
