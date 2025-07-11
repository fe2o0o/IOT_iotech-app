import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  constructor(private _Router:Router,private _TranslateService:TranslateService,private _TranslationsService:TranslationsService,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.USER_MANAGEMENT');
    this._TranslationsService.selected_lan_sub.subscribe((lang) => {
      if(lang === 'ar') {
        this.is_arabic.set(true);
      } else {
        this.is_arabic.set(false);
      }
    })


  }


  ngOnInit(): void {
    this.items.set([
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command: () => {
              this._Router.navigate(['/alharamain-app/user-managemnet/action' , this.selected_user.id])
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              this._Router.navigate(['/alharamain-app/user-managemnet/user' , this.selected_user.id ])
            }
          },
          {
            label: this._TranslateService.instant('DEVICES.DELETE'),
            icon: 'fi fi-rr-trash',
            command: () => {
              this.showDeletePopUp.set(true)
            }
          }
        ]
      }
    ])
  }


  showFilter = signal<boolean>(false);

  selected_user: any;

  showDeletePopUp = signal<boolean>(false)
  usersData = signal<any>(null);

  loadingState = signal<boolean>(false);

  is_arabic = signal<boolean>(false);

  items = signal<any[]>([]);

  filterObj = {
    status: null,
    type: null
  }


  handleFilterList() {

  }

  status: any[] = [
    { name: 'Active' },
    {
      name:'inActive'
    }
  ]

  roles: any[] = [
    {
      name:'Admin' ,
    },
    {
      name:'SuperAdmin'
    }
  ]


  usersListTemp: any[] = [];

  per_page:number = 10
  usersList:any[]=[]


  getUsersList() {

  }


  handleSearch() {

  }

  searchTerm = ''
  filterCount: number = 0;


}
