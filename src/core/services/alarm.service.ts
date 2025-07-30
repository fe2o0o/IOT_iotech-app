import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  constructor(private _HttpClient: HttpClient) { }


  getAllAlarms():Observable<any> {
    return this._HttpClient.get(environment.app_api_url +'AlarmTemplate/GetAllAlarmTemplates')
  }



  getDevicesType():Observable<any> {
    return this._HttpClient.get(environment.app_api_url +'Auth/GetAllDeviceTypes')
  }


  storeAlarm(payload:any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + `AlarmTemplate/StoreAlarmTemplate` ,payload  )
  }
  getDeviceTypeSegments(devicType: any): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/GetDeviceTypeAlarmSegmentsDefaultS?deviceType=${devicType}`)
  }
}
