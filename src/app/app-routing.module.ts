import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from '../features/dashboard/index/index.component';
import { loggedInGuard } from '../core/guards/logged-in.guard';
import { requiredLoginGuard } from '../core/guards/required-login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [loggedInGuard],
    loadChildren: ()=> import('../features/auth/auth.module').then((m)=> m.AuthModule)
  },
  {
    path: 'iotech_app',
    component: IndexComponent,
    loadChildren: () => import('../features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate:[requiredLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration:'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
