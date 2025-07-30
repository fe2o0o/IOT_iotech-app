import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlarmService } from '../../../../core/services/alarm.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-alaram-action',
  standalone: false,
  templateUrl: './alaram-action.component.html',
  styleUrl: './alaram-action.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AlaramActionComponent implements OnInit {
  constructor(private _ChangeDetectorRef:ChangeDetectorRef,private _ActivatedRoute:ActivatedRoute,private _Router:Router , private _MessageService:MessageService,private _AlarmService:AlarmService,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALARMS');
      this.initAlarmForm();
    this.getDevicesType();
    this._ActivatedRoute.paramMap.subscribe((res: any) => {
      if (res.get('id')) {
        this.currentUpdateId = res.get('id')
        this._AlarmService.getAlarmById(res.get('id')).subscribe((res: any) => {
          console.log("res" , res?.data);
          this.initAlarmForm(res?.data);
          this.current_segments.set(res?.data?.segments)
        })
      }
    })
  }

  alarm_form!: FormGroup;

  ngOnInit(): void {

  }

  currentUpdateId: any = null;

  getDevicesType() {
    this._AlarmService.getDevicesType().subscribe((res: any) => {
      this.deviceTypes = res?.data
    })
  }

  handleGetSegement(event:any) {
    this._AlarmService.getDeviceTypeSegments(event?.value).subscribe((res: any) => {
      this.current_segments.set(res?.data?.segments)
    })
  }

  stopPropergation(event: any) {

    event.originalEvent.stopPropagation()
  }
  current_segments = signal<any[]>([])

  deviceTypes:any[] = []
  initAlarmForm(data?:any) {
    this.alarm_form = new FormGroup({
      templateName: new FormControl(data ? data?.templateName : null, [Validators.required]),
      deviceType: new FormControl(data ? data?.deviceType : null , [Validators.required])
    })
    this._ChangeDetectorRef.markForCheck()
  }



  load_action = signal<boolean>(false)


  handleAlarmAction() {
    this.load_action.set(true)
    const req = {
      ...this.alarm_form.value,
      segments: this.current_segments()
    }

    const isUpdate$ = !this.currentUpdateId ? this._AlarmService.storeAlarm(req) : null;


    isUpdate$?.subscribe({
      next: (res: any) => {
            this.load_action.set(false)
        this._MessageService.add({ severity: 'success', summary: 'Success', detail: 'Alarm Added Successfully' })
        this._Router.navigate(['/iotech_app/alarms/list'])
      },
      error: (err: any) => {
            this.load_action.set(false)

      }
    })



  }


}
