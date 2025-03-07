import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

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

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.loginObj).subscribe(
      (response: any) => {
        console.log('Sikeres bejelentkezés', response);
        localStorage.setItem('token', response.token);
      },
      error => {
        console.error('Hiba a bejelentkezés során', error);
      }
    );
  }
}
