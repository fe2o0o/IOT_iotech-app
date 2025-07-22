import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { RoleManagmentService } from '../../../../core/services/role-managment.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  constructor(private _MessageService:MessageService,private _RoleManagmentService:RoleManagmentService,private _Router: Router, private _TranslateService: TranslateService, private _TranslationsService: TranslationsService, private _SharedService: SharedService) {

    this._TranslationsService.selected_lan_sub.subscribe((lan: string) => {
      if (lan == 'ar') {
        this.is_arabic.set(true);
      } else {
        this.is_arabic.set(false);
      }
    });
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ROLE_MANAGEMENT');
  }

  per_page: number = 15;
  is_arabic = signal<boolean>(false);
  loadingState = signal<boolean>(false);
  showRoleAction: boolean = false;
  roles_permsiionsData: any = {
    total_roles: 15,
    total_permssions: 25,
    Roles_Growth: 36,
  }

  current_id_selected: any;

  ngOnInit(): void {
    this.items = [
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command: () => {
              this._Router.navigate(['iotech_app/roles-management/action', this.current_id_selected])
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              this._Router.navigate(['alharamain-app/role-managemnet/view', 5])
            }
          },
          {
            label: this._TranslateService.instant('DEVICES.DELETE'),
            icon: 'fi fi-rr-trash',
            command: () => {
              this.showDeletePopUp = true;
            }
          }
        ]
      }
    ];


    this.getRolesList()
  }

  roles_list: any[] = [
    {
      "Role_Name": "Manager",
      "Description": "Administrative access to manage user and configurations",
      "Permissions": 50,
      "Users": 15,
      "Created_at": "25 Apr 2025 10:00 PM"
    },
    {
      "Role_Name": "Technical",
      "Description": "Full technical control",
      "Permissions": 50,
      "Users": 57,
      "Created_at": "25 Apr 2025 10:00 PM"
    },
    {
      "Role_Name": "Demo",
      "Description": "Full view all features only without any actions",
      "Permissions": 50,
      "Users": 83,
      "Created_at": "25 Apr 2025 10:00 PM"
    },
    {
      "Role_Name": "Manager",
      "Description": "Administrative access to manage user and configurations",
      "Permissions": 50,
      "Users": 84,
      "Created_at": "25 Apr 2025 10:00 PM"
    },
    {
      "Role_Name": "Technical",
      "Description": "Full technical control",
      "Permissions": 50,
      "Users": 50,
      "Created_at": "25 Apr 2025 10:00 PM"
    }
  ]


  role_summary = signal<any>(null)

  getRolesList() {
    this.roles_list = []
    this.loadingState.set(true);

    this._RoleManagmentService.getRoleList().subscribe((res:any) => {
      this.roles_list = res?.data?.roles;
      this.role_summary.set(res?.data?.summary)
      this.loadingState.set(false)
    })
  }
  searchTerm: string = '';
  handleSearch() {

  }


  showDeletePopUp: boolean = false;


  items: any = []


  loading_delete = signal<boolean>(false);

  handleDelete() {
    this.loading_delete.set(true)
    this._RoleManagmentService.deleteRole(this.current_id_selected).subscribe((res: any) => {
      this.loading_delete.set(false)
      this._MessageService.add({severity:'success' , summary:'Success' , detail:"Role Deleted Successfully"})
      this.getRolesList();
      this.showDeletePopUp = false;
    })
  }
}
