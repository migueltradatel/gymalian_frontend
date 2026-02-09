import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.page.html',
  styleUrls: ['./session-view.page.scss'],
  standalone: false
})
export class SessionViewPage implements OnInit {
  planId: string | null = null;
  plan: any = null;
  logs: any[] = []; // Structure to hold input data
  feedbackMessage: string = '';
  feedbackColor: string = 'medium';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.loadPlan();
    }
  }

  loadPlan() {
    this.api.get(`/workouts/${this.planId}`).subscribe(data => {
      this.plan = data;
      this.initializeLogs();
    });
  }

  initializeLogs() {
    if (!this.plan || !this.plan.sessions || this.plan.sessions.length === 0) return;

    // Flatten logic for MVP (assuming 1 session per display or handling first session)
    // Here we handle the first session found in plan for simplicity
    const session = this.plan.sessions[0];

    this.logs = session.exercises.map((ex: any) => ({
      exerciseId: ex.exerciseId._id,
      sets: Array(ex.targetSets).fill({}).map((_, idx) => ({ setNumber: idx + 1, weight: null, reps: null }))
    }));
  }

  getSetsArray(count: number) {
    return new Array(count);
  }

  submitLog() {
    const payload = {
      date: new Date(),
      workoutPlanId: this.planId,
      exercises: this.logs.map(log => ({
        exerciseId: log.exerciseId,
        sets: log.sets.filter((s: any) => s.weight && s.reps).map((s: any) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps
        }))
      }))
    };

    this.api.post('/logs', payload).subscribe(
      async (res) => {
        this.feedbackColor = res.feedbackColor.toLowerCase(); // green, yellow, red
        if (this.feedbackColor === 'yellow') this.feedbackColor = 'warning';
        if (this.feedbackColor === 'green') this.feedbackColor = 'success';
        if (this.feedbackColor === 'red') this.feedbackColor = 'danger';

        this.feedbackMessage = `Workout saved! Progress: ${res.feedbackColor}`;

        const toast = await this.toastCtrl.create({
          message: this.feedbackMessage,
          duration: 3000,
          color: this.feedbackColor
        });
        toast.present();
      },
      (err) => {
        console.error(err);
        alert('Error saving log');
      }
    );
  }
}
