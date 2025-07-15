import { Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(private _UsersManagmentsService:UsersManagmentsService,private _ActivatedRoute:ActivatedRoute,private sharedService: SharedService) {
    this.sharedService.breadCrumbTitle.next('View User');
    this._ActivatedRoute.paramMap.subscribe((res) => {
      forkJoin([
              this._UsersManagmentsService.getPermssionsTypes(),
          this._UsersManagmentsService.getDevicesTypes(),
          this._UsersManagmentsService.getUserById(res.get('id')),
      ]).subscribe((res: any[]) => {
          const permssions = res[0]?.data;
        const devicesTypes = res[1]?.data;
        this.userDataShow = res[2]?.data;
                 const userDevicePermissions = this.userDataShow?.devicePermissions || [];
          this.devicesTypes.set(
            devicesTypes.map((device: any) => {
              // Find user permissions for this device type
              const userDevice = userDevicePermissions.find((d: any) => d.deviceTypeId === device.id);
              return {
                ...device,
                permssions: permssions.map((perm: any) => ({
                  ...perm,
                  isSelected: userDevice
                    ? userDevice.permissions.some((p: any) => p.id === perm.id)
                    : false
                }))
              };
            })
        );

        this.loading_data.set(false);
      })
    })
  }

  devicesTypes= signal<any[]>([])

  userDataShow: any;

  loading_data = signal<boolean>(true);
}
