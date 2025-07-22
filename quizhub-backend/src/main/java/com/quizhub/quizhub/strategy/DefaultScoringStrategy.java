package com.quizhub.quizhub.strategy;

import com.quizhub.quizhub.model.DifficultyLevel;
import org.springframework.stereotype.Component;

/**
 * Default implementation of the ScoringStrategy interface.
 * Calculates scores based on question difficulty and hint usage.
 */
@Component
public class DefaultScoringStrategy implements ScoringStrategy {

    /**
     * Calculate the score for a correct answer based on difficulty level and hint usage.
     * EASY questions: 1 point
     * MEDIUM questions: 2 points
     * HARD questions: 3 points
     * If hint is used, a 25% penalty is applied.
     *
     * @param difficulty The difficulty level of the question
     * @param hintUsed Whether a hint was used to answer the question
     * @return The calculated score as a float
     */
    @Override
    public float calculateScore(DifficultyLevel difficulty, boolean hintUsed) {
        float score = 0F;
        
        // Assign base score based on difficulty
        switch (difficulty) {
            case EASY:
                score = 1F;
                break;
            case MEDIUM:
                score = 2F;
                break;
            case HARD:
                score = 3F;
                break;
            default:
                score = 1F; // Default to EASY if unknown difficulty
        }
        
        // Apply penalty if hint was used (25% reduction)
        if (hintUsed) {
            score *= 0.75F;
        }
        
        return score;
    }
}