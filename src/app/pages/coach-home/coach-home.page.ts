import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-coach-home',
  templateUrl: './coach-home.page.html',
  styleUrls: ['./coach-home.page.scss'],
  standalone: false
})
export class CoachHomePage implements OnInit {
  exercises: any[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadExercises();
  }

  loadExercises() {
    this.api.get('/exercises').subscribe(data => {
      this.exercises = data;
    });
  }

  createExercise(data: any) {
    this.api.post('/exercises', data).subscribe(() => {
      this.loadExercises();
    });
  }

  async addExercisePrompt() {
    const alert = await this.alertCtrl.create({
      header: 'New Exercise',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Name' },
        { name: 'muscleGroup', type: 'text', placeholder: 'Muscle Group' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.createExercise(data);
          }
        }
      ]
    });
    await alert.present();
  }

  async createPlanPrompt() {
    // Simplified Plan Creator for MVP
    const alert = await this.alertCtrl.create({
      header: 'New Workout Plan',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Plan Name' },
        { name: 'athleteId', type: 'text', placeholder: 'Athlete ID (Optional)' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create',
          handler: (data) => this.createPlan(data)
        }
      ]
    });
    await alert.present();
  }

  createPlan(data: any) {
    // Create a plan with all current exercises as one session
    const payload = {
      name: data.name,
      athleteId: data.athleteId || undefined,
      sessions: [{
        dayName: 'Day 1',
        exercises: this.exercises.map(ex => ({
          exerciseId: ex._id,
          targetSets: 3,
          targetReps: '10'
        }))
      }]
    };

    this.api.post('/workouts', payload).subscribe(() => {
      alert('Plan created with all exercises!');
    });
  }

  async generateCodePrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Generate Access Code',
      inputs: [
        { name: 'code', type: 'text', placeholder: 'Code (e.g. SUMMER)' },
        { name: 'duration', type: 'number', placeholder: 'Duration (days)' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Generate',
          handler: (data) => this.generateCode(data)
        }
      ]
    });
    await alert.present();
  }

  generateCode(data: any) {
    this.api.post('/auth/generate-code', data).subscribe(() => {
      alert(`Code ${data.code} generated!`);
    });
  }

  logout() {
    this.auth.logout();
  }
}
