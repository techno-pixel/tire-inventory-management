// components/inventory-dialog/inventory-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryItem } from '../../interfaces/inventory-item';

@Component({
  selector: 'app-inventory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Inventory Item</h2>
    <mat-dialog-content>
      <form [formGroup]="itemForm" class="item-form">
        <mat-form-field>
          <mat-label>Brand</mat-label>
          <input matInput formControlName="brand">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Model</mat-label>
          <input matInput formControlName="model">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Size</mat-label>
          <input matInput formControlName="size">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="All Season">All Season</mat-option>
            <mat-option value="Summer">Summer</mat-option>
            <mat-option value="Winter">Winter</mat-option>
            <mat-option value="Performance">Performance</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Location</mat-label>
          <input matInput formControlName="location">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!itemForm.valid">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .item-form {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class InventoryDialogComponent {
  itemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InventoryItem | null
  ) {
    this.itemForm = this.fb.group({
      brand: [data?.brand || '', Validators.required],
      model: [data?.model || '', Validators.required],
      size: [data?.size || '', Validators.required],
      type: [data?.type || '', Validators.required],
      quantity: [data?.quantity || 0, [Validators.required, Validators.min(0)]],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      location: [data?.location || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }
}