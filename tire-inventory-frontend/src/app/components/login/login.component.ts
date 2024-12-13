// components/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Username</mat-label>
            <input matInput formControlName="username">
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
            Login
          </button>

          <div class="register-link">
            <p>Don't have an account? <a mat-button color="accent" routerLink="/register">Register</a></p>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .login-card {
      max-width: 400px;
      margin: 2rem auto;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    button {
      width: 100%;
      margin-top: 1rem;
    }
    .register-link {
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Add error handling UI feedback here
        }
      });
    }
  }
}