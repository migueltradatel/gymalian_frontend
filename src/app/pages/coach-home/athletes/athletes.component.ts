import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ModalController } from '@ionic/angular';
import { SessionDetailModalComponent } from '../session-detail/session-detail.modal';

@Component({
    selector: 'app-coach-athletes',
    templateUrl: './athletes.component.html',
    styleUrls: ['./athletes.component.scss'],
    standalone: false
})
export class CoachAthletesComponent implements OnInit {
    athletes: any[] = [];
    isLoading: boolean = true;
    expandedAthleteId: string | null = null;
    athleteDetailsMap: Map<string, any> = new Map();

    constructor(
        private api: ApiService,
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
        this.loadAthletes();
    }

    loadAthletes() {
        this.isLoading = true;
        this.api.get('/auth/athletes').subscribe({
            next: (data: any) => {
                this.athletes = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading athletes', err);
                this.isLoading = false;
            }
        });
    }

    toggleAthlete(athleteId: string) {
        if (this.expandedAthleteId === athleteId) {
            this.expandedAthleteId = null;
        } else {
            this.expandedAthleteId = athleteId;
            if (!this.athleteDetailsMap.has(athleteId)) {
                this.loadAthleteDetails(athleteId);
            }
        }
    }

    loadAthleteDetails(athleteId: string) {
        this.api.get(`/coach/athlete/${athleteId}/details`).subscribe({
            next: (details: any) => {
                this.athleteDetailsMap.set(athleteId, details);
            },
            error: (err) => {
                console.error('Error loading athlete details', err);
            }
        });
    }

    async openSessionDetail(log: any, planName: string) {
        const modal = await this.modalCtrl.create({
            component: SessionDetailModalComponent,
            componentProps: {
                log: log,
                planName: planName
            }
        });
        await modal.present();
    }

    getAthleteDetails(athleteId: string) {
        return this.athleteDetailsMap.get(athleteId);
    }

    isExpanded(athleteId: string): boolean {
        return this.expandedAthleteId === athleteId;
    }
}
