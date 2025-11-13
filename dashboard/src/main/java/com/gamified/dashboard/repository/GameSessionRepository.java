package com.gamified.dashboard.repository;

import com.gamified.dashboard.entity.GameSession;
import com.gamified.dashboard.entity.GameType;
import com.gamified.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByUserOrderByPlayedAtDesc(User user);
    List<GameSession> findByGameTypeOrderByScoreDesc(GameType gameType);
    
    @Query("SELECT COUNT(gs) FROM GameSession gs WHERE gs.user = ?1 AND gs.gameType = ?2")
    Long countByUserAndGameType(User user, GameType gameType);
}