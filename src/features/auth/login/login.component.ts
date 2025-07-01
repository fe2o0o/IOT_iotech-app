import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  constructor(private _Router:Router,private _AuthService:AuthService){}
  loginForm!: FormGroup;

  ngOnInit(): void {
      this.initLoginForm()
  }

  isLoginBtnLoading = signal<boolean>(false)


  isShowPass = signal<boolean>(false)

  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email , Validators.required]),
      password: new FormControl(null , [Validators.required])
    })
  }


  handleLogin() {
    if (this.loginForm.valid) {
      this.isLoginBtnLoading.set(true)
      this._AuthService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this._AuthService.userData.next(res?.data)
          localStorage.setItem('userData', JSON.stringify(res?.data))
          this.isLoginBtnLoading.set(false)
          this._Router.navigate(['/iotech_app'])
        },
        error: (err: any) => {
          this.isLoginBtnLoading.set(false)
        }
      })
    }
  }

}
