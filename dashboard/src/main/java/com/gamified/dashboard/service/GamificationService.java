package com.gamified.dashboard.service;

import com.gamified.dashboard.entity.*;
import com.gamified.dashboard.repository.UserRepository;
import com.gamified.dashboard.repository.GameSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GamificationService {
    
    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;
    
    @Transactional
    public GameSession recordGameSession(Long userId, GameType gameType, int score, int duration, String gameData) {
        User user = userRepository.findById(userId).orElseThrow();
        

        int pointsEarned = calculatePoints(gameType, score);
        

        GameSession session = new GameSession();
        session.setUser(user);
        session.setGameType(gameType);
        session.setScore(score);
        session.setPointsEarned(pointsEarned);
        session.setDuration(duration);
        session.setGameData(gameData);
        
        // Update user stats
        user.addPoints(pointsEarned);
        user.setGamesPlayed(user.getGamesPlayed() + 1);
        user.setLastActivity(LocalDateTime.now());
        
        // Check for new badges
        checkAndAwardBadges(user, gameType, score);
        
        userRepository.save(user);
        return gameSessionRepository.save(session);
    }
    
    private int calculatePoints(GameType gameType, int score) {
        return switch (gameType) {
            case QUIZ_BATTLE -> score > 0 ? gameType.getBasePoints() : gameType.getBonusPoints();
            case TYPING_RACE -> score + gameType.getBonusPoints(); // WPM + completion bonus
            case MATH_LIGHTNING -> score * gameType.getBasePoints();
            case WORD_SCRAMBLE -> score * gameType.getBasePoints();
            case MEMORY_FLASH -> score * gameType.getBasePoints();
        };
    }
    
    private void checkAndAwardBadges(User user, GameType gameType, int score) {
        // First Steps badge
        if (user.getGamesPlayed() == 1) {
            user.addBadge(BadgeType.FIRST_STEPS);
        }
        
        // Game-specific badges
        switch (gameType) {
            case TYPING_RACE -> {
                if (score >= 60) user.addBadge(BadgeType.SPEED_DEMON);
            }
            case MATH_LIGHTNING -> {
                if (score >= 10) user.addBadge(BadgeType.MATH_WIZARD);
            }
            case MEMORY_FLASH -> {
                if (score >= 5) user.addBadge(BadgeType.PERFECT_MEMORY);
            }
        }
        
        // Level-based badges
        if (user.getCurrentLevel() >= 10) {
            user.addBadge(BadgeType.CHAMPION);
        }
    }
    
    public List<User> getLeaderboard() {
        return userRepository.findTop10ByOrderByTotalPointsDesc();
    }
}