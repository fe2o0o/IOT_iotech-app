import { Component } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-role-action',
  standalone: false,
  templateUrl: './role-action.component.html',
  styleUrl: './role-action.component.scss'
})
export class RoleActionComponent {
  constructor(private _SharedService: SharedService) {
     this._SharedService.breadCrumbTitle.next('SIDEBAR.ROLE_MANAGEMENT');
  }
  devicesTypes:any[] =[]
}
