import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ModalController, AlertController } from '@ionic/angular';
import { CreateExerciseModalComponent } from '../create-exercise/create-exercise.modal';

@Component({
    selector: 'app-coach-exercises',
    templateUrl: './exercises.component.html',
    styleUrls: ['./exercises.component.scss'],
    standalone: false
})
export class CoachExercisesComponent implements OnInit {
    exercises: any[] = [];
    filteredExercises: any[] = [];
    plans: any[] = [];

    // Filters
    searchTerm: string = '';
    selectedMuscle: string = '';
    selectedRoutine: string = '';
    selectedAthlete: string = '';

    muscleGroups: string[] = [];
    routines: any[] = [];
    athletes: any[] = [];

    isLoading: boolean = true;

    constructor(
        private api: ApiService,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;

        this.api.get('/exercises').subscribe(exercises => {
            this.exercises = exercises;
            this.extractMuscleGroups();

            this.api.get('/coach/plans').subscribe(plans => {
                this.plans = plans;
                this.extractFilterData();
                this.applyFilters();
                this.isLoading = false;
            });
        });
    }

    extractMuscleGroups() {
        const groups = new Set(this.exercises.map(ex => ex.muscleGroup));
        this.muscleGroups = Array.from(groups).sort();
    }

    extractFilterData() {
        this.routines = this.plans.map(p => ({ id: p._id, name: p.name }));
        const athleteMap = new Map();
        this.plans.forEach(p => {
            if (p.athleteId) {
                athleteMap.set(p.athleteId._id, p.athleteId.email);
            }
        });
        this.athletes = Array.from(athleteMap.entries()).map(([id, email]) => ({ id, email }));
    }

    applyFilters() {
        this.filteredExercises = this.exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                ex.muscleGroup.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesMuscle = !this.selectedMuscle || ex.muscleGroup === this.selectedMuscle;
            const matchesRoutine = !this.selectedRoutine || this.isExerciseInPlan(ex._id, this.selectedRoutine);
            const matchesAthlete = !this.selectedAthlete || this.isExerciseForAthlete(ex._id, this.selectedAthlete);
            return matchesSearch && matchesMuscle && matchesRoutine && matchesAthlete;
        });
    }

    isExerciseInPlan(exerciseId: string, planId: string): boolean {
        const plan = this.plans.find(p => p._id === planId);
        if (!plan) return false;
        return plan.sessions.some((s: any) => s.exercises.some((e: any) => e.exerciseId._id === exerciseId));
    }

    isExerciseForAthlete(exerciseId: string, athleteId: string): boolean {
        const athletePlans = this.plans.filter(p => p.athleteId && p.athleteId._id === athleteId);
        return athletePlans.some(p => p.sessions.some((s: any) => s.exercises.some((e: any) => e.exerciseId._id === exerciseId)));
    }

    async addExercise() {
        const modal = await this.modalCtrl.create({
            component: CreateExerciseModalComponent
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.api.post('/exercises', data).subscribe(() => {
                this.loadData();
            });
        }
    }

    async editExercise(exercise: any) {
        const modal = await this.modalCtrl.create({
            component: CreateExerciseModalComponent,
            componentProps: { exercise }
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.api.put(`/exercises/${exercise._id}`, data).subscribe(() => {
                this.loadData();
            });
        }
    }

    async deleteExercise(exercise: any) {
        const alert = await this.alertCtrl.create({
            header: 'Delete Exercise',
            message: `Are you sure you want to delete ${exercise.name}?`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.api.delete(`/exercises/${exercise._id}`).subscribe(() => {
                            this.loadData();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }
}
