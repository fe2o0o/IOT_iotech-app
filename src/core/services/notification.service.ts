import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _HttpClient: HttpClient) { }

  getNotificationData(): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/GetAllNotificationGroups`)
  }

  getDevicesType(): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + 'AlarmTemplate/GetAllDeviceTypesForNotificationGroup')
  }

  getDevicesForType(type: string): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/device-type-details-NotificationGroup?deviceType=${type}`)
  }


  addNotification(req: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + 'AlarmTemplate/AddNotificationGroup' , req)
  }


  deleteNotification(id: any): Observable<any>{
    return this._HttpClient.delete(environment.app_api_url + `AlarmTemplate/DeleteNotificationGroup/${id}`)
  }


  getSingleNotificationGroup(id: any): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `AlarmTemplate/GetNotificationGroupByIdAsync/${id}`)
  }
}
