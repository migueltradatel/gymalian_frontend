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

    exportToCSV(athlete: any) {
        const details = this.getAthleteDetails(athlete._id);
        if (!details || !details.logs || details.logs.length === 0) return;

        const headers = ['Date', 'Plan', 'Exercise', 'Set', 'Weight', 'Reps'];
        let csvContent = headers.join(',') + '\n';

        details.logs.forEach((log: any) => {
            const planName = details.plans.find((p: any) => p._id === log.workoutPlanId)?.name || 'Unknown';
            log.exercises.forEach((ex: any) => {
                const exName = ex.exerciseId?.name || 'Unknown';
                ex.sets.forEach((set: any) => {
                    const row = [
                        new Date(log.date).toLocaleDateString(),
                        `"${planName}"`,
                        `"${exName}"`,
                        set.setNumber,
                        set.weight,
                        set.reps
                    ];
                    csvContent += row.join(',') + '\n';
                });
            });
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `progress_${athlete.email}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
