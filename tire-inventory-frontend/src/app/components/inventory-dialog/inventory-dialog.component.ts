import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryItem } from '../../interfaces/inventory-item';
import { TireDataService } from '../../services/tire-data.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

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
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Inventory Item</h2>
    <div mat-dialog-content>
      <form [formGroup]="itemForm" class="form-container">
        <div class="form-row">
          <mat-form-field>
            <mat-label>Brand</mat-label>
            <input matInput [matAutocomplete]="brandAuto" formControlName="brand">
            <mat-autocomplete #brandAuto="matAutocomplete">
              <mat-option *ngFor="let brand of popularBrands" [value]="brand">
                {{brand}}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Model</mat-label>
            <input matInput formControlName="model" 
                   (input)="onModelInput()"
                   [matAutocomplete]="modelAuto">
            <mat-autocomplete #modelAuto="matAutocomplete">
              <mat-option *ngFor="let spec of tireSpecs" 
                         [value]="spec.model"
                         (click)="autoFillSpec(spec)">
                {{spec.model}}
              </mat-option>
            </mat-autocomplete>
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
          </mat-form-field>
        </div>

        <!-- Rest of your form fields -->
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="itemForm.invalid || loading"
              (click)="onSave()">
        Save
      </button>
    </div>
  `,
  styles: [`
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
  `]
})
export class InventoryDialogComponent implements OnInit {
  itemForm: FormGroup;
  popularBrands: string[] = [];
  tireSpecs: any[] = [];
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
    
    this.itemForm.get('model')?.valueChanges.pipe(
      debounceTime(300),
      tap(() => this.loading = true),
      switchMap(value => this.tireDataService.searchTireSpecs(value))
    ).subscribe(specs => {
      this.tireSpecs = specs;
      this.loading = false;
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      size: ['', Validators.required],
      type: ['', Validators.required],
      speedRating: ['', Validators.required],
      loadIndex: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      minimumStock: [5, [Validators.required, Validators.min(0)]],
      rimDiameter: [''],
      sectionWidth: [''],
      aspectRatio: [''],
      construction: [''],
      maxLoad: [''],
      maxPressure: [''],
      treadDepth: [''],
      weight: [''],
      notes: ['']
    });
  }

  onModelInput() {
    const brand = this.itemForm.get('brand')?.value;
    const model = this.itemForm.get('model')?.value;
    
    if (brand && model) {
      this.loading = true;
      this.tireDataService.getTireSpecification(brand, model)
        .subscribe(spec => {
          if (spec) {
            this.autoFillSpec(spec);
          }
          this.loading = false;
        });
    }
  }

  autoFillSpec(spec: any) {
    this.itemForm.patchValue({
      size: spec.size,
      type: spec.type,
      speedRating: spec.speedRating,
      loadIndex: spec.loadIndex,
      rimDiameter: spec.rimDiameter,
      sectionWidth: spec.sectionWidth,
      aspectRatio: spec.aspectRatio,
      construction: spec.construction,
      maxLoad: spec.maxLoad,
      maxPressure: spec.maxPressure,
      treadDepth: spec.treadDepth,
      weight: spec.weight
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      
      // Generate SKU
      const sku = `${formValue.brand.substring(0,4).toUpperCase()}-${
        formValue.model.substring(0,4).toUpperCase()}-${
        formValue.size.replace('/', '').replace('R', '')
      }`;

      const item: InventoryItem = {
        ...formValue,
        sku,
        lastUpdated: new Date(),
        id: this.data?.id
      };

      this.dialogRef.close(item);
    }
  }
}