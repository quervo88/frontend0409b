import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {

  appointmentObj: any = {
    "name": "",
    "mobileNo": "",
    "city": "",
    "age": 0,
    "gender": "",
    "appointmentDate": "",
    "appointmentTime": "",
    "isFirstVisit": true,
    "naration": ""
  };

  minDate: string = '';
  availableTimes: string[] = [];

  constructor(private master: MasterService) {}

  ngOnInit() {
    this.setMinDate();
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
      // Ha hétvége, ne legyenek elérhető időpontok
      this.availableTimes = [];
    } else {
      // Hétköznapokon 9:00–17:00 között félóránkénti időpontok
      this.availableTimes = this.generateTimeSlots(9, 17, 30);
    }
  }

  // Félórás léptékű időpontokat generál
  generateTimeSlots(startHour: number, endHour: number, stepMinutes: number): string[] {
    let times: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += stepMinutes) {
        times.push(this.formatTime(hour, min));
      }
    }
    return times;
  }

  // Dátum formázása YYYY-MM-DD formátumban
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Időpont formázása HH:MM formátumban
  formatTime(hour: number, minutes: number): string {
    return `${this.padZero(hour)}:${this.padZero(minutes)}`;
  }

  // Egyjegyű számokhoz 0-t ad
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Foglalás mentése
  onSaveAppointment() {
    this.master.createNew(this.appointmentObj).subscribe((res: any) => {
      if (res.result) {
        alert("Appointment Done");
      }
    }, error => {
      alert("API Error/ Check Form");
    });
  }
}
