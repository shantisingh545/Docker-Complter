package com.gamified.dashboard.entity;

public enum BadgeType {
    FIRST_STEPS("First Steps", "Complete your first game"),
    SPEED_DEMON("Speed Demon", "Type 60+ WPM"),
    MATH_WIZARD("Math Wizard", "Get 10+ correct in Math Lightning"),
    PERFECT_MEMORY("Perfect Memory", "Complete Memory Flash level 5"),
    QUIZ_MASTER("Quiz Master", "Get 5 perfect quiz scores"),
    AI_LEARNER("AI Learner", "Ask 10 AI questions"),
    STREAK_KING("Streak King", "Maintain 3-day activity streak"),
    CHAMPION("Champion", "Reach level 10");
    
    private final String name;
    private final String description;
    
    BadgeType(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    public String getName() { return name; }
    public String getDescription() { return description; }
}