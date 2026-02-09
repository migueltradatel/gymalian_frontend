import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-athlete-home',
  templateUrl: './athlete-home.page.html',
  styleUrls: ['./athlete-home.page.scss'],
  standalone: false
})
export class AthleteHomePage implements OnInit {
  plans: any[] = [];

  constructor(private api: ApiService, private auth: AuthService) { }

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.api.get('/workouts').subscribe(data => {
      this.plans = data;
    });
  }

  logout() {
    this.auth.logout();
  }
}
