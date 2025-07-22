package com.quizhub.quizhub;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class QuizHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizHubApplication.class, args);
    }

    @Bean
    public GroupedOpenApi api() {
        return GroupedOpenApi.builder()
                .group("QuizHub API")
                .pathsToMatch("/**")
                .build();
    }
}