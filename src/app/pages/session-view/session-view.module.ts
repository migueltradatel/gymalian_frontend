import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionViewPageRoutingModule } from './session-view-routing.module';

import { SessionViewPage } from './session-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionViewPageRoutingModule
  ],
  declarations: [SessionViewPage]
})
export class SessionViewPageModule {}
