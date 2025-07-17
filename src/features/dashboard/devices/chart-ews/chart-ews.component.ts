import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DevicesService } from '../../../../core/services/devices.service';
import moment from 'moment';
import { SharedService } from '../../../../shared/services/shared.service';
import { ChangeDetectorRef } from '@angular/core';
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
  chartWidth: number = 100;
  is_arabic: any;
  handleExportExcel() {
    this._SharedService.exportToExcel(this.current_chart_data, this.current_id())

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
  constructor(private _ChangeDetectorRef:ChangeDetectorRef,private _SharedService: SharedService, private _DevicesService: DevicesService, private translate: TranslateService, private _TranslationsService: TranslationsService, private route: ActivatedRoute) {
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
      // this.alarms_chart?.chart?.update()
      this._ChangeDetectorRef.markForCheck()
    })

    this.selectedMatrix = this.matrixFilters[0]
    this.route.params.subscribe(params => {
      console.log('Route parameters:', params);
      this.current_id.set(params['id'] || '');
      this._DevicesService.getEWSChart(this.current_id()).subscribe((res: any) => {
        this.current_chart_data = res?.data?.temperatureMetrics;
        this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
    this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Ambient_Temperature'),
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
                label: this.translate.instant('LABELS.Heat_Index'),
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
                label: this.translate.instant('LABELS.Dew_Point'),
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
                label: this.translate.instant('LABELS.Frost_Point'),
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
                label: this.translate.instant('LABELS.Wet_Bulb_Temperature'),
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
          this.chartWidth += this.current_chart_data.length * 2;
          console.log("width chart", this.chartWidth);

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
            this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Ambient_Temperature'),
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
                label: this.translate.instant('LABELS.Heat_Index'),
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
                label: this.translate.instant('LABELS.Dew_Point'),
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
                label: this.translate.instant('LABELS.Frost_Point'),
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
                label: this.translate.instant('LABELS.Wet_Bulb_Temperature'),
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
            this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Wind_Speed'),
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
                label: this.translate.instant('LABELS.Wind_Gusts'),
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
                label: this.translate.instant('LABELS.Wind_Direction'),
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
                label: this.translate.instant('LABELS.Beaufort_Number'),
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
                label: this.translate.instant('LABELS.Wind_Chill'),
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
                label: this.translate.instant('LABELS.Wind_Chill_Index'),
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
            this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Relative_Humidity'),
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
                label: this.translate.instant('LABELS.Absolute_Humidity'),
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
                label: this.translate.instant('LABELS.Specific_Humidity'),
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
                label: this.translate.instant('LABELS.Mixing_Ratio'),
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
                label: this.translate.instant('LABELS.Sat_Water_Vapor_Pressure'),
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
                label: this.translate.instant('LABELS.Water_Vapor_Pressure'),
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
            this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Atmos_Moisture_By_Volume'),
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
                label: this.translate.instant('LABELS.Atmos_Moisture_By_Weight'),
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
                label: this.translate.instant('LABELS.Specific_Enthalpy'),
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
                label: this.translate.instant('LABELS.Speed_Of_Sound'),
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
            this.data_alarms().labels = this.current_chart_data.map(item => item.lastSeen);
            this.data_alarms().datasets = [
              {
                label: this.translate.instant('LABELS.Battery_Voltage'),
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
                label: this.translate.instant('LABELS.Pulse_Counter'),
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
                label: this.translate.instant('LABELS.Use_Case'),
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
                label: this.translate.instant('LABELS.Barometric_Pressure'),
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
                label: this.translate.instant('LABELS.Boiling_Point_Of_Water'),
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
          this.chartWidth += this.current_chart_data.length * 2;
          console.log("width chart", this.chartWidth);

        } else {
          this.chartWidth = 100;
        }


        this.loadingChart.set(false);
        this.alarms_chart?.chart?.update();
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
        this._ChangeDetectorRef.markForCheck()
      },
      error: (err: any) => {
        this.loadingChart.set(false);
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
      }
    })
  }




  data_alarms= signal<any>( {
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
  })


optionsAlarm = {
  stacked: false,
  maintainAspectRatio: false,
  aspectRatio: 0.6,

  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      labels: {
         padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || '';
          let value = context.parsed.y;
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
