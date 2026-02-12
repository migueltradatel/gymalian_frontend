import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-coach-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class CoachDashboardComponent implements OnInit {
    stats = {
        athleteCount: 0,
        planCount: 0,
        completedTodayCount: 0,
        recentActivity: [] as any[]
    };
    isLoading = true;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        this.isLoading = true;
        this.api.get('/coach/stats').subscribe({
            next: (data: any) => {
                this.stats = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.isLoading = false;
            }
        });
    }

    getFeedbackColor(color: string) {
        if (!color) return 'medium';
        switch (color.toUpperCase()) {
            case 'GREEN': return 'success';
            case 'YELLOW': return 'warning';
            case 'RED': return 'danger';
            default: return 'medium';
        }
    }
}
