import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    TableModule,
    TranslateModule


  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    ChartModule,
    TableModule,
    PrimeNGModule,
    TranslateModule

  ]
})
export class SharedModule { }
