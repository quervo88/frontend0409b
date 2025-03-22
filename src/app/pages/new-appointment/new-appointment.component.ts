import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  appointmentObj: any = {
    service: '',
    appointmentDate: '',
    appointmentTime: '',
    stylist: ''
  };

  minDate: string = '';
  availableTimes: string[] = [];
  user: any = null;

  stylistImage: string = ''; // A kiválasztott fodrász képe
  stylists: { name: string, value: string, image: string }[] = [
    { name: 'Sándor', value: 'sandor', image: 'assets/img/sandor2.png' },
    { name: 'Hajni', value: 'hajni', image: 'assets/img/hajni2.png' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.setMinDate();
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    // Feliratkozás a felhasználó változásaira
    this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    // Ha az oldal újratöltődik, lekérdezzük a felhasználót a backendből
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  updateAvailableTimes() {
    if (!this.appointmentObj.appointmentDate) return;

    const selectedDate = new Date(this.appointmentObj.appointmentDate);
    const day = selectedDate.getDay();

    if (day === 0 || day === 6) {
      this.availableTimes = [];
    } else {
      this.availableTimes = this.generateTimeSlots(9, 17, 30);
    }
  }

  generateTimeSlots(startHour: number, endHour: number, stepMinutes: number): string[] {
    let times: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += stepMinutes) {
        times.push(`${this.padZero(hour)}:${this.padZero(min)}`);
      }
    }
    return times;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  onStylistChange() {
    const selectedStylist = this.stylists.find(s => s.value === this.appointmentObj.stylist);
    this.stylistImage = selectedStylist ? selectedStylist.image : '';
  }

  onSaveAppointment() {
    if (!this.user) {
      alert('Be kell jelentkezni a foglaláshoz!');
      return;
     
    }

    if (!this.appointmentObj.appointmentDate || !this.appointmentObj.appointmentTime || !this.appointmentObj.service || !this.appointmentObj.stylist) {
      alert('Kérlek, töltsd ki az összes mezőt!');
      return;
    }

    const bookingData = {
      user_id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      service: this.appointmentObj.service,
      stylist: this.appointmentObj.stylist,
      appointmentDate: this.appointmentObj.appointmentDate,
      appointmentTime: this.appointmentObj.appointmentTime
    };

    console.log(bookingData)

    // this.authService.bookAppointment(bookingData).subscribe(
    //   (res: any) => {
    //     alert('Foglalás sikeresen mentve!');
    //   },
    //   error => {
    //     alert('Hiba történt a foglalás során: ' + (error.error?.message || 'Ismeretlen hiba'));
    //   }
    // );
  }
}
