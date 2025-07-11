import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: '', redirectTo: 'devices-management', pathMatch: 'full' },
  { path: 'devices-management', loadChildren: () => import('./devices/devices.module').then(m => m.DevicesModule) },
  { path: 'map', component: MapComponent },
  {path:'users-management' , loadChildren:()=> import('./users-management/users-management.module').then(m => m.UsersManagementModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
