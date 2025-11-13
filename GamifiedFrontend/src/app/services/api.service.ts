import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, GameSession, GameType } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  // User endpoints
  registerUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/register`, userData);
  }

  loginUser(credentials: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/login`, credentials);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/leaderboard`);
  }

  chatWithAI(message: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/users/ai-chat`, { message }, { responseType: 'text' });
  }

  // Game endpoints
  recordGameSession(sessionData: any): Observable<GameSession> {
    return this.http.post<GameSession>(`${this.baseUrl}/games/session`, sessionData);
  }

  getQuizQuestion(subject: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/games/quiz-question?subject=${subject}`, { responseType: 'text' });
  }

  getTypingText(): Observable<string> {
    return this.http.get(`${this.baseUrl}/games/typing-text`, { responseType: 'text' });
  }

  getMathProblem(): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/math-problem`);
  }

  getWordScramble(subject: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/word-scramble?subject=${subject}`);
  }

  getMemorySequence(level: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/memory-sequence?level=${level}`);
  }
}