import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DevicesService } from '../../../../core/services/devices.service';
import moment from 'moment';
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

    this.handleChart(null, this.filterForm.get('fromDate')?.value?.toISOString(), this.filterForm.get('toDate')?.value?.toISOString(),
      this.matrixFilters[0].selected, this.matrixFilters[1].selected, this.matrixFilters[2].selected, this.matrixFilters[3].selected);

  }
  loadingChart = signal<boolean>(true);
  current_chart_data: any[] = [];
  chartWidth: any;
  is_arabic: any;
  handleExportExcel() {

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
    this.handleChart(selectedFilter.name, null, null,
      this.matrixFilters[0].selected, this.matrixFilters[1].selected, this.matrixFilters[2].selected, this.matrixFilters[3].selected);
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
  constructor(private _DevicesService: DevicesService, private translate: TranslateService, private _TranslationsService: TranslationsService, private route: ActivatedRoute) {
    this.initFilterForm()
    this.matrixFilters = [
      {
        id: 1,
        name: this.translate.instant('DEVICES.ambientTemperature'),
        selected: true,
        icon: 'fi fi-rr-temperature-high'
      },
      {
        id: 2,
        name: this.translate.instant('DEVICES.dewPoint'),
        selected: true,
        icon: 'fi fi-rr-wind'
      }
      ,
      {
        id: 3,
        name: this.translate.instant('DEVICES.heatIndex'),
        selected: true,
        icon: 'fi fi-rr-radar-monitoring-track'
      },
      {
        id: 4,
        name: this.translate.instant('DEVICES.frostPoint'),
        selected: true,
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
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.ambientTemperature);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.dewPoint);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.heatIndex);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.frostPoint);
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
    state.selected = !state.selected;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0]

    this.handleChart(selectedFilter, this.filterForm.get('fromDate')?.value?.toISOString(), this.filterForm.get('toDate')?.value?.toISOString(),
      this.matrixFilters[0].selected, this.matrixFilters[1].selected, this.matrixFilters[2].selected, this.matrixFilters[3].selected);
  }


  handleChart(period?: any, fromUtc?: any, toUtc?: any, filterambientTemperature: boolean = true, filterdewPoint: boolean = true, filterheatIndex: boolean = true, filterfrostPoint: boolean = true) {
    this.loadingChart.set(true);
    this._DevicesService.getEWSChart(this.current_id(), period, fromUtc, toUtc).subscribe({
      next: (res: any) => {
        this.current_chart_data = res?.data?.temperatureMetrics;
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.ambientTemperature);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.dewPoint);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.heatIndex);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.frostPoint);

        // If all filters are false, show all datasets
        const allFalse = !filterambientTemperature && !filterdewPoint && !filterheatIndex && !filterfrostPoint;
        if (allFalse) {
          this.data_alarms.datasets.forEach((ds: { hidden: boolean; }) => ds.hidden = false);
        } else {
          this.data_alarms.datasets[0].hidden = !filterambientTemperature;
          this.data_alarms.datasets[1].hidden = !filterdewPoint;
          this.data_alarms.datasets[2].hidden = !filterheatIndex;
          this.data_alarms.datasets[3].hidden = !filterfrostPoint;
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
        label: 'Tmbient Temperature',
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
        label: 'Dew Point',
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
        label: 'Heat Index',
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
        label: 'Frost Point',
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
