import { Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlarmService } from '../../../../core/services/alarm.service';
@Component({
  selector: 'app-alaram-action',
  standalone: false,
  templateUrl: './alaram-action.component.html',
  styleUrl: './alaram-action.component.scss'
})
export class AlaramActionComponent implements OnInit {
  constructor(private _AlarmService:AlarmService,private _SharedService:SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALARMS');
  }

  alarm_form!: FormGroup;

  ngOnInit(): void {
    this.initAlarmForm();
    this.getDevicesType()
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
  initAlarmForm() {
    this.alarm_form = new FormGroup({
      templateName: new FormControl(null, [Validators.required]),
      deviceType: new FormControl(null , [Validators.required])
    })
  }


}
