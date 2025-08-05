import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidatorService } from '../../../../core/validators/password-validation';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';
@Component({
  selector: 'app-user-action',
  standalone: false,
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActionComponent implements OnInit {
  constructor(private _ChangeDetectorRef: ChangeDetectorRef, private _ActivatedRoute: ActivatedRoute, private _Router: Router, private _MessageService: MessageService, private _UsersManagmentsService: UsersManagmentsService, private _SharedService: SharedService, private _PasswordValidatorService: PasswordValidatorService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.USER_MANAGEMENT');
    this.initUserForm()
    this._ActivatedRoute.paramMap.subscribe((res) => {
      if (res.get('id')) {
        this.currentUpdateId = res.get('id')


        forkJoin([
          this._UsersManagmentsService.getAllRoles(),
          this._UsersManagmentsService.getPermsionsDevices(),
          this._UsersManagmentsService.getUserById(res.get('id')),
        ]).subscribe((res: any[]) => {
          this.roles = res[0]?.data;
          const user = res[2]?.data;

          const deviceTypes = res[1]?.data?.deviceTypes || [];
          const permissions = res[1]?.data?.permissions?.filter((per:any)=>{return per.name != 'Add'}) || [];
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


          this.initUserForm(user);
          this._ChangeDetectorRef.markForCheck()
        })
      } else {
        this.handleDevicesRoles()
        this.getAllRoles()
        this.initUserForm()
      }
    })
  }



  handleSetPermssions(event: any) {
  event.value = this.roles.find((role:any)=> {return role.id == event.value})
  const selectedPermissions = event.value.permissions || [];


  const updatedDevicesTypes = this.devicesTypes().map((type: any) => {
    const updatedDevices = (type.devices || []).map((dev: any) => {
      const selectedDevice = selectedPermissions.find((sd: any) => sd.deviceId === dev.id);

      const updatedPerms = (dev.permissions || []).map((perm: any) => ({
        ...perm,
        isSelected: !!selectedDevice?.permissionTypes.some((p: any) => p.id === perm.id)
      }));

      const is_selected_all = updatedPerms.every((perm: any) => perm.isSelected);

      return {
        ...dev,
        permissions: updatedPerms,
        is_selected_all
      };
    });

    const all_devices_selected = updatedDevices.every((d: any) => d.is_selected_all);
    const all_add_perm = updatedDevices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Add')?.isSelected
    );
    const all_view_perm = updatedDevices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'View')?.isSelected
    );
    const all_edit_perm = updatedDevices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Edit')?.isSelected
    );
    const all_delete_perm = updatedDevices.every((d: any) =>
      d.permissions.find((p: any) => p.name === 'Delete')?.isSelected
    );

    return {
      ...type,
      devices: updatedDevices,
      all_devices_selected,
      all_add_perm,
      all_edit_perm,
      all_view_perm,
      all_delete_perm
    };
  });

  this.devicesTypes.set(updatedDevicesTypes);
  this._ChangeDetectorRef.markForCheck();

  console.log("selectedPermissions" ,selectedPermissions);

}

  imageSrc: any;
  handleSelectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files: any = target.files;

      const file: File = files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);

    };
  }



  handleSelectedAll(event: CheckboxChangeEvent, dev: any, type: any) {
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

  handleSelectSingle(event: CheckboxChangeEvent, dev: any, type: any) {



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

    if (type.all_add_perm && type.all_edit_perm && type.all_view_perm && type.all_delete_perm) {
      type.all_devices_selected = true
    } else {
      type.all_devices_selected = false
    }
  }



  handleSelectAllForType(event: CheckboxChangeEvent, type: any) {
    console.log("exsiting type", type);
    type?.devices?.map((dev: any) => {
      dev.is_selected_all = event.checked
      this.handleSelectedAll(event, dev, type)
    })

    type.all_add_perm = event.checked
    type.all_edit_perm = event.checked
    type.all_view_perm = event.checked
    type.all_delete_perm = event.checked
  }


  staff_Perm = [
          {
                "id": 1,
                "name": "Add",
                isActive:false
            },
            {
                "id": 2,
                "name": "View",
                isActive:false
            },
            {
                "id": 3,
                "name": "Delete",
                isActive:false
            },
            {
                "id": 4,
                "name": "Edit",
                isActive:false
            }
  ]

  handleDevicesRoles() {
    this._UsersManagmentsService.getPermsionsDevices().subscribe((res: any) => {
      const deviceTypes = res?.data?.deviceTypes || [];
      const permissions = res?.data?.permissions?.filter((per:any)=>{return per.name != 'Add'}) || [];

      const structured = deviceTypes.map((type: any) => ({
        deviceType: type.deviceType,
        all_devices_selected: false,
        all_add_perm: false,
        all_edit_perm: false,
        all_view_perm: false,
        all_delete_perm: false,
        devices: (type.devices || []).map((dev: any) => ({
          ...dev,
          permissions: permissions.map((perm: any) => ({
            ...perm,
            isSelected: false
          })),
          is_selected_all: false
        }))
      }));

      this.devicesTypes.set(structured);
      console.log("devicesTypes", this.devicesTypes());
    });
  }







  ngOnInit(): void {

  }


  isShowPass = signal<boolean>(false)

  currentUpdateId: any = null;

  showPermssionsError: boolean = false;
  devicesTypes = signal<any[]>([])
  status: any[] = [
    {
      id: 1,
      name: 'Active',
      value: true
    },
    {
      id: 2,
      name: 'InActive',
      value: false
    },
  ];




  getAllRoles() {
    this._UsersManagmentsService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
      }
    })
  }


  handleSelectAllStaff(event:any) {
    this.staff_Perm.map((per) => {
        if (event?.checked) {
        per.isActive = true
        } else {
          per.isActive = false
      }
      })
  }

  userAction() {
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
      ...this.user_form.value,
      isActive: this.user_form.get('isActive')?.value == 1 ? true : false,
      devices: selected_devices,
      profileImageUrl: this.imageSrc || null,
      staffPermissions: this.staff_Perm.filter((per) => per.isActive).map((per) =>  per.id)
    };

    this.loadAction.set(true);

    if (!this.currentUpdateId) {
      this._UsersManagmentsService.addUser(req).subscribe({
        next: (res: any) => {
          this.loadAction.set(false);
          this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully!' });
          this._Router.navigate(['/iotech_app/users-management/list']);
        },
        error: (err: any) => {
          this.loadAction.set(false);
        }
      });
    } else {
      req.id = this.currentUpdateId;
      this._UsersManagmentsService.updateUser(req).subscribe({
        next: (res: any) => {
          this.loadAction.set(false);
          this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated successfully!' });
          this._Router.navigate(['/iotech_app/users-management/list']);
        },
        error: (err: any) => {
          this.loadAction.set(false);
        }
      });
    }
  }
  roles: any[] = [];
  loadAction = signal<boolean>(false);

  passwordValidationError: any[] = []
  user_form !: FormGroup;

  // {
  //   "firstName": "string",
  //   "email": "user@example.com",
  //   "phoneNumber": "string",
  //   "isActive": true,
  //   "roleId": "string",
  //   "password": "string",
  //   "deviceIds": [
  //     0
  //   ],
  //   "devicePermissions": [
  //     {
  //       "deviceTypeId": 0,
  //       "permissionTypeIds": [
  //         0
  //       ]
  //     }
  //   ]
  // }

  initUserForm(data?: any) {
    this.user_form = new FormGroup({
      firstName: new FormControl(data ? data?.firstName : null, Validators.required),
      email: new FormControl(data ? data?.email : null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(data ? data?.phoneNumber : null, Validators.required),
      isActive: new FormControl(data ? data.isActive ? 1 : 2 : null, [Validators.required]),
      roleId: new FormControl(data ? data?.roles[0]?.id : null, [Validators.required]),
      password: new FormControl(null, !data ? Validators.required : null),

    })


    this.user_form.get('password')?.valueChanges.subscribe((value: string) => {
      const validaResult = this._PasswordValidatorService.validatePassword(value);
      if (!validaResult.isValid) {
        this.user_form.get('password')?.setErrors({ inVaild: true })
        this.passwordValidationError = validaResult.errors
      } else {
        this.user_form.get('password')?.setErrors(null)
        this.passwordValidationError = []

      }
      console.log("validation_res", validaResult);

    })
  }
}
