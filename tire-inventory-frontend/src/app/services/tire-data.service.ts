import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface TireSpecification {
  brand: string;
  model: string;
  size: string;
  type: string;
  speedRating: string;
  loadIndex: string;
  rimDiameter: number;
  sectionWidth: number;
  aspectRatio: number;
  construction: string;
  maxLoad: number;
  maxPressure: number;
  treadDepth: number;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class TireDataService {
  private tireSpecsCache = new BehaviorSubject<{[key: string]: TireSpecification}>({});
  private readonly GITHUB_API = 'https://api.github.com/repos/OpenTire/OpenTire/contents/data/specifications';
  private readonly CACHE_KEY = 'tire_specifications';

  constructor(private http: HttpClient) {
    this.loadFromCache();
  }

  private loadFromCache() {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        this.tireSpecsCache.next(JSON.parse(cached));
      } catch (e) {
        console.error('Error loading cached tire specs:', e);
      }
    }
  }

  getTireSpecification(brand: string, model: string): Observable<TireSpecification | null> {
    const key = `${brand}-${model}`.toLowerCase();
    const cached = this.tireSpecsCache.value[key];
    if (cached) {
      return of(cached);
    }
    
    return this.fetchTireSpec(brand, model);
  }

  private fetchTireSpec(brand: string, model: string): Observable<TireSpecification | null> {
    const query = `${brand} ${model}`.toLowerCase();
    
    return this.http.get<any>(`${this.GITHUB_API}/search?q=${query}`).pipe(
      map(response => this.parseTireSpec(response)),
      tap(spec => {
        if (spec) {
          const newCache = {
            ...this.tireSpecsCache.value,
            [`${brand}-${model}`.toLowerCase()]: spec
          };
          this.tireSpecsCache.next(newCache);
          localStorage.setItem(this.CACHE_KEY, JSON.stringify(newCache));
        }
      }),
      catchError(error => {
        console.error('Error fetching tire spec:', error);
        return of(null);
      })
    );
  }

  private parseTireSpec(rawData: any): TireSpecification | null {
    try {
      // Transform OpenTire data format to our format
      return {
        brand: rawData.brand,
        model: rawData.model,
        size: rawData.size,
        type: rawData.type,
        speedRating: rawData.speed_rating,
        loadIndex: rawData.load_index,
        rimDiameter: parseFloat(rawData.rim_diameter),
        sectionWidth: parseFloat(rawData.section_width),
        aspectRatio: parseFloat(rawData.aspect_ratio),
        construction: rawData.construction,
        maxLoad: parseFloat(rawData.max_load),
        maxPressure: parseFloat(rawData.max_pressure),
        treadDepth: parseFloat(rawData.tread_depth),
        weight: parseFloat(rawData.weight)
      };
    } catch (e) {
      console.error('Error parsing tire spec:', e);
      return null;
    }
  }

  searchTireSpecs(query: string): Observable<TireSpecification[]> {
    return this.http.get<any>(`${this.GITHUB_API}/search?q=${query}`).pipe(
      map(response => response.items.map((item: any) => this.parseTireSpec(item))),
      catchError(error => {
        console.error('Error searching tire specs:', error);
        return of([]);
      })
    );
  }

  getPopularBrands(): string[] {
    return [
      'Michelin',
      'Bridgestone',
      'Goodyear',
      'Continental',
      'Pirelli',
      'Dunlop',
      'Yokohama',
      'Toyo',
      'Cooper',
      'Hankook'
    ];
  }
}