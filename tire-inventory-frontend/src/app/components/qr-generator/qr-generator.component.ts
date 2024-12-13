// components/qr-generator/qr-generator.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { InventoryItem } from '../../interfaces/inventory-item';
import { InventoryService } from '../../services/inventory.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="qr-container">
      <mat-card class="qr-card">
        <mat-card-header>
          <mat-card-title>Generate QR Code</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <mat-label>Select Item</mat-label>
            <mat-select [(ngModel)]="selectedItem" (selectionChange)="generateQRCode()">
              <mat-option *ngFor="let item of inventoryItems" [value]="item">
                {{item.brand}} {{item.model}} - {{item.size}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="qr-display" *ngIf="qrDataUrl">
            <img [src]="qrDataUrl" alt="QR Code" class="qr-code">
            <button mat-raised-button color="primary" (click)="downloadQR()">
              <mat-icon>download</mat-icon>
              Download QR Code
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="scanner-card">
        <mat-card-header>
          <mat-card-title>Scan QR Code</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="scanner-placeholder">
            <mat-icon>qr_code_scanner</mat-icon>
            <p>QR Scanner Coming Soon</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .qr-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .qr-card, .scanner-card {
      padding: 20px;
    }
    .qr-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-top: 20px;
    }
    .qr-code {
      width: 300px;
      height: 300px;
    }
    mat-form-field {
      width: 100%;
    }
    .scanner-placeholder {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 2px dashed #ccc;
      margin-top: 20px;
    }
    .scanner-placeholder mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
  `]
})
export class QrGeneratorComponent implements OnInit {
  selectedItem: InventoryItem | null = null;
  qrDataUrl: string = '';
  inventoryItems: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getItems().subscribe(
      items => this.inventoryItems = items
    );
  }

  async generateQRCode() {
    if (this.selectedItem) {
      const data = JSON.stringify({
        id: this.selectedItem.id,
        sku: this.selectedItem.sku,
        brand: this.selectedItem.brand,
        model: this.selectedItem.model,
        size: this.selectedItem.size
      });

      try {
        this.qrDataUrl = await QRCode.toDataURL(data);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    }
  }

  downloadQR() {
    if (this.qrDataUrl) {
      const link = document.createElement('a');
      link.download = `QR-${this.selectedItem?.sku || 'code'}.png`;
      link.href = this.qrDataUrl;
      link.click();
    }
  }
}