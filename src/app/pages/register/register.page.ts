import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  email = '';
  password = '';
  role = 'ATHLETE';
  code = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register({
      email: this.email,
      password: this.password,
      role: this.role,
      code: this.code
    }).subscribe(
      (res) => {
        if (res.role === 'COACH') {
          this.router.navigate(['/coach-home']);
        } else {
          this.router.navigate(['/athlete-home']);
        }
      },
      (err) => {
        console.error(err);
        alert('Registration failed: ' + (err.error?.message || 'Unknown error'));
      }
    );
  }
}
