import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersManagmentsService } from '../../../../core/services/users-managments.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AlarmService } from '../../../../core/services/alarm.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-action',
  standalone: false,
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit {
  constructor(private _ActivatedRoute:ActivatedRoute,private _Router:Router,private _MessageService:MessageService,private _ChangeDetectorRef:ChangeDetectorRef,private _AlarmService:AlarmService,private _NotificationService:NotificationService,private _UsersManagmentsService:UsersManagmentsService,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS');


    this.initMainForm()

  }


  current_updated_data: any;

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      if (param.get('id')) {
        this.currentUpdateId = param.get('id')
        forkJoin([this._NotificationService.getSingleNotificationGroup(this.currentUpdateId), this._UsersManagmentsService.getAllUsers(1, 999), this._NotificationService.getDevicesType(), this._AlarmService.getAllAlarms()]).subscribe((res: any[]) => {
          this.current_updated_data = res[0]?.data;
          this.initMainForm(this.current_updated_data)
          const usersIDS:any[] = this.current_updated_data?.users?.map((user: any) => user?.userId);

          this.users.set(
            res[1]?.data?.items.filter((us:any)=> !usersIDS.includes(us?.id) )
          )

          this.selected_users.set(
            res[1]?.data?.items.filter((us:any)=> usersIDS.includes(us?.id) )
          )
          this.devicesTypes.set(res[2]?.data)
          this.selected_type = this.current_updated_data?.deviceType
          this.handleGetDevices()
          this.alarm_tempeletes.set(res[3]?.data?.templates);
          this.selected_templete = this.alarm_tempeletes().filter((temp: any) => temp?.templateName == this.current_updated_data?.alarmTemplate)[0]
          console.log("selected" , this.selected_templete);

          this.handleGetTemplates(this.current_updated_data?.dataSegments)
        })
      } else {
        this.initMainForm();
        this.getUsers();
        this.getDevicesType();
        this.getAlarmTemplates()
      }
    })
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
    this.selected_devices.set([])
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
      this.alarm_tempeletes.set(res?.data?.templates)
    }))
  }

  data_segments = signal<any[]>([])
  handleGetTemplates(dataUpdate?:any[]) {
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
              isActive: dataUpdate
                ? dataUpdate?.some((segUp: any) => {
                    if (seg == segUp?.segmentName) {
                      return segUp.notificationTypes.includes(not?.name);
                    } else {
                      return false;
                    }
                  })
                : false,
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
  initMainForm(data?:any) {
    this.main_form = new FormGroup({
      name: new FormControl(data ? data?.name : null , Validators.required),
      description :  new FormControl(data ? data?.description : null , Validators.required)
    })


    if (data) {

      this._ChangeDetectorRef.markForCheck()
    }
  }



  handleBackword() {
    if (this.current_step() == 0) {
      this.current_step.set(1)
    } else {
      this.current_step.set(this.current_step() + 1)
    }
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
