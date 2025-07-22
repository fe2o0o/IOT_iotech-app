import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-role-action',
  standalone: false,
  templateUrl: './role-action.component.html',
  styleUrl: './role-action.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush


})
export class RoleActionComponent {
  constructor(private _Router:Router,private _MessageService:MessageService,private _ActivatedRoute:ActivatedRoute,private _UsersManagmentsService:UsersManagmentsService,private _SharedService: SharedService) {
    this.initRoleForm()
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ROLE_MANAGEMENT');
    this._ActivatedRoute.paramMap.subscribe((res) => {
      if (res.get('id')) {

      } else {
        this.initRoleForm()
        this.handleDevicesRoles()
      }
    })
  }
  devicesTypes = signal<any[]>([])

  handleDevicesRoles() {
    this._UsersManagmentsService.getPermsionsDevices().subscribe((res: any) => {
      const deviceTypes = res?.data?.deviceTypes || [];
      const permissions = res?.data?.permissions || [];

      const structured = deviceTypes.map((type: any) => ({
        deviceType: type.deviceType,
        all_devices_selected: false,
        all_add_perm:false,
        all_edit_perm:false,
        all_view_perm:false,
        all_delete_perm:false,
        devices: (type.devices || []).map((dev: any) => ({
          ...dev,
          permissions: permissions.map((perm: any) => ({
            ...perm,
            isSelected: false
          })),
          is_selected_all:false
        }))
      }));

      this.devicesTypes.set(structured);
      console.log("devicesTypes" , this.devicesTypes());
    });
  }

   handleSelectedAll(event:CheckboxChangeEvent,dev:any , type:any){
      dev?.permissions?.map((ele: any) => {
        ele.isSelected = event.checked
      })

      const isAllDevicesSelected = type.devices.filter((ele: any) => { return !ele.is_selected_all })


      if (isAllDevicesSelected.length) {
            type.all_add_perm = false
      type.all_edit_perm = false
          type.all_view_perm = false
        type.all_delete_perm = false
        type.all_devices_selected = false
      } else if (isAllDevicesSelected.length == 0) {
                  type.all_add_perm = true
      type.all_edit_perm = true
          type.all_view_perm = true
        type.all_delete_perm = true
        type.all_devices_selected = true
      }


    }

    handleSelectSingle(event: CheckboxChangeEvent, dev: any , type:any) {



    dev.is_selected_all = dev.permissions.every((perm: any) => perm.isSelected);

    type.all_devices_selected = type.devices.every((d: any) => d.is_selected_all);

    type.all_add_perm = type.devices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Add')?.isSelected
    );
    type.all_view_perm = type.devices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'View')?.isSelected
    );
    type.all_edit_perm = type.devices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Edit')?.isSelected
    );
    type.all_delete_perm = type.devices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Delete')?.isSelected
    );

    }


    handleSelectAllPermissionForType(type: any, permName: string, checked: boolean) {
    type.devices.forEach((dev: any) => {
      dev.permissions.forEach((perm: any) => {
        if (perm.name === permName) {
          perm.isSelected = checked;
        }
      });
      dev.is_selected_all = dev.permissions.every((perm: any) => perm.isSelected);
    });

      if (type.all_add_perm && type.all_edit_perm && type.all_view_perm &&  type.all_delete_perm) {
      type.all_devices_selected = true
      } else {
        type.all_devices_selected = false
    }
  }



    handleSelectAllForType(event: CheckboxChangeEvent, type: any) {
      console.log("exsiting type" , type);
      type?.devices?.map((dev: any) => {
        dev.is_selected_all = event.checked
        this.handleSelectedAll(event , dev , type)
      })

      type.all_add_perm = event.checked
      type.all_edit_perm = event.checked
          type.all_view_perm = event.checked
          type.all_delete_perm = event.checked
  }


  loading_action = signal<boolean>(false)

  handleAction() {
      const selected_devices = this.devicesTypes()
    .flatMap((type: any) =>
      (type.devices || []).map((dev: any) => {
        const selectedPermssions = (dev.permissions || [])
          .filter((per: any) => per.isSelected)
          .map((per: any) => per.id);

        if (selectedPermssions.length > 0) {
          return {
            deviceId: dev.id,
            permissionTypeIds: selectedPermssions
          };
        }
        return null;
      })
    )
      .filter(Boolean);


    const req = {
      ...this.role_form.value,
      devicePermissions:selected_devices
    }

    this.loading_action.set(true)
    this._UsersManagmentsService.createRole(req).subscribe({
      next: (res: any) => {
        this._MessageService.add({severity:'success' , summary:'Success' , detail:'Role Created Successfully !'})
        this.loading_action.set(false)
        this._Router.navigate(['/iotech_app/roles-management/list'])
      },
      error: (err: any) => {
        this.loading_action.set(false)
      }
    })


  }

  role_form!: FormGroup;
  initRoleForm() {
    this.role_form = new FormGroup({
      roleName: new FormControl(null, [Validators.required]),
      description : new FormControl(null , [Validators.required])
    })
  }
}
