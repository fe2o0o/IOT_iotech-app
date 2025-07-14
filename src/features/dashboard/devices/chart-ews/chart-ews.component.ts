import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DevicesService } from '../../../../core/services/devices.service';
import moment from 'moment';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-chart-ews',
  standalone: false,
  templateUrl: './chart-ews.component.html',
  styleUrl: './chart-ews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartEwsComponent {
  loadingFilter: boolean = false;
  applyFilterDate() {
    this.loadingFilter = true;
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    this.handleChart(null, this.filterForm.get('fromDate')?.value?.toISOString(), this.filterForm.get('toDate')?.value?.toISOString());

  }
  loadingChart = signal<boolean>(true);
  current_chart_data: any[] = [];
  chartWidth:number = 100;
  is_arabic: any;
  handleExportExcel() {
    this._SharedService.exportToExcel(this.current_chart_data , this.current_id())

  }
  filterVisiblle = signal<boolean>(false);
  cancelAllFilters() {
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    this.handleChart()
  }
  applyPeriod() {
    this.loadingFilter = true;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]
    this.handleChart(selectedFilter.name, null, null);
  }
  isApplyDisabled(): boolean {
    const isHasFilter = this.customFilters.filter(filter => filter.isActive)
    if (isHasFilter.length > 0) {
      return false
    } else {
      return true
    }
  }


  @ViewChild("alarms_chart") alarms_chart!: any;

  current_id = signal<string>('')
  constructor(private _SharedService:SharedService,private _DevicesService: DevicesService, private translate: TranslateService, private _TranslationsService: TranslationsService, private route: ActivatedRoute) {
    this.initFilterForm()
    this.matrixFilters = [
      {
        id: 1,
        name: this.translate.instant('DEVICES.temperatureMetrics'),
        selected: true,
        icon: 'fi fi-rr-temperature-high'
      },
      {
        id: 2,
        name: this.translate.instant('DEVICES.windMetrics'),
        selected: false,
        icon: 'fi fi-rr-wind'
      }
      ,
      {
        id: 3,
        name: this.translate.instant('DEVICES.humidityMetrics'),
        selected: false,
        icon: 'fi fi-rr-radar-monitoring-track'
      },
      {
        id: 4,
        name: this.translate.instant('DEVICES.EnergyMetrics'),
        selected: false,
        icon: 'fi fi-rr-radar-monitoring-track'
      },
      {
        id: 5,
        name: this.translate.instant('DEVICES.pressureMetrics'),
        selected: false,
        icon: 'fi fi-rr-radar-monitoring-track'
      }
    ]

    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_arabic = true
      } else {
        this.is_arabic = false
      }
    })

    this.selectedMatrix = this.matrixFilters[0]
    this.route.params.subscribe(params => {
      console.log('Route parameters:', params);
      this.current_id.set(params['id'] || '');
      this._DevicesService.getEWSChart(this.current_id()).subscribe((res: any) => {
        this.current_chart_data = res?.data?.temperatureMetrics;
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets = [
          {
            label: 'Ambient Temperature',
            backgroundColor: '#1A232D',
            borderColor: '#1A232D',
            data: this.current_chart_data.map(item => item.ambientTemperature),
            borderRadius: 6,
            fill: false,
            tension: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 5,
          },
          {
            label: 'Heat Index',
            backgroundColor: '#FF9500',
            borderColor: '#FF9500',
            data: this.current_chart_data.map(item => item.heatIndex),
            borderRadius: 6,
            fill: false,
            tension: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 5,
          },
          {
            label: 'Dew Point',
            backgroundColor: '#9F8A60',
            borderColor: '#9F8A60',
            data: this.current_chart_data.map(item => item.dewPoint),
            borderRadius: 6,
            fill: false,
            tension: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 5,
          },
          {
            label: 'Frost Point',
            backgroundColor: '#14AB46',
            borderColor: '#14AB46',
            data: this.current_chart_data.map(item => item.frostPoint),
            borderRadius: 6,
            fill: false,
            tension: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 5,
          },
          {
            label: 'wet Bulb Temperature',
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            data: this.current_chart_data.map(item => item.wetBulbTemperature),
            borderRadius: 6,
            fill: false,
            tension: 0.4,
            borderCapStyle: 'round',
            borderJoinStyle: 'round',
            pointRadius: 5,
          }
        ]
           if (this.current_chart_data.length > 10) {
          this.chartWidth += this.current_chart_data.length * 2.5;
          console.log("width chart" , this.chartWidth);

        } else {
          this.chartWidth = 100;
        }
        this.loadingChart.set(false);
        this.alarms_chart?.chart?.update()
        console.log("res chart all", this.current_chart_data);
      })
    });
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

  handleSelecedStatus(state: any) {
    this.matrixFilters.map((item: any) => { return item.selected = false })
    state.selected = true;
    this.selectedMatrix = state;

    this.handleChart()

  }


  handleChart(period?: any, fromUtc?: any, toUtc?: any) {
    this.loadingChart.set(true);
    this._DevicesService.getEWSChart(this.current_id(), period, fromUtc, toUtc).subscribe({
      next: (res: any) => {
        switch (this.selectedMatrix.id) {
          case 1:
            this.current_chart_data = res?.data?.temperatureMetrics;
            this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms.datasets = [
              {
                label: 'Ambient Temperature',
                backgroundColor: '#1A232D',
                borderColor: '#1A232D',
                data: this.current_chart_data.map(item => item.ambientTemperature),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Heat Index',
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                data: this.current_chart_data.map(item => item.heatIndex),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Dew Point',
                backgroundColor: '#9F8A60',
                borderColor: '#9F8A60',
                data: this.current_chart_data.map(item => item.dewPoint),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Frost Point',
                backgroundColor: '#14AB46',
                borderColor: '#14AB46',
                data: this.current_chart_data.map(item => item.frostPoint),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'wet Bulb Temperature',
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                data: this.current_chart_data.map(item => item.wetBulbTemperature),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              }
            ]
            break;
          case 2:
            this.current_chart_data = res?.data?.windMetrics;
            this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms.datasets = [
              {
                label: 'Wind Speed',
                backgroundColor: '#1A232D',
                borderColor: '#1A232D',
                data: this.current_chart_data.map(item => item.windSpeed),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Wind Gusts',
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                data: this.current_chart_data.map(item => item.windGusts),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Wind Direction',
                backgroundColor: '#9F8A60',
                borderColor: '#9F8A60',
                data: this.current_chart_data.map(item => item.windDirection),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Beaufort Number',
                backgroundColor: '#14AB46',
                borderColor: '#14AB46',
                data: this.current_chart_data.map(item => item.beaufortNumber),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Wind Chill',
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                data: this.current_chart_data.map(item => item.windChill),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Wind Chill Index',
                backgroundColor: '#e83e8c',
                borderColor: '#e83e8c',
                data: this.current_chart_data.map(item => item.windChillIndex),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              }
            ]
            break;
          case 3:
            this.current_chart_data = res?.data?.humidityMetrics;
            this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms.datasets = [
              {
                label: 'Relative Humidity',
                backgroundColor: '#1A232D',
                borderColor: '#1A232D',
                data: this.current_chart_data.map(item => item.relativeHumidity),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Absolute Humidity',
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                data: this.current_chart_data.map(item => item.absoluteHumidity),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Specific Humidity',
                backgroundColor: '#9F8A60',
                borderColor: '#9F8A60',
                data: this.current_chart_data.map(item => item.specificHumidity),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Mixing Ratio',
                backgroundColor: '#14AB46',
                borderColor: '#14AB46',
                data: this.current_chart_data.map(item => item.mixingRatio),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Sat. Water Vapor Pressure',
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                data: this.current_chart_data.map(item => item.satWaterVaporPressure),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Water Vapor Pressure',
                backgroundColor: '#e83e8c',
                borderColor: '#e83e8c',
                data: this.current_chart_data.map(item => item.waterVaporPressure),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              }
            ]
            break;
          case 4:
            this.current_chart_data = res?.data?.moistureEnergyMetrics;
            this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms.datasets = [
              {
                label: 'Atmos Moisture By Volume',
                backgroundColor: '#1A232D',
                borderColor: '#1A232D',
                data: this.current_chart_data.map(item => item.atmosMoistureByVolume),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Atmos Moisture By Weight',
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                data: this.current_chart_data.map(item => item.atmosMoistureByWeight),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Specific Enthalpy',
                backgroundColor: '#9F8A60',
                borderColor: '#9F8A60',
                data: this.current_chart_data.map(item => item.specificEnthalpy),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Speed Of Sound',
                backgroundColor: '#14AB46',
                borderColor: '#14AB46',
                data: this.current_chart_data.map(item => item.speedOfSound),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
            ]
            break;
          case 5:
            this.current_chart_data = res?.data?.deviceStatusPressureMetrics;
            this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms.datasets = [
              {
                label: 'Battery Voltage',
                backgroundColor: '#1A232D',
                borderColor: '#1A232D',
                data: this.current_chart_data.map(item => item.batteryVoltage),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Pulse Counter',
                backgroundColor: '#FF9500',
                borderColor: '#FF9500',
                data: this.current_chart_data.map(item => item.pulseCounter),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Use Case',
                backgroundColor: '#9F8A60',
                borderColor: '#9F8A60',
                data: this.current_chart_data.map(item => item.useCase),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Barometric Pressure',
                backgroundColor: '#14AB46',
                borderColor: '#14AB46',
                data: this.current_chart_data.map(item => item.barometricPressure),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
              {
                label: 'Boiling PointOfWater',
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                data: this.current_chart_data.map(item => item.boilingPointOfWater),
                borderRadius: 6,
                fill: false,
                tension: 0.4,
                borderCapStyle: 'round',
                borderJoinStyle: 'round',
                pointRadius: 5,
              },
            ]
            break;
          default:
            break;
        }



           if (this.current_chart_data.length > 10) {
          this.chartWidth += this.current_chart_data.length * 2.5;
          console.log("width chart" , this.chartWidth);

        } else {
          this.chartWidth = 100;
        }


        this.loadingChart.set(false);
        this.alarms_chart?.chart?.update();
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
      },
      error: (err: any) => {
        this.loadingChart.set(false);
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
      }
    })
  }




  data_alarms: any = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Relative Humidity',
        backgroundColor: '#1A232D',
        borderColor: '#1A232D',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      },
      {
        label: 'Absolute Humidity',
        backgroundColor: '#FF9500',
        borderColor: '#FF9500',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      },
      {
        label: 'Specific Humidity',
        backgroundColor: '#9F8A60',
        borderColor: '#9F8A60',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      },
      {
        label: 'Mixing Ratio',
        backgroundColor: '#14AB46',
        borderColor: '#14AB46',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      },
      {
        label: 'Sat. Water Vapor Pressure',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      },
      {
        label: 'Water Vapor Pressure',
        backgroundColor: '#e83e8c',
        borderColor: '#e83e8c',
        data: [],
        borderRadius: 6,
        fill: false,
        tension: 0.4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 5,
      }
    ]
  };


  optionsAlarm = {
    stacked: false,
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: true,
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

  handleCustomFilter(filter: any) {
    this.customFilters.map((fil: any) => {
      fil.isActive = false
    })

    filter.isActive = true;
  }
  matrixFilters: any = []

  selectedMatrix: any;


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
