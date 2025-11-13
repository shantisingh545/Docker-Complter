package com.gamified.dashboard.controller;

import com.gamified.dashboard.entity.User;
import com.gamified.dashboard.repository.UserRepository;
import com.gamified.dashboard.service.GamificationService;
import com.gamified.dashboard.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserController {
    
    private final UserRepository userRepository;
    private final GamificationService gamificationService;
    private final AIService aiService;
    
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody Map<String, String> request) {
        User user = new User();
        user.setUsername(request.get("username"));
        user.setEmail(request.get("email"));
        user.setPassword(request.get("password")); // In real app, hash this!
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
    
    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        User user = userRepository.findByUsername(username).orElse(null);
        
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        List<User> leaderboard = gamificationService.getLeaderboard();
        return ResponseEntity.ok(leaderboard);
    }
    
    @PostMapping("/ai-chat")
    public ResponseEntity<String> chatWithAI(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String response = aiService.getChatResponse(message);
        return ResponseEntity.ok(response);
    }
}