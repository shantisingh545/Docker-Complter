import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GameService } from '../../services/game.service';
import { GameType } from '../../models/user.model';

@Component({
  selector: 'app-memory-flash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="memory-flash">
      <h2>🧩 Memory Flash</h2>
      
      <div *ngIf="!gameStarted && !gameFinished" class="game-start">
        <p>Memorize the sequence and repeat it back!</p>
        <div class="instructions">
          <h4>How to Play:</h4>
          <ul>
            <li>🔢 Watch the number sequence carefully</li>
            <li>⏰ You have limited time to memorize</li>
            <li>✍️ Type the sequence back in correct order</li>
            <li>📈 Each level gets longer and faster</li>
          </ul>
        </div>
        <button (click)="startGame()" class="start-btn">Start Game</button>
      </div>

      <div *ngIf="gameStarted && !gameFinished" class="game-active">
        <div class="game-header">
          <div class="level">Level {{currentLevel}}</div>
          <div class="score">Score: {{score}}</div>
          <div class="lives">Lives: {{'❤️'.repeat(lives)}}</div>
        </div>
        
        <div *ngIf="showingSequence" class="sequence-display">
          <div class="instruction">📖 Memorize this sequence:</div>
          <div class="sequence">{{displaySequence}}</div>
          <div class="timer-bar">
            <div class="timer-fill" [style.width.%]="timerProgress"></div>
          </div>
          <div class="countdown">{{Math.ceil(memoryTime / 1000)}}s</div>
        </div>
        
        <div *ngIf="waitingForInput" class="input-phase">
          <div class="instruction">✍️ Enter the sequence you saw:</div>
          <input 
            [(ngModel)]="userInput" 
            (keyup.enter)="submitSequence()"
            placeholder="Enter numbers separated by commas (e.g., 1,2,3)"
            class="sequence-input"
            maxlength="50">
          <button (click)="submitSequence()" [disabled]="!userInput.trim()" class="submit-btn">
            Submit Sequence
          </button>
        </div>
        
        <div *ngIf="showingResult" class="result-display">
          <div [class]="isCorrect ? 'correct-result' : 'incorrect-result'">
            {{isCorrect ? '✅ Correct! Well done!' : '❌ Incorrect!'}}
          </div>
          <div class="sequence-comparison">
            <div>Expected: {{currentSequence}}</div>
            <div>Your answer: {{userInput}}</div>
          </div>
          <div class="next-info">
            {{isCorrect ? 'Get ready for level ' + (currentLevel + 1) + '!' : 'Try again!'}}
          </div>
        </div>
      </div>

      <div *ngIf="gameFinished" class="game-results">
        <h3>🎉 Game Over!</h3>
        <div class="final-level">You reached Level {{maxLevel}}</div>
        <div class="results">
          <div class="result-item">
            <span class="label">Highest Level:</span>
            <span class="value">{{maxLevel}}</span>
          </div>
          <div class="result-item">
            <span class="label">Final Score:</span>
            <span class="value">{{score}}</span>
          </div>
          <div class="result-item">
            <span class="label">Sequences Completed:</span>
            <span class="value">{{completedSequences}}</span>
          </div>
          <div class="result-item">
            <span class="label">Points Earned:</span>
            <span class="value">{{pointsEarned}}</span>
          </div>
        </div>
        <button (click)="playAgain()" class="play-again-btn">Play Again</button>
      </div>
    </div>
  `,
  styles: [`
    .memory-flash {
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .game-start {
      text-align: center;
      padding: 20px;
    }

    .instructions {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      text-align: left;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .instructions ul {
      margin-top: 10px;
    }

    .instructions li {
      margin-bottom: 8px;
    }

    .start-btn, .play-again-btn {
      background: linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 1.1em;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .sequence-display {
      text-align: center;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      color: white;
      margin-bottom: 20px;
    }

    .instruction {
      font-size: 1.2em;
      margin-bottom: 20px;
    }

    .sequence {
      font-size: 3em;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 10px;
      margin-bottom: 20px;
    }

    .timer-bar {
      background: rgba(255,255,255,0.3);
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .timer-fill {
      background: #28a745;
      height: 100%;
      transition: width 0.1s linear;
    }

    .countdown {
      font-size: 1.5em;
      font-weight: bold;
    }

    .input-phase {
      text-align: center;
      padding: 40px;
      background: #f8f9fa;
      border-radius: 15px;
    }

    .sequence-input {
      font-size: 1.5em;
      padding: 15px;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      text-align: center;
      width: 100%;
      max-width: 400px;
      margin: 20px 0;
      font-family: 'Courier New', monospace;
    }

    .sequence-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .submit-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 1.1em;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .result-display {
      text-align: center;
      padding: 30px;
      border-radius: 15px;
      margin-bottom: 20px;
    }

    .correct-result {
      background: #d4edda;
      color: #155724;
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 10px;
    }

    .incorrect-result {
      background: #f8d7da;
      color: #721c24;
      font-size: 1.5em;
      font-weight: bold;
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 10px;
    }

    .sequence-comparison {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 15px;
      font-family: 'Courier New', monospace;
    }

    .next-info {
      font-size: 1.1em;
      color: #6c757d;
      font-style: italic;
    }

    .game-results {
      text-align: center;
      padding: 20px;
    }

    .final-level {
      font-size: 1.5em;
      color: #6f42c1;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .results {
      margin: 20px 0;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #dee2e6;
    }

    .label {
      font-weight: bold;
      color: #495057;
    }

    .value {
      color: #6f42c1;
      font-weight: bold;
    }
  `]
})
export class MemoryFlashComponent implements OnInit {
  Math = Math;
  gameStarted = false;
  gameFinished = false;
  currentLevel = 1;
  maxLevel = 1;
  score = 0;
  lives = 3;
  completedSequences = 0;
  
  showingSequence = false;
  waitingForInput = false;
  showingResult = false;
  
  currentSequence = '';
  displaySequence = '';
  userInput = '';
  isCorrect = false;
  
  memoryTime = 3000; // 3 seconds initially
  timerProgress = 100;
  timerInterval: any;
  
  pointsEarned = 0;

  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {}

  ngOnInit() {}

  startGame() {
    this.gameStarted = true;
    this.startLevel();
  }

  startLevel() {
    this.showingSequence = true;
    this.waitingForInput = false;
    this.showingResult = false;
    this.userInput = '';
    
    // Generate sequence for current level
    this.apiService.getMemorySequence(this.currentLevel).subscribe({
      next: (response) => {
        this.currentSequence = response.sequence;
        this.displaySequence = response.sequence.replace(/,/g, ' ');
        this.showSequence();
      },
      error: (error) => {
        console.error('Error loading sequence:', error);
      }
    });
  }

  showSequence() {
    // Calculate memory time based on level (gets shorter as level increases)
    this.memoryTime = Math.max(2000, 4000 - (this.currentLevel * 200));
    this.timerProgress = 100;
    
    this.timerInterval = setInterval(() => {
      this.timerProgress -= (100 / (this.memoryTime / 100));
      if (this.timerProgress <= 0) {
        clearInterval(this.timerInterval);
        this.hideSequence();
      }
    }, 100);
  }

  hideSequence() {
    this.showingSequence = false;
    this.waitingForInput = true;
  }

  submitSequence() {
    if (!this.userInput.trim()) return;
    
    this.waitingForInput = false;
    this.showingResult = true;
    
    // Clean up user input and compare
    const userSequence = this.userInput.replace(/\s/g, '').replace(/,+/g, ',');
    const correctSequence = this.currentSequence;
    
    this.isCorrect = userSequence === correctSequence;
    
    if (this.isCorrect) {
      this.score += this.currentLevel * 8; // More points for higher levels
      this.completedSequences++;
      this.maxLevel = Math.max(this.maxLevel, this.currentLevel);
      
      setTimeout(() => {
        this.currentLevel++;
        this.startLevel();
      }, 3000);
    } else {
      this.lives--;
      if (this.lives <= 0) {
        setTimeout(() => {
          this.endGame();
        }, 3000);
      } else {
        setTimeout(() => {
          this.startLevel(); // Retry same level
        }, 3000);
      }
    }
  }

  endGame() {
    this.gameFinished = true;
    this.gameStarted = false;
    this.pointsEarned = this.score;
    
    const user = this.gameService.getCurrentUser();
    if (user) {
      this.apiService.recordGameSession({
        userId: user.id,
        gameType: GameType.MEMORY_FLASH,
        score: this.maxLevel,
        duration: 0,
        gameData: JSON.stringify({ 
          maxLevel: this.maxLevel,
          completedSequences: this.completedSequences
        })
      }).subscribe();
      
      this.gameService.updateUserPoints(this.pointsEarned);
    }
  }

  playAgain() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentLevel = 1;
    this.maxLevel = 1;
    this.score = 0;
    this.lives = 3;
    this.completedSequences = 0;
    this.showingSequence = false;
    this.waitingForInput = false;
    this.showingResult = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}