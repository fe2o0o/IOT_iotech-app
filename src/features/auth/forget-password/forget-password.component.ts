import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  constructor(private _Router:Router,private _MessageService:MessageService , private _AuthService:AuthService){}

  ngOnInit(): void {
    this.initForgotPasswordForm()
  }


  initForgotPasswordForm() {
    this.forgot_pass_form = new FormGroup({
      email: new FormControl(null , [Validators.required , Validators.email])
    })
  }

  forgot_pass_form!: FormGroup;

  handleForgetPassword() {
    this.isLoading.set(true)
    this._AuthService.forgotPassword(this.forgot_pass_form.value).subscribe({
      next: (res: any) => {
           this._Router.navigate(['/auth/otp-verfication'], {
          queryParams:{email:this.forgot_pass_form.value?.email}
        })
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Please check your email' })
      },
      error: (err) => {
        this.isLoading.set(false)
      }
    })
  }

  isLoading = signal<boolean>(false)
}
