import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
@Component({
  selector: 'app-action',
  standalone: false,
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit {
  constructor(private _UsersManagmentsService:UsersManagmentsService,private _SharedService:SharedService) {
        this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS')

  }


  ngOnInit(): void {
    this.initMainForm();
    this.getUsers()
  }

  current_step = signal<number>(2)

  getUsers() {
    this._UsersManagmentsService.getAllUsers(1, 999).subscribe((res: any) => {
      this.users = res?.data?.items
    })
  }
  load_action = signal<boolean>(false)
  currentUpdateId: any;

  users: any[] = []

  selected_users = signal<any[]>([])

  main_form !: FormGroup;
  initMainForm() {
    this.main_form = new FormGroup({
      name: new FormControl(null , Validators.required)
    })
  }
}
