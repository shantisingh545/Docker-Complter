import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GameService } from '../../services/game.service';
import { GameType } from '../../models/user.model';

@Component({
  selector: 'app-typing-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="typing-game">
      <h2>⚡ Typing Speed Race</h2>
      
      <div *ngIf="!gameStarted && !gameFinished" class="game-start">
        <p>Test your typing speed! Type the sentence as fast and accurately as possible.</p>
        <button (click)="startGame()" class="start-btn">Start Game</button>
      </div>

      <div *ngIf="gameStarted && !gameFinished" class="game-active">
        <div class="timer">Time: {{timeLeft}}s</div>
        <div class="target-text">
          <span *ngFor="let char of targetTextArray; let i = index" 
                [class]="getCharClass(i)">{{char}}</span>
        </div>
        <textarea 
          [(ngModel)]="userInput" 
          (input)="onInput()"
          placeholder="Start typing here..."
          class="typing-input"
          #typingInput>
        </textarea>
        <div class="live-feedback" *ngIf="gameStarted && !gameFinished">
          <div class="errors" *ngIf="currentErrors > 0">
            ❌ Errors: {{currentErrors}}
          </div>
          <div class="progress">
            Progress: {{Math.round((userInput.length / targetText.length) * 100)}}%
          </div>
        </div>
        <div class="stats">
          <span>WPM: {{currentWPM}}</span>
          <span>Accuracy: {{accuracy}}%</span>
        </div>
      </div>

      <div *ngIf="gameFinished" class="game-results">
        <h3>🎉 Game Complete!</h3>
        <div class="results">
          <div class="result-item">
            <span class="label">Final WPM:</span>
            <span class="value">{{finalWPM}}</span>
          </div>
          <div class="result-item">
            <span class="label">Accuracy:</span>
            <span class="value">{{finalAccuracy}}%</span>
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
    .typing-game {
      max-width: 800px;
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
      padding: 40px;
    }

    .start-btn, .play-again-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 1.1em;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .start-btn:hover, .play-again-btn:hover {
      transform: translateY(-2px);
    }

    .timer {
      text-align: center;
      font-size: 1.5em;
      font-weight: bold;
      color: #e74c3c;
      margin-bottom: 20px;
    }

    .target-text {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      font-size: 1.2em;
      line-height: 1.6;
      margin-bottom: 20px;
      border-left: 4px solid #007bff;
    }

    .typing-input {
      width: 100%;
      height: 120px;
      padding: 15px;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      font-size: 1.1em;
      resize: none;
      margin-bottom: 20px;
    }

    .typing-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .stats {
      display: flex;
      justify-content: space-around;
      background: #e9ecef;
      padding: 15px;
      border-radius: 10px;
      font-weight: bold;
    }

    .char-correct {
      background-color: #d4edda;
      color: #155724;
    }

    .char-incorrect {
      background-color: #f8d7da;
      color: #721c24;
    }

    .char-pending {
      background-color: #f8f9fa;
      color: #6c757d;
    }

    .live-feedback {
      display: flex;
      justify-content: space-between;
      background: #fff3cd;
      padding: 10px 15px;
      border-radius: 10px;
      margin-top: 10px;
      font-size: 0.9em;
    }

    .errors {
      color: #856404;
      font-weight: bold;
    }

    .progress {
      color: #155724;
      font-weight: bold;
    }

    .game-results {
      text-align: center;
      padding: 20px;
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
      color: #007bff;
      font-weight: bold;
    }
  `]
})
export class TypingGameComponent implements OnInit {
  targetText = '';
  targetTextArray: string[] = [];
  userInput = '';
  gameStarted = false;
  gameFinished = false;
  timeLeft = 60;
  startTime = 0;
  currentWPM = 0;
  accuracy = 100;
  finalWPM = 0;
  finalAccuracy = 0;
  pointsEarned = 0;
  timer: any;
  currentErrors = 0;
  totalErrors = 0;
  Math = Math;

  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.loadTypingText();
  }

  loadTypingText() {
    this.apiService.getTypingText().subscribe(text => {
      this.targetText = text;
      this.targetTextArray = text.split('');
    });
  }

  startGame() {
    this.gameStarted = true;
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateStats();
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  onInput() {
    this.updateStats();
    this.updateLiveErrors();
    
    // Check if typing is complete
    if (this.userInput.length >= this.targetText.length) {
      this.endGame();
    }
  }

  updateLiveErrors() {
    this.currentErrors = 0;
    const minLength = Math.min(this.userInput.length, this.targetText.length);
    
    for (let i = 0; i < minLength; i++) {
      if (this.userInput[i] !== this.targetText[i]) {
        this.currentErrors++;
      }
    }
    
    this.totalErrors = Math.max(this.totalErrors, this.currentErrors);
  }

  getCharClass(index: number): string {
    if (index >= this.userInput.length) {
      return 'char-pending';
    }
    
    if (this.userInput[index] === this.targetText[index]) {
      return 'char-correct';
    } else {
      return 'char-incorrect';
    }
  }

  updateStats() {
    const wordsTyped = this.userInput.trim().split(' ').length;
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // minutes
    this.currentWPM = Math.round(wordsTyped / Math.max(timeElapsed, 0.1));
    
    // Calculate accuracy based on total characters typed vs errors
    const totalTyped = this.userInput.length;
    if (totalTyped > 0) {
      this.accuracy = Math.round(((totalTyped - this.totalErrors) / totalTyped) * 100);
    } else {
      this.accuracy = 100;
    }
  }

  endGame() {
    this.gameFinished = true;
    this.gameStarted = false;
    clearInterval(this.timer);
    
    this.finalWPM = this.currentWPM;
    this.finalAccuracy = this.accuracy;
    this.pointsEarned = this.finalWPM + 20; // WPM + completion bonus
    
    // Record game session
    const user = this.gameService.getCurrentUser();
    if (user) {
      this.apiService.recordGameSession({
        userId: user.id,
        gameType: GameType.TYPING_RACE,
        score: this.finalWPM,
        duration: 60 - this.timeLeft,
        gameData: JSON.stringify({ wpm: this.finalWPM, accuracy: this.finalAccuracy })
      }).subscribe();
      
      this.gameService.updateUserPoints(this.pointsEarned);
    }
  }

  playAgain() {
    this.userInput = '';
    this.gameStarted = false;
    this.gameFinished = false;
    this.timeLeft = 60;
    this.currentWPM = 0;
    this.accuracy = 100;
    this.currentErrors = 0;
    this.totalErrors = 0;
    this.loadTypingText();
  }
}