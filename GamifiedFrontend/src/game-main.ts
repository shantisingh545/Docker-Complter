import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { GameAppComponent } from './app/game-app.component';
import { GameWrapperComponent } from './app/components/games/game-wrapper.component';

const gameRoutes = [
  { path: 'game/:type', component: GameWrapperComponent },
  { path: '', redirectTo: '/game/quiz', pathMatch: 'full' }
];

bootstrapApplication(GameAppComponent, {
  providers: [
    provideRouter(gameRoutes),
    provideHttpClient()
  ]
}).catch((err) => console.error(err));