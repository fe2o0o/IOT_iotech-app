import { Component, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../shared/services/shared.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { DevicesService } from '../../../../core/services/devices.service';
@Component({
  selector: 'app-chart-vs330',
  standalone: false,
  templateUrl: './chart-vs330.component.html',
  styleUrl: './chart-vs330.component.scss'
})
export class ChartVs330Component {
  @ViewChild("alarms_chart") alarms_chart!:   any;

  constructor(private _ActivatedRoute: ActivatedRoute, private _DevicesService:DevicesService, private translate: TranslateService, private _TranslationsService: TranslationsService, private _SharedService: SharedService) {
    this.matrixFilters = [
      {
        id: 1,
        name: this.translate.instant('DEVICES.TEMP_HUN'),
        selected: true,
        icon: 'fi fi-rr-temperature-high'
      },
      {
        id: 2,
        name: this.translate.instant('DEVICES.CO_LEVEL'),
        selected: false,
        icon: 'fi fi-rr-wind'
      }
      ,
      {
        id: 3,
        name: this.translate.instant('DEVICES.Barometric_Pressure'),
        selected: false,
        icon: 'fi fi-rr-radar-monitoring-track'
      }
    ]

    this.selectedMatrix = this.matrixFilters[0]
    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_arabic = true
      } else {
        this.is_arabic = false
      }
    })

    this._ActivatedRoute.paramMap.subscribe((res) => {
      if (res.get('id')) {
        this.currentIdentifire = res.get('id')
        this.handleChart()

      }
    })
  }





  currentIdentifire: any;
  chartWidth:number =  100

  handleChart(period?: any, fromUtc?: any, toUtc?: any, filterTemperature: boolean = true, filterHumidity: boolean = true, filterCo2: boolean = true, filterCo2Baseline: boolean = true) {
    this.loadingChart.set(true);
    this._DevicesService.getCO2Chart(this.currentIdentifire , period , fromUtc , toUtc).subscribe({
      next: (res: any) => {
        this.loadingChart.set(false);
        this.loadingFilter = false;
        this.filterVisiblle = false;
        console.log("res charrt", res);
        this.current_chart_data = res?.data;
        if (this.current_chart_data.length > 10) {
          this.chartWidth += this.current_chart_data.length * 4;
          console.log("width chart" , this.chartWidth);

        } else {
          this.chartWidth = 100;
        }
        this.data_alarms.labels = this.current_chart_data.map((el: any) => {
          return el.lastSeen
        })
        switch (this.selectedMatrix?.id) {
          case 1:
            this.data_alarms.datasets.map((ele: any) => {
              ele.data = []
            })
            this.data_alarms.datasets[0].label = 'Temperature';
            this.data_alarms.datasets[0].fill = false;
            this.data_alarms.datasets[0].borderColor = '#9F8A60'
            this.data_alarms.datasets[1].label = 'Humidity'
            this.data_alarms.datasets[1].borderColor = '#1A232D'
            this.data_alarms.datasets[0].backgroundColor = '#9F8A60';

            this.data_alarms.datasets[0].data = res?.data?.map((el: any) => {
              return el.temperatureCelsius
            })
            this.data_alarms.datasets[1].data = res?.data?.map((el: any) => {
              return el.humidityPercent
            })
            this.alarms_chart?.chart?.update()
            break;

          case 2:
            this.data_alarms.datasets.map((ele: any) => {
              ele.data = []
            })
            this.data_alarms.datasets[0].label = 'CO₂ Level'
            this.data_alarms.datasets[0].data = res?.data?.map((el: any) => {
              return el.co2Ppm
            })
            this.data_alarms.datasets[0].fill = true;
            this.data_alarms.datasets[0].borderColor = '#1A232D'
            this.data_alarms.datasets[0].backgroundColor = '#94999D'
            this.alarms_chart?.chart?.update()
            break;

          case 3:

            this.data_alarms.datasets.map((ele: any) => {
              ele.data = []
            })

            this.data_alarms.datasets[0].data = res?.data?.map((el: any) => {
              return el.co2BaselinePpm
            })
            this.data_alarms.datasets[0].label = 'Pressure'
            this.data_alarms.datasets[0].fill = false;
            this.data_alarms.datasets[0].borderColor = '#9F8A60';
            this.data_alarms.datasets[0].backgroundColor = '#9F8A60';


            this.alarms_chart?.chart?.update()


            break;

          default:
            break;
        }


      }
    })
  }

  handleSelecedStatus(state: any) {

    this.matrixFilters.map((ele: any) => { ele.selected = false })
    state.selected = true;
    this.selectedMatrix = state;

    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]

    this.handleChart(selectedFilter?.name , this.filterForm.get('fromDate')?.value?.toISOString() , this.filterForm.get('toDate')?.value?.toISOString())
  }

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


  loadingChart = signal<boolean>(false);

  current_chart_data: any[] = [];


  handleExportExcel() {
    this._SharedService.exportToExcel(this.current_chart_data , this.currentIdentifire)
  }

  cancelAllFilters() {
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    this.handleChart()
  }

  ngOnInit(): void {
    this.initFilterForm()
  }



  data_alarms = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'People In',
        backgroundColor: '#9F8A60',
        borderColor: '#9F8A60',
        data: [],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      },
      {
        label: 'People Out',
        backgroundColor: '#1A232D',
        borderColor: '#1A232D',
        data: [],
        borderRadius: 6,
        fill: false, // To avoid filling under the line, you can set fill: true for an area chart
        tension: 0.4, // Make the line curved
        borderCapStyle: 'round', // Rounded line caps
        borderJoinStyle: 'round', // Rounded line joins
        pointRadius: 5, // Optional: Adjust point size
      },
      {
        label: 'Accumulated In',
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
      {
        label: 'Accumulated Out',
        backgroundColor: '#14AB46',
        borderColor: '#14AB46',
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
    plugins: {
      legend: {
        display: false,
        labels: {
          color: ''
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            let value = context.parsed.y;
            // Add units based on dataset index or label
            if (context.dataset.label?.toLowerCase().includes('temp')) {
              return `${label}: ${value} ˚C`;
            }
            if (context.dataset.label?.toLowerCase().includes('humid')) {
              return `${label}: ${value} %`;
            }
            if (context.dataset.label == 'CO₂ Level') {
              return `${label}: ${value} ppm`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9F8A60',
          font: {
            weight: 500
          }
        },
        grid: {
          color: '',
          drawBorder: true,
          lineWidth: 0
        },
        border: {
          width: 3
        }
      },
      y: {
        ticks: {
          color: '#9F8A60'
        },
        grid: {
          color: '',
          drawBorder: false
        },
        border: {
          width: 3
        }
      }
    }
  };

  applyPeriod() {
    this.loadingFilter = true;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]
    this.handleChart(selectedFilter.name)
  }

  matrixFilters:any = []

  selectedMatrix: any ;


  loadingFilter: boolean = false;

  applyFilterDate() {
    this.loadingFilter = true;
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })
    this.handleChart(null , this.filterForm.get('fromDate')?.value?.toISOString() , this.filterForm.get('toDate')?.value?.toISOString())


  }


  filterVisiblle: boolean = false;

  is_arabic: boolean = false;


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
