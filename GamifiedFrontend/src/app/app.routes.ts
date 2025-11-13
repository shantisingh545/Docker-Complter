import { Routes } from '@angular/router';
import { GameWrapperComponent } from './components/games/game-wrapper.component';

export const routes: Routes = [
  { path: 'game/:type', component: GameWrapperComponent }
];
