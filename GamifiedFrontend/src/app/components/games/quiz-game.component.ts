import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { GameService } from '../../services/game.service';
import { GameType } from '../../models/user.model';

@Component({
  selector: 'app-quiz-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-game">
      <h2>🧠 Quiz Battle</h2>
      
      <div *ngIf="!gameStarted && !gameFinished" class="game-start">
        <p>Test your knowledge with AI-generated questions!</p>
        <div class="subject-selection">
          <button *ngFor="let subject of subjects" 
                  (click)="selectSubject(subject)"
                  [class.selected]="selectedSubject === subject"
                  class="subject-btn">
            {{subject}}
          </button>
        </div>
        <button (click)="startGame()" [disabled]="!selectedSubject" class="start-btn">Start Quiz</button>
      </div>

      <div *ngIf="gameStarted && !gameFinished" class="game-active">
        <div class="quiz-header">
          <div class="question-counter">Question {{currentQuestion + 1}} of {{totalQuestions}}</div>
          <div class="timer">{{timeLeft}}s</div>
          <div class="score">Score: {{score}}/{{currentQuestion}}</div>
        </div>
        
        <!-- Loading indicator -->
        <div *ngIf="loadingQuestion" class="loading-card">
          <div class="loading-spinner">🤖</div>
          <div class="loading-text">AI is generating your question...</div>
        </div>

        <!-- Question card -->
        <div class="question-card" *ngIf="currentQuestionData && !loadingQuestion">
          <div class="question">{{currentQuestionData.question}}</div>
          <div class="options">
            <button *ngFor="let option of currentQuestionData.options; let i = index"
                    (click)="selectAnswer(i)"
                    [class.selected]="selectedAnswer === i"
                    [disabled]="answered"
                    class="option-btn">
              {{option}}
            </button>
          </div>
          <div *ngIf="answered" class="feedback">
            <div [class]="isCorrect ? 'correct' : 'incorrect'">
              {{isCorrect ? '✅ Correct!' : '❌ Incorrect'}}
            </div>
            <div class="correct-answer" *ngIf="!isCorrect">
              Correct answer: {{currentQuestionData.options[currentQuestionData.correctAnswer]}}
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="gameFinished" class="game-results">
        <h3>🎉 Quiz Complete!</h3>
        <div class="results">
          <div class="result-item">
            <span class="label">Final Score:</span>
            <span class="value">{{score}}/{{totalQuestions}}</span>
          </div>
          <div class="result-item">
            <span class="label">Accuracy:</span>
            <span class="value">{{Math.round((score/totalQuestions)*100)}}%</span>
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
    .quiz-game {
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .timer {
      font-size: 1.2em;
      font-weight: bold;
      color: #e74c3c;
    }

    .question-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      padding: 20px;
    }

    .question {
      font-size: 1.3em;
      font-weight: bold;
      margin-bottom: 20px;
      color: #2c3e50;
    }

    .options {
      display: grid;
      gap: 10px;
    }

    .option-btn {
      padding: 15px;
      border: 2px solid #dee2e6;
      background: white;
      border-radius: 10px;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover {
      background: #f8f9fa;
      border-color: #007bff;
    }

    .option-btn.selected {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }

    .option-btn:disabled {
      cursor: not-allowed;
    }

    .feedback {
      margin-top: 20px;
      padding: 15px;
      border-radius: 10px;
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

    .loading-card {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 10px;
      padding: 40px 20px;
      text-align: center;
    }

    .loading-spinner {
      font-size: 3em;
      margin-bottom: 15px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .loading-text {
      color: #6c757d;
      font-size: 1.1em;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `]
})
export class QuizGameComponent implements OnInit {
  Math = Math;
  subjects = ['Math', 'Science', 'History', 'Literature', 'Geography'];
  selectedSubject = '';
  gameStarted = false;
  gameFinished = false;
  currentQuestion = 0;
  totalQuestions = 5;
  score = 0;
  timeLeft = 30;
  timer: any;
  currentQuestionData: any = null;
  selectedAnswer = -1;
  answered = false;
  isCorrect = false;
  pointsEarned = 0;
  loadingQuestion = false;

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
    this.loadNextQuestion();
  }

  loadNextQuestion() {
    this.selectedAnswer = -1;
    this.answered = false;
    this.timeLeft = 30;
    this.loadingQuestion = true;
    this.currentQuestionData = null;
    
    // Generate AI question
    this.apiService.getQuizQuestion(this.selectedSubject).subscribe({
      next: (response) => {
        try {
          this.currentQuestionData = JSON.parse(response);
          this.loadingQuestion = false;
          this.startTimer();
        } catch (error) {
          console.error('Error parsing AI question:', error);
          // Fallback to hardcoded question
          const questions = this.getQuestionsForSubject(this.selectedSubject);
          this.currentQuestionData = questions[Math.floor(Math.random() * questions.length)];
          this.loadingQuestion = false;
          this.startTimer();
        }
      },
      error: (error) => {
        console.error('Error getting AI question:', error);
        // Fallback to hardcoded question
        const questions = this.getQuestionsForSubject(this.selectedSubject);
        this.currentQuestionData = questions[Math.floor(Math.random() * questions.length)];
        this.loadingQuestion = false;
        this.startTimer();
      }
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  getQuestionsForSubject(subject: string) {
    const questionBank: any = {
      'Math': [
        { question: 'What is 15 × 8?', options: ['120', '125', '115', '130'], correctAnswer: 0 },
        { question: 'What is the square root of 144?', options: ['11', '12', '13', '14'], correctAnswer: 1 },
        { question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correctAnswer: 1 }
      ],
      'Science': [
        { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 2 },
        { question: 'How many bones are in the human body?', options: ['206', '208', '210', '212'], correctAnswer: 0 },
        { question: 'What planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correctAnswer: 1 }
      ],
      'History': [
        { question: 'In which year did World War II end?', options: ['1944', '1945', '1946', '1947'], correctAnswer: 1 },
        { question: 'Who was the first President of the United States?', options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'], correctAnswer: 2 }
      ]
    };
    return questionBank[subject] || questionBank['Math'];
  }

  selectAnswer(index: number) {
    if (this.answered) return;
    this.selectedAnswer = index;
    this.answered = true;
    clearInterval(this.timer);
    
    this.isCorrect = index === this.currentQuestionData.correctAnswer;
    if (this.isCorrect) {
      this.score++;
    }
    
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  timeUp() {
    this.answered = true;
    this.isCorrect = false;
    clearInterval(this.timer);
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion >= this.totalQuestions) {
      this.endGame();
    } else {
      this.loadNextQuestion();
    }
  }

  endGame() {
    this.gameFinished = true;
    this.gameStarted = false;
    this.pointsEarned = this.score * 15 + 5; // 15 points per correct + 5 participation
    
    const user = this.gameService.getCurrentUser();
    if (user) {
      this.apiService.recordGameSession({
        userId: user.id,
        gameType: GameType.QUIZ_BATTLE,
        score: this.score,
        duration: this.totalQuestions * 30,
        gameData: JSON.stringify({ subject: this.selectedSubject, accuracy: (this.score/this.totalQuestions)*100 })
      }).subscribe();
      
      this.gameService.updateUserPoints(this.pointsEarned);
    }
  }

  playAgain() {
    this.currentQuestion = 0;
    this.score = 0;
    this.gameStarted = false;
    this.gameFinished = false;
    this.selectedSubject = '';
  }
}