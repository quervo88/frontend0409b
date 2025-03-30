import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe((response: any) => {
      this.users = response.data;  // Feltételezzük, hogy a válaszban a felhasználók a 'data' kulcs alatt találhatók
    });
  }

  setAdmin(id: number) {
    this.authService.setAdmin(id).subscribe((response) => {
      alert(response.message);
      this.loadUsers();  // A felhasználók újratöltése a módosítás után
    });
  }

  demotivate(id: number) {
    this.authService.demotivate(id).subscribe((response) => {
      alert(response.message);
      this.loadUsers();  // A felhasználók újratöltése a módosítás után
    });
  }

  addEmployee(userId: number) {
    this.authService.addEmployee(userId).subscribe(response => {
      alert(response.message);
      this.loadUsers(); // Újratöltjük a felhasználók listáját
    }, error => {
      alert(error.error.message); // Hibakezelés, ha a felhasználó már dolgozó
    });
  }
  
}
