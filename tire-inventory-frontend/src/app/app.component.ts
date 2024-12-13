// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Tire Inventory Management</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isLoggedIn()">
        <button mat-button routerLink="/dashboard">Dashboard</button>
        <button mat-button routerLink="/inventory">Inventory</button>
        <button mat-button routerLink="/qr-generator">QR Generator</button>
        <button mat-button (click)="logout()">Sign Out</button>
      </ng-container>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}