package com.quizhub.quizhub.dto;

import com.quizhub.quizhub.model.Quiz;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublicQuizDTO extends BaseQuizDTO {
    public PublicQuizDTO(Quiz quiz) {
        super(quiz);
    }
}
