import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesManagmentRoutingModule } from './roles-managment-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    RolesManagmentRoutingModule,
    SharedModule
  ]
})
export class RolesManagmentModule { }
