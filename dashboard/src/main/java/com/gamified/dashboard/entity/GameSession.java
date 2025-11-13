package com.gamified.dashboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Enumerated(EnumType.STRING)
    private GameType gameType;
    
    private Integer score;
    private Integer pointsEarned;
    private Integer duration; // in seconds
    private String gameData; // JSON string for game-specific data
    
    @Column(name = "played_at")
    private LocalDateTime playedAt = LocalDateTime.now();
}