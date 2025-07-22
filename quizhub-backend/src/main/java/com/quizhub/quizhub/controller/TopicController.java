package com.quizhub.quizhub.controller;

import com.quizhub.quizhub.model.Topic;
import com.quizhub.quizhub.service.TopicService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics")
public class TopicController {
    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

//    creating the topic[]
    @PostMapping("create-topic")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        Topic savedTopic = topicService.createTopic(topic);
        return ResponseEntity.ok(savedTopic);
    }

//    getting all the topics[]
    @GetMapping("getall-topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        return ResponseEntity.ok(topicService.getAllTopics());
    }

//    getting the topics based on the topic id []
    @GetMapping("gettopic/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id) {
        return topicService.getTopicById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
//        topicService.deleteTopic(id);
//        return ResponseEntity.noContent().build();
//    }

}
