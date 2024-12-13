import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Tire Inventory Management</span>
      <span class="spacer"></span>
      <ng-container *ngIf="authService.isLoggedIn()">
        <button mat-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>
        <button mat-button routerLink="/inventory">
          <mat-icon>inventory_2</mat-icon>
          Inventory
        </button>
        <button mat-button routerLink="/qr-generator">
          <mat-icon>qr_code</mat-icon>
          QR Generator
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Sign Out
        </button>
      </ng-container>
    </mat-toolbar>

    <div class="content-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .content-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    button {
      margin-left: 8px;
    }

    mat-icon {
      margin-right: 4px;
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