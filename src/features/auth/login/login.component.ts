import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
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

}
