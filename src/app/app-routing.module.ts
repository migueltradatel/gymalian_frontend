import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'coach-home',
    loadChildren: () => import('./pages/coach-home/coach-home.module').then(m => m.CoachHomePageModule)
  },
  {
    path: 'athlete-home',
    loadChildren: () => import('./pages/athlete-home/athlete-home.module').then(m => m.AthleteHomePageModule)
  },
  {
    path: 'session-view/:id',
    loadChildren: () => import('./pages/session-view/session-view.module').then(m => m.SessionViewPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
