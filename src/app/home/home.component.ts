import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  userName = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Feliratkozás a user$ observable-ra, így mindig naprakész adatokat kapunk
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = user.email;  // Az email cím a felhasználó objektumból
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  

}
