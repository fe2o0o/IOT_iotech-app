import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-otp-verfication',
  standalone: false,
  templateUrl: './otp-verfication.component.html',
  styleUrl: './otp-verfication.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class OTPVerficationComponent implements OnInit {

  constructor(private _MessageService:MessageService,private _AuthService:AuthService,private _Router:Router ,private _ActivatedRoute: ActivatedRoute) {
    this._ActivatedRoute.queryParamMap.subscribe((res) => {
      if (res.get('email')) {
        this.startTimer()
        this.current_mail.set(res.get('email'))
      } else {
        this._Router.navigate(['/auth/forgot-password'])
      }
    })
  }
  current_mail = signal<any>(null)

  ngOnInit(): void {
    this.initOTPForm()
  }


  otp_form!: FormGroup;


  initOTPForm() {
    this.otp_form = new FormGroup({
      otp: new FormControl(null , [Validators.required , Validators.minLength(4)])
    })
  }

  timeLeft = signal<number>(180)
  minutes =signal<string>('03') ;
  seconds = signal<string>('00');
  isTimerExpired: boolean = false;
  private timerSubscription: Subscription | null = null;

 startTimer(): void {
    this.isTimerExpired = false;
    this.timeLeft.set(180);
    this.updateTimeDisplay();

    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft.set(this.timeLeft() - 1);
      this.updateTimeDisplay();

      if (this.timeLeft() <= 0) {
        this.timerSubscription?.unsubscribe();
        this.isTimerExpired = true;
      }
    });
  }


  updateTimeDisplay(): void {
    const minutes = Math.floor(this.timeLeft() / 60);
    const seconds = this.timeLeft() % 60;
    this.minutes.set(minutes < 10 ? `0${minutes}` : `${minutes}`);
    this.seconds.set(seconds < 10 ? `0${seconds}` : `${seconds}`);
  }

  resetTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.startTimer();
  }

  handleOTPVerfication() {

    this._AuthService.verfiyOTP({ email: this.current_mail(), otpCode: this.otp_form.get('otp')?.value }).subscribe({
      next: (res: any) => {
        this.isLoading.set(false)
        this._MessageService.add({severity:'success' , summary:'Success' , detail:'OTP code verified successfully.'})
        this._Router.navigate(['/auth/update-password'], {
          queryParams: {
            userOTP: this.otp_form.value.otp,
            email: this.current_mail
          }
        })
      }
    })
  }

  isLoading = signal<boolean>(false)


    ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();

  }


  resendOTP() {
    this._AuthService.resendOTP({ email: this.current_mail }).subscribe({
      next: (res: any) => {
        this._MessageService.add({severity:'success' , summary:'Success' , detail:'OTP Resended Successfully'})
        this.resetTimer()
      }
    })
  }
}
