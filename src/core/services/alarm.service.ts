import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  constructor(private _HttpClient: HttpClient) { }


  getAllAlarms(search:string = ''):Observable<any> {
    return this._HttpClient.get(environment.app_api_url +`AlarmTemplate/GetAllAlarmTemplates?search=${search}`)
  }



  getDevicesType():Observable<any> {
    return this._HttpClient.get(environment.app_api_url +'Auth/GetAllDeviceTypes')
  }

  updateAlarm(id: any, req: any): Observable<any>{
    return this._HttpClient.put(environment.app_api_url + `AlarmTemplate/UpdateAlarmTemplate/${id}` , req)
  }

  storeAlarm(payload:any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + `AlarmTemplate/StoreAlarmTemplate` ,payload  )
  }
  getDeviceTypeSegments(devicType: any): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/GetDeviceTypeAlarmSegmentsDefaultS?deviceType=${devicType}`)
  }

  getAlarmById(id: any): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/GetAlarmTemplateById/${id}`)
  }


  deleteAlarm(id: any): Observable<any>{
    return this._HttpClient.delete(environment.app_api_url + `AlarmTemplate/DeleteAlarmTemplate/${id}`)
  }
}
