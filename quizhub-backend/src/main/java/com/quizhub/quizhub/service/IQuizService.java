package com.quizhub.quizhub.service;

import com.quizhub.quizhub.model.Quiz;

import java.util.List;
import java.util.Optional;

public interface IQuizService {
    Quiz saveQuiz(Quiz quiz);
    void deleteQuiz(Long id);
}
