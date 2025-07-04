import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { DevicesService } from '../../../../core/services/devices.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-device-list',
  standalone: false,
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent implements OnInit {
  constructor(private _Router:Router,private _DevicesService:DevicesService,private _SharedService:SharedService,private _TranslateService: TranslateService) {
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.DEVICE_MANAGEMENT');

    this.items.set([
      {
        items: [
          {
            label: this._TranslateService.instant('DEVICES.EDIT'),
            icon: 'fi fi-rr-edit',
            command:()=>{
              this.showEditPopUp = true
            }

          },
          {
            label: this._TranslateService.instant('DEVICES.VIEW'),
            icon: 'fi fi-rr-eye',
            command: () => {
              this._Router.navigate(['iotech_app/devices-management/device' , this.selected_device?.identifier , this.selected_device?.type])

            }
          },
          {
            label: this._TranslateService.instant('DEVICES.DELETE'),
            icon: 'fi fi-rr-trash',
            command: () => {
              this.showDeletePopUp = true
            }
          }
        ]
      }
    ]);
  }
  loadingState = signal<boolean>(false)
  allData = signal<any>({});

  is_arabic: boolean = false;
  showFilter: boolean = false;
  types: any[] = [
    {
      id: 1,
      name:'LoRawan'
    },
    {
      id: 2,
      name:'SigFox'
    }
  ]


  ngOnInit(): void {
      this.getDashboardData()
  }

  status: any[] = [
    {
      id: 1,
      name:'Online'
    },
    {
      id: 2,
      name:'Offline'
    }
  ]

  handleSearch() {

  }


  getDashboardData() {
    this.loadingState.set(true);
    this.devicesList.set([])
    this.devicesListTemp.set([])
    this._DevicesService.getDevicesDashboard().subscribe({
      next: (res: any) => {
        this.allData.set(res?.data)
        this.devicesList.set(res?.data?.items)
        this.devicesListTemp.set(this.devicesList())

        this.loadingState.set(false)
      }
    })
  }



  showEditPopUp:boolean = false
  showDeletePopUp:boolean = false

  items = signal<any[]>([])

  per_page: number = 15;
  current_page: number = 1;
  selected_device: any;

  devicesListTemp = signal<any[]>([])
  devicesList = signal<any[]>([])

  onPageChange(event:any) {

  }
  filterCount: number = 0;
  searchTerm:string =''

  filterObj = {
    status: null,
    type:null
  }
}
