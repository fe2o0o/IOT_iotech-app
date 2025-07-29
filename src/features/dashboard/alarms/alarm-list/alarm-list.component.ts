import { TranslationsService } from './../../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlarmService } from '../../../../core/services/alarm.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-alarm-list',
  standalone: false,
  templateUrl: './alarm-list.component.html',
  styleUrl: './alarm-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmListComponent {
  constructor(private _ChangeDetectorRef:ChangeDetectorRef,private _AlarmService:AlarmService,private _TranslationsService:TranslationsService,private _SharedService: SharedService, private _TranslateService: TranslateService) {
    this.items = [
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command: () => {
              // this._Router.navigate(['iotech_app/roles-management/action', this.current_id_selected])
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              // this._Router.navigate(['iotech_app/roles-management/view', this.current_id_selected])
            }
          },
          {
            label: this._TranslateService.instant('DEVICES.DELETE'),
            icon: 'fi fi-rr-trash',
            command: () => {
              // this.showDeletePopUp = true;
            }
          }
        ]
      }
    ];
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALARMS');
        this._TranslationsService.selected_lan_sub.subscribe((lan: string) => {
      if (lan == 'ar') {
        this.is_arabic.set(true);
      } else {
        this.is_arabic.set(false);
      }
    });
  }


  alarm_list: any[] = [
    {
      id:1,
      name:"Viziosense",
      assigned: "5",
      created_at:"25 Apr 2025 10:00 PM"
    },
    {
      id:1,
      name:"HKT Smart Wristband",
      assigned: "5",
      created_at:"25 Apr 2025 10:00 PM"
    },
    {
      id:1,
      name:"PiP LevelSense",
      assigned: "5",
      created_at:"25 Apr 2025 10:00 PM"
    },
  ]

    searchTerm: string = '';
    private searchSubject = new Subject<string>()
    handleSearch() {
      this.searchSubject.next(this.searchTerm)
    }

  items: any[] = []
  per_page: number = 15;
  is_arabic = signal<boolean>(false);
  loadingState = signal<boolean>(false);
  showRoleAction: boolean = false;




  getAlarmData() {
    this.loadingState.set(true)
    this.alarm_list = []
    this._AlarmService.getAllAlarms().subscribe((res: any) => {
      console.log("res alarm", res?.data);
      this.alarm_list = res?.data
      this.loadingState.set(false);
      this._ChangeDetectorRef.markForCheck()
    })
  }
}
