import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {


  items: any[] = [];

  constructor(private _AuthService:AuthService,private _TranslateService:TranslateService,private _SharedService:SharedService) {
    this._AuthService.startHandleRefreshToken()
    this._SharedService.breadCrumbTitle.subscribe((res: string) => {
      this.title_bread.set(res)
    });

    this.items = [
      {
        items: [
          {
            label: this._TranslateService?.instant('TITLES.LOGOUT'),
            icon: 'fi fi-rr-sign-out-alt',
            command: () => {
              localStorage.clear()
            }
          }
        ]
      }
    ];
  }



  userData = {
    userName:'User Name'
  }

  selected_lang:string ='en'
  langs: any[] = [
    {
      name:'English',
      code: 'en',
    },
    {
      name: 'العربية',
      code: 'ar',
    }
  ]


  title_bread = signal<string>('')
}
