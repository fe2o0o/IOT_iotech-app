import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { switchMap } from 'rxjs';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ViewComponent {
  constructor(private _SharedService:SharedService,private _NotificationService:NotificationService,private _ActivatedRoute:ActivatedRoute) {
       this._SharedService.breadCrumbTitle.next('BREADCRUMB.NOTIFICATIONS')

    this._ActivatedRoute.paramMap.pipe(
      switchMap((param) => this._NotificationService.getSingleNotificationGroup(param.get('id')))
    ).subscribe({
      next: (res: any) => {
        const dataUpdate: any[] = res?.data?.dataSegments
        this.data_view.set(res?.data)
            this.data_segments.set(res?.data?.dataSegments?.map((seg: any) => {
        return {
          name: seg,
          notifications: ['SMS' , 'Mail' , 'System' , 'WhatsApp'].map((not: any) => {
            const ic = () => {
                switch (not) {
                  case 'SMS':
                    return 'fi fi-rr-message-sms text-xl ';
                  case 'Mail':
                    return 'fi fi-rr-envelope text-xl';
                  case 'System':
                    return 'fi fi-rs-bell text-xl'
                  case 'WhatsApp':
                    return 'fi fi-brands-whatsapp text-xl'
                  default:
                    return '';
                }
              }
            return {
              ...not,
              isActive:seg?.notificationTypes?.includes(not) ? true : false,
              icon: ic()
            }
          })
        }
      }))
        this.loading_data.set(false)
      }
    })
  }

  data_segments = signal<any>(null)


  loading_data = signal<boolean>(true)
  data_view = signal<any>(null)
}
