import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GameService } from '../../services/game.service';
import { GameType } from '../../models/user.model';

@Component({
  selector: 'app-word-scramble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="word-scramble">
      <h2>🔤 Word Scramble</h2>
      
      <div *ngIf="!gameStarted && !gameFinished" class="game-start">
        <p>Unscramble educational words to earn points!</p>
        <div class="subject-selection">
          <button *ngFor="let subject of subjects" 
                  (click)="selectSubject(subject)"
                  [class.selected]="selectedSubject === subject"
                  class="subject-btn">
            {{subject}}
          </button>
        </div>
        <button (click)="startGame()" [disabled]="!selectedSubject" class="start-btn">Start Game</button>
      </div>

      <div *ngIf="gameStarted && !gameFinished" class="game-active">
        <div class="game-header">
          <div class="score">Score: {{score}}</div>
          <div class="level">Level {{currentLevel}}</div>
          <div class="hints">Hints: {{hintsLeft}}</div>
        </div>
        
        <div *ngIf="loadingWord" class="loading-card">
          <div class="loading-text">🔤 Generating word...</div>
        </div>
        
        <div *ngIf="currentWord && !loadingWord" class="word-card">
          <div class="scrambled-word">{{scrambledWord}}</div>
          <div class="hint" *ngIf="showHint">💡 {{currentHint}}</div>
          <input 
            [(ngModel)]="userAnswer" 
            (keyup.enter)="submitAnswer()"
            placeholder="Type your answer..."
            class="answer-input"
            [disabled]="answered">
          <div class="game-buttons">
            <button (click)="submitAnswer()" [disabled]="!userAnswer || answered" class="submit-btn">
              Submit
            </button>
            <button (click)="useHint()" [disabled]="hintsLeft <= 0 || showHint" class="hint-btn">
              Use Hint ({{hintsLeft}} left)
            </button>
            <button (click)="skipWord()" class="skip-btn">Skip Word</button>
          </div>
          
          <div *ngIf="answered" class="feedback">
            <div [class]="isCorrect ? 'correct' : 'incorrect'">
              {{isCorrect ? '✅ Correct! +10 points' : '❌ Incorrect!'}}
            </div>
            <div *ngIf="!isCorrect" class="correct-answer">
              The correct answer was: {{currentWord}}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="gameFinished" class="game-results">
        <h3>🎉 Game Complete!</h3>
        <div class="results">
          <div class="result-item">
            <span class="label">Words Solved:</span>
            <span class="value">{{correctWords}}/{{totalWords}}</span>
          </div>
          <div class="result-item">
            <span class="label">Final Score:</span>
            <span class="value">{{score}}</span>
          </div>
          <div class="result-item">
            <span class="label">Accuracy:</span>
            <span class="value">{{Math.round((correctWords/totalWords)*100) || 0}}%</span>
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
    .word-scramble {
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
      padding: 20px;
    }

    .subject-selection {
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .subject-btn {
      padding: 10px 20px;
      border: 2px solid #dee2e6;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .subject-btn:hover, .subject-btn.selected {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .start-btn, .play-again-btn {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 1.1em;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .start-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    .loading-card {
      text-align: center;
      padding: 40px;
      color: #6c757d;
      font-size: 1.2em;
    }

    .word-card {
      background: white;
      border: 2px solid #dee2e6;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
    }

    .scrambled-word {
      font-size: 3em;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 20px;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }

    .hint {
      background: #fff3cd;
      color: #856404;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-style: italic;
    }

    .answer-input {
      font-size: 1.5em;
      padding: 15px;
      border: 2px solid #dee2e6;
      border-radius: 10px;
      text-align: center;
      width: 100%;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .answer-input:focus {
      outline: none;
      border-color: #007bff;
    }

    .game-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .submit-btn, .hint-btn, .skip-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
    }

    .submit-btn {
      background: #007bff;
      color: white;
    }

    .hint-btn {
      background: #ffc107;
      color: #212529;
    }

    .skip-btn {
      background: #6c757d;
      color: white;
    }

    .submit-btn:disabled, .hint-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .feedback {
      margin-top: 20px;
      padding: 15px;
      border-radius: 10px;
      font-weight: bold;
    }

    .correct {
      background: #d4edda;
      color: #155724;
    }

    .incorrect {
      background: #f8d7da;
      color: #721c24;
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
export class WordScrambleComponent implements OnInit {
  Math = Math;
  subjects = ['Math', 'Science', 'History', 'Literature', 'Geography'];
  selectedSubject = '';
  gameStarted = false;
  gameFinished = false;
  currentLevel = 1;
  score = 0;
  correctWords = 0;
  totalWords = 0;
  hintsLeft = 3;
  currentWord = '';
  scrambledWord = '';
  currentHint = '';
  userAnswer = '';
  answered = false;
  isCorrect = false;
  showHint = false;
  loadingWord = false;
  pointsEarned = 0;

  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {}

  ngOnInit() {}

  selectSubject(subject: string) {
    this.selectedSubject = subject;
  }

  startGame() {
    this.gameStarted = true;
    this.loadNextWord();
  }

  loadNextWord() {
    this.loadingWord = true;
    this.answered = false;
    this.isCorrect = false;
    this.showHint = false;
    this.userAnswer = '';
    
    this.apiService.getWordScramble(this.selectedSubject).subscribe({
      next: (response) => {
        this.currentWord = response.answer;
        this.scrambledWord = response.scrambled;
        this.currentHint = response.hint;
        this.loadingWord = false;
      },
      error: (error) => {
        console.error('Error loading word:', error);
        this.loadingWord = false;
      }
    });
  }

  submitAnswer() {
    if (!this.userAnswer.trim()) return;
    
    this.answered = true;
    this.totalWords++;
    this.isCorrect = this.userAnswer.toUpperCase().trim() === this.currentWord;
    
    if (this.isCorrect) {
      this.correctWords++;
      let points = 10;
      if (!this.showHint) points += 5; // Bonus for no hint
      this.score += points;
    }
    
    setTimeout(() => {
      if (this.totalWords >= 5) {
        this.endGame();
      } else {
        this.loadNextWord();
      }
    }, 2000);
  }

  useHint() {
    if (this.hintsLeft > 0) {
      this.hintsLeft--;
      this.showHint = true;
    }
  }

  skipWord() {
    this.totalWords++;
    this.answered = true;
    this.isCorrect = false;
    
    setTimeout(() => {
      if (this.totalWords >= 5) {
        this.endGame();
      } else {
        this.loadNextWord();
      }
    }, 2000);
  }

  endGame() {
    this.gameFinished = true;
    this.gameStarted = false;
    this.pointsEarned = this.score;
    
    const user = this.gameService.getCurrentUser();
    if (user) {
      this.apiService.recordGameSession({
        userId: user.id,
        gameType: GameType.WORD_SCRAMBLE,
        score: this.correctWords,
        duration: 0,
        gameData: JSON.stringify({ 
          accuracy: (this.correctWords/this.totalWords)*100,
          hintsUsed: 3 - this.hintsLeft
        })
      }).subscribe();
      
      this.gameService.updateUserPoints(this.pointsEarned);
    }
  }

  playAgain() {
    this.gameStarted = false;
    this.gameFinished = false;
    this.currentLevel = 1;
    this.score = 0;
    this.correctWords = 0;
    this.totalWords = 0;
    this.hintsLeft = 3;
    this.selectedSubject = '';
  }
}