import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { isPlatformBrowser } from '@angular/common'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse currentUser from localStorage:', e);
          this.currentUserSubject.next(null);
        }
      }
    }
  }
  
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (this.isBrowser && response?.user && response?.token) {
            try {
              localStorage.setItem('token', response.token);
              localStorage.setItem('currentUser', JSON.stringify(response.user));
            } catch (e) {
              console.error('Failed to save user to localStorage:', e);
            }
            this.currentUserSubject.next(response.user);
          } else {
            console.warn('Invalid API response:', response);
          }
        })
      );
  }
  

  // constructor(
  //   private http: HttpClient,
  //   @Inject(PLATFORM_ID) private platformId: Object
  // ) {
  //   this.isBrowser = isPlatformBrowser(this.platformId);
  //   if (this.isBrowser) {
  //     const storedUser = localStorage.getItem('currentUser');
  //     if (storedUser) {
  //       this.currentUserSubject.next(JSON.parse(storedUser));
  //     }
  //   }
  // }

  // login(credentials: { username: string; password: string }): Observable<any> {
  //   return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/login`, credentials)
  //     .pipe(
  //       tap(response => {
  //         if (this.isBrowser) {
  //           localStorage.setItem('token', response.token);
  //           localStorage.setItem('currentUser', JSON.stringify(response.user));
  //         }
  //         this.currentUserSubject.next(response.user);
  //       })
  //     );
  // }

  register(user: User): Observable<any> {
    return this.http.post<{ user: User; token: string }>(`${this.apiUrl}/register`, user)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }
}
