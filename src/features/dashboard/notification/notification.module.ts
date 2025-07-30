import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { ActionComponent } from './action/action.component';


@NgModule({
  declarations: [
    ListComponent,
    ActionComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule
  ]
})
export class NotificationModule { }
