import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DevicesService } from '../../../../core/services/devices.service';
import { TranslationsService } from '../../../../shared/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-ews-child1',
  templateUrl: './chart-ews-child1.component.html',
  styleUrl: './chart-ews-child1.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartEwsChild1Component {
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
        name: this.translate.instant('DEVICES.windSpeed'),
        selected: true,
        icon: 'fi fi-rr-wind'
      },
      {
        id: 2,
        name: this.translate.instant('DEVICES.windGusts'),
        selected: true,
        icon: 'fi fi-rr-wind-warning'
      },
      {
        id: 3,
        name: this.translate.instant('DEVICES.windDirection'),
        selected: true,
        icon: 'fi fi-rr-compass'
      },
      {
        id: 4,
        name: this.translate.instant('DEVICES.beaufortNumber'),
        selected: true,
        icon: 'fi fi-rr-gauge'
      },
      {
        id: 5,
        name: this.translate.instant('DEVICES.windChill'),
        selected: true,
        icon: 'fi fi-rr-temperature-low'
      },
      {
        id: 6,
        name: this.translate.instant('DEVICES.windChillIndex'),
        selected: true,
        icon: 'fi fi-rr-temperature-high'
      }
    ];

    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      this.is_arabic = res == 'ar';
    });

    this.selectedMatrix = this.matrixFilters[0];
    this.route.params.subscribe(params => {
      this.current_id.set(params['id'] || '');
      this._DevicesService.getEWSChart(this.current_id()).subscribe((res: any) => {
        this.current_chart_data = res?.data?.windMetrics || [];
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.windSpeed);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.windGusts);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.windDirection);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.beaufortNumber);
        this.data_alarms.datasets[4].data = this.current_chart_data.map(item => item.windChill);
        this.data_alarms.datasets[5].data = this.current_chart_data.map(item => item.windChillIndex);

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

  handleChart(
    period?: any,
    fromUtc?: any,
    toUtc?: any,
    filterWindSpeed: boolean = true,
    filterWindGusts: boolean = true,
    filterWindDirection: boolean = true,
    filterBeaufortNumber: boolean = true,
    filterWindChill: boolean = true,
    filterWindChillIndex: boolean = true
  ) {
    this.loadingChart.set(true);
    this._DevicesService.getEWSChart(this.current_id(), period, fromUtc, toUtc).subscribe({
      next: (res: any) => {
        this.current_chart_data = res?.data?.windMetrics || [];
        this.data_alarms.labels = this.current_chart_data.map(item => item.lastSeen);
        this.data_alarms.datasets[0].data = this.current_chart_data.map(item => item.windSpeed);
        this.data_alarms.datasets[1].data = this.current_chart_data.map(item => item.windGusts);
        this.data_alarms.datasets[2].data = this.current_chart_data.map(item => item.windDirection);
        this.data_alarms.datasets[3].data = this.current_chart_data.map(item => item.beaufortNumber);
        this.data_alarms.datasets[4].data = this.current_chart_data.map(item => item.windChill);
        this.data_alarms.datasets[5].data = this.current_chart_data.map(item => item.windChillIndex);

        // If all filters are false, show all datasets
        const allFalse = !filterWindSpeed && !filterWindGusts && !filterWindDirection && !filterBeaufortNumber && !filterWindChill && !filterWindChillIndex;
        if (allFalse) {
          this.data_alarms.datasets.forEach((ds: { hidden: boolean; }) => ds.hidden = false);
        } else {
          this.data_alarms.datasets[0].hidden = !filterWindSpeed;
          this.data_alarms.datasets[1].hidden = !filterWindGusts;
          this.data_alarms.datasets[2].hidden = !filterWindDirection;
          this.data_alarms.datasets[3].hidden = !filterBeaufortNumber;
          this.data_alarms.datasets[4].hidden = !filterWindChill;
          this.data_alarms.datasets[5].hidden = !filterWindChillIndex;
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
        label: 'Wind Speed',
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
        label: 'Wind Gusts',
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
        label: 'Wind Direction',
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
        label: 'Beaufort Number',
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
        label: 'Wind Chill',
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
        label: 'Wind Chill Index',
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
    // Example: this._SharedService.exportToExcel(this.current_chart_data, 'WindMetrics');
  }

  get dateRangeError(): boolean {
    return this.filterForm.hasError('dateRangeInvalid');
  }
}
