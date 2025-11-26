import { Routes } from '@angular/router';
import { DotsComponent } from './dots/dots.component';
import { MirrorComponent } from './mirror/mirror.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dots',
    pathMatch: 'full'
  },
  {
    path: 'dots',
    component: DotsComponent
  },
  {
    path: 'mirror',
    component: MirrorComponent
  },
  {
    path: '**',
    redirectTo: '/dots',
    pathMatch: 'full'
  }
];

