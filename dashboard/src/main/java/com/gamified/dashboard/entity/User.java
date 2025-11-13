package com.gamified.dashboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    private String password;
    
    @Column(name = "total_points")
    private Integer totalPoints = 0;
    
    @Column(name = "current_level")
    private Integer currentLevel = 1;
    
    @Column(name = "games_played")
    private Integer gamesPlayed = 0;
    
    @Column(name = "streak_days")
    private Integer streakDays = 0;
    
    @Column(name = "last_activity")
    private LocalDateTime lastActivity;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<BadgeType> badges = new HashSet<>();
    
    public void addPoints(int points) {
        this.totalPoints += points;
        updateLevel();
    }
    
    private void updateLevel() {
        this.currentLevel = (totalPoints / 100) + 1;
    }
    
    public void addBadge(BadgeType badge) {
        this.badges.add(badge);
    }
}