// components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
  <div class="dashboard-container">
    <!-- Quick Stats -->
    <div class="stats-grid">
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon color="primary">inventory_2</mat-icon>
            <div class="stat-details">
              <h3>Total Inventory</h3>
              <p class="stat-number">{{totalInventory}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      <!-- Continue with other stat cards... -->
    </div>
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
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }
    .chart-card {
      min-height: 300px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalInventory = 487;
  lowStockItems = 12;
  todaySales = 3245.00;
  monthlyRevenue = 98750.00;

  ngOnInit() {
    this.initializeSalesChart();
    this.initializeInventoryChart();
    this.initializeTopItemsChart();
  }

  private initializeSalesChart() {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales ($)',
          data: [65000, 72000, 68000, 85000, 89000, 98750],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  }

  private initializeInventoryChart() {
    const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['All Season', 'Winter', 'Summer', 'Performance'],
        datasets: [{
          data: [45, 25, 20, 10],
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

  private initializeTopItemsChart() {
    const ctx = document.getElementById('topItemsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Michelin PS4', 'Bridgestone WS90', 'Continental DWS06', 'Pirelli P Zero'],
        datasets: [{
          label: 'Units Sold',
          data: [124, 98, 86, 72],
          backgroundColor: 'rgb(54, 162, 235)'
        }]
      }
    });
  }
}