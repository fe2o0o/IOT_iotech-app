import { TranslationsService } from './../shared/services/translation.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { errorHandlingInterceptor } from '../core/interceptors/error-handling.interceptor';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { languageInterceptor } from '../core/interceptors/language.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
    }),
    SharedModule
  ],
  providers: [
    TranslationsService,
    MessageService,
    provideHttpClient(withFetch() , withInterceptors([errorHandlingInterceptor , authInterceptor , languageInterceptor ]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
