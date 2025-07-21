import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription, tap, interval, throwError } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  constructor(private _Router: Router, private _HttpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId) ) {
      this.userDataAuth();
    }
  }


  ngOnInit(): void {

  }


  userData:BehaviorSubject<any> = new BehaviorSubject<any>(null)

public refreshSubscription: Subscription | any;









  userDataAuth() {
    const user = JSON.parse(`${localStorage.getItem('userData')}`)

    if (user) {
      this.getRefreshToken().subscribe((res:any) => {
            const user = JSON.parse(`${localStorage.getItem('userData')}`)

        user.token = res?.data?.accessToken
        user.refreshToken = res?.data?.refreshToken;
        localStorage.setItem('userData', JSON.stringify(user));
      })
      this.userData.next(user)

    } else {
      this._Router.navigate(['/auth/login'])
    }
  }




  login(data:any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'Auth/login' , data)
  }


  forgotPassword(email: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'Auth/forgot-password' , email)
  }

  verfiyOTP(data: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'Auth/verify-otp' , data)
  }



  resendOTP(data: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'Auth/resend-otp' , data)
  }


  changePassword(data: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'Auth/reset-password' , data)
  }


  getRefreshToken():Observable<any> {
    const userData = JSON.parse(`${localStorage.getItem('userData')}`);
    if (!userData) {
      localStorage.clear()
      this._Router.navigate(['/auth'])
      return throwError(() => new Error('User data not found'));
    }
    return this._HttpClient.post(environment.app_api_url + 'Auth/refresh-token',{refreshToken:userData.refreshToken}).pipe(
      tap((res:any) => {
        // console.log("res" , res);

      })
    )
  }


   startHandleRefreshToken() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.refreshSubscription = interval(3 * 60 * 60 * 1000).subscribe(() => {
      this.getRefreshToken().subscribe((res:any) => {
        console.log("res" , res);
        const user = JSON.parse(`${localStorage.getItem('userData')}`)

        user.token = res?.data?.accessToken
        user.refreshToken = res?.data?.refreshToken;
        localStorage.setItem('userData', JSON.stringify(user));
      })
    })
  }

}

