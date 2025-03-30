import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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

    return this.http.get<any>(`${this.apiUrl}/user`, { headers }).pipe(
      tap(user => this.userSubject.next(user))
    );
  }

  // Felhasználók listájának lekérése
  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/getusers`, { headers });
  }

  setAdmin(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/admin/${id}`, {}, { headers });
  }

  demotivate(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.apiUrl}/polymorph/${id}`, {}, { headers });
  }

  addEmployee(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add-employee/${userId}`, {}, { headers });
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
  bookAppointment(bookingData: any) {
    return this.http.post(`${this.apiUrl}/bookings`, bookingData);
  }

  // Szolgáltatások listájának lekérése
  getServices(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any>(`${this.apiUrl}/services`, { headers });
  }

  // Szolgáltatás hozzáadása
  addService(serviceData: { service: string, price: number }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.apiUrl}/addservice`, serviceData, { headers });
  }

  // Szolgáltatás frissítése
  updateService(id: number, service: { service: string, price: number }): Observable<any> {
    // Konvertáljuk a price mezőt számra, ha még nem az
    const updatedService = {
      service: service.service,
      price: typeof service.price === 'string' ? parseFloat(service.price) : service.price  // Az ár biztosan szám lesz
    };
  
    return this.http.put(`${this.apiUrl}/updateservice/${id}`, updatedService);
  }

  // Szolgáltatás törlése
  deleteService(serviceId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.delete(`${this.apiUrl}/deleteservice/${serviceId}`, { headers });
  }

  getEmployees(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any>(`${this.apiUrl}/employees`, { headers });
  }

  getBookedAppointments(employeeId: number, date: string): Observable<string[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<string[]>(`${this.apiUrl}/booked-appointments/${employeeId}/${date}`, { headers });
  }
  
  
}
