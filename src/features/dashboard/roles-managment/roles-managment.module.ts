import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesManagmentRoutingModule } from './roles-managment-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';
import { RoleActionComponent } from './role-action/role-action.component';
import { RoleViewComponent } from './role-view/role-view.component';


@NgModule({
  declarations: [
    ListComponent,
    RoleActionComponent,
    RoleViewComponent
  ],
  imports: [
    CommonModule,
    RolesManagmentRoutingModule,
    SharedModule
  ]
})
export class RolesManagmentModule { }
