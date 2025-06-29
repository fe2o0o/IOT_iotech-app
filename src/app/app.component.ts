import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslationsService } from '../shared/services/translation.service';
import { enLang } from '../../public/i18n/en';
import { arLang } from '../../public/i18n/ar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'IOT_iotech-app';
  constructor(private _TranslationsService: TranslationsService) {
    this._TranslationsService.loadTranslations(enLang , arLang)
    this._TranslationsService.selected_lan_sub.subscribe((lang: string) => {
      if (lang === 'ar') {
        this.dir.set(true)
      } else {
        this.dir.set(false)
      }
    })
  }


  dir = signal<boolean>(false)
}
