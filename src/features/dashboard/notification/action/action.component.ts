import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AlarmService } from '../../../../core/services/alarm.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-action',
  standalone: false,
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit {
  constructor(private _Router:Router,private _MessageService:MessageService,private _ChangeDetectorRef:ChangeDetectorRef,private _AlarmService:AlarmService,private _NotificationService:NotificationService,private _UsersManagmentsService:UsersManagmentsService,private _SharedService:SharedService) {
        this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS')

  }


  ngOnInit(): void {
    this.initMainForm();
    this.getUsers();
    this.getDevicesType();
    this.getAlarmTemplates()
  }

  current_step = signal<number>(1)
  getUsers() {
    this._UsersManagmentsService.getAllUsers(1, 999).subscribe((res: any) => {
      this.users.set(res?.data?.items)
    })
  }

  selected_templete: any = null;

  devices = signal<any[]>([])
  selected_devices = signal<any[]>([])
  handleGetDevices() {
    this._NotificationService.getDevicesForType(this.selected_type).subscribe((res: any) => {
      console.log("res devices" , res?.data);
      this.devices.set(res?.data?.devices)
    })
  }

  devicesTypes = signal<any[]>([])
  selected_type:any = null
  getDevicesType() {
    this._NotificationService.getDevicesType().subscribe((res: any) => {
      this.devicesTypes.set(res?.data)
    })
  }



  alarm_tempeletes = signal<any[]>([])

  getAlarmTemplates() {
    this._AlarmService.getAllAlarms().subscribe(((res: any) => {
      this.alarm_tempeletes.set(res?.data)
    }))
  }

  data_segments = signal<any[]>([])
  handleGetTemplates() {
    this._NotificationService.getDevicesForType(this.selected_templete?.deviceType).subscribe((res: any) => {

      this.data_segments.set(res?.data?.segments?.map((seg: any) => {
        return {
          name: seg,
          notifications: res?.data?.notificationTypes.map((not: any) => {
            const ic = () => {
                switch (not?.name) {
                  case 'SMS':
                    return 'fi fi-rr-message-sms text-xl ';
                  case 'Mail':
                    return 'fi fi-rr-envelope text-xl';
                  case 'System':
                    return 'fi fi-rs-bell text-xl'
                  case 'WhatsApp':
                    return 'fi fi-brands-whatsapp text-xl'
                  default:
                    return '';
                }
              }
            return {
              ...not,
              isActive: false,
              icon: ic()
            }
          })
        }
      }))



      console.log("data seg" , this.data_segments());
      this._ChangeDetectorRef.markForCheck()
    })
  }
  load_action = signal<boolean>(false)
  currentUpdateId: any;

  users = signal<any[]>([])

  selected_users = signal<any[]>([])

  main_form !: FormGroup;
  initMainForm() {
    this.main_form = new FormGroup({
      name: new FormControl(null, Validators.required),
      description :  new FormControl(null , Validators.required)
    })
  }





  handleAction() {
    if (this.current_step() != 4) {
      this.current_step.set(this.current_step() + 1)
      return;
    }

    this.load_action.set(true)
    const req = {
        ...this.main_form.value,
        userIds: this.selected_users().map((user: any) => {
          return user?.id
        }),
        alarmTemplateId:this.selected_templete?.id,
        deviceIds: this.selected_devices().map((dev: any) => {
          return dev?.id
        }),
        dataSegments: this.data_segments().map((seg: any) => {
          const selected_seg = seg?.notifications.filter((not:any)=> not?.isActive)

          if (selected_seg.length > 0) {
            return {
              name: seg.name,
              notificationTypeIds: seg?.notifications.filter((not:any) => not?.isActive).map((notAc:any)=> notAc?.id)
            }
          } else {
            return null
          }

        }).filter((seg: any) => seg != null),
        deviceType:this.selected_type

    }
    console.log("req", req);

    const API = this.currentUpdateId ? null : this._NotificationService.addNotification(req)


    API?.subscribe({
      next: (res: any) => {
        this.load_action.set(false)
        if (!this.currentUpdateId) {
          this._MessageService.add({severity:'success' , summary:"Success" , detail:"Notification Group Added Successfully"})
          this._Router.navigate(['/iotech_app/notification-managment/list'])
        }
      }
    })
  }
}



// {
//   "name": "string",
//   "description": "string",
//   "deviceType": "string",
//   "alarmTemplateId": 0,
//   "deviceIds": [
//     0
//   ],
//   "userIds": [
//     "string"
//   ],
//   "dataSegments": [
//     {
//       "name": "string",
//       "notificationTypeIds": [
//         0
//       ]
//     }
//   ]
// }
