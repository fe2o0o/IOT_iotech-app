import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidatorService } from '../../../../core/validators/password-validation';
@Component({
  selector: 'app-user-action',
  standalone: false,
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserActionComponent implements OnInit {
  constructor(private _SharedService: SharedService , private _PasswordValidatorService:PasswordValidatorService) {
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

  ngOnInit(): void {
    this.initUserForm()
  }


  isShowPass = signal<boolean>(false)

  currentUpdateId: any = null;

  showPermssionsError: boolean = false;
  devicesTypes: any[] = [
    {
      name: 'PLS-001-SFX',
      permssions: [
        { name: 'View', value: true },
        { name: 'Edit', value: false },
        { name: 'Delete', value: false },
        { name: 'Add', value: false },
      ]
    }
  ]
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




  userAction() {

  }
  roles: any[] = [];
  loadAction:boolean = false;

  passwordValidationError:any[] = []
  user_form !: FormGroup;

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
