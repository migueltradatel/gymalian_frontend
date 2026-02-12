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
    planName: string = '';
    selectedAthleteId: string = '';
    athletes: any[] = [];
    isLoading = false;

    constructor(
        private modalCtrl: ModalController,
        private api: ApiService
    ) { }

    ngOnInit() {
        this.loadAthletes();
    }

    loadAthletes() {
        this.isLoading = true;
        this.api.get('/auth/athletes').subscribe({
            next: (data) => {
                this.athletes = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching athletes', err);
                this.isLoading = false;
            }
        });
    }

    close() {
        this.modalCtrl.dismiss();
    }

    create() {
        if (!this.planName) {
            return;
        }
        this.modalCtrl.dismiss({
            name: this.planName,
            athleteId: this.selectedAthleteId || undefined
        }, 'confirm');
    }
}
