import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { RoleActionComponent } from './role-action/role-action.component';
import { RoleViewComponent } from './role-view/role-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: "list", component: ListComponent },
  { path: 'action', component: RoleActionComponent },
  { path: 'action/:id', component: RoleActionComponent },
  {path:'view/:id' , component:RoleViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesManagmentRoutingModule { }
