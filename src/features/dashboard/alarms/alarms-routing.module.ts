import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlarmListComponent } from './alarm-list/alarm-list.component';
import { AlaramActionComponent } from './alaram-action/alaram-action.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AlarmListComponent },
  {path:'action' , component:AlaramActionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsRoutingModule { }
