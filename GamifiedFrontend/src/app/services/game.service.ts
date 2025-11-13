import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Don't auto-load user - will be loaded manually on app init
  }

  loadUserFromStorage() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  updateUserPoints(points: number) {
    const user = this.getCurrentUser();
    if (user) {
      user.totalPoints += points;
      user.currentLevel = Math.floor(user.totalPoints / 100) + 1;
      this.setCurrentUser(user);
    }
  }

  getBadgeInfo(badgeType: string): { name: string, description: string, icon: string } {
    const badges: any = {
      'FIRST_STEPS': { name: 'First Steps', description: 'Complete your first game', icon: '🥉' },
      'SPEED_DEMON': { name: 'Speed Demon', description: 'Type 60+ WPM', icon: '⚡' },
      'MATH_WIZARD': { name: 'Math Wizard', description: 'Get 10+ correct in Math Lightning', icon: '🧙‍♂️' },
      'PERFECT_MEMORY': { name: 'Perfect Memory', description: 'Complete Memory Flash level 5', icon: '🧠' },
      'QUIZ_MASTER': { name: 'Quiz Master', description: 'Get 5 perfect quiz scores', icon: '🏆' },
      'AI_LEARNER': { name: 'AI Learner', description: 'Ask 10 AI questions', icon: '🤖' },
      'STREAK_KING': { name: 'Streak King', description: 'Maintain 3-day activity streak', icon: '🔥' },
      'CHAMPION': { name: 'Champion', description: 'Reach level 10', icon: '👑' }
    };
    return badges[badgeType] || { name: badgeType, description: '', icon: '🏅' };
  }
}