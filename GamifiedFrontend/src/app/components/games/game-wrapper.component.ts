import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizGameComponent } from './quiz-game.component';
import { TypingGameComponent } from './typing-game.component';
import { MathGameComponent } from './math-game.component';
import { WordScrambleComponent } from './word-scramble.component';
import { MemoryFlashComponent } from './memory-flash.component';

@Component({
  selector: 'app-game-wrapper',
  standalone: true,
  imports: [CommonModule, QuizGameComponent, TypingGameComponent, MathGameComponent, WordScrambleComponent, MemoryFlashComponent],
  template: `
    <div class="game-wrapper">
      <div class="game-header">
        <h1>🎮 {{getGameTitle()}}</h1>
        <button (click)="closeGame()" class="close-btn">✕ Close Game</button>
      </div>
      
      <div class="game-content">
        <app-quiz-game *ngIf="gameType === 'quiz'"></app-quiz-game>
        <app-typing-game *ngIf="gameType === 'typing'"></app-typing-game>
        <app-math-game *ngIf="gameType === 'math'"></app-math-game>
        <app-word-scramble *ngIf="gameType === 'word'"></app-word-scramble>
        <app-memory-flash *ngIf="gameType === 'memory'"></app-memory-flash>
      </div>
    </div>
  `,
  styles: [`
    .game-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 15px;
      margin-bottom: 20px;
    }

    .game-header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
    }

    .close-btn:hover {
      background: #c0392b;
    }

    .game-content {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class GameWrapperComponent implements OnInit {
  gameType: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameType = params['type'];
    });
  }

  getGameTitle(): string {
    switch (this.gameType) {
      case 'quiz': return 'Quiz Battle';
      case 'typing': return 'Typing Speed Race';
      case 'math': return 'Math Lightning';
      case 'word': return 'Word Scramble';
      case 'memory': return 'Memory Flash';
      default: return 'Game';
    }
  }

  closeGame() {
    window.close();
  }
}