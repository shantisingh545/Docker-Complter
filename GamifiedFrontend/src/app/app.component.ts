import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { User } from './models/user.model';
import { ApiService } from './services/api.service';
import { GameService } from './services/game.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    RouterOutlet,
    DashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'GamifiedFrontend';
  currentUser: User | null = null;
  isLoggedIn = false;
  activeTab = 'dashboard';
  selectedGame: string | null = null;
  showRegister = false;
  isLoggingOut = false;
  
  loginData = { username: '', password: '' };
  registerData = { username: '', email: '', password: '' };
  
  leaderboard: User[] = [];
  chatMessages: any[] = [];
  chatInput = '';

  constructor(
    private apiService: ApiService,
    private gameService: GameService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Only load user if not logging out
    if (!this.isLoggingOut) {
      this.gameService.loadUserFromStorage();
    }
    
    this.gameService.currentUser$.subscribe(user => {
      if (!this.isLoggingOut) {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        if (user) {
          this.loadLeaderboard();
          this.refreshUserData();
        }
      }
    });
    
    // Refresh user data every 30 seconds to catch updates from games
    setInterval(() => {
      if (this.currentUser && localStorage.getItem('currentUser') && !this.isLoggingOut) {
        this.refreshUserData();
      }
    }, 30000);
    
    // Refresh when window gains focus (user returns from game)
    window.addEventListener('focus', () => {
      if (this.currentUser && localStorage.getItem('currentUser') && !this.isLoggingOut) {
        this.refreshUserData();
        this.loadLeaderboard();
      }
    });
  }

  login() {
    this.apiService.loginUser(this.loginData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.gameService.setCurrentUser(user);
        this.loginData = { username: '', password: '' };
      },
      error: (error) => {
        alert('Login failed. Please check your credentials.');
      }
    });
  }

  register() {
    this.apiService.registerUser(this.registerData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.gameService.setCurrentUser(user);
        this.registerData = { username: '', email: '', password: '' };
        this.showRegister = false;
      },
      error: (error) => {
        alert('Registration failed. Please try again.');
      }
    });
  }

  logout() {
    // Set logout flag immediately to prevent any reloading
    this.isLoggingOut = true;
    
    // Clear all storage first
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset component state
    this.isLoggedIn = false;
    this.currentUser = null;
    this.activeTab = 'dashboard';
    this.leaderboard = [];
    this.chatMessages = [];
    this.chatInput = '';
    this.showRegister = false;
    this.loginData = { username: '', password: '' };
    this.registerData = { username: '', email: '', password: '' };
    
    // Force change detection
    this.cdr.detectChanges();
    
    // Reset logout flag after a delay
    setTimeout(() => {
      this.isLoggingOut = false;
    }, 1000);
  }

  loadLeaderboard() {
    this.apiService.getLeaderboard().subscribe(users => {
      this.leaderboard = users;
    });
  }

  sendMessage() {
    if (!this.chatInput.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: this.chatInput,
      time: new Date()
    };
    
    this.chatMessages.push(userMessage);
    
    this.apiService.chatWithAI(this.chatInput).subscribe(response => {
      const aiMessage = {
        type: 'ai',
        content: response,
        time: new Date()
      };
      this.chatMessages.push(aiMessage);
    });
    
    this.chatInput = '';
  }

  openGame(gameType: string) {
    window.open(`http://localhost:4200/game/${gameType}`, '_blank');
  }

  isGameRoute(): boolean {
    return this.router.url.startsWith('/game');
  }

  refreshUserData() {
    if (this.currentUser && localStorage.getItem('currentUser')) {
      this.apiService.getUser(this.currentUser.id).subscribe(updatedUser => {
        this.gameService.setCurrentUser(updatedUser);
      });
    }
  }

  useQuickPrompt(prompt: string) {
    this.chatInput = prompt;
    this.sendMessage();
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/\n/g, '<br>') // Line breaks
      .replace(/\d+\./g, '<br>$&') // Numbered lists
      .replace(/- /g, '<br>• '); // Bullet points
  }
}
