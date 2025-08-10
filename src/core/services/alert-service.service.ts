import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(private _HttpClient:HttpClient) { }




  getAlertLis(onlyRead:boolean = false , onlyUnread:boolean = false , onlyDismissed:boolean = false):Observable<any> {
      return this._HttpClient.get(environment.app_api_url + `SystemAlerts/User-Alerts-All?onlyRead=${onlyRead}&onlyUnread=${onlyUnread}&onlyDismissed=${onlyDismissed}`)
  }



  updateAlertStatud(req: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'SystemAlerts/User-Alerts-UpdateStatus' , req)
  }


}
