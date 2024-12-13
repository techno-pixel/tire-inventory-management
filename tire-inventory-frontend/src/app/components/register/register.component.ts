import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <mat-card class="register-card">
      <mat-card-header>
        <mat-card-title>Register</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Username</mat-label>
            <input matInput formControlName="username">
            <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
              Username is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email">
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              Password must be at least 6 characters
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="registerForm.invalid">
            Register
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .register-card {
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
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle error (you might want to show an error message to the user)
        }
      });
    }
  }
}