import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotsComponent } from './dots/dots.component';
import { MirrorComponent } from './mirror/mirror.component';


const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
