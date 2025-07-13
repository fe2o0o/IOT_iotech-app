import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DevicesService } from '../../../../core/services/devices.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-ews-child2',
  templateUrl: './chart-ews-child2.component.html',
  styleUrl: './chart-ews-child2.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartEwsChild2Component {
  loadingFilter: boolean = false;
  loadingChart = signal<boolean>(true);
  current_chart_data: any[] = [];
  chartWidth: any;
  is_arabic: any;
  filterVisiblle = signal<boolean>(false);

  @ViewChild("alarms_chart") alarms_chart!: any;

  current_id = signal<string>('');
  matrixFilters: any = [];
  selectedMatrix: any;

  customFilters: any[] = [
    { id: 1, name: '15m', isActive: false },
    { id: 2, name: '30m', isActive: false },
    { id: 3, name: '2h', isActive: false },
    { id: 4, name: '4h', isActive: false },
    { id: 5, name: '5h', isActive: false }
  ];

  filterForm!: FormGroup;

  constructor(
    private _DevicesService: DevicesService,
    private translate: TranslateService,
    private _TranslationsService: TranslationsService,
    private route: ActivatedRoute
  ) {
    this.initFilterForm();
    this.matrixFilters = [
      {
        id: 1,
        name: this.translate.instant('DEVICES.relativeHumidity'),
        selected: true,
        icon: 'fi fi-rr-droplet-percent'
      },
      {
        id: 2,
        name: this.translate.instant('DEVICES.absoluteHumidity'),
        selected: true,
        icon: 'fi fi-rr-droplet'
      },
      {
        id: 3,
        name: this.translate.instant('DEVICES.specificHumidity'),
        selected: true,
        icon: 'fi fi-rr-water'
      },
      {
        id: 4,
        name: this.translate.instant('DEVICES.mixingRatio'),
        selected: true,
        icon: 'fi fi-rr-flask'
      },
      {
        id: 5,
        name: this.translate.instant('DEVICES.satWaterVaporPressure'),
        selected: true,
        icon: 'fi fi-rr-clouds'
      },
      {
        id: 6,
        name: this.translate.instant('DEVICES.waterVaporPressure'),
        selected: true,
        icon: 'fi fi-rr-cloud'
      }
    ];

    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      this.is_arabic = res == 'ar';
    });

    this.selectedMatrix = this.matrixFilters[0];
    this.route.params.subscribe(params => {
      this.current_id.set(params['id'] || '');
      this._DevicesService.getEWSChart(this.current_id()).subscribe((res: any) => {
        this.current_chart_data = res?.data?.humidityMetrics || [];
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.relativeHumidity);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.absoluteHumidity);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.specificHumidity);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.mixingRatio);
        this.data_alarms.datasets[4].data = this.current_chart_data.map(item => item.satWaterVaporPressure);
        this.data_alarms.datasets[5].data = this.current_chart_data.map(item => item.waterVaporPressure);

        this.loadingChart.set(false);
        this.alarms_chart?.chart?.update();
      });
    });
  }

  handleSelecedStatus(state: any) {
    state.selected = !state.selected;
    const selectedFilter = this.customFilters.filter(filter => filter.isActive)[0];
    this.handleChart(
      selectedFilter,
      this.filterForm.get('fromDate')?.value?.toISOString(),
      this.filterForm.get('toDate')?.value?.toISOString(),
      this.matrixFilters[0].selected,
      this.matrixFilters[1].selected,
      this.matrixFilters[2].selected,
      this.matrixFilters[3].selected,
      this.matrixFilters[4].selected,
      this.matrixFilters[5].selected
    );
  }

  handleCustomFilter(filter: any) {
    this.customFilters.forEach((fil: any) => fil.isActive = false);
    filter.isActive = true;
  }

  isApplyDisabled(): boolean {
    return !this.customFilters.some(filter => filter.isActive);
  }

  applyPeriod() {
    this.loadingFilter = true;
    const selectedFilter = this.customFilters.find(filter => filter.isActive);
    this.handleChart(
      selectedFilter,
      this.filterForm.get('fromDate')?.value?.toISOString(),
      this.filterForm.get('toDate')?.value?.toISOString(),
      this.matrixFilters[0].selected,
      this.matrixFilters[1].selected,
      this.matrixFilters[2].selected,
      this.matrixFilters[3].selected,
      this.matrixFilters[4].selected,
      this.matrixFilters[5].selected
    );
  }

  cancelAllFilters() {
    this.customFilters.forEach((fil: any) => fil.isActive = false);
    this.handleChart();
  }

  applyFilterDate() {
    this.loadingFilter = true;
    this.customFilters.forEach((fil: any) => fil.isActive = false);
    this.handleChart(
      null,
      this.filterForm.get('fromDate')?.value?.toISOString(),
      this.filterForm.get('toDate')?.value?.toISOString(),
      this.matrixFilters[0].selected,
      this.matrixFilters[1].selected,
      this.matrixFilters[2].selected,
      this.matrixFilters[3].selected,
      this.matrixFilters[4].selected,
      this.matrixFilters[5].selected
    );
  }

  handleExportExcel() {
    // Dummy implementation, replace with your export logic
    // Example: this._SharedService.exportToExcel(this.current_chart_data, 'HumidityMetrics');
  }

  handleChart(
    period?: any,
    fromUtc?: any,
    toUtc?: any,
    filterRelativeHumidity: boolean = true,
    filterAbsoluteHumidity: boolean = true,
    filterSpecificHumidity: boolean = true,
    filterMixingRatio: boolean = true,
    filterSatWaterVaporPressure: boolean = true,
    filterWaterVaporPressure: boolean = true
  ) {
    this.loadingChart.set(true);
    this._DevicesService.getEWSChart(this.current_id(), period, fromUtc, toUtc).subscribe({
      next: (res: any) => {
        this.current_chart_data = res?.data?.humidityMetrics || [];
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.relativeHumidity);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.absoluteHumidity);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.specificHumidity);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.mixingRatio);
        this.data_alarms.datasets[4].data = this.current_chart_data.map(item => item.satWaterVaporPressure);
        this.data_alarms.datasets[5].data = this.current_chart_data.map(item => item.waterVaporPressure);

        // If all filters are false, show all datasets
        const allFalse = !filterRelativeHumidity && !filterAbsoluteHumidity && !filterSpecificHumidity && !filterMixingRatio && !filterSatWaterVaporPressure && !filterWaterVaporPressure;
        if (allFalse) {
          this.data_alarms.datasets.forEach((ds: { hidden: boolean; }) => ds.hidden = false);
        } else {
          this.data_alarms.datasets[0].hidden = !filterRelativeHumidity;
          this.data_alarms.datasets[1].hidden = !filterAbsoluteHumidity;
          this.data_alarms.datasets[2].hidden = !filterSpecificHumidity;
          this.data_alarms.datasets[3].hidden = !filterMixingRatio;
          this.data_alarms.datasets[4].hidden = !filterSatWaterVaporPressure;
          this.data_alarms.datasets[5].hidden = !filterWaterVaporPressure;
        }

        this.loadingChart.set(false);
        this.alarms_chart?.chart?.update();
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
      },
      error: () => {
        this.loadingChart.set(false);
        this.loadingFilter = false;
        this.filterVisiblle.set(false);
      }
    });
  }


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

  data_alarms: any = {
    labels: [],
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

  initFilterForm() {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required)
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const fromDate = control.get('fromDate')?.value;
    const toDate = control.get('toDate')?.value;
    if (!fromDate || !toDate) return null;
    if (new Date(toDate).getTime() <= new Date(fromDate).getTime()) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  get dateRangeError(): boolean {
    return this.filterForm.hasError('dateRangeInvalid');
  }
}
