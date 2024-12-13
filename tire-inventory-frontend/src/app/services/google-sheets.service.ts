import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly apiUrl = 'http://localhost:8000/api/sync';

  constructor(private http: HttpClient) {}

  async appendRow(values: string[]): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(`${this.apiUrl}/sheets/append`, { values })
    );
  }

  async getSheetData(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/sheets/data`)
    );
  }

  async syncInventory(): Promise<void> {
    return lastValueFrom(
      this.http.post<void>(`${this.apiUrl}/sheets/sync`, {})
    );
  }
}