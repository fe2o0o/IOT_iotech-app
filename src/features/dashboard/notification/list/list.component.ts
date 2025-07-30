import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  constructor(private _ChangeDetectorRef:ChangeDetectorRef ,private _NotificationService:NotificationService,private _TranslationsService:TranslationsService,private _SharedService: SharedService) {
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS')
            this._TranslationsService.selected_lan_sub.subscribe((lan: string) => {
      if (lan == 'ar') {
        this.is_arabic.set(true);
      } else {
        this.is_arabic.set(false);
      }
    });
  }
  current_id_selected: any;
  handleSearch(){}
  searchTerm:string = ''
    items: any[] = []
  per_page: number = 15;
  is_arabic = signal<boolean>(false);
  loadingState = signal<boolean>(false);
  showRoleAction: boolean = false;

  notification_list: any[] = [];


  getNotificationData() {
    this.loadingState.set(true)
    this.notification_list = []
    this._NotificationService.getNotificationData().subscribe((res: any) => {
      this.loadingState.set(false)
      this.notification_list = res?.data;
      this._ChangeDetectorRef.markForCheck()
    })
  }
}
