// services/mock-data.service.ts
import { Injectable } from '@angular/core';
import { InventoryItem } from '../interfaces/inventory-item';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockInventory: InventoryItem[] = [
    {
      id: 1,
      sku: "MICH-PS4-22545R17",
      brand: "Michelin",
      model: "Pilot Sport 4",
      size: "225/45R17",
      type: "Summer Performance",
      quantity: 8,
      price: 189.99,
      cost: 145.00,
      location: "A1",
      minimumStock: 4,
      season: "Summer",
      speedRating: "Y",
      loadIndex: "94",
      dot: "1221",
      imageUrl: "assets/images/michelin-ps4.jpg",
      warrantyMonths: 72,
      manufactureDate: new Date("2023-12-01")
    },
    {
      id: 2,
      sku: "BRID-WS90-21555R16",
      brand: "Bridgestone",
      model: "Blizzak WS90",
      size: "215/55R16",
      type: "Winter",
      quantity: 12,
      price: 165.99,
      cost: 120.00,
      location: "B2",
      minimumStock: 6,
      season: "Winter",
      speedRating: "H",
      loadIndex: "93",
      dot: "1123",
      imageUrl: "assets/images/bridgestone-ws90.jpg",
      warrantyMonths: 36,
      manufactureDate: new Date("2023-11-15")
    },
    {
      id: 3,
      sku: "CONT-DWS06-24540R19",
      brand: "Continental",
      model: "ExtremeContact DWS06 Plus",
      size: "245/40R19",
      type: "All Season",
      quantity: 4,
      price: 209.99,
      cost: 160.00,
      location: "C3",
      minimumStock: 4,
      season: "All Season",
      speedRating: "Y",
      loadIndex: "98",
      dot: "1224",
      imageUrl: "assets/images/continental-dws06.jpg",
      warrantyMonths: 60,
      manufactureDate: new Date("2023-12-15")
    },
    // Add more mock data...
  ];

  getMockInventory(): InventoryItem[] {
    return this.mockInventory;
  }

  addMockItem(item: InventoryItem) {
    const newId = Math.max(...this.mockInventory.map(i => i.id || 0)) + 1;
    const newItem = { ...item, id: newId };
    this.mockInventory.push(newItem);
    return newItem;
  }

  updateMockItem(id: number, item: InventoryItem) {
    const index = this.mockInventory.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockInventory[index] = { ...item, id };
      return this.mockInventory[index];
    }
    return null;
  }

  deleteMockItem(id: number) {
    const index = this.mockInventory.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockInventory.splice(index, 1);
      return true;
    }
    return false;
  }
}