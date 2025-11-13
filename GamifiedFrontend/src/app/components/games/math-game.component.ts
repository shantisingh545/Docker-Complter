import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GameService } from '../../services/game.service';
import { GameType } from '../../models/user.model';

@Component({
  selector: 'app-math-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="math-game">
      <h2>⚡ Math Lightning</h2>
      
      <div *ngIf="!gameStarted && !gameFinished" class="game-start">
        <p>Solve as many math problems as you can in 60 seconds!</p>
        <button (click)="startGame()" class="start-btn">Start Game</button>
      </div>

      <div *ngIf="gameStarted && !gameFinished" class="game-active">
        <div class="game-header">
          <div class="timer">⏰ {{timeLeft}}s</div>
          <div class="score">✅ {{correctAnswers}} correct</div>
          <div class="streak" *ngIf="streak > 1">🔥 {{streak}} streak!</div>
        </div>
        
        <div class="problem-card">
          <div class="problem">{{currentProblem.question}}</div>
          <input 
            type="number" 
            [(ngModel)]="userAnswer" 
            (keyup.enter)="submitAnswer()"
            placeholder="Your answer"
            class="answer-input"
            #answerInput>
          <button (click)="submitAnswer()" class="submit-btn">Submit</button>
        </div>

        <div class="feedback" *ngIf="showFeedback">
          <div [class]="lastAnswerCorrect ? 'correct' : 'incorrect'">
            {{lastAnswerCorrect ? '✅ Correct! +5 points' : '❌ Try again!'}}
          </div>
        </div>
      </div>

      <div *ngIf="gameFinished" class="game-results">
        <h3>🎉 Time's Up!</h3>
        <div class="results">
          <div class="result-item">
            <span class="label">Problems Solved:</span>
            <span class="value">{{correctAnswers}}</span>
          </div>
          <div class="result-item">
            <span class="label">Best Streak:</span>
            <span class="value">{{bestStreak}}</span>
          </div>
          <div class="result-item">
            <span class="label">Accuracy:</span>
            <span class="value">{{Math.round((correctAnswers/totalAttempts)*100) || 0}}%</span>
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
    .math-game {
      max-width: 600px;
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
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .timer {
      font-size: 1.3em;
      font-weight: bold;
      color: #e74c3c;
    }

    .score {
      font-size: 1.1em;
      font-weight: bold;
      color: #28a745;
    }

    .streak {
      font-size: 1.1em;
      font-weight: bold;
      color: #fd7e14;
      animation: pulse 0.5s ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .problem-card {
      background: white;
      border: 2px solid #dee2e6;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
      margin-bottom: 20px;
    }

    .problem {
      font-size: 2.5em;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .answer-input {
      font-size: 1.5em;
      padding: 15px;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      text-align: center;
      width: 200px;
      margin-right: 15px;
    }

    .answer-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .submit-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 15px 25px;
      border-radius: 10px;
      font-size: 1.1em;
      cursor: pointer;
    }

    .feedback {
      text-align: center;
      padding: 15px;
      border-radius: 10px;
      font-weight: bold;
      font-size: 1.2em;
    }

    .correct {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .incorrect {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
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
export class MathGameComponent implements OnInit {
  Math = Math;
  gameStarted = false;
  gameFinished = false;
  timeLeft = 60;
  correctAnswers = 0;
  totalAttempts = 0;
  streak = 0;
  bestStreak = 0;
  currentProblem: any = {};
  userAnswer: number | null = null;
  showFeedback = false;
  lastAnswerCorrect = false;
  pointsEarned = 0;
  timer: any;

  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {}

  ngOnInit() {}

  startGame() {
    this.gameStarted = true;
    this.generateNewProblem();
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  generateNewProblem() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let a, b, answer;
    
    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 25;
        b = Math.floor(Math.random() * 25) + 1;
        answer = a - b;
        break;
      case '*':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        answer = a * b;
        break;
      default:
        a = 1; b = 1; answer = 2;
    }
    
    this.currentProblem = {
      question: `${a} ${operation} ${b}`,
      answer: answer
    };
  }

  submitAnswer() {
    if (this.userAnswer === null) return;
    
    this.totalAttempts++;
    this.lastAnswerCorrect = this.userAnswer === this.currentProblem.answer;
    
    if (this.lastAnswerCorrect) {
      this.correctAnswers++;
      this.streak++;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }
    
    this.showFeedback = true;
    
    setTimeout(() => {
      this.showFeedback = false;
      this.userAnswer = null;
      this.generateNewProblem();
    }, 1000);
  }

  endGame() {
    this.gameFinished = true;
    this.gameStarted = false;
    clearInterval(this.timer);
    
    this.pointsEarned = this.correctAnswers * 5; // 5 points per correct answer
    
    const user = this.gameService.getCurrentUser();
    if (user) {
      this.apiService.recordGameSession({
        userId: user.id,
        gameType: GameType.MATH_LIGHTNING,
        score: this.correctAnswers,
        duration: 60,
        gameData: JSON.stringify({ 
          streak: this.bestStreak, 
          accuracy: (this.correctAnswers/this.totalAttempts)*100 
        })
      }).subscribe();
      
      this.gameService.updateUserPoints(this.pointsEarned);
    }
  }

  playAgain() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.timeLeft = 60;
    this.correctAnswers = 0;
    this.totalAttempts = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.userAnswer = null;
    this.showFeedback = false;
  }
}