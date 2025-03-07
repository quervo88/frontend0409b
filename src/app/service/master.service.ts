import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiEndPoint: string="https://freeapi.miniprojectideas.com/api/HospitalAppointment/"

  constructor(private http: HttpClient) { }

  createNew(obj:any): Observable<any>
  {
    return this.http.post(this.apiEndPoint + "AddNewAppointment", obj)
  }

  getAllAppointments ()
  {
    return this.http.get< Observable<any> >(this.apiEndPoint + "GetAllAppointments") 
  }
  getAllTodaysAppointments ()
  {
    return this.http.get< Observable<any> >(this.apiEndPoint + "GetTodaysAppointments") 
  }
}
