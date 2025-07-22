import { Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { RoleManagmentService } from '../../../../core/services/role-managment.service';
import { ActivatedRoute } from '@angular/router';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-role-view',
  standalone: false,
  templateUrl: './role-view.component.html',
  styleUrl: './role-view.component.scss'
})
export class RoleViewComponent {

  constructor(private _Router:Router,private _MessageService:MessageService,private _UsersManagmentsService: UsersManagmentsService, private _ActivatedRoute: ActivatedRoute, private _RoleManagmentService: RoleManagmentService, private _SharedService: SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ROLE_MANAGEMENT');
    this._ActivatedRoute.paramMap.subscribe((res) => {
      if (res.get('id')) {
        this.current_role_id = res.get('id')
        forkJoin([this._UsersManagmentsService.getPermsionsDevices(), this._RoleManagmentService.getSingleRole(this.current_role_id)]).subscribe((res: any[]) => {

          const deviceTypes = res[0]?.data?.deviceTypes || [];
          const permissions = res[0]?.data?.permissions || [];
          const userDevices = res[1]?.data?.devices || [];
          this.current_role_data = res[1]?.data
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
          this.loading_data.set(false)
        })
      }
    })
  }


  current_role_data: any;

  loading_data = signal<boolean>(true)

  devicesTypes = signal<any[]>([])


  current_role_id: any;


  showDeletePopUp: boolean = false;

    loading_delete = signal<boolean>(false);

  handleDelete() {
    this.loading_delete.set(true)
    this._RoleManagmentService.deleteRole(this.current_role_id).subscribe((res: any) => {
      this.loading_delete.set(false)
      this._MessageService.add({ severity: 'success', summary: 'Success', detail: "Role Deleted Successfully" })
      this._Router.navigate(['/iotech_app/roles-management/list'])
      this.showDeletePopUp = false;
    })
  }
}
