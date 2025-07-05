import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { DeviceListComponent } from './device-list/device-list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { ChartVs350Component } from './chart-vs350/chart-vs350.component';
import { ChartVs330Component } from './chart-vs330/chart-vs330.component';
import { ChartVs341Component } from './chart-vs341/chart-vs341.component';
import { ChartBOSComponent } from './chart-bos/chart-bos.component';


@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDetailsComponent,
    ChartVs350Component,
    ChartVs330Component,
    ChartVs341Component,
    ChartBOSComponent
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    SharedModule
  ]
})
export class DevicesModule { }
