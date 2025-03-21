import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  appointmentObj: any = {
    name: '',
    email: '',
    mobileNo: '',
    city: '',
    age: 0,
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    isFirstVisit: true,
    naration: ''
  };

  minDate: string = '';
  availableTimes: string[] = [];
  user: any = null;

  constructor(private master: MasterService, private authService: AuthService) {}

  ngOnInit() {
    this.setMinDate();
    this.loadUserData();
  }

  // Betölti a bejelentkezett felhasználó adatait
  loadUserData() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.appointmentObj.name = user.name;
        this.appointmentObj.email = user.email;
      }
    }, error => {
      console.error('Nem sikerült lekérni a felhasználói adatokat:', error);
    });
  }

  // Beállítja a mai napot minimum dátumnak
  setMinDate() {
    const today = new Date();
    this.minDate = this.formatDate(today);
  }

  // Frissíti az elérhető időpontokat az adott nap alapján
  updateAvailableTimes() {
    if (!this.appointmentObj.appointmentDate) return;

    const selectedDate = new Date(this.appointmentObj.appointmentDate);
    const day = selectedDate.getDay(); // 0: Vasárnap, 1: Hétfő, ..., 6: Szombat

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
        times.push(this.formatTime(hour, min));
      }
    }
    return times;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(hour: number, minutes: number): string {
    return `${this.padZero(hour)}:${this.padZero(minutes)}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Foglalás mentése
  onSaveAppointment() {
    if (!this.user) {
      alert('Be kell jelentkezni a foglaláshoz!');
      return;
    }

    const bookingData = {
      user_id: this.user.id,
      name: this.appointmentObj.name,
      email: this.appointmentObj.email,
      appointmentDate: this.appointmentObj.appointmentDate,
      appointmentTime: this.appointmentObj.appointmentTime
    };

    this.authService.bookAppointment(bookingData).subscribe(
      (res: any) => {
        alert('Foglalás sikeresen mentve!');
      },
      error => {
        alert('Hiba történt a foglalás során: ' + (error.error?.message || 'Ismeretlen hiba'));
      }
    );
  }
}
