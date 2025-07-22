package com.quizhub.quizhub.repository;

import com.quizhub.quizhub.model.DifficultyLevel;
import com.quizhub.quizhub.model.Question;
import com.quizhub.quizhub.model.Topic;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

//    @Query("SELECT DISTINCT q.topic FROM Question q")
//    List<Topic> findDistinctTopics();

    List<Question> findByTopic(Topic topic, Pageable pageable);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.topic.id = :topicId")
    long countByTopicId(@Param("topicId") Long topicId);

    List<Question> findByCreatedBy_Id(Long userId);

//    List<Question> findByCreatedByUsername(String username);  // Fetch questions for a user

    List<Question> findByTopic_IdIn(List<Long> topicIds, Pageable pageable);
    List<Question> findByTopic_IdIn(List<Long> topicIds);

    List<Question> findByTopic_IdInAndDifficulty(List<Long> topicIds, DifficultyLevel difficulty, Pageable pageable);


}
