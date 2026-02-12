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
    isLoading: boolean = true;

    constructor(
        private api: ApiService,
        private modalCtrl: ModalController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.loadPlans();
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
