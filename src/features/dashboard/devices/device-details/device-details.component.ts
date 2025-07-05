import { ChartVs330Component } from './../chart-vs330/chart-vs330.component';
import { ChangeDetectionStrategy, Component, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { SharedService } from '../../../../shared/services/shared.service';
import { DevicesService } from '../../../../core/services/devices.service';
import { GoogleMap } from '@angular/google-maps';
import { ChartVs350Component } from '../chart-vs350/chart-vs350.component';
import { ChangeDetectorRef } from '@angular/core';
import { ChartBOSComponent } from '../chart-bos/chart-bos.component';
import { ChartVs341Component } from '../chart-vs341/chart-vs341.component';

@Component({
  selector: 'app-device-details',
  standalone: false,
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DeviceDetailsComponent {
  @ViewChild("alarms_chart") alarms_chart!:  any;
  @ViewChild(GoogleMap) map!: GoogleMap;
  totalItems: any;
  handleReload() {
    window.location.reload()
  }
  @ViewChild('vcr', { static: true, read: ViewContainerRef }) vcr!: ViewContainerRef;

  constructor(private _ChangeDetectorRef:ChangeDetectorRef,private _DevicesService: DevicesService, private _SharedService: SharedService, private _ActivatedRoute: ActivatedRoute) {
    this._ActivatedRoute.paramMap.pipe(
      tap(res => {
        this.deviceId = res.get('id'); this.devceType = res?.get('type');
       }),
      switchMap(res => this._DevicesService.getDeviceNewDetails(res.get('id'), res.get('type')))
    ).subscribe((res: any) => {
          switch (this.devceType) {
          case 'PPC-002-LRW':
            this.vcr.clear()
              const comp = this.vcr.createComponent(ChartVs350Component)
              comp.setInput('current_identifier_input', this.deviceId)
              this._ChangeDetectorRef.markForCheck()

            break;
            case 'AW-CO2-SFX':
              this.vcr.clear()
              this.vcr.createComponent(ChartVs330Component)
              this._ChangeDetectorRef.markForCheck()
              break;
            case 'BOS-002-LRW':
              this.vcr.clear()
              const Comp = this.vcr.createComponent(ChartBOSComponent)
              Comp.setInput('current_identifier_input', this.deviceId)
              this._ChangeDetectorRef.markForCheck()
              break;
            case 'DOS-002-LRW':
              this.vcr.clear()
              const ref = this.vcr.createComponent(ChartVs341Component)
              ref.setInput('current_identifier_input', this.deviceId)
              this._ChangeDetectorRef.markForCheck()
              break;
          default:
            break;
        }
      this.deviceDetails.set(res?.data?.details);
      this.deviceReadings.set(res?.data?.readings);
      this.deviceDetailsLoding.set(false);
    })
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.DEVICE_MANAGEMENT');
  }
  tableData = signal<any[]>([]);
  current_page: number = 1;
  per_page: number = 15;
  loadingState:boolean = false
  getTableData(event: any) {
    this.loadingState = true;
    this.tableData.set([])
    const pageNumber = event?.first / event?.rows + 1;
    if (event?.rows == this.per_page) {
      this.current_page = pageNumber;
    } else {
      this.current_page = 1;
    }
    this.per_page = event?.rows;
    this._DevicesService.getDeviceNewDetails(this.deviceId, this.devceType, this.current_page, this.per_page).subscribe((res: any) => {
      this.loadingState = true;
      this.current_page = res?.data?.readings?.currentPage
      this.per_page = res?.data?.readings?.pageSize;
      this.totalItems = res?.data?.readings?.totalItems;

      this.tableData.set(res?.data?.readings?.items)
    })
  }
  is_arabic: boolean = false;
  loadingEx: boolean = false;
  rangeDates:any= null
  center: google.maps.LatLngLiteral = { lat: 24.713892459748248, lng: 46.66132500714057 };
  zoom = 14;
  options: google.maps.MapOptions = {
    mapId: "115e41338d1465ab",
    center: this.center,
    zoom: this.zoom,
  };

  handleExportWithFilter(){}

  deviceDetails = signal<any>(null)

  deviceId: any = null;
  devceType: any = null;
  current_tab = signal<number>(1)
  deviceDetailsLoding = signal<boolean>(true)
  deviceReadings = signal<any[]>([])

}
