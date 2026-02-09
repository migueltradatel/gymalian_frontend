import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (res) => {
        if (res.role === 'COACH') {
          this.router.navigate(['/coach-home']);
        } else {
          this.router.navigate(['/athlete-home']);
        }
      },
      (err) => {
        console.error(err);
        alert('Login failed');
      }
    );
  }
}
