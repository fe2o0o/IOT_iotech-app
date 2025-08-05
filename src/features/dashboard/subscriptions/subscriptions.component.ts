import { Component, OnInit, signal } from '@angular/core';
import { SubscriptionsService } from '../../../core/services/subscriptions.service';
import { SharedService } from '../../../shared/services/shared.service';
import moment from 'moment';
@Component({
  selector: 'app-subscriptions',
  standalone: false,
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  constructor(private _SubscriptionsService:SubscriptionsService,private _SharedService: SharedService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.SUBSCRIPTIONS')
  }


  getdiffDate(start:string) {
    const today = moment();
  const targetDate = moment(start);
  return targetDate.diff(today, 'days');
  }

  ngOnInit(): void {
      this.getSubscriptionData()
  }


  sub_data = signal<any[]>([])

  getSubscriptionData() {
    this._SubscriptionsService.getSubscriptions().subscribe((res: any) => {
      this.sub_data.set(res?.data?.items)
    })
  }

}
