import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersManagementRoutingModule } from './users-management-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { SharedModule } from '../../../shared/modules/shared/shared.module';


@NgModule({
  declarations: [
    UsersListComponent
  ],
  imports: [
    CommonModule,
    UsersManagementRoutingModule,
    SharedModule
  ]
})
export class UsersManagementModule { }
