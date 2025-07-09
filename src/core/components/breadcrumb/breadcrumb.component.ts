import { TranslationsService } from './../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {


  items: any[] = [];

  constructor(private _TranslationsService:TranslationsService,private _Router:Router,private _AuthService:AuthService,private _TranslateService:TranslateService,private _SharedService:SharedService) {
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
              this._Router.navigate(['/auth'])
            }
          }
        ]
      }
    ];
    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      this.selected_lang = res
    })


    this._TranslationsService.selected_lan_sub.subscribe((res) => {
      if (res == 'ar') {
        this.is_ar.set(true)
      } else {
        this.is_ar.set(false)
      }
    })
  }



  is_ar = signal<boolean>(false)


  ngOnInit(): void {
    this._AuthService.userData.subscribe((res) => {
        this.userData = res
      })
  }

  handleSelectedLanguage() {
    this._TranslationsService.setLanguage(this.selected_lang);
    this._TranslationsService.selected_lan_sub.next(this.selected_lang);

  }

  handleOverlay() {
    this._SharedService.overlayStatus.next(true)
    this._SharedService.sidebar_state.next(true)
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
