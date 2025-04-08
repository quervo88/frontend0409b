import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginObj).subscribe(
      (response: any) => {
        console.log('Sikeres bejelentkezés', response);
        localStorage.setItem('token', response.data.token);
        alert('Sikeres bejelentkezés!');

        // Itt a navigateByUrl használata biztosítja, hogy a home újra legyen töltve
        this.router.navigateByUrl('/home').then(() => {
          window.location.reload();  // Ezzel frissítjük az oldalt
        });
      },
      error => {
        console.error('Hiba a bejelentkezés során', error);
        alert('Hibás bejelentkezési adatok!');
      }
    );
  }
}

