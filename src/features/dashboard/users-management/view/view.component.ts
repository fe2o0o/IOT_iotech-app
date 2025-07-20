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
  constructor(private _UsersManagmentsService: UsersManagmentsService, private _ActivatedRoute: ActivatedRoute, private sharedService: SharedService) {
    this.sharedService.breadCrumbTitle.next('View User');
    this._ActivatedRoute.paramMap.subscribe((res) => {
      forkJoin([
        this._UsersManagmentsService.getPermssionsTypes(),
        this._UsersManagmentsService.getPermsionsDevices(),
        this._UsersManagmentsService.getUserById(res.get('id')),
      ]).subscribe((res: any[]) => {
        const user = res[2]?.data;
        this.userDataShow = user
        const deviceTypes = res[1]?.data?.deviceTypes || [];
        const permissions = res[1]?.data?.permissions || [];
        const userDevices = user?.devices || [];
        const structured = deviceTypes.map((type: any) => {
          const devices = (type.devices || []).map((dev: any) => {
            const userDevice = userDevices.find((ud: any) => ud.deviceId === dev.id);

            const devPerms = permissions.map((perm: any) => ({
              ...perm,
              isSelected: !!userDevice?.permissions.some((p: any) => p.id === perm.id)
            }));

            const is_selected_all = devPerms.every((perm: any) => perm.isSelected);

            return {
              ...dev,
              permissions: devPerms,
              is_selected_all
            };
          });

          const all_devices_selected = devices.every((d: any) => d.is_selected_all);
          const all_add_perm = devices.every((d: any) =>
            d.permissions.find((p: any) => p.name === 'Add')?.isSelected
          );
          const all_view_perm = devices.every((d: any) =>
            d.permissions.find((p: any) => p.name === 'View')?.isSelected
          );
          const all_edit_perm = devices.every((d: any) =>
            d.permissions.find((p: any) => p.name === 'Edit')?.isSelected
          );
          const all_delete_perm = devices.every((d: any) =>
            d.permissions.find((p: any) => p.name === 'Delete')?.isSelected
          );

          return {
            deviceType: type.deviceType,
            devices,
            all_devices_selected,
            all_add_perm,
            all_edit_perm,
            all_view_perm,
            all_delete_perm
          };
        });

        this.devicesTypes.set(structured);


        console.log("devicesTypes" , this.devicesTypes());

        this.loading_data.set(false)
      })
    })
  }

  devicesTypes = signal<any[]>([])

  userDataShow: any;

  loading_data = signal<boolean>(true);
}
