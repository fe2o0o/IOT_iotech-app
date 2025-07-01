import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarMainLayoutComponent } from '../../../core/components/sidebar-main-layout/sidebar-main-layout.component';
import { BreadcrumbComponent } from '../../../core/components/breadcrumb/breadcrumb.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    SidebarMainLayoutComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    TableModule,
    TranslateModule,
    GoogleMapsModule


  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    TableModule,
    PrimeNGModule,
    TranslateModule,
    SidebarMainLayoutComponent,
    BreadcrumbComponent,
    GoogleMapsModule

  ]
})
export class SharedModule { }
