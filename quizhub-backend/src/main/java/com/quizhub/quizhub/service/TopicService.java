package com.quizhub.quizhub.service;

import com.quizhub.quizhub.model.Topic;
import com.quizhub.quizhub.repository.TopicRepository;
import com.quizhub.quizhub.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TopicService implements ITopicService {
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;

    public TopicService(TopicRepository topicRepository, QuestionRepository questionRepository) {
        this.topicRepository = topicRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    @Override
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @Override
    public Optional<Topic> getTopicById(Long id) {
        return topicRepository.findById(id);
    }

//    @Override
//    public void deleteTopic(Long id) {
//        long questionCount = questionRepository.countByTopicId(id);
//        if (questionCount == 0) {
//            topicRepository.deleteById(id);
//        }
//    }
}
