import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteHomePageRoutingModule } from './athlete-home-routing.module';

import { AthleteHomePage } from './athlete-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteHomePageRoutingModule
  ],
  declarations: [AthleteHomePage]
})
export class AthleteHomePageModule {}
