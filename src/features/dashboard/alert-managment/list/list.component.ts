import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { AlertServiceService } from '../../../../core/services/alert-service.service';
@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  constructor(private _AlertServiceService:AlertServiceService  ,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALERT')

  }


  handleFilterAlerts(id: any) {

    this.tabs.map((tab) => {
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


  tabs = [
    {
      id: 1,
      name: "All",
      is_active:true
    },
    {
      id: 2,
      name: "Read",
      is_active: false
    },
    {
      id: 3,
      name: "Unread",
      is_active:false
    },
    {
      id: 4,
      name: "Dismiss",
      is_active:false
    },
  ]


  alerts = signal<any[]>([])


  ngOnInit(): void {
      this.getAlerts()
  }


  loading_state = signal<boolean>(false)

  getAlerts(onlyRead: boolean = false, onlyUnread: boolean = false, onlyDismissed: boolean = false) {
    this.loading_state.set(true)
    this._AlertServiceService.getAlertLis(onlyRead, onlyUnread, onlyDismissed).subscribe((res) => {
      console.log("alert list res" , res);
      this.alerts.set(res?.data)

      this.loading_state.set(false)
    })
  }

}
