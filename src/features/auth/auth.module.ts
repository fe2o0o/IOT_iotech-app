import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthBaseComponent } from './auth-base/auth-base.component';
import { AuthOuletComponent } from './auth-oulet/auth-oulet.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../shared/modules/shared/shared.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { OTPVerficationComponent } from './otp-verfication/otp-verfication.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';


@NgModule({
  declarations: [
    AuthBaseComponent,
    AuthOuletComponent,
    LoginComponent,
    ForgetPasswordComponent,
    OTPVerficationComponent,
    UpdatePasswordComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
