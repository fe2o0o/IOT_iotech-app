import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidatorService } from '../../../../core/validators/password-validation';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-action',
  standalone: false,
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserActionComponent implements OnInit {
  constructor(private _Router:Router,private _MessageService:MessageService,private _UsersManagmentsService:UsersManagmentsService,private _SharedService: SharedService , private _PasswordValidatorService:PasswordValidatorService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.USER_MANAGEMENT');
  }

  imageSrc: any;
  handleSelectImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files:any = target.files;

      const file: File = files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);

    };
  }



    handleDevicesRoles() {
    forkJoin([this._UsersManagmentsService.getPermssionsTypes(), this._UsersManagmentsService.getDevicesTypes()]).subscribe((res: any[]) => {
      const permssions = res[0]?.data

      this.devicesTypes.set(res[1]?.data?.map((ele: any) => {
        return {
          ...ele,
          permssions: permssions.map((res:any)=>{ return {...res , isSelected:false}})
        }
      }))


      console.log("Devices Types Dispalay " , this.devicesTypes());

    })
  }







  ngOnInit(): void {
    this.handleDevicesRoles()
    this.getAllRoles()
    this.initUserForm()
  }


  isShowPass = signal<boolean>(false)

  currentUpdateId: any = null;

  showPermssionsError: boolean = false;
  devicesTypes = signal<any[]>([])
  status: any[] = [
    {
      id: 1,
      name: 'Active',
      value:true
    },
    {
      id: 2,
      name: 'InActive',
      value:false
    },
  ];




  getAllRoles() {
    this._UsersManagmentsService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
      }
  } )
  }


  userAction() {

        const selected_device = this.devicesTypes()
      .map((dev: any): any => {
        const isSelected = dev.permssions.some((per: any) => per.isSelected);

        if (isSelected) {
          const selectedPermssions = dev.permssions
            .filter((per: any) => per?.isSelected)
            .map((per: any) => per.id);

          return {
            deviceTypeId: dev.id,
            permissionTypeIds: selectedPermssions
          };
        }
      })
      .filter(Boolean);


        const req = {
      ...this.user_form.value,
      isActive: this.user_form.get('isActive')?.value == 1 ? true : false,
          devicePermissions: selected_device,
      deviceIds:[]
    }

    this.loadAction.set(true)

    this._UsersManagmentsService.addUser(req).subscribe({
      next: (res: any) => {
        this.loadAction.set(false);
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully!' }); 4
        this._Router.navigate(['/iotech_app/users-management/list']);
      },
      error: (err: any) => {
        this.loadAction.set(false);
      }
    })
  }
  roles: any[] = [];
  loadAction = signal<boolean>(false);

  passwordValidationError:any[] = []
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

  initUserForm(data?:any) {
    this.user_form = new FormGroup({
      firstName: new FormControl(data ? data?.firstName : null, Validators.required),
      email: new FormControl(data ? data?.email: null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(data ? data?.phoneNumber: null, Validators.required),
      isActive: new FormControl(data ? data.isActive ? 1:2 :null , [Validators.required]),
      roleId: new FormControl(data ? data?.roleId : null, [Validators.required]),
      password: new FormControl(null, !data ? Validators.required : null),

    })


    this.user_form.get('password')?.valueChanges.subscribe((value:string) => {
      const validaResult = this._PasswordValidatorService.validatePassword(value);
      if (!validaResult.isValid) {
        this.user_form.get('password')?.setErrors({inVaild:true})
        this.passwordValidationError = validaResult.errors
      } else {
        this.user_form.get('password')?.setErrors(null)
        this.passwordValidationError = []

      }
      console.log("validation_res" , validaResult);

    })
  }
}
