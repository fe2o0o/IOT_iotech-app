import { Component, input, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DevicesService } from '../../../../core/services/devices.service';

@Component({
  selector: 'app-chart-bos',
  standalone: false,
  templateUrl: './chart-bos.component.html',
  styleUrl: './chart-bos.component.scss'
})
export class ChartBOSComponent {
  constructor(private translate: TranslateService , private _DevicesService:DevicesService) {
    this.peopleStatus=[
      {
        id: 1,
        name: 'Distance',
        selected: true,
        icon: 'fi fi-rr-distribute-spacing-vertical'
      },
      {
        id: 2,
        name: 'Occupancy',
        selected: true,
        icon: 'fi fi-rr-users-alt'
      }
      ,
      {
        id: 3,
        name: 'Calibration',
        selected: true,
        icon: 'fi fi-rr-rewind'
      }
    ]
  }

  is_arabic:Boolean = false

  ngOnInit(): void {
    this.initFilterForm()
    this.getChartData()
  }
  chartWidth:number = 100
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current_identifier_input'].currentValue) {
        this.current_identifier = changes['current_identifier_input'].currentValue
      }
  }

  @ViewChild("alarms_chart") alarms_chart!:  any;

  current_identifier_input = input.required<string>()
  current_identifier:string = ''
  getChartData(period?: any, fromUtc?: any, toUtc?: any) {
    this.loadingChart.set(true);
    this._DevicesService.getBOSChart(this.current_identifier, period, fromUtc, toUtc,this.peopleStatus[0]?.selected , this.peopleStatus[1]?.selected , this.peopleStatus[2]?.selected  ).subscribe((res: any) => {
      this.current_chart_data.set(res?.data)
      console.log("data chart", this.current_chart_data());
      if (this.current_chart_data().length > 10) {
        this.chartWidth += this.current_chart_data.length * 4;
        console.log("width chart", this.chartWidth);

      } else {
        this.chartWidth = 100;
      }
      this.data_alarms.labels = res?.data?.map((item: any) => {
        return item?.lastSeen
      })

      this.data_alarms.datasets[0].data = res?.data?.map((item: any) => {
        return item?.distance
      })
      this.data_alarms.datasets[1].data = res?.data?.map((item: any) => {
        return item?.occupancy == 'N/A' ? 0 : item?.occupancy
      })
      this.data_alarms.datasets[2].data = res?.data?.map((item: any) => {
        return item?.calibration == 'N/A' ? 0 : item?.occupancy
      })

      this.alarms_chart?.chart?.update()
      this.loadingChart.set(false);
      this.loadingFilter = false;
      this.filterVisiblle = false;

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

  isApplyDisabled(): Boolean {
    const isHasFilter = this.customFilters.filter(filter => filter.isActive)
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
        label: 'Distance',
        backgroundColor: '#9F8A60',
        borderColor: '#9F8A60',
        data: [10 , 16 ,18],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      },
      {
        label: 'occupancy',
        backgroundColor: '#1A232D',
        borderColor: '#1A232D',
        data: [20 , 39,38],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      },
      {
        label: 'calibration',
        backgroundColor: '#FF9500',
        borderColor: '#FF9500',
        data: [],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      },

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
  applyPeriod() {
    this.loadingFilter = true;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]
    this.getChartData(selectedFilter?.name , null , null )
  }


  applyFilterDate() {
    this.loadingFilter = true;
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })


    this.getChartData(null , this.filterForm.get('fromDate')?.value?.toISOString() , this.filterForm.get('toDate')?.value?.toISOString()  )
  }


  filterForm!: FormGroup;
  initFilterForm() {
    this.filterForm = new FormGroup({
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
