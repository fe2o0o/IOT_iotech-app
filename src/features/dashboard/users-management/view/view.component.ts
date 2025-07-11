import { Component } from '@angular/core';
import { SharedService } from '../../../../shared/services/shared.service';
@Component({
  selector: 'app-view',
  standalone: false,
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(private sharedService: SharedService) {
    this.sharedService.breadCrumbTitle.next('View User');
  }

  devicesTypes: any[] = [
    {
      name: 'PLS-001-SFX',
      permssions: [
        { name: 'View', isSelected: true },
        { name: 'Edit', isSelected: false },
        { name: 'Delete', isSelected: true },
        { name: 'Add', isSelected: false },
      ]
    }
  ]

  userDataShow: any;

  loading_data: boolean = false;
}
