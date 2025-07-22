package com.quizhub.quizhub.service;

import com.quizhub.quizhub.dto.QuizDTO;
import com.quizhub.quizhub.model.Quiz;
import com.quizhub.quizhub.model.QuizVisibility;
import com.quizhub.quizhub.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuizService implements IQuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Override
    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @Override
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getFilteredQuizzesByUser(Long userId) {
        return quizRepository.findByGeneratedBy_IdAndVisibility(userId, QuizVisibility.FILTERED);
    }

    public Optional<Quiz> getQuizById(Long quizId) {
        return quizRepository.findById(quizId);
    }

    public Optional<QuizDTO> getQuizDTOById(Long quizId) {
        return quizRepository.findById(quizId).map(QuizDTO::new);
    }

    public List<Quiz> getQuizzesByUserAndVisibility(Long userId, QuizVisibility visibility) {
        return quizRepository.findByGeneratedBy_IdAndVisibility(userId, visibility);
    }

    public List<Quiz> getQuizzesByVisibility(QuizVisibility visibility) {
        return quizRepository.findByVisibility(visibility);
    }

}
