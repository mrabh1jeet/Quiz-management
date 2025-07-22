package com.quizhub.quizhub.service;

import com.quizhub.quizhub.model.Topic;
import java.util.List;
import java.util.Optional;

public interface ITopicService {
    Topic createTopic(Topic topic);
    List<Topic> getAllTopics();
    Optional<Topic> getTopicById(Long id);
}
