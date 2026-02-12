import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoachHomePageRoutingModule } from './coach-home-routing.module';

import { CoachHomePage } from './coach-home.page';
import { CreatePlanModalComponent } from './create-plan/create-plan.modal';
import { CreateExerciseModalComponent } from './create-exercise/create-exercise.modal';
import { CoachDashboardComponent } from './dashboard/dashboard.component';
import { CoachExercisesComponent } from './exercises/exercises.component';
import { CoachPlansComponent } from './plans/plans.component';
import { CoachAthletesComponent } from './athletes/athletes.component';
import { SessionDetailModalComponent } from './session-detail/session-detail.modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoachHomePageRoutingModule
  ],
  declarations: [
    CoachHomePage,
    CreatePlanModalComponent,
    CreateExerciseModalComponent,
    CoachDashboardComponent,
    CoachExercisesComponent,
    CoachPlansComponent,
    CoachAthletesComponent,
    SessionDetailModalComponent
  ]
})
export class CoachHomePageModule { }
