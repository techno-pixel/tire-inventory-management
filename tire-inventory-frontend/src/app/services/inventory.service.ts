import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError, tap } from 'rxjs';
import { InventoryItem } from '../interfaces/inventory-item';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:8000/api/inventory';
  private openTireApiUrl =
    'https://raw.githubusercontent.com/yourgithub/opentire/main/data/tires.json'; // Update with actual URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getItems(): Observable<InventoryItem[]> {
    const headers = this.getHeaders();

    return this.http.get<InventoryItem[]>(this.apiUrl, { headers }).pipe(
      catchError((err) => {
        console.warn('API unavailable, returning mock data:', err);
        return of(this.mockInventory);
      })
    );
  }

  getItem(id: number): Observable<InventoryItem> {
    const headers = this.getHeaders();

    return this.http
      .get<InventoryItem>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError((err) => {
          const item = this.mockInventory.find((i) => i.id === id);
          return of(item!);
        })
      );
  }

  // addItem(item: InventoryItem): Observable<InventoryItem> {
  //   const headers = this.getHeaders();

  //   console.log('Sending item to backend:', {
  //     ...item,
  //     // Ensure dates are properly formatted
  //     lastUpdated: item.lastUpdated?.toISOString(),
  //     manufactureDate: item.manufactureDate?.toISOString()
  //   });

  //   return this.http.post<InventoryItem>(this.apiUrl, {
  //     ...item,
  //     // Ensure dates are properly formatted
  //     lastUpdated: item.lastUpdated?.toISOString(),
  //     manufactureDate: item.manufactureDate?.toISOString()
  //   }, { headers }).pipe(
  //     tap((response: InventoryItem) => console.log('Backend response:', response)),
  //     catchError(error => {
  //       console.error('Error adding item:', error);
  //       console.error('Error details:', error.error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  addItem(item: any) {
    return this.http.post(this.apiUrl, item).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding item:', error);
        console.error('Error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  updateItem(id: number, item: InventoryItem): Observable<InventoryItem> {
    const headers = this.getHeaders();

    return this.http
      .put<InventoryItem>(`${this.apiUrl}/${id}`, item, { headers })
      .pipe(
        catchError((err) => {
          const index = this.mockInventory.findIndex((i) => i.id === id);
          if (index !== -1) {
            this.mockInventory[index] = { ...item, id };
            return of(this.mockInventory[index]);
          }
          return of(item);
        })
      );
  }

  deleteItem(id: number): Observable<void> {
    const headers = this.getHeaders();

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((err) => {
        const index = this.mockInventory.findIndex((i) => i.id === id);
        if (index !== -1) {
          this.mockInventory.splice(index, 1);
        }
        return of(void 0);
      })
    );
  }

  // Add a method to fetch from OpenTire API
  fetchOpenTireData(): Observable<any> {
    return this.http.get(this.openTireApiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching OpenTire data:', error);
        return of([]);
      })
    );
  }
  private handleError<T>(result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error('API call failed:', error);
      return of(result as T);
    };
  }

  // Mock data for fallback
  private mockInventory: InventoryItem[] = [
    {
      id: 1,
      sku: 'MICH-PS4-22545R17',
      brand: 'Michelin',
      model: 'Pilot Sport 4',
      size: '225/45R17',
      type: 'Summer Performance',
      quantity: 8,
      price: 189.99,
      cost: 145.0,
      location: 'A1',
      minimumStock: 4,
      season: 'Summer',
      speedRating: 'Y',
      loadIndex: '94',
      dot: '1221',
      imageUrl: 'assets/images/michelin-ps4.jpg',
      warrantyMonths: 72,
      manufactureDate: new Date('2023-12-01'),
    },
    {
      id: 2,
      sku: 'BRID-WS90-21555R16',
      brand: 'Bridgestone',
      model: 'Blizzak WS90',
      size: '215/55R16',
      type: 'Winter',
      quantity: 12,
      price: 165.99,
      cost: 120.0,
      location: 'B2',
      minimumStock: 6,
      season: 'Winter',
      speedRating: 'H',
      loadIndex: '93',
      dot: '1123',
      imageUrl: 'assets/images/bridgestone-ws90.jpg',
      warrantyMonths: 36,
      manufactureDate: new Date('2023-11-15'),
    },
  ];
}
