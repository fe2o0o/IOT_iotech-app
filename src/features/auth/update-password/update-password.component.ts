import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../core/validators/confirm-password.v';
import { PasswordValidatorService } from '../../../core/validators/password-validation';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent {
  constructor(private _MessageService:MessageService,private _Router:Router,private _AuthService:AuthService,private _ActivatedRoute:ActivatedRoute,private _PasswordValidatorService: PasswordValidatorService) {
    this._ActivatedRoute.queryParamMap.subscribe((params) => {
      if (params.get('userOTP') ,  params.get('email') ) {

        this.userOTP = params.get('userOTP')
        this.user_email = params.get('email')
      } else {
                this._Router.navigate(['/auth/forgot-password'])

          }
    })
  }


  userOTP: any;
  user_email:any
  update_password_form!: FormGroup;

  ngOnInit(): void {
      this.initUpdatePassForm()
  }

  isShowPass = signal<boolean>(false)
  isShowPassConfirm = signal<boolean>(false)

  initUpdatePassForm() {
    this.update_password_form = new FormGroup({
      new_password: new FormControl(null , [Validators.required]),
      confirm_password: new FormControl(null , [Validators.required , passwordMatchValidator().bind(this)]),
    })




    this.update_password_form.get('new_password')?.valueChanges.subscribe((value:string) => {
      const validaResult = this._PasswordValidatorService.validatePassword(value);
      if (!validaResult.isValid) {
        this.update_password_form.get('new_password')?.setErrors({inVaild:true})
        this.passwordValidationError = validaResult.errors
      } else {
        this.update_password_form.get('new_password')?.setErrors(null)
        this.passwordValidationError = []

      }
      console.log("validation_res" , validaResult);

    })
  }


  passwordValidationError:string[] = []


  isLoading = signal<boolean>(false)

    updatePassword() {
    this.isLoading.set(true)
    const data = {
      email: this.user_email(),
      otpCode: this.userOTP,
      newPassword: this.update_password_form.get('new_password')?.value
    }

    this._AuthService.changePassword(data).subscribe({
      next: (res:any) => {
        this.isLoading.set(false)
        this._MessageService.add({severity:'success' , summary:'Success' , detail:'Password Updated Successfully'})
        this._Router.navigate(['/auth/successfully-update'])
      },
      error: (err:any) => {
        this.isLoading.set(false)
      }
    })
  }
}
