import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ModalController, AlertController } from '@ionic/angular';
import { CreatePlanModalComponent } from '../create-plan/create-plan.modal';

@Component({
    selector: 'app-coach-plans',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss'],
    standalone: false
})
export class CoachPlansComponent implements OnInit {
    plans: any[] = [];
    athletes: any[] = [];
    isLoading: boolean = true;

    // Filter criteria
    searchTerm: string = '';
    selectedAthleteId: string = 'all';
    sortBy: string = 'newest';

    constructor(
        private api: ApiService,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.loadPlans();
        this.loadAthletes();
    }

    loadPlans() {
        this.isLoading = true;
        this.api.get('/coach/plans').subscribe({
            next: (data: any) => {
                this.plans = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading plans', err);
                this.isLoading = false;
            }
        });
    }

    loadAthletes() {
        this.api.get('/auth/athletes').subscribe(athletes => {
            this.athletes = athletes;
        });
    }

    get filteredPlans() {
        let filtered = [...this.plans];

        // Search filter
        if (this.searchTerm) {
            const search = this.searchTerm.toLowerCase();
            filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
        }

        // Athlete filter
        if (this.selectedAthleteId !== 'all') {
            filtered = filtered.filter(p => {
                const planAthleteId = p.athleteId ? (p.athleteId._id || p.athleteId) : '';
                return planAthleteId === this.selectedAthleteId;
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return this.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    }

    async createPlan() {
        const modal = await this.modalCtrl.create({
            component: CreatePlanModalComponent
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.api.post('/workouts', data).subscribe(() => {
                this.loadPlans();
            });
        }
    }

    async editPlan(plan: any) {
        const modal = await this.modalCtrl.create({
            component: CreatePlanModalComponent,
            componentProps: { plan }
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.api.put(`/workouts/${plan._id}`, data).subscribe(() => {
                this.loadPlans();
            });
        }
    }

    async deletePlan(plan: any) {
        const alert = await this.alertCtrl.create({
            header: 'Delete Workout Plan',
            message: `Are you sure you want to delete ${plan.name}? This will remove it from all assigned athletes.`,
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: () => {
                        this.api.delete(`/workouts/${plan._id}`).subscribe(() => {
                            this.loadPlans();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }
}
