import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DotsComponent } from './dots/dots.component';


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
