import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class UsersManagmentsService {

  constructor(private _HttpClient: HttpClient) { }




  getAllUsers(page_number: number = 1 , page_size:number = 15 , searchTerm: string = ''):Observable<any> {
    return this._HttpClient.get(environment.app_api_url +`Auth/AllUsers?PageNumber=${page_number}&PageSize=${page_size}&email=${searchTerm}`);

  }


  getAllRoles(): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `Auth/GetAllRoles`)
  }


  getPermssionsTypes():Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `Auth/GetPermissionTypes`)
  }


  getDevicesTypes():Observable<any> {
    return this._HttpClient.get(environment.app_api_url + `Auth/GetAllDeviceTypes`)
  }


  addUser(req: any): Observable<any>{
    return this._HttpClient.post(environment.app_api_url + `Auth/register`, req);
  }
}
