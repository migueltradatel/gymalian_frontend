import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachHomePageRoutingModule } from './coach-home-routing.module';

import { CoachHomePage } from './coach-home.page';
import { CreatePlanModalComponent } from './create-plan/create-plan.modal';
import { CreateExerciseModalComponent } from './create-exercise/create-exercise.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachHomePageRoutingModule
  ],
  declarations: [CoachHomePage, CreatePlanModalComponent, CreateExerciseModalComponent]
})
export class CoachHomePageModule { }
