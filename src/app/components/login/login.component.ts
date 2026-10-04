import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  fieldErrors: { [key: string]: string[] } = {};
  submitting = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};
    this.submitting = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 422) {
          this.fieldErrors = err.error.errors;
        } else if (err.status === 429) {
          this.errorMessage = 'Too many login attempts. Wait a minute and try again.';
        } else {
          this.errorMessage = 'Could not sign in. Is the API running?';
        }
      }
    });
  }
}