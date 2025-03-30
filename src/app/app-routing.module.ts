import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewAppointmentComponent } from './pages/new-appointment/new-appointment.component';
import { AppointmentListComponent } from './pages/appointment-list/appointment-list.component';
import { RegisterComponent } from './register/register.component';
import { UserlistComponent } from './userlist/userlist.component';
import { LoginComponent } from './login/login.component';
import { ServicesListComponent } from './services-list/services-list.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'dashboard',
    pathMatch:'full'
  },
  {
    path:'home',
    component: DashboardComponent
  },
  {
    path:'new',
    component: NewAppointmentComponent
  },
  {
    path:'list',
    component: AppointmentListComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'superadmin', component: UserlistComponent },
  { path: 'services', component: ServicesListComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
