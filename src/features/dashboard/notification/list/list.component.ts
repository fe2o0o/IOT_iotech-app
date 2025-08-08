import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  constructor(private _MessageService:MessageService,private _Router:Router,private _TranslateService:TranslateService,private _ChangeDetectorRef:ChangeDetectorRef ,private _NotificationService:NotificationService,private _TranslationsService:TranslationsService,private _SharedService: SharedService) {
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS')
    this._TranslationsService.selected_lan_sub.subscribe((lan: string) => {
        if (lan == 'ar') {
        this.is_arabic.set(true);
        } else {
        this.is_arabic.set(false);
        }
    });

    this.items = [
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command: () => {
              this._Router.navigate(['/iotech_app/notification-managment/action' , this.current_id_selected])
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              this._Router.navigate(['/iotech_app/notification-managment/view' , this.current_id_selected])
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
    ]

    this.searchSub$.pipe(debounceTime(300)).subscribe((term: string) => {
      this.getNotificationData()
    })
  }
  current_id_selected: any;
  handleSearch() {
    this.searchSub$.next(this.searchTerm)
  }


  handleDisabledDelete(val: string): boolean {
  const normalizedInput = val ? val.toLocaleLowerCase() : '';
  return normalizedInput !== 'delete' && normalizedInput !== 'حذف';
}



  searchSub$ = new Subject<string>()
  searchTerm:string = ''
    items: any[] = []
  per_page: number = 15;
  is_arabic = signal<boolean>(false);
  loadingState = signal<boolean>(false);
  showRoleAction: boolean = false;

  notification_list: any[] = [];


  can_add = signal<boolean>(true)
  showDeletePopUp = signal<boolean>(false)
  loading_delete = signal<boolean>(false)
  getNotificationData() {
    this.loadingState.set(true)
    this.notification_list = []
    this._NotificationService.getNotificationData(this.searchTerm).subscribe((res: any) => {
      this.loadingState.set(false)
      this.notification_list = res?.data?.groups;
      this.can_add.set(res?.data?.canAdd)
      this._ChangeDetectorRef.markForCheck()
    })
  }


  handleRouting() {
    if (this.can_add()) {
      this._Router.navigate(['/iotech_app/notification-managment/action'])
    } else {
      this._MessageService.add({ severity: 'warn', summary:'Warning' , detail:"All Device Types Already Belongs To Notification Group" })

    }
  }

  handleDelete() {
    this.loading_delete.set(true)
    this._NotificationService.deleteNotification(this.current_id_selected).subscribe({
      next: (res: any) => {
        this.loading_delete.set(false)
        this.showDeletePopUp.set(false);
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Notification Group Deleted Successfully ' });
        this.getNotificationData()
      },
      error: (err: any) => {
        this.loading_delete.set(false);
        this.showDeletePopUp.set(false);
      }
    })
  }

}
