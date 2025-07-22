package com.quizhub.quizhub.dto;

import com.quizhub.quizhub.model.Quiz;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FilteredQuizDTO extends BaseQuizDTO {
    private String filterCriteria;

    public FilteredQuizDTO(Quiz quiz) {
        super(quiz);
        this.filterCriteria = quiz.getFilterCriteria();
    }
}
