package com.gamified.dashboard.controller;

import com.gamified.dashboard.entity.GameSession;
import com.gamified.dashboard.entity.GameType;
import com.gamified.dashboard.service.GamificationService;
import com.gamified.dashboard.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class GameController {
    
    private final GamificationService gamificationService;
    private final AIService aiService;
    
    @PostMapping("/session")
    public ResponseEntity<GameSession> recordGameSession(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        GameType gameType = GameType.valueOf(request.get("gameType").toString());
        Integer score = Integer.valueOf(request.get("score").toString());
        Integer duration = Integer.valueOf(request.get("duration").toString());
        String gameData = request.get("gameData").toString();
        
        GameSession session = gamificationService.recordGameSession(userId, gameType, score, duration, gameData);
        return ResponseEntity.ok(session);
    }
    
    @GetMapping("/quiz-question")
    public ResponseEntity<String> getQuizQuestion(@RequestParam String subject) {
        String question = aiService.generateQuizQuestion(subject);
        return ResponseEntity.ok(question);
    }
    
    @GetMapping("/typing-text")
    public ResponseEntity<String> getTypingText() {
        String text = aiService.generateTypingText();
        return ResponseEntity.ok(text);
    }
    
    @GetMapping("/math-problem")
    public ResponseEntity<Map<String, Object>> getMathProblem() {
        // Generate simple math problems
        int a = (int) (Math.random() * 50) + 1;
        int b = (int) (Math.random() * 50) + 1;
        String[] operations = {"+", "-", "*"};
        String op = operations[(int) (Math.random() * 3)];
        
        int answer = switch (op) {
            case "+" -> a + b;
            case "-" -> a - b;
            case "*" -> a * b;
            default -> 0;
        };
        
        return ResponseEntity.ok(Map.of(
            "question", a + " " + op + " " + b + " = ?",
            "answer", answer
        ));
    }
    
    @GetMapping("/word-scramble")
    public ResponseEntity<Map<String, String>> getWordScramble(@RequestParam String subject) {
        String word = aiService.generateScrambleWord(subject);
        String scrambled = scrambleWord(word);
        String hint = aiService.generateWordHint(word, subject);
        
        return ResponseEntity.ok(Map.of(
            "scrambled", scrambled,
            "answer", word,
            "hint", hint
        ));
    }
    
    @GetMapping("/memory-sequence")
    public ResponseEntity<Map<String, String>> getMemorySequence(@RequestParam int level) {
        int sequenceLength = Math.min(3 + level, 10); // Start with 4, max 10
        String sequence = aiService.generateMemorySequence(sequenceLength);
        
        return ResponseEntity.ok(Map.of(
            "sequence", sequence,
            "length", String.valueOf(sequenceLength)
        ));
    }
    
    private String scrambleWord(String word) {
        char[] chars = word.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            int randomIndex = (int) (Math.random() * chars.length);
            char temp = chars[i];
            chars[i] = chars[randomIndex];
            chars[randomIndex] = temp;
        }
        return new String(chars);
    }
}