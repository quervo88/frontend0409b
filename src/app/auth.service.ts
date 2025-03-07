import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api'; 
  // Az alap API URL, nem tartalmazza a /register vagy /login végpontokat

  constructor(private http: HttpClient) { }

  register(registrationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registrationData);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
