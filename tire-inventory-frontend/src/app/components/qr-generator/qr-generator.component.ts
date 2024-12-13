// qr-generator.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { InventoryItem } from '../../interfaces/inventory-item';
import { InventoryService } from '../../services/inventory.service';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    ZXingScannerModule
  ]
})
export class QrGeneratorComponent implements OnInit, OnDestroy {
  selectedItem: InventoryItem | null = null;
  qrDataUrl: string = '';
  inventoryItems: InventoryItem[] = [];
  isScanning = true; // Set to true by default to show scanner
  hasDevices: boolean = false;
  currentDevice: MediaDeviceInfo | undefined;

  constructor(
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadInventoryData();
  }

  ngOnDestroy() {
    this.isScanning = false;
  }

  private loadInventoryData() {
    this.inventoryService.getItems().subscribe(
      items => this.inventoryItems = items,
      error => this.showMessage('Error loading inventory items')
    );
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.hasDevices = devices && devices.length > 0;
    if (this.hasDevices) {
      this.currentDevice = devices[0];
    }
  }

  onScanSuccess(result: string) {
    try {
      const scannedData = JSON.parse(result);
      const matchingItem = this.inventoryItems.find(item => item.id === scannedData.id);
      if (matchingItem) {
        this.selectedItem = matchingItem;
        this.generateQRCode();
        this.showMessage('Item found!');
      } else {
        this.showMessage('Item not found in inventory');
      }
    } catch (e) {
      this.showMessage('Invalid QR code');
    }
  }

  async generateQRCode() {
    if (!this.selectedItem) return;
    
    try {
      const data = JSON.stringify({
        id: this.selectedItem.id,
        sku: this.selectedItem.sku,
        brand: this.selectedItem.brand,
        model: this.selectedItem.model,
        size: this.selectedItem.size,
        timestamp: new Date().toISOString()
      });
      
      this.qrDataUrl = await QRCode.toDataURL(data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (err) {
      this.showMessage('Error generating QR code');
    }
  }

  downloadQR() {
    if (!this.qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `QR-${this.selectedItem?.sku || 'code'}.png`;
    link.href = this.qrDataUrl;
    link.click();
  }

  saveToSheets() {
    if (!this.selectedItem) return;
    this.showSuccess('Feature coming soon!');
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }


  private showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}