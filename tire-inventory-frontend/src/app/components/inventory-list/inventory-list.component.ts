// components/inventory-list/inventory-list.component.ts
import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { InventoryItem } from '../../interfaces/inventory-item';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule
  ],
  template: `
    <div class="inventory-container">
      <div class="search-bar">
        <mat-form-field>
          <mat-label>Search Inventory</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search by brand, model, size...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
        
        <button mat-raised-button color="primary" (click)="addNewItem()">
          <mat-icon>add</mat-icon>
          Add Item
        </button>
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="inventory-table">
        <!-- Image Column -->
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef> Image </th>
          <td mat-cell *matCellDef="let item">
            <img [src]="item.imageUrl || 'assets/placeholder-tire.png'" alt="Tire image" class="tire-image">
          </td>
        </ng-container>

        <!-- Brand Column -->
        <ng-container matColumnDef="brand">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Brand </th>
          <td mat-cell *matCellDef="let item">{{item.brand}}</td>
        </ng-container>

        <!-- Model Column -->
        <ng-container matColumnDef="model">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Model </th>
          <td mat-cell *matCellDef="let item">{{item.model}}</td>
        </ng-container>

        <!-- Size Column -->
        <ng-container matColumnDef="size">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Size </th>
          <td mat-cell *matCellDef="let item">{{item.size}}</td>
        </ng-container>

        <!-- Quantity Column -->
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Quantity </th>
          <td mat-cell *matCellDef="let item" [ngClass]="{'low-stock': item.quantity < item.minimumStock}">
            {{item.quantity}}
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let item">
            <button mat-icon-button color="primary" (click)="editItem(item)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteItem(item)">
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="generateQR(item)">
              <mat-icon>qr_code</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
    }
    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .search-bar mat-form-field {
      width: 50%;
    }
    .inventory-table {
      width: 100%;
    }
    .tire-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    .low-stock {
      color: #f44336;
      font-weight: bold;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class InventoryListComponent implements OnInit {
  displayedColumns: string[] = ['image', 'brand', 'model', 'size', 'quantity', 'actions'];
  dataSource: MatTableDataSource<InventoryItem>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<InventoryItem>([]);
  }

  ngOnInit() {
    this.loadInventoryData();
  }

  loadInventoryData() {
    this.inventoryService.getItems().subscribe(items => {
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNewItem() {
    // To be implemented with dialog
    console.log('Add new item clicked');
  }

  editItem(item: InventoryItem) {
    // To be implemented with dialog
    console.log('Edit item:', item);
  }

  deleteItem(item: InventoryItem) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(item.id!).subscribe({
        next: () => {
          this.loadInventoryData();
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }

  generateQR(item: InventoryItem) {
    // Navigate to QR generator with item data
    this.router.navigate(['/qr-generator'], { state: { item } });
  }
}