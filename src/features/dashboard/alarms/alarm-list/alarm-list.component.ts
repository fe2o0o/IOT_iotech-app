import { TranslationsService } from './../../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, Subject } from 'rxjs';
import { AlarmService } from '../../../../core/services/alarm.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-alarm-list',
  standalone: false,
  templateUrl: './alarm-list.component.html',
  styleUrl: './alarm-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmListComponent {
  constructor(private _MessageService:MessageService,private _Router:Router,private _ChangeDetectorRef:ChangeDetectorRef,private _AlarmService:AlarmService,private _TranslationsService:TranslationsService,private _SharedService: SharedService, private _TranslateService: TranslateService) {
    this.items = [
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command: () => {
              this._Router.navigate(['iotech_app/alarms/action', this.current_id_selected])
            }

          },
          // {
          //   label: this._TranslateService.instant('DEVICES.VIEW'),
          //   icon: 'fi fi-rr-eye',
          //   command: () => {
          //     // this._Router.navigate(['iotech_app/roles-management/view', this.current_id_selected])
          //   }
          // },
          {
            label: this._TranslateService.instant('DEVICES.DELETE'),
            icon: 'fi fi-rr-trash',
            command: () => {
              this.showDeletePopUp.set(true);
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


    this.searchSubject.pipe(debounceTime(300)).subscribe((res) => {
      this.getAlarmData()
    })
  }

  loading_delete = signal<boolean>(false)
  current_id_selected: any;
  handleDelete() {
        this.loading_delete.set(true)
    this._AlarmService.deleteAlarm(this.current_id_selected).subscribe({
      next: (res: any) => {
        this.loading_delete.set(false)
        this.showDeletePopUp.set(false);
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Alarm Templete Deleted Successfully ' });
        this.getAlarmData()
      },
      error: (err: any) => {
        this.loading_delete.set(false);
        this.showDeletePopUp.set(false);
      }
    })
  }
  showDeletePopUp = signal<boolean>(false)
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


  handleRouting() {
    if (this.can_add) {
      this._Router.navigate(['/iotech_app/alarms/action'])
    } else {
      this._MessageService.add({ severity: 'warn', summary:'Warning' , detail:"All Device Types Already Have Alarm Template  " })
    }
  }

  can_add:boolean = true

  getAlarmData() {
    this.loadingState.set(true)
    this.alarm_list = []
    this._AlarmService.getAllAlarms(this.searchTerm).subscribe((res: any) => {
      this.can_add = res?.data?.canAdd
      this.alarm_list = res?.data?.templates
      this.loadingState.set(false);
      this._ChangeDetectorRef.markForCheck()
    })
  }
}
