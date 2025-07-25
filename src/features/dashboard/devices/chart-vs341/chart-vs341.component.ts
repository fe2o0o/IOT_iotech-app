import { ChangeDetectionStrategy, Component, input, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DevicesService } from '../../../../core/services/devices.service';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-chart-vs341',
  standalone: false,
  templateUrl: './chart-vs341.component.html',
  styleUrl: './chart-vs341.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ChartVs341Component {
  constructor(private _SharedService:SharedService,private translate: TranslateService , private _DevicesService:DevicesService) {
    this.peopleStatus=[
      {
        id: 2,
        name: 'Occupancy',
        selected: true,
        icon: 'fi fi-rr-users-alt'
      }

    ]
    this.peopleStatus_1=[
      {
        id: 2,
        name: 'Occupancy',
        selected: false,
        icon: 'fi fi-rr-users-alt'
      }
      ,
      {
        id: 3,
        name: 'Battery',
        selected: true,
        icon: 'fi fi-rr-rewind'
      }
    ]
  }

  peopleStatus_1:any[]=[]
  is_arabic:Boolean = false

  ngOnInit(): void {
    this.initFilterForm();
    this.initFilterForm_bars()
    this.getChartData();
    this.getChartData_bars()
  }
  chartWidth = signal<number>(100)
  chartWidthBar = signal<number>(100)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current_identifier_input'].currentValue) {
        this.current_identifier = changes['current_identifier_input'].currentValue
      }
  }

  handleExportExcel() {
    this._SharedService.exportToExcel(this.current_chart_data() , this.current_identifier)
  }

  @ViewChild("alarms_chart") alarms_chart!:  any;
  @ViewChild("alarms_chart_1") alarms_chart_1!:  any;

  current_identifier_input = input.required<string>()
  current_identifier:string = ''
  getChartData(period?: any, fromUtc?: any, toUtc?: any) {
    this.loadingChart.set(true);
    this._DevicesService.getDOSChart(this.current_identifier, period, fromUtc, toUtc,this.peopleStatus_1[0]?.selected , this.peopleStatus_1[1]?.selected   ).subscribe((res: any) => {
      this.current_chart_data.set(res?.data)
      console.log("data chart", this.current_chart_data());
      if (this.current_chart_data().length > 10) {
        this.chartWidth.set(this.current_chart_data.length * 4);

      } else {
        this.chartWidth.set(100);
      }
      this.data_alarms.labels = res?.data?.map((item: any) => {
        return item?.lastSeen
      })


      this.data_alarms.datasets[0].data = res?.data?.map((item: any) => {
        return item?.battery == 'N/A' ? 0 : item?.battery
      })

      this.alarms_chart?.chart?.update()
      this.loadingChart.set(false);
      this.loadingFilter = false;
      this.filterVisiblle = false;

    })
  }

  loadingChart_bars = signal<boolean>(false)
  current_chart_data_bars = signal<any[]>([])
  getChartData_bars(period?: any, fromUtc?: any, toUtc?: any) {
    this.loadingChart_bars.set(true);
    this._DevicesService.getDOSChart(this.current_identifier, period, fromUtc, toUtc,this.peopleStatus[0]?.selected , this.peopleStatus[1]?.selected   ).subscribe((res: any) => {
      this.current_chart_data_bars.set(res?.data)
      console.log("data chart bars", this.current_chart_data_bars());
      if (this.current_chart_data_bars().length > 10) {
       this.chartWidthBar.set(  this.current_chart_data_bars().length * 4)

      } else {
        this.chartWidthBar.set(100);
      }
      this.data_alarms_1.labels = res?.data?.map((item: any) => {
        return item?.lastSeen
      })


      this.data_alarms_1.datasets[1].data = res?.data?.map((item: any) => {
        return item?.occupancy == "vacant" ? 1:0
      })

      this.data_alarms_1.datasets[2].data = res?.data?.map((item: any) => {
        return item?.occupancy == "occupied" ? .5:0
      })


      this.data_alarms_1.datasets[0].data = Array(this.data_alarms_1.datasets[1].data.length).fill(50)



      this.alarms_chart_1?.chart?.update()
      this.loadingChart_bars.set(false);
      this.loadingFilter_BARS = false;
      this.filterVisiblle_bars = false;

    })
  }



  peopleStatus: any[] = [];

  customFilters: any[] = [
    {
      id: 1,
      name: '15m',
      isActive: false
    },
    {
      id: 2,
      name: '30m',
      isActive: false
    },
    {
      id: 3,
      name: '2h',
      isActive: false
    },
    {
      id: 4,
      name: '4h',
      isActive: false
    },
    {
      id: 5,
      name: '5h',
      isActive: false
    }
  ]
  customFilters_1: any[] = [
    {
      id: 1,
      name: '15m',
      isActive: false
    },
    {
      id: 2,
      name: '30m',
      isActive: false
    },
    {
      id: 3,
      name: '2h',
      isActive: false
    },
    {
      id: 4,
      name: '4h',
      isActive: false
    },
    {
      id: 5,
      name: '5h',
      isActive: false
    }
  ]

  handleSelecedStatus(state: any) {
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]
    state.selected = !state?.selected;

    this.getChartData(selectedFilter?.name , null , null )
  }

  handleCustomFilter(filter: any) {
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    filter.isActive = true;

  }
  handleCustomFilter_bars(filter: any) {
    this.customFilters_1.map((fil: any) => {
      fil.isActive = false
    })

    filter.isActive = true;

  }

  isApplyDisabled(): Boolean {
    const isHasFilter = this.customFilters.filter(filter => filter.isActive)
    if (isHasFilter.length > 0) {
      return false
    } else {
      return true
    }
  }

  isApplyDisabled_bars(): Boolean {
    const isHasFilter = this.customFilters_1.filter(filter => filter.isActive)
    if (isHasFilter.length > 0) {
      return false
    } else {
      return true
    }
  }

  data_alarms = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Battery',
        backgroundColor: '#FF9500',
        borderColor: '#FF9500',
        data: [],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      }

    ]
  };

  optionsAlarm = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: ''
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9F8A60',
          font: {
            weight: 500
          },

        },
        grid: {
          color: '',
          drawBorder: true,
          lineWidth: 0 // Grid lines remain invisible
        },
        border: {
          width: 3 // Increase the width of the x-axis line (default is 1)
        },

      },
      y: {
        ticks: {
          color: '#9F8A60'
        },
        grid: {
          color: '',
          drawBorder: false // No border for grid lines
        },
        border: {
          width: 3 // Increase the width of the y-axis line (default is 1)
        }
      }
    }
  };



  data_alarms_1 = {
    labels: [

    ],
    datasets: [
      {
        label: 'Base',
        backgroundColor: '#E0E0E0',
        data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
        stack: 'Stack 0',
        borderRadius: 6
      },
      {
        label: 'Vacant',
        backgroundColor: '#D51C54',
        data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1],
        stack: 'Stack 0',
        borderRadius: 6
      },
      {
        label: 'Occupied',
        backgroundColor: '#000000',
        data: [0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0, 0, 0.5, 0, 0.5, 0, 0, 0],
        stack: 'Stack 0',
        borderRadius: 6
      }
    ]
  };

  optionsAlarm_1 = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#9F8A60'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context.dataset.label === 'Base') return '';
            return `${context.dataset.label}: ${context.raw === 0.5 ? 'Occupied' : context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#9F8A60',
          font: {
            weight: 500
          }
        },
        grid: {
          display: false
        },
        border: {
          width: 3
        }
      },
      y: {
        stacked: true,
        min: 50,
        max: 51.5, // Adjusted to accommodate 0.5 for occupied and 1 for vacant
        ticks: {
          color: '#9F8A60',
          stepSize: 0.5,
          callback: function (value: number) {
            if (value === 50) return '';
            if (value === 50.5) return 'Occupied';
            if (value === 51) return 'Vacant';
            return '';
          }
        },
        grid: {
          display: false
        },
        border: {
          width: 3
        }
      }
    }
  };
  current_chart_data = signal<any[]>([])




  loadingFilter:boolean = false
  filterVisiblle:boolean = false
  loadingChart = signal<boolean>(false)
  cancelAllFilters() {
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    this.getChartData()
  }
  cancelAllFiltersBars() {
    this.customFilters_1.map((fil: any) => {
      fil.isActive = false
    })

    this.getChartData_bars()
  }
  applyPeriod() {
    this.loadingFilter = true;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]
    this.getChartData(selectedFilter?.name , null , null )
  }

  loadingFilter_BARS:Boolean = false
  applyPeriod_bars() {
    this.loadingFilter_BARS = true;
    const selectedFilter = this.customFilters_1.filter(filter => filter.isActive)[0]
    this.getChartData_bars(selectedFilter?.name , null , null )
  }


  applyFilterDate() {
    this.loadingFilter = true;
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })


    this.getChartData(null , this.filterForm.get('fromDate')?.value?.toISOString() , this.filterForm.get('toDate')?.value?.toISOString()  )
  }
  applyFilterDate_bars() {
    this.loadingFilter_BARS = true;
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })


    this.getChartData_bars(null , this.filterForm_bars.get('fromDate')?.value?.toISOString() , this.filterForm_bars.get('toDate')?.value?.toISOString()  )
  }


  filterVisiblle_bars:boolean = false

  filterForm!: FormGroup;
  initFilterForm() {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required)
    },
      { validators: this.dateRangeValidator })
  }
  filterForm_bars!: FormGroup;
  initFilterForm_bars() {
    this.filterForm_bars = new FormGroup({
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required)
    },
      { validators: this.dateRangeValidator })
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const fromDate = control.get('fromDate')?.value;
    const toDate = control.get('toDate')?.value;

    if (!fromDate || !toDate) {
      return null; // Skip validation if either date is not set (required validator will handle this)
    }

    // Compare the Date objects (includes both date and time)
    if (new Date(toDate).getTime() <= new Date(fromDate).getTime()) {
      return { dateRangeInvalid: true }; // Return error if toDate is not after fromDate
    }

    return null; // No error if validation passes
  }

  // Helper method to check if the form has the dateRangeInvalid error
  get dateRangeError(): boolean {
    return this.filterForm.hasError('dateRangeInvalid');
  }

}
