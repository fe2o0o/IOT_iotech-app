import { TranslationsService } from './../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
@Component({
  selector: 'app-auth-oulet',
  standalone: false,
  templateUrl: './auth-oulet.component.html',
  styleUrl: './auth-oulet.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AuthOuletComponent {
  constructor(private _TranslationsService:TranslationsService) {
    this._TranslationsService.selected_lan_sub.subscribe((res) => {
      if (res == 'ar') {
        this.is_ar.set(true)
      } else {
        this.is_ar.set(false)
      }
      this.selected_lang.set(res)
    })
  }

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

  selected_lang =signal<string>('en') ;

  changeLanguage() {
    this._TranslationsService.setLanguage(this.selected_lang());
    this._TranslationsService.selected_lan_sub.next(this.selected_lang())

  }

  is_ar = signal<boolean>(false)

}
