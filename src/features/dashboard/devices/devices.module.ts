import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { DeviceListComponent } from './device-list/device-list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { ChartVs350Component } from './chart-vs350/chart-vs350.component';


@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceDetailsComponent,
    ChartVs350Component
  ],
  imports: [
    CommonModule,
    DevicesRoutingModule,
    SharedModule
  ]
})
export class DevicesModule { }
