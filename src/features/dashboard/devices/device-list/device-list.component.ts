import { TranslationsService } from './../../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { DevicesService } from '../../../../core/services/devices.service';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-device-list',
  standalone: false,
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent implements OnInit {
  constructor(private _MessageService:MessageService,private _TranslationsService:TranslationsService,private _Router:Router,private _DevicesService:DevicesService,private _SharedService:SharedService,private _TranslateService: TranslateService) {
    this._SharedService.breadCrumbTitle.next('BREADCRUMB.DEVICE_MANAGEMENT');
    this._TranslationsService.selected_lan_sub.subscribe(res => {
      if (res == 'ar') {
        this.is_arabic = true
      } else {
        this.is_arabic = false
      }
    })
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
              this.showDeletePopUp = true;
              this.editName.set(this.selected_device?.deviceName)
            }
          }
        ]
      }
    ]);


    this.searchSub.pipe(debounceTime(300)).subscribe((res:string) => {
      this.getDashboardData()
    })
  }



  navigatetoView(dev: any) {
    this._Router.navigate(['iotech_app/devices-management/device' , dev?.identifier , dev?.type])
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
    },
    {
      id: 3,
      name:'LP-WAN'
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

  private searchSub : Subject<string> = new Subject<string>()

  handleSearch() {
    this.searchSub.next(this.searchTerm)
  }


  getDashboardData() {
    this.loadingState.set(true);
    this.devicesList.set([])
    this.devicesListTemp.set([])
    this._DevicesService.getDevicesDashboard(1,15,this.searchTerm).subscribe({
      next: (res: any) => {
        this.allData.set(res?.data)
        this.devicesList.set(res?.data?.items)
        this.devicesListTemp.set(this.devicesList())

        this.loadingState.set(false)
      }
    })
  }

  filterCount=signal<number>(0);

  // handleFilterList() {
  //   this.filterCount.set(0)

  //   let filter_cartona = []

  //   if (this.filterObj.type != null) {
  //     this.filterCount.set(this.filterCount() + 1);
  //     filter_cartona = this.devicesList().filter((item: any) => {
  //       return this.filterObj.type == 'SigFox' ? item.connectionType == 'Sigfox' : item.connectionType != 'Sigfox'
  //     })
  //   }


  //   if (this.filterObj.status != null) {
  //     this.filterCount.set(this.filterCount() + 1);
  //     if (filter_cartona.length) {
  //       this.devicesListTemp.set(filter_cartona.filter((item: any) => {
  //         return this.filterObj.status == 'Online' ? item.isOnline : item.isOnline == false
  //       }))
  //     } else {
  //       this.devicesListTemp.set(this.devicesList().filter((item: any) => {
  //         return this.filterObj.status == 'Online' ? item.isOnline : item.isOnline == false
  //       }))
  //     }
  //   }


  //   if (!this.filterObj.status && !this.filterObj.type) {
  //     this.devicesListTemp.set([...this.devicesList()])
  //   }

  //   this.showFilter  = false
  // }


  handleFilterList() {
    this.filterCount.set(0);
    if (this.filterObj.type != null) {
      this.filterCount.set(this.filterCount() + 1);
    }
    if (this.filterObj.status != null) {
      this.filterCount.set(this.filterCount() + 1);
    }

    this.loadingState.set(true);
    this.devicesList.set([])
    this.devicesListTemp.set([])
    this._DevicesService.getDevicesDashboard(1,15,this.searchTerm , this.filterObj.status , this.filterObj.type).subscribe({
      next: (res: any) => {
        this.allData.set(res?.data)
        this.devicesList.set(res?.data?.items)
        this.devicesListTemp.set(this.devicesList())

        this.loadingState.set(false)
      }
    })


    this.showFilter  = false


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
  searchTerm:string =''

  filterObj = {
    status: null,
    type:null
  }


  editName = signal<string>('')

  loadingEdit = signal<boolean>(false)

  handleEditDevice() {
    this.loadingEdit.set(true);

    this._DevicesService.editDevice(this.selected_device?.identifier, this.editName()  ).subscribe({
      next: (res: any) => {
        // this.selected_device?.device
        this.loadingEdit.set(false);
        this._MessageService.add({ severity: "success", summary: 'Success', detail: 'Device Name Edited Siccessfully!' })
        this.showEditPopUp = false;
        this.getDashboardData()
      },
      error: (err:any) => {
        this.loadingEdit.set(false);
        this.showEditPopUp = false;

      }
    })

  }
}
