import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthOuletComponent } from './auth-oulet/auth-oulet.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OTPVerficationComponent } from './otp-verfication/otp-verfication.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthOuletComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgetPasswordComponent },
      { path: 'otp-verfication', component: OTPVerficationComponent },
      {path:'update-password' , component:UpdatePasswordComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
