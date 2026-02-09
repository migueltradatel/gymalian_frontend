import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoachHomePage } from './coach-home.page';

const routes: Routes = [
  {
    path: '',
    component: CoachHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoachHomePageRoutingModule {}
