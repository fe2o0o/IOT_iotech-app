import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {


  ngOnInit(): void {
    this.initForgotPasswordForm()
  }


  initForgotPasswordForm() {
    this.forgot_pass_form = new FormGroup({
      email: new FormControl(null , [Validators.required , Validators.email])
    })
  }

  forgot_pass_form!: FormGroup;


  isLoading = signal<boolean>(false)
}
