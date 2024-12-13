import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryItem } from '../../interfaces/inventory-item';
import { TireDataService } from '../../services/tire-data.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Inventory Item</h2>
    <div mat-dialog-content>
      <form [formGroup]="itemForm" class="form-container">
        <div class="form-row">
          <mat-form-field>
            <mat-label>Brand</mat-label>
            <input
              matInput
              [matAutocomplete]="brandAuto"
              formControlName="brand"
            />
            <mat-autocomplete #brandAuto="matAutocomplete">
              <mat-option *ngFor="let brand of popularBrands" [value]="brand">
                {{ brand }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="itemForm.get('brand')?.hasError('required')">
              Brand is required
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Model</mat-label>
            <input matInput formControlName="model" />
            <mat-error *ngIf="itemForm.get('model')?.hasError('required')">
              Model is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field>
            <mat-label>Size</mat-label>
            <input matInput formControlName="size" placeholder="225/45R17" />
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
        </div>

        <div class="form-row">
          <mat-form-field>
            <mat-label>Speed Rating</mat-label>
            <input matInput formControlName="speedRating" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Load Index</mat-label>
            <input matInput formControlName="loadIndex" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field>
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field>
            <mat-label>Tread Depth</mat-label>
            <input matInput type="number" formControlName="treadDepth" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Weight</mat-label>
            <input matInput type="number" formControlName="weight" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field>
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Minimum Stock</mat-label>
            <input matInput type="number" formControlName="minimumStock" />
          </mat-form-field>
        </div>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="!itemForm.valid"
      >
        {{ data ? 'Update' : 'Save' }}
      </button>
    </div>
  `,
  styles: [
    `
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 500px;
        max-height: 70vh;
        overflow-y: auto;
      }
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
    `,
  ],
})
export class InventoryDialogComponent implements OnInit {
  itemForm: FormGroup;
  popularBrands: string[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InventoryDialogComponent>,
    private tireDataService: TireDataService,
    @Inject(MAT_DIALOG_DATA) public data: InventoryItem | null
  ) {
    this.itemForm = this.createForm();
  }

  ngOnInit() {
    this.popularBrands = this.tireDataService.getPopularBrands();

    // Auto-fill specifications when brand and model are entered
    this.itemForm
      .get('brand')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.updateSpecifications());

    this.itemForm
      .get('model')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.updateSpecifications());

    // If editing, populate form with existing data
    if (this.data) {
      this.itemForm.patchValue(this.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(2)]],
      model: ['', [Validators.required, Validators.minLength(1)]],
      size: [
        '',
        [Validators.required, Validators.pattern(/^\d{3}\/\d{2}R\d{2}$/)],
      ],
      type: ['All Season', Validators.required],
      speedRating: ['', Validators.required],
      loadIndex: ['', [Validators.required, Validators.pattern(/^\d{2,3}$/)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      minimumStock: [5, [Validators.required, Validators.min(0)]],
      season: ['All Season', Validators.required],
      treadDepth: [0, [Validators.required, Validators.min(0)]], // New field
      weight: [0, [Validators.required, Validators.min(0)]], // New field
      dot: [''],
      notes: [''],
      warrantyMonths: [0, [Validators.min(0)]],
    });
  }

  private updateSpecifications() {
    const brand = this.itemForm.get('brand')?.value;
    const model = this.itemForm.get('model')?.value;

    if (brand && model) {
      this.loading = true;
      this.tireDataService
        .getTireSpecification(brand, model)
        .subscribe((spec) => {
          if (spec) {
            this.itemForm.patchValue({
              size: spec.size,
              type: spec.type,
              speedRating: spec.speedRating,
              loadIndex: spec.loadIndex,
            });
          }
          this.loading = false;
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Form validity:', this.itemForm.valid);
    console.log('Form values:', this.itemForm.value);
    console.log('Form errors:', this.itemForm.errors);

    // Log individual control validation states
    Object.keys(this.itemForm.controls).forEach((key) => {
      const control = this.itemForm.get(key);
      console.log(`${key} validity:`, {
        valid: control?.valid,
        errors: control?.errors,
        value: control?.value,
      });
    });

    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      // Generate SKU
      const sku = `${formValue.brand
        .substring(0, 4)
        .toUpperCase()}-${formValue.model
        .substring(0, 4)
        .toUpperCase()}-${formValue.size.replace('/', '').replace('R', '')}`;

      const item: InventoryItem = {
        ...formValue,
        sku,
        lastUpdated: new Date(),
        id: this.data?.id,
      };

      console.log('Saving item:', item);
      this.dialogRef.close(item);
    }
  }
}
