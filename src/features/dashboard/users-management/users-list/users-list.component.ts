import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  constructor(private _UsersManagmentsService:UsersManagmentsService,private _Router:Router,private _TranslateService:TranslateService,private _TranslationsService:TranslationsService,private _SharedService:SharedService) {
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
              this._Router.navigate(['/iotech_app/users-management/action' , this.selected_user.id])
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              this._Router.navigate(['/iotech_app/users-management/view' , this.selected_user.id ])
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







    this.searchSubject.pipe(debounceTime(300)).subscribe((res: string) => {
      this.getUsersList()
    })
  }


  handleDeleteUser() {

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


  getUsersList(event?: any) {
    console.log("event" , event);

    this.loadingState.set(true);
    this.usersListTemp = [];
    this.usersList = [];
    this._UsersManagmentsService.getAllUsers(event?.first+1 || 1, event?.rows || 15, this.searchTerm).subscribe({
      next: (res) => {
        this.usersData.set(res?.data);
        this.usersList = res?.data?.items;
        this.usersListTemp = res?.data?.items;
        this.loadingState.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingState.set(false);
      }
    });
  }




  handleSearch() {
    this.searchSubject.next(this.searchTerm);
  }


  private searchSubject = new Subject<string>()

  searchTerm = ''
  filterCount: number = 0;


}
