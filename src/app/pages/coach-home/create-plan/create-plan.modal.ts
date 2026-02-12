import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-create-plan-modal',
    templateUrl: './create-plan.modal.html',
    styleUrls: ['./create-plan.modal.scss'],
    standalone: false
})
export class CreatePlanModalComponent implements OnInit {
    step: number = 1;
    planName: string = '';
    selectedAthleteId: string = '';
    athletes: any[] = [];

    exercises: any[] = [];
    filteredExercises: any[] = [];
    selectedExerciseIds: string[] = [];

    muscleGroups: string[] = [];
    selectedMuscle: string = '';
    isLoading = false;

    constructor(
        private modalCtrl: ModalController,
        private api: ApiService
    ) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        this.isLoading = true;
        this.api.get('/auth/athletes').subscribe(athletes => {
            this.athletes = athletes;
            this.api.get('/exercises').subscribe(exercises => {
                this.exercises = exercises;
                this.extractMuscleGroups();
                this.applyFilter();
                this.isLoading = false;
            });
        });
    }

    extractMuscleGroups() {
        const groups = new Set(this.exercises.map(ex => ex.muscleGroup));
        this.muscleGroups = Array.from(groups).sort();
    }

    applyFilter() {
        this.filteredExercises = this.exercises.filter(ex =>
            !this.selectedMuscle || ex.muscleGroup === this.selectedMuscle
        );
    }

    toggleExercise(exerciseId: string) {
        const index = this.selectedExerciseIds.indexOf(exerciseId);
        if (index === -1) {
            this.selectedExerciseIds.push(exerciseId);
        } else {
            this.selectedExerciseIds.splice(index, 1);
        }
    }

    isExerciseSelected(exerciseId: string): boolean {
        return this.selectedExerciseIds.includes(exerciseId);
    }

    nextStep() {
        if (this.step === 1 && this.planName) {
            this.step = 2;
        }
    }

    prevStep() {
        if (this.step === 2) {
            this.step = 1;
        }
    }

    close() {
        this.modalCtrl.dismiss();
    }

    create() {
        if (!this.planName || this.selectedExerciseIds.length === 0) {
            return;
        }

        // Prepare sessions (for now 1 session with all selected exercises as per current logic, 
        // but formatted correctly for the API)
        const payload = {
            name: this.planName,
            athleteId: this.selectedAthleteId || undefined,
            sessions: [{
                dayName: 'Day 1',
                exercises: this.selectedExerciseIds.map(id => ({
                    exerciseId: id,
                    targetSets: 3,
                    targetReps: '10'
                }))
            }]
        };

        this.modalCtrl.dismiss(payload, 'confirm');
    }
}
