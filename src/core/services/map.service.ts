import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _HttpClient: HttpClient) { }



  getAllLocations(): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `DeviceSummariesUnified/get-all-locations`)
  }
}
