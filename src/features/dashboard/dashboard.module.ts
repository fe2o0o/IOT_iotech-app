import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/modules/shared/shared.module';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    IndexComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
