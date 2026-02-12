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

    // Detailed configuration for each selected exercise
    exerciseConfigs: any[] = [];

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
        } else if (this.step === 2 && this.selectedExerciseIds.length > 0) {
            this.prepareStep3();
            this.step = 3;
        }
    }

    prevStep() {
        if (this.step > 1) {
            this.step--;
        }
    }

    prepareStep3() {
        // Initialize configs for selected exercises if not already present
        this.exerciseConfigs = this.selectedExerciseIds.map(id => {
            const existing = this.exerciseConfigs.find(c => c.exerciseId === id);
            if (existing) return existing;

            const ex = this.exercises.find(e => e._id === id);
            return {
                exerciseId: id,
                name: ex.name,
                targetSets: 3,
                targetReps: '10',
                targetRPE: 8
            };
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }

    create() {
        if (!this.planName || this.exerciseConfigs.length === 0) {
            return;
        }

        const payload = {
            name: this.planName,
            athleteId: this.selectedAthleteId || undefined,
            sessions: [{
                dayName: 'Day 1',
                exercises: this.exerciseConfigs.map(config => ({
                    exerciseId: config.exerciseId,
                    targetSets: config.targetSets,
                    targetReps: config.targetReps,
                    targetRPE: config.targetRPE
                }))
            }]
        };

        this.modalCtrl.dismiss(payload, 'confirm');
    }
}
