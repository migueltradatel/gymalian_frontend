import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { CreatePlanModalComponent } from './create-plan/create-plan.modal';
import { CreateExerciseModalComponent } from './create-exercise/create-exercise.modal';
import { NotificationsPopoverComponent } from '../../components/notifications-popover/notifications-popover.component';

@Component({
  selector: 'app-coach-home',
  templateUrl: './coach-home.page.html',
  styleUrls: ['./coach-home.page.scss'],
  standalone: false
})
export class CoachHomePage implements OnInit {
  currentTab: string = 'dashboard';
  exercises: any[] = [];
  coachName: string = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public notificationService: NotificationService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.loadExercises();
    this.loadCoachName();
  }

  loadCoachName() {
    this.coachName = 'Coach';
  }

  switchTab(tab: string) {
    this.currentTab = tab;
  }

  async openNotifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsPopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'notifications-popover'
    });
    await popover.present();
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
    const modal = await this.modalCtrl.create({
      component: CreateExerciseModalComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.createExercise(data);
    }
  }

  async createPlanPrompt() {
    const modal = await this.modalCtrl.create({
      component: CreatePlanModalComponent
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.createPlan(data);
    }
  }

  createPlan(data: any) {
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
