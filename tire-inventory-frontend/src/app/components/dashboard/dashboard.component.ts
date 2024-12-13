import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="dashboard-container" *ngIf="loaded">
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">inventory_2</mat-icon>
              <div class="stat-details">
                <h3>Total Inventory</h3>
                <p class="stat-number">{{metrics?.total_inventory || 0}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">warning</mat-icon>
              <div class="stat-details">
                <h3>Low Stock Items</h3>
                <p class="stat-number">{{metrics?.low_stock_items || 0}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      <canvas id="inventoryChart"></canvas>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .stat-card {
      padding: 15px;
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .stat-details h3 {
      margin: 0;
      font-size: 1rem;
      color: #666;
    }
    .stat-number {
      margin: 5px 0 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
  `]
})
export class DashboardComponent implements OnInit {
  metrics: any;
  loaded = false;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadMetrics();
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private loadMetrics() {
    const headers = this.getHeaders();
    
    this.http.get<any>('http://localhost:8000/api/analytics/dashboard-metrics', { headers })
      .pipe(
        catchError(error => {
          console.error('Error loading metrics:', error);
          return of({ total_inventory: 0, low_stock_items: 0, seasonal_distribution: {} });
        })
      )
      .subscribe({
        next: (data) => {
          this.metrics = data;
          this.loaded = true;
          if (data.seasonal_distribution) {
            this.initializeInventoryChart();
          }
        },
        error: (err) => {
          console.error('Error in metrics subscription:', err);
          this.loaded = true;
          this.metrics = { total_inventory: 0, low_stock_items: 0 };
        }
      });
  }

  generateDummyData() {
    const headers = this.getHeaders();
    
    this.http.post('http://localhost:8000/api/dummy/generate-dummy-data', {}, { headers })
      .pipe(
        catchError(error => {
          console.error('Error generating dummy data:', error);
          return of(null);
        })
      )
      .subscribe({
        next: () => this.loadMetrics(),
        error: (err) => console.error('Error in dummy data subscription:', err)
      });
  }

  private initializeInventoryChart() {
    const canvas = document.getElementById('inventoryChart') as HTMLCanvasElement;
    if (!canvas) {
      console.warn('Canvas element not found, skipping chart initialization');
      return;
    }

    const labels = Object.keys(this.metrics.seasonal_distribution);
    const values = Object.values(this.metrics.seasonal_distribution);

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values as number[],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
          ]
        }]
      }
    });
  }
}