import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../core/validators/confirm-password.v';
import { PasswordValidatorService } from '../../../core/validators/password-validation';
@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent {
  constructor(private _PasswordValidatorService:PasswordValidatorService){}
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
}
