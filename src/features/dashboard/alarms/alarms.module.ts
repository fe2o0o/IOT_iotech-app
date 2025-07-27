import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmsRoutingModule } from './alarms-routing.module';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { SharedService } from '../../../shared/services/shared.service';
import { AlarmListComponent } from './alarm-list/alarm-list.component';

@NgModule({
  declarations: [
    AlarmListComponent
  ],
  imports: [
    CommonModule,
    AlarmsRoutingModule,
    SharedModule
  ]
})
export class AlarmsModule {
  constructor(private _SharedService:SharedService)
  {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.ALARMS')
  }
}
