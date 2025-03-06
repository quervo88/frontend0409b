import { Component } from '@angular/core';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrl: './new-appointment.component.css'
})
export class NewAppointmentComponent {

  appointmentObj: any =
  {
    "name": "",
    "mobileNo": "",
    "city": "",
    "age": 0,
    "gender": "",
    "appointmentDate": "2025-03-06T16:18:14.770Z",
    "appointmentTime": "",
    "isFirstVisit": true,
    "naration": ""
  }

}
