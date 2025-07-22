package com.quizhub.quizhub.dto;

import com.quizhub.quizhub.model.Quiz;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrivateQuizDTO extends BaseQuizDTO {
    private String privateCode;

    public PrivateQuizDTO(Quiz quiz) {
        super(quiz);
        this.privateCode = quiz.getPrivateCode();
    }
}
