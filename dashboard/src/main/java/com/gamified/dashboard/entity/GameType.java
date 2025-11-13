package com.gamified.dashboard.entity;

public enum GameType {
    QUIZ_BATTLE("Quiz Battle", 15, 5),
    TYPING_RACE("Typing Speed Race", 1, 20), // 1 point per WPM + 20 completion
    MATH_LIGHTNING("Math Lightning", 5, 0),
    WORD_SCRAMBLE("Word Scramble", 10, 15), // 10 correct, 15 no hints
    MEMORY_FLASH("Memory Flash", 8, 0); // 8 points per level
    
    private final String displayName;
    private final int basePoints;
    private final int bonusPoints;
    
    GameType(String displayName, int basePoints, int bonusPoints) {
        this.displayName = displayName;
        this.basePoints = basePoints;
        this.bonusPoints = bonusPoints;
    }
    
    public String getDisplayName() { return displayName; }
    public int getBasePoints() { return basePoints; }
    public int getBonusPoints() { return bonusPoints; }
}