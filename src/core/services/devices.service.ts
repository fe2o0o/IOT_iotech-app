import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private _HttpClient: HttpClient) { }

  getCO2Chart(identifire: any, period?: any, fromUtc?: any, toUtc?: any, filterTemperature: boolean = true, filterHumidity: boolean = true, filterCo2
    : boolean = true, filterCo2Baseline
: boolean = true): Observable<any> {
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

    query[query.length - 1] == '?' ? query += `filterTemperature=${filterTemperature}` : query += `&filterTemperature=${filterTemperature}`
    query[query.length - 1] == '?' ? query += `filterHumidity=${filterHumidity}` : query += `&filterHumidity=${filterHumidity}`
    query[query.length - 1] == '?' ? query += `filterCo2
=${filterCo2
      }` : query += `&filterCo2
=${filterCo2
      }`
    query[query.length - 1] == '?' ? query += `filterCo2Baseline
=${filterCo2Baseline
}` : query += `&filterCo2Baseline
=${filterCo2Baseline
}`


    return this._HttpClient.get(environment.app_api_url + `SigfoxAirWitsCo2/ChartAirWitsCo2/${identifire}` + query)
  }

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


  editDevice(deviceId: any, deviceName: string): Observable<any> {
    return this._HttpClient.put(environment.app_api_url + `DeviceSummariesUnified/UpdatedeviceName?deviceId=${deviceId}`, { deviceName })
  }



  getDOSChart(deviceID: any , period?: any, fromUtc?: any, toUtc?: any ,  filterOccupancy:boolean = true , filterBattery:boolean = true):Observable<any> {
    let query = '?'

    if (deviceID) {
      query[query.length - 1] == '?' ? query += `deviceId=${deviceID}` : query += `&deviceId=${deviceID}`
    }
    if (period) {
      query[query.length - 1] == '?' ? query += `period=${period}` : query += `&period=${period}`
    }
    if (fromUtc) {
      query[query.length - 1] == '?' ? query += `fromUtc=${fromUtc}` : query += `&fromUtc=${fromUtc}`
    }
    if (toUtc) {
      query[query.length - 1] == '?' ? query += `toUtc=${toUtc}` : query += `&toUtc=${toUtc}`
    }

  query[query.length - 1] == '?' ? query += `filterOccupancy=${filterOccupancy}` : query += `&filterOccupancy=${filterOccupancy}`
  query[query.length - 1] == '?' ? query += `filterBattery=${filterBattery}` : query += `&filterBattery=${filterBattery}`


    return this._HttpClient.get(environment.app_api_url + `LoraWanVS341/GetChartDataLoraWanVS341`+ query)
  }
  getBOSChart(deviceID: any , period?: any, fromUtc?: any, toUtc?: any, filterDistance:boolean = true ,  filterOccupancy:boolean = true , filterCalibration:boolean = true):Observable<any> {
    let query = '?'

    if (deviceID) {
      query[query.length - 1] == '?' ? query += `deviceId=${deviceID}` : query += `&deviceId=${deviceID}`
    }
    if (period) {
      query[query.length - 1] == '?' ? query += `period=${period}` : query += `&period=${period}`
    }
    if (fromUtc) {
      query[query.length - 1] == '?' ? query += `fromUtc=${fromUtc}` : query += `&fromUtc=${fromUtc}`
    }
    if (toUtc) {
      query[query.length - 1] == '?' ? query += `toUtc=${toUtc}` : query += `&toUtc=${toUtc}`
    }

  query[query.length - 1] == '?' ? query += `filterDistance=${filterDistance}` : query += `&filterDistance=${filterDistance}`
  query[query.length - 1] == '?' ? query += `filterOccupancy=${filterOccupancy}` : query += `&filterOccupancy=${filterOccupancy}`
  query[query.length - 1] == '?' ? query += `filterCalibration=${filterCalibration}` : query += `&filterCalibration=${filterCalibration}`


    return this._HttpClient.get(environment.app_api_url + `LoraWanVS330/GetVs330ChartData`+ query)
  }

  getDeviceNewDetails(identifire: any, type: any, PageNumber: number = 1, PageSize: number = 10): Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/DeviceDetails?identifier=${identifire}&type=${type}&PageNumber=${PageNumber}&PageSize=${PageSize}`)
  }



  getDevicesDashboard(page_number:number = 1 , page_size:number = 15 , searchTerms:any = '',status
    : any = '', Type: any = ''): Observable<any> {
      let query = '?'

      if (page_number) {
        query[query.length - 1] == '?' ? query += `PageNumber=${page_number}` : query += `&PageNumber=${page_number}`
      }
      if (page_size) {
        query[query.length - 1] == '?' ? query += `PageSize=${page_size}` : query += `&PageSize=${page_size}`
      }
      if (searchTerms) {
        query[query.length - 1] == '?' ? query += `search=${searchTerms}` : query += `&search=${searchTerms}`
      }
      if (status) {
        query[query.length - 1] == '?' ? query += `status=${status}` : query += `&status=${status}`
      }
      if (Type) {
        query[query.length - 1] == '?' ? query += `Type=${Type}` : query += `&Type=${Type}`
      }
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/GetAllDeviceSummaries` + query)
  }


  getReadingExport(identifier: any, type: any, fromUtc: any, toUtc:any ):Observable<any> {
    let query = '?'

    if (identifier) {
      query[query.length - 1] == '?' ? query += `identifier=${identifier}` : query += `&identifier=${identifier}`
    }
    if (type) {
      query[query.length - 1] == '?' ? query += `type=${type}` : query += `&type=${type}`
    }
    if (fromUtc) {
      query[query.length - 1] == '?' ? query += `fromUtc=${fromUtc}` : query += `&fromUtc=${fromUtc}`
    }
    if (toUtc) {
      query[query.length - 1] == '?' ? query += `toUtc=${toUtc}` : query += `&toUtc=${toUtc}`
    }
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/DeviceReadingsForExcel`+query)
  }


  updateLoacations(type: any, identifair: any, data: any): Observable<any>{
    delete data.content
    return this._HttpClient.post(environment.app_api_url + `DeviceSummariesUnified/upsert-location?type=${type}&identifair=${identifair}` , data)
  }


  getEWSChart(deviceID: any , period?: any, fromUtc?: any, toUtc?: any):Observable<any> {
    let query = '?'

    if (deviceID) {
      query[query.length - 1] == '?' ? query += `deviceId=${deviceID}` : query += `&deviceId=${deviceID}`
    }
    if (period) {
      query[query.length - 1] == '?' ? query += `period=${period}` : query += `&period=${period}`
    }
    if (fromUtc) {
      query[query.length - 1] == '?' ? query += `fromUtc=${fromUtc}` : query += `&fromUtc=${fromUtc}`
    }
    if (toUtc) {
      query[query.length - 1] == '?' ? query += `toUtc=${toUtc}` : query += `&toUtc=${toUtc}`
    }

    return this._HttpClient.get(environment.app_api_url + `SigFoxEvvos/chart-data` + query)
  }

}
