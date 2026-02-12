import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-session-view',
  templateUrl: './session-view.page.html',
  styleUrls: ['./session-view.page.scss'],
  standalone: false
})
export class SessionViewPage implements OnInit, OnDestroy {
  planId: string | null = null;
  plan: any = null;
  logs: any[] = [];
  feedbackMessage: string = '';
  feedbackColor: string = 'medium';

  // Timer State
  timerActive: boolean = false;
  secondsLeft: number = 0;
  timerInterval: any;
  restTime: number = 60; // Default 60s rest

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

  ngOnDestroy() {
    this.stopTimer();
  }

  loadPlan() {
    this.api.get(`/workouts/${this.planId}`).subscribe(data => {
      this.plan = data;
      this.initializeLogs();
    });
  }

  initializeLogs() {
    if (!this.plan || !this.plan.sessions || this.plan.sessions.length === 0) return;
    const session = this.plan.sessions[0];
    this.logs = session.exercises.map((ex: any) => ({
      exerciseId: ex.exerciseId._id,
      sets: Array(ex.targetSets).fill({}).map((_, idx) => ({
        setNumber: idx + 1,
        weight: null,
        reps: null,
        rpe: null,
        rir: null,
        completed: false
      }))
    }));
  }

  onSetChange(exerciseIndex: number, setIndex: number) {
    const set = this.logs[exerciseIndex].sets[setIndex];
    if (set.weight && set.reps && !set.completed) {
      set.completed = true;
      this.startRestTimer();
    }
  }

  startRestTimer() {
    this.stopTimer();
    this.secondsLeft = this.restTime;
    this.timerActive = true;

    this.timerInterval = setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft <= 0) {
        this.stopTimer();
        this.playNotification();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerActive = false;
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  async playNotification() {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      const toast = await this.toastCtrl.create({
        message: 'Rest time over! Start next set.',
        duration: 3000,
        color: 'primary',
        position: 'top'
      });
      toast.present();
    } catch (e) { }
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
          reps: s.reps,
          rpe: s.rpe,
          rir: s.rir
        }))
      }))
    };

    this.api.post('/logs', payload).subscribe(
      async (res) => {
        this.feedbackColor = res.feedbackColor.toLowerCase();
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
