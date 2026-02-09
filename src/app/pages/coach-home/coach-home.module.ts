import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachHomePageRoutingModule } from './coach-home-routing.module';

import { CoachHomePage } from './coach-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachHomePageRoutingModule
  ],
  declarations: [CoachHomePage]
})
export class CoachHomePageModule {}
