import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  constructor(private _HttpClient: HttpClient) { }



  getSubscriptions(page_number: number = 1, page_size: number = 10): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `Subscriptions/GetAllSubscriptions?PageNumber=${page_number}&PageSize=${page_size}` )
  }

}
