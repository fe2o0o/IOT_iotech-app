import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertManagmentRoutingModule } from './alert-managment-routing.module';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    AlertManagmentRoutingModule,
    SharedModule
  ]
})
export class AlertManagmentModule { }
