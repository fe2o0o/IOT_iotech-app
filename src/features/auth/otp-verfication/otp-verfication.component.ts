import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-otp-verfication',
  standalone: false,
  templateUrl: './otp-verfication.component.html',
  styleUrl: './otp-verfication.component.scss'
})
export class OTPVerficationComponent implements OnInit {

  constructor() {
    this.startTimer()
  }
  current_mail = signal<string>('Ibrahimfe2o0o@gmail.com')

  ngOnInit(): void {
      this.initOTPForm()
  }


  otp_form!: FormGroup;


  initOTPForm() {
    this.otp_form = new FormGroup({
      otp: new FormControl(null , [Validators.required , Validators.minLength(6)])
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


  isLoading =  signal<boolean>(false)
}
