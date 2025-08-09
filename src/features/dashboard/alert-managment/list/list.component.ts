import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { AlertServiceService } from '../../../../core/services/alert-service.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  constructor(private _TranslateService:TranslateService,private _AlertServiceService:AlertServiceService  ,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALERT')
    this.tabs = [
    {
      id: 1,
      name: this._TranslateService.instant('ALERTS.ALL'),
      is_active:true
    },
    {
      id: 2,
      name: this._TranslateService.instant('ALERTS.READ'),
      is_active: false
    },
    {
      id: 3,
      name: this._TranslateService.instant('ALERTS.UNREAD'),
      is_active:false
    },
    {
      id: 4,
      name: this._TranslateService.instant('ALERTS.DISMISS'),
      is_active:false
    },
  ]
  }


  handleFilterAlerts(id: any) {

    this.tabs.map((tab:any) => {
      if (tab.id == id) {
        tab.is_active = true
      } else {
        tab.is_active = false
      }

      })

    switch (id) {
      case 1:
        this.getAlerts()
        break;

      case 2:
        this.getAlerts(true , false , false)
        break;

      case 3:
        this.getAlerts(false, true, false)
        break;
      case 4:
        this.getAlerts(false, false, true)
        break;
      default:
        this.getAlerts()
        break;
    }
  }


  tabs:any = []


  alerts = signal<any[]>([])


  ngOnInit(): void {
      this.getAlerts()
  }


  loading_state = signal<boolean>(false)

  getAlerts(onlyRead: boolean = false, onlyUnread: boolean = false, onlyDismissed: boolean = false) {
    this.loading_state.set(true)
    this._AlertServiceService.getAlertLis(onlyRead, onlyUnread, onlyDismissed).subscribe((res) => {

      this.alerts.set(res?.data?.map((alert: any) => {
        return {
          ...alert,
          isRead:alert?.notifications?.every((not:any) => not?.isRead),
          isDismiss:alert?.notifications?.every((not:any) => not?.isDismissed)
        }
      }))

      console.log("alert list res" , this.alerts());
      this.loading_state.set(false)
    })
  }

}
