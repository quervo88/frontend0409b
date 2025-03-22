import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Az API URL-je
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage(); // Ha van bejelentkezett felhasználó, töltsük be az adatokat!
  }

  // Ha van bejelentkezett felhasználó, töltsük be a localStorage-ból
  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        this.userSubject.next(JSON.parse(user));
      }
    }
  }

  // Regisztrációs metódus
  register(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registrationData);
  }

  // Bejelentkezés metódus
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        }
      })
    );
  }

  // Felhasználó adatainak lekérése a token segítségével
  getUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${this.apiUrl}/user`, { headers }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }


  // Kijelentkezés metódus
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null); // A felhasználói adatokat töröljük
  }

  // Ellenőrzi, hogy a felhasználó be van-e jelentkezve
  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }

  // Időpont foglalás metódus
  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bookings`, appointmentData);
  }
}
