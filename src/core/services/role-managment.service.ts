import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/env.dev';
@Injectable({
  providedIn: 'root'
})
export class RoleManagmentService {

  constructor(private _HttpClient: HttpClient) { }


  getRoleList():Observable<any> {
    return this._HttpClient.get(environment.app_api_url + 'Auth/GetAllRolesWithPermitionAndUserCount')
  }



  getSingleRole(id: any): Observable<any>{
    return this._HttpClient.get(environment.app_api_url + `Auth/GetRoleAndPermissionWithDeviceById/${id}`)
  }


  deleteRole(id:any):Observable<any> {
    return this._HttpClient.delete(environment.app_api_url + `Auth/DeleteRole/${id}`)
  }



  updateRole(req: any , id:any): Observable<any>{
    return this._HttpClient.put(environment.app_api_url + `Auth/UpdateRoleWithPermissions/${id}` , req)
  }

}
