package com.quizhub.quizhub.repository;

import com.quizhub.quizhub.model.QuestionResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionResponseRepository extends JpaRepository<QuestionResponse, Long> {
    // You can add custom query methods here if needed
}
