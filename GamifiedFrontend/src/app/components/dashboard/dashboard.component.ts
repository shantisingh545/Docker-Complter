import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, BadgeType } from '../../models/user.model';
import { GameService } from '../../services/game.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container" *ngIf="currentUser">
      <div class="header">
        <h1>Welcome back, {{currentUser.username}}! 🎮</h1>
        <div class="user-stats">
          <div class="stat-card points" (click)="animateCard('points')" [class.animate]="animatingCard === 'points'">
            <div class="stat-icon">💰</div>
            <div class="stat-value">{{currentUser.totalPoints}}</div>
            <div class="stat-label">Total Points</div>
          </div>
          <div class="stat-card level" (click)="animateCard('level')" [class.animate]="animatingCard === 'level'">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">{{currentUser.currentLevel}}</div>
            <div class="stat-label">Level</div>
          </div>
          <div class="stat-card games" (click)="animateCard('games')" [class.animate]="animatingCard === 'games'">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">{{currentUser.gamesPlayed}}</div>
            <div class="stat-label">Games Played</div>
          </div>
        </div>
      </div>

      <div class="badges-section">
        <div class="section-header">
          <h2>Your Badges 🏆</h2>
          <button (click)="showBadgeGuide = !showBadgeGuide" class="info-btn">
            {{showBadgeGuide ? 'Hide Guide' : 'How to Earn Badges?'}} ℹ️
          </button>
        </div>
        
        <div *ngIf="showBadgeGuide" class="badge-guide">
          <h3>🎯 Badge Requirements</h3>
          <div class="badge-requirements">
            <div class="requirement-item">
              <span class="badge-preview">🎓</span>
              <div class="requirement-text">
                <strong>First Steps</strong><br>
                Complete your first game
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">🧠</span>
              <div class="requirement-text">
                <strong>Quiz Master</strong><br>
                Answer 50 quiz questions correctly
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">⚡</span>
              <div class="requirement-text">
                <strong>Speed Demon</strong><br>
                Achieve 60+ WPM in typing game
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">🔢</span>
              <div class="requirement-text">
                <strong>Math Wizard</strong><br>
                Solve 100 math problems correctly
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">🧩</span>
              <div class="requirement-text">
                <strong>Perfect Memory</strong><br>
                Complete memory sequences up to level 8
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">🤖</span>
              <div class="requirement-text">
                <strong>AI Learner</strong><br>
                Use AI tutor 10 times
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">🔥</span>
              <div class="requirement-text">
                <strong>Streak King</strong><br>
                Play games for 7 consecutive days
              </div>
            </div>
            <div class="requirement-item">
              <span class="badge-preview">👑</span>
              <div class="requirement-text">
                <strong>Champion</strong><br>
                Reach level 10
              </div>
            </div>
          </div>
        </div>
        
        <div class="badges-grid">
          <div *ngFor="let badge of currentUser.badges" 
               class="badge-card earned" 
               (click)="animateBadge(badge)"
               [class.animate]="animatingBadge === badge">
            <div class="badge-icon">{{getBadgeInfo(badge).icon}}</div>
            <div class="badge-name">{{getBadgeInfo(badge).name}}</div>
            <div class="badge-status">✅ Earned</div>
          </div>
          
          <div *ngFor="let badge of getUnearnedBadges()" 
               class="badge-card unearned"
               [title]="getBadgeRequirement(badge)">
            <div class="badge-icon locked">{{getBadgeInfo(badge).icon}}</div>
            <div class="badge-name">{{getBadgeInfo(badge).name}}</div>
            <div class="badge-status">🔒 Locked</div>
          </div>
          
          <div *ngIf="currentUser.badges.length === 0" class="no-badges">
            🎯 Start playing games to earn your first badge!
          </div>
        </div>
      </div>

      <div class="progress-section">
        <h2>Progress to Next Level 📈</h2>
        <div class="progress-container">
          <div class="progress-bar" (click)="animateProgress()" [class.animate]="animatingProgress">
            <div class="progress-fill" [style.width.%]="getProgressToNextLevel()"></div>
            <div class="progress-text-overlay">{{getProgressToNextLevel()}}%</div>
          </div>
          <div class="progress-details">
            <span class="current-points">{{getCurrentLevelPoints()}} / {{getNextLevelRequirement()}} points</span>
            <span class="points-needed">{{getPointsToNextLevel()}} more needed</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions ⚡</h2>
        <div class="actions-grid">
          <button class="action-btn quiz" (click)="quickPlay('quiz')">
            <div class="action-icon">🧠</div>
            <div class="action-text">Quick Quiz</div>
          </button>
          <button class="action-btn typing" (click)="quickPlay('typing')">
            <div class="action-icon">⚡</div>
            <div class="action-text">Typing Practice</div>
          </button>
          <button class="action-btn math" (click)="quickPlay('math')">
            <div class="action-icon">🔢</div>
            <div class="action-text">Math Challenge</div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .header h1 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
      font-size: 2.5em;
    }

    .user-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }

    .stat-card.animate {
      animation: pulse 0.6s ease-in-out;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .stat-icon {
      font-size: 2.5em;
      margin-bottom: 10px;
      display: block;
    }

    .stat-value {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 1em;
      opacity: 0.9;
      font-weight: 500;
    }

    .badges-section {
      margin-bottom: 40px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-header h2 {
      color: #2c3e50;
      margin: 0;
    }

    .info-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9em;
      transition: all 0.2s;
    }

    .info-btn:hover {
      background: #138496;
      transform: translateY(-1px);
    }

    .badge-guide {
      background: #f8f9fa;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 25px;
      border-left: 5px solid #007bff;
    }

    .badge-guide h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .badge-requirements {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .requirement-item {
      display: flex;
      align-items: center;
      gap: 15px;
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .badge-preview {
      font-size: 2em;
      min-width: 50px;
      text-align: center;
    }

    .requirement-text {
      flex: 1;
      font-size: 0.9em;
      line-height: 1.4;
    }

    .badges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 20px;
    }

    .badge-card {
      background: white;
      border: 3px solid #e9ecef;
      border-radius: 15px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .badge-card.earned {
      border-color: #28a745;
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    }

    .badge-card.earned:hover {
      transform: translateY(-3px) rotate(2deg);
      box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
    }

    .badge-card.unearned {
      border-color: #dee2e6;
      background: #f8f9fa;
      opacity: 0.6;
    }

    .badge-card.animate {
      animation: badgeBounce 0.6s ease-in-out;
    }

    @keyframes badgeBounce {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-5deg); }
      75% { transform: scale(1.1) rotate(5deg); }
    }

    .badge-icon {
      font-size: 2.5em;
      margin-bottom: 10px;
      display: block;
    }

    .badge-icon.locked {
      filter: grayscale(100%);
    }

    .badge-name {
      font-size: 0.85em;
      font-weight: bold;
      color: #495057;
      margin-bottom: 5px;
    }

    .badge-status {
      font-size: 0.75em;
      padding: 4px 8px;
      border-radius: 10px;
      font-weight: bold;
    }

    .badge-card.earned .badge-status {
      background: #28a745;
      color: white;
    }

    .badge-card.unearned .badge-status {
      background: #6c757d;
      color: white;
    }

    .no-badges {
      grid-column: 1 / -1;
      color: #6c757d;
      font-style: italic;
      padding: 40px;
      text-align: center;
      background: #f8f9fa;
      border-radius: 15px;
      border: 2px dashed #dee2e6;
    }

    .progress-section {
      margin-bottom: 40px;
    }

    .progress-section h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .progress-container {
      background: white;
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .progress-bar {
      background: #e9ecef;
      border-radius: 25px;
      height: 40px;
      overflow: hidden;
      margin-bottom: 15px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }

    .progress-bar:hover {
      transform: scale(1.02);
    }

    .progress-bar.animate {
      animation: progressPulse 0.6s ease-in-out;
    }

    @keyframes progressPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .progress-fill {
      background: linear-gradient(90deg, #28a745, #20c997, #17a2b8);
      height: 100%;
      transition: width 0.5s ease;
      border-radius: 25px;
    }

    .progress-text-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #2c3e50;
      font-weight: bold;
      font-size: 1.1em;
    }

    .progress-details {
      display: flex;
      justify-content: space-between;
      color: #6c757d;
      font-size: 0.9em;
    }

    .current-points {
      font-weight: bold;
    }

    .points-needed {
      color: #007bff;
      font-weight: bold;
    }

    .quick-actions {
      margin-top: 40px;
    }

    .quick-actions h2 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 20px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .action-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    }

    .action-icon {
      font-size: 2em;
      margin-bottom: 8px;
      display: block;
    }

    .action-text {
      font-weight: bold;
      font-size: 1em;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
        margin: 10px;
      }
      
      .header h1 {
        font-size: 2em;
      }
      
      .user-stats {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
      
      .badge-requirements {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  showBadgeGuide = false;
  animatingCard = '';
  animatingBadge = '';
  animatingProgress = false;

  constructor(
    private gameService: GameService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.gameService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getBadgeInfo(badge: string) {
    return this.gameService.getBadgeInfo(badge);
  }

  getProgressToNextLevel(): number {
    if (!this.currentUser) return 0;
    const currentLevelPoints = (this.currentUser.currentLevel - 1) * 100;
    const pointsInCurrentLevel = this.currentUser.totalPoints - currentLevelPoints;
    return Math.min((pointsInCurrentLevel / 100) * 100, 100);
  }

  getPointsToNextLevel(): number {
    if (!this.currentUser) return 0;
    const currentLevelPoints = (this.currentUser.currentLevel - 1) * 100;
    const pointsInCurrentLevel = this.currentUser.totalPoints - currentLevelPoints;
    return Math.max(100 - pointsInCurrentLevel, 0);
  }

  getCurrentLevelPoints(): number {
    if (!this.currentUser) return 0;
    const currentLevelPoints = (this.currentUser.currentLevel - 1) * 100;
    return this.currentUser.totalPoints - currentLevelPoints;
  }

  getNextLevelRequirement(): number {
    return 100;
  }

  getUnearnedBadges(): BadgeType[] {
    const allBadges = [BadgeType.FIRST_STEPS, BadgeType.QUIZ_MASTER, BadgeType.SPEED_DEMON, BadgeType.MATH_WIZARD, BadgeType.PERFECT_MEMORY, BadgeType.AI_LEARNER, BadgeType.STREAK_KING, BadgeType.CHAMPION];
    return allBadges.filter(badge => !this.currentUser?.badges.includes(badge));
  }

  getBadgeRequirement(badge: BadgeType): string {
    const requirements: {[key in BadgeType]: string} = {
      [BadgeType.FIRST_STEPS]: 'Complete your first game',
      [BadgeType.QUIZ_MASTER]: 'Answer 50 quiz questions correctly',
      [BadgeType.SPEED_DEMON]: 'Achieve 60+ WPM in typing game',
      [BadgeType.MATH_WIZARD]: 'Solve 100 math problems correctly',
      [BadgeType.PERFECT_MEMORY]: 'Complete memory sequences up to level 8',
      [BadgeType.AI_LEARNER]: 'Use AI tutor 10 times',
      [BadgeType.STREAK_KING]: 'Play games for 7 consecutive days',
      [BadgeType.CHAMPION]: 'Reach level 10'
    };
    return requirements[badge] || 'Unknown requirement';
  }

  animateCard(cardType: string) {
    this.animatingCard = cardType;
    setTimeout(() => this.animatingCard = '', 600);
  }

  animateBadge(badge: string) {
    this.animatingBadge = badge;
    setTimeout(() => this.animatingBadge = '', 600);
  }

  animateProgress() {
    this.animatingProgress = true;
    setTimeout(() => this.animatingProgress = false, 600);
  }

  quickPlay(gameType: string) {
    window.open(`http://localhost:4200/game/${gameType}`, '_blank');
  }
}