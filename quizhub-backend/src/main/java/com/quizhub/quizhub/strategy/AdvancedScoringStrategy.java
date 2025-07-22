package com.quizhub.quizhub.strategy;

import com.quizhub.quizhub.model.DifficultyLevel;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

/**
 * Advanced implementation of the ScoringStrategy interface.
 * Provides a more sophisticated scoring algorithm that could be used in the future.
 * This demonstrates the extensibility of the Strategy pattern.
 */
@Component("advancedScoringStrategy")
@Primary
public class AdvancedScoringStrategy implements ScoringStrategy {

    /**
     * Calculate the score for a correct answer with a more sophisticated algorithm.
     * EASY questions: 1.2 points
     * MEDIUM questions: 2.5 points
     * HARD questions: 4 points
     * If hint is used, a 30% penalty is applied.
     *
     * @param difficulty The difficulty level of the question
     * @param hintUsed Whether a hint was used to answer the question
     * @return The calculated score as a float
     */
    @Override
    public float calculateScore(DifficultyLevel difficulty, boolean hintUsed) {
        float score = 0F;
        
        // Assign base score based on difficulty with enhanced values
        switch (difficulty) {
            case EASY:
                score = 1.2F;
                break;
            case MEDIUM:
                score = 2.5F;
                break;
            case HARD:
                score = 4.0F;
                break;
            default:
                score = 1.2F; // Default to EASY if unknown difficulty
        }
        
        // Apply a steeper penalty if hint was used (30% reduction)
        if (hintUsed) {
            score *= 0.7F;
        }
        
        return score;
    }
}