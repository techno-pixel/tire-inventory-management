import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { InventoryItem } from '../interfaces/inventory-item';
import { environment } from '../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8000/api/inventory';

  // Mock data for initial testing
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
    }
  ];

  constructor(private http: HttpClient) { }

  getItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl).pipe(
      catchError(err => {
        console.warn('API unavailable, returning mock data');
        return of(this.mockInventory);
      })
    );
  }

  getItem(id: number): Observable<InventoryItem> {
    // For testing
    // const item = this.mockInventory.find(i => i.id === id);
    // return of(item!);
    
    // When backend is ready:
    return this.http.get<InventoryItem>(`${this.apiUrl}/${id}`);
  }

  addItem(item: InventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item).pipe(
      catchError((error) => {
        console.error('Error adding item:', error);
        return of(error);
      })
    );
  }

  updateItem(id: number, item: InventoryItem): Observable<InventoryItem> {
    // For testing
    // const index = this.mockInventory.findIndex(i => i.id === id);
    // if (index !== -1) {
    //   this.mockInventory[index] = { ...item, id };
    //   return of(this.mockInventory[index]);
    // }
    // return of(item);
    
    // When backend is ready:
    return this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    // For testing
    // const index = this.mockInventory.findIndex(i => i.id === id);
    // if (index !== -1) {
    //   this.mockInventory.splice(index, 1);
    // }
    // return of(void 0);
    
    // When backend is ready:
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

