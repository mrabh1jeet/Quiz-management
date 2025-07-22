package com.quizhub.quizhub.strategy;

import com.quizhub.quizhub.model.DifficultyLevel;

/**
 * Strategy interface for calculating scores in quizzes.
 * This interface defines the contract for different scoring algorithms.
 */
public interface ScoringStrategy {
    
    /**
     * Calculate the score for a correct answer based on difficulty level and hint usage.
     * 
     * @param difficulty The difficulty level of the question
     * @param hintUsed Whether a hint was used to answer the question
     * @return The calculated score as a float
     */
    float calculateScore(DifficultyLevel difficulty, boolean hintUsed);
}