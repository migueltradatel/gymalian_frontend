import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-coach-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class CoachDashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('volumeChart') volumeChartCanvas!: ElementRef;

    stats = {
        athleteCount: 0,
        planCount: 0,
        completedTodayCount: 0,
        recentActivity: [] as any[]
    };
    isLoading = true;
    completionRate: number = 0;
    chart: any;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadStats();
    }

    ngAfterViewInit() {
        // We will init chart after data is loaded
    }

    loadStats() {
        this.isLoading = true;
        this.api.get('/coach/stats').subscribe({
            next: (data: any) => {
                this.stats = data;
                this.loadAnalytics();
            },
            error: (err) => {
                console.error('Error loading stats', err);
                this.isLoading = false;
            }
        });
    }

    loadAnalytics() {
        this.api.get('/coach/analytics/completion-rate').subscribe(res => {
            this.completionRate = res.rate;
        });

        this.api.get('/coach/analytics/volume-history').subscribe(history => {
            this.isLoading = false; // Set loading to false so *ngIf allows the canvas to exist
            setTimeout(() => {
                this.initVolumeChart(history);
            }, 100); // Small delay to ensure Angular has rendered the DOM
        });
    }

    initVolumeChart(history: any[]) {
        if (!this.volumeChartCanvas) return;

        const ctx = this.volumeChartCanvas.nativeElement.getContext('2d');
        const labels = history.map(h => h._id);
        const data = history.map(h => h.totalVolume);

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Volume (kg)',
                    data: data,
                    borderColor: '#FF6B00',
                    backgroundColor: 'rgba(255, 107, 0, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#FF6B00',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#888' }
                    }
                }
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
