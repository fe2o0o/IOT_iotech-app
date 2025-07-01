import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { sidebarLinks } from '../../models/sidebarLinks.model';

@Component({
  selector: 'app-sidebar-main-layout',
  standalone: false,
  templateUrl: './sidebar-main-layout.component.html',
  styleUrl: './sidebar-main-layout.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SidebarMainLayoutComponent {

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
      link:'/alharamain-app/user-managemnet',
      visible:true,
    },
    {
      name:'SIDEBAR.ROLE_MANAGEMENT' ,
      icon:'fi fi-ss-shield-keyhole',
      link:'/alharamain-app/role-managemnet',
      visible:true,
    },
    {
      name:'SIDEBAR.NOTIFICATIONS' ,
      icon:'fi fi-rr-bells',
      link:'/alharamain-app/notification-managment',
      visible:false,
    },
    {
      name:'SIDEBAR.ALARMS' ,
      icon:'fi fi-rr-alarm-exclamation',
      link:'/alharamain-app/alarms',
      visible:false,
    },

  ])

  isExpand:boolean = false

  isColapsed = signal<boolean>(true)
  handleCollapse() {

  }
  handleOpenOverlay() { }
  handleExpand() {

  }
}
