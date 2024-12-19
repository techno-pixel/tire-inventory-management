import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

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
  private isBrowser: boolean;

  // Default specifications for common tire types
  private defaultSpecs: { [key: string]: Partial<TireSpecification> } = {
    'all_season': {
      type: 'All Season',
      speedRating: 'H',
      loadIndex: '94',
      construction: 'Radial'
    },
    'summer': {
      type: 'Summer',
      speedRating: 'Y',
      loadIndex: '95',
      construction: 'Radial'
    },
    'winter': {
      type: 'Winter',
      speedRating: 'T',
      loadIndex: '92',
      construction: 'Radial'
    }
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFromCache();
  }

  private loadFromCache() {
    if (this.isBrowser) {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        try {
          this.tireSpecsCache.next(JSON.parse(cached));
        } catch (e) {
          console.error('Error loading cached tire specs:', e);
        }
      }
    }
  }

  // getTireSpecification(brand: string, model: string): Observable<TireSpecification | null> {
  //   const key = `${brand}-${model}`.toLowerCase();
  //   const cached = this.tireSpecsCache.value[key];
    
  //   if (cached) {
  //     return of(cached);
  //   }

  //   // Return a default specification if no cache
  //   return of(this.createDefaultSpec(brand, model));
  // }

  // private createDefaultSpec(brand: string, model: string): TireSpecification {
  //   // Determine tire type from model name
  //   let baseSpecs = this.defaultSpecs['all_season'];
  //   if (model.toLowerCase().includes('winter') || model.toLowerCase().includes('snow')) {
  //     baseSpecs = this.defaultSpecs['winter'];
  //   } else if (model.toLowerCase().includes('sport') || model.toLowerCase().includes('summer')) {
  //     baseSpecs = this.defaultSpecs['summer'];
  //   }

  //   return {
  //     brand,
  //     model,
  //     size: '225/45R17', // Default size
  //     type: baseSpecs.type || 'All Season',
  //     speedRating: baseSpecs.speedRating || 'H',
  //     loadIndex: baseSpecs.loadIndex || '94',
  //     rimDiameter: 17,
  //     sectionWidth: 225,
  //     aspectRatio: 45,
  //     construction: baseSpecs.construction || 'Radial',
  //     maxLoad: 1356,
  //     maxPressure: 51,
  //     treadDepth: 8.5,
  //     weight: 11.2
  //   };
  // }

  getTireSpecification(brand: string, model: string): Observable<TireSpecification | null> {
    const key = `${brand}-${model}`.toLowerCase();
    const cached = this.tireSpecsCache.value[key];
    if (cached) {
      return of(cached);
    }
    return of(this.createDefaultSpec(brand, model));
  }

private createDefaultSpec(brand: string, model: string): TireSpecification {
    return {
      brand,
      model,
      size: '225/45R17',
      type: 'All Season',
      speedRating: 'H',
      loadIndex: '94',
      rimDiameter: 17,
      sectionWidth: 225,
      aspectRatio: 45,
      construction: 'Radial',
      maxLoad: 1356,
      maxPressure: 51,
      treadDepth: 8.5,
      weight: 11.2,
    };
  }

  searchTireSpecs(query: string): Observable<TireSpecification[]> {
    if (!query?.trim()) {
      return of([]);
    }

    // Instead of making API calls, return matching default specs
    return of(this.getPopularBrands()
      .filter(brand => brand.toLowerCase().includes(query.toLowerCase()))
      .map(brand => this.createDefaultSpec(brand, 'Standard Model'))
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