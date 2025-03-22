import { Component } from '@angular/core';
import { AuthService } from './auth.service'; // AuthService importálása

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // javítva a styleUrls
})
export class AppComponent {
  title = 'booking';

  constructor(public authService: AuthService) { } // AuthService injektálása

  // Kijelentkezés metódus
  logout(): void {
    this.authService.logout();
  }
}
