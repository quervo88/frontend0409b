import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';  // Biztosítsuk, hogy az AuthService be van importálva
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {

  services: any[] = [];
  newService = { name: '', price: null };  // Az új szolgáltatás tárolására szolgáló objektum
  editingService: any = null;  // Az éppen szerkesztett szolgáltatás

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getServices();  // A szolgáltatások betöltése az oldal betöltődésekor
  }

  // Szolgáltatások lekérése
  getServices(): void {
    this.authService.getServices().subscribe(
      (response) => {
        if (response.success) {
          this.services = response.data;  // Beállítjuk a szolgáltatásokat
        } else {
          console.error('Nem sikerült a szolgáltatások betöltése');
        }
      },
      (error) => {
        console.error('Hiba történt a szolgáltatások lekérésekor:', error);
      }
    );
  }

  // Új szolgáltatás hozzáadása
  addService(): void {
    if (this.newService.name && this.newService.price !== null) {
      const serviceData = {
        service: this.newService.name,
        price: this.newService.price // Az ár most már számként van kezelve
      };

      this.authService.addService(serviceData).subscribe(
        (response) => {
          if (response.success) {
            this.services.push(response.data);  // Hozzáadjuk az új szolgáltatást
            this.newService = { name: '', price: null };  // Kiürítjük az űrlapot
          } else {
            console.error('Hiba történt a szolgáltatás hozzáadásakor');
          }
        },
        (error) => {
          console.error('Hiba történt a szolgáltatás hozzáadásakor:', error);
        }
      );
    } else {
      console.error('Kérem adja meg a szolgáltatás nevét és árát.');
    }
  }

  // Szolgáltatás szerkesztése
  editService(service: any): void {
    this.editingService = { ...service };  // Átmásoljuk az aktuális szolgáltatást a szerkesztéshez
  }

  deleteService(serviceId: number): void {
    if (confirm('Biztosan törölni szeretné ezt a szolgáltatást?')) {
      this.authService.deleteService(serviceId).subscribe(
        (response) => {
          if (response.success) {
            // Ha sikeres a törlés, eltávolítjuk a törölt szolgáltatást a listából
            this.services = this.services.filter(service => service.id !== serviceId);
            console.log('Szolgáltatás törölve');
          } else {
            console.error('Hiba történt a szolgáltatás törlésekor');
          }
        },
        (error) => {
          console.error('Hiba történt a szolgáltatás törlésekor:', error);
        }
      );
    }
  }
  

  // Módosított szolgáltatás mentése
  saveEditedService(): void {
    if (this.editingService && this.editingService.id) {
      // Az ár konvertálása szám típusúra (ha még nem az)
      const updatedService = {
        service: this.editingService.service,
        price: parseFloat(this.editingService.price) // Az ár konvertálása számra
      };

      this.authService.updateService(this.editingService.id, updatedService).subscribe(
        (response) => {
          if (response.success) {
            const index = this.services.findIndex(service => service.id === this.editingService.id);
            if (index !== -1) {
              this.services[index] = response.data;  // Frissítjük a szolgáltatást
            }
            this.editingService = null;  // Kilépünk a szerkesztési módból
          } else {
            console.error('Hiba történt a szolgáltatás módosításakor');
          }
        },
        (error) => {
          console.error('Hiba történt a szolgáltatás módosításakor:', error);
        }
      );
    }
  }

  // Módosítás lemondása
  cancelEdit(): void {
    this.editingService = null;  // Kilépünk a szerkesztésből
  }
}
