import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { sidebarLinks } from '../../models/sidebarLinks.model';
import { SharedService } from '../../../shared/services/shared.service';
import { TranslationsService } from '../../../shared/services/translation.service';
@Component({
  selector: 'app-sidebar-main-layout',
  standalone: false,
  templateUrl: './sidebar-main-layout.component.html',
  styleUrl: './sidebar-main-layout.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SidebarMainLayoutComponent {
  constructor(private _SharedService: SharedService , private _TranslationsService:TranslationsService) {
    this._TranslationsService.selected_lan_sub.subscribe((res) => {
      if (res == 'ar') {
        this.is_ar.set(true)
      } else {
        this.is_ar.set(false)
      }
    })


    this.getSideStatus()


  }

  is_ar = signal<boolean>(false)
  sidebarLinks = signal<sidebarLinks[]>([
    {
      name:'SIDEBAR.DEVICES',
      icon:'fi fi-rr-devices',
      link:'/iotech_app/devices-management',
      visible:true,
    },
    {
      name:'SIDEBAR.EMERGENCY' ,
      icon:'fi fi-rr-octagon-exclamation',
      link:'/alharamain-app/alerts',
      visible:false,
    },
    {
      name:'SIDEBAR.MAP' ,
      icon:'fi fi-rs-map',
      link:'/iotech_app/map',
      visible:true,
    },
    {
      name:'SIDEBAR.USER_MANAGEMENT' ,
      icon:'fi fi-rr-users',
      link:'/iotech_app/users-management',
      visible:true,
    },
    {
      name:'SIDEBAR.ROLE_MANAGEMENT' ,
      icon:'fi fi-ss-shield-keyhole',
      link:'/iotech_app/roles-management',
      visible:true,
    },
    {
      name:'SIDEBAR.NOTIFICATIONS' ,
      icon:'fi fi-rr-bell',
      link:'/iotech_app/notification-managment',
      visible:true,
    },
    {
      name:'SIDEBAR.ALARMS' ,
      icon:'fi fi-rr-light-emergency-on',
      link:'/iotech_app/alarms',
      visible:true,
    },
    {
      name:'SIDEBAR.ALERT' ,
      icon:'fi fi-rr-light-emergency-on',
      link:'/iotech_app/alert-managment',
      visible:true,
    },
    {
            name:'SIDEBAR.SUBSCRIPTIONS' ,
      icon:'fi fi-rr-users-alt',
      link:'/iotech_app/subscriptions',
      visible:true,
    }

  ])

  getSideStatus() {
    this._SharedService.sidebar_state.subscribe({
      next: () => {
        if (this._SharedService.sidebar_state.getValue()) {
          this.isColapsed.set(true)
        } else {
          this.isColapsed.set(false)
        }
      }
    })
  }

  isExpand:boolean = false

  isColapsed = signal<boolean>(true)
  handleCollapse() {

  }

  handleCloseOver() {
    this._SharedService.overlayStatus.next(false)
  }
  handleOpenOverlay() { }
  handleExpand() {
    console.log("is closed" , this.isColapsed());
    this.isColapsed.set(!this.isColapsed())
    this._SharedService.sidebar_state.next(this.isColapsed())
  }
}
