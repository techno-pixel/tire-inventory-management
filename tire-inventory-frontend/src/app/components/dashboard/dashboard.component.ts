import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AuthService } from '../../services/auth.service';

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
              <p class="stat-number">{{metrics?.total_inventory}}</p>
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
              <p class="stat-number">{{metrics?.low_stock_items}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <!-- Add charts or more cards for seasonal distribution, supplier performance, disposal compliance as needed -->
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
    // Fetch dashboard metrics
    this.http.get<any>('http://localhost:8000/api/analytics/dashboard-metrics')
      .subscribe({
        next: (data) => {
          this.metrics = data;
          this.loaded = true;
          this.initializeInventoryChart();
        },
        error: (err) => console.error(err)
      });
  }

  private initializeInventoryChart() {
    const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement;
    const labels = Object.keys(this.metrics.seasonal_distribution);
    const values = Object.values(this.metrics.seasonal_distribution);

    new Chart(ctx, {
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

  generateDummyData() {
    this.http.post('http://localhost:8000/api/dummy/generate-dummy-data', {}, {headers: {Authorization: 'Bearer ' + this.authService.getToken()}})
      .subscribe({
        next: () => this.loadMetrics(),
        error: (err) => console.error(err)
      });
  }
  
  private loadMetrics() {
    this.http.get<any>('http://localhost:8000/api/analytics/dashboard-metrics')
      .subscribe({
        next: (data) => {
          this.metrics = data;
          this.loaded = true;
          this.initializeInventoryChart();
        },
        error: (err) => console.error(err)
      });
    }
}
