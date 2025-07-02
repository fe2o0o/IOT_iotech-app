import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private _HttpClient: HttpClient) { }


  getVs350Chart(deviceName: any,period?: any, fromUtc?: any, toUtc?: any, filterAccumulatedIn: boolean = true, filterAccumulatedOut: boolean = true, filterPeriodIn: boolean = true, filterPeriodOut: boolean = true):Observable<any> {
    let query = '?'

    if (period) {
      query[query.length - 1] == '?' ? query += `period=${period}` : query += `&period=${period}`
    }
    if (fromUtc) {
      query[query.length - 1] == '?' ? query += `fromUtc=${fromUtc}` : query += `&fromUtc=${fromUtc}`
    }
    if (toUtc) {
      query[query.length - 1] == '?' ? query += `toUtc=${toUtc}` : query += `&toUtc=${toUtc}`
    }

    query[query.length - 1] == '?' ? query += `filterAccumulatedIn=${filterAccumulatedIn}` : query += `&filterAccumulatedIn=${filterAccumulatedIn}`
    query[query.length - 1] == '?' ? query += `filterAccumulatedOut=${filterAccumulatedOut}` : query += `&filterAccumulatedOut=${filterAccumulatedOut}`
    query[query.length - 1] == '?' ? query += `filterPeriodIn=${filterPeriodIn}` : query += `&filterPeriodIn=${filterPeriodIn}`
    query[query.length - 1] == '?' ? query += `filterPeriodOut=${filterPeriodOut}` : query += `&filterPeriodOut=${filterPeriodOut}`


    return this._HttpClient.get(environment.app_api_url + `lorawan/vs350/ChartLoraWanVs350/${deviceName}` + query)
  }

  getDeviceNewDetails(identifire: any, type: any, PageNumber: number = 1, PageSize: number = 10): Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/DeviceDetails?identifier=${identifire}&type=${type}&PageNumber=${PageNumber}&PageSize=${PageSize}`)
  }



  getDevicesDashboard(page_number:number = 1 , page_size:number = 15 , searchTerms:string = ''):Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/GetAllDeviceSummaries?PageNumber=${page_number}&PageSize=${page_size}&search=${searchTerms}`)
  }


}
