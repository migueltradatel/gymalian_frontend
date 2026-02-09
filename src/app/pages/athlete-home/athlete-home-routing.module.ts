import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteHomePage } from './athlete-home.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteHomePageRoutingModule {}
