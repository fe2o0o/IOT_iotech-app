import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private _HttpClient: HttpClient) { }




  getDevicesDashboard(page_number:number = 1 , page_size:number = 15 , searchTerms:string = ''):Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/GetAllDeviceSummaries?PageNumber=${page_number}&PageSize=${page_size}&search=${searchTerms}`)
  }


}
