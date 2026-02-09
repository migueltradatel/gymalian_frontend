import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionViewPage } from './session-view.page';

const routes: Routes = [
  {
    path: '',
    component: SessionViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionViewPageRoutingModule {}
