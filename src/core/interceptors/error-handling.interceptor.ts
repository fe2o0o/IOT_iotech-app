import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(MessageService);
  const router = inject(Router);
  return next(req).pipe(
    tap((event:any) => {
      if (event.type === HttpEventType.Response && event.status === 200) {
          console.log('Event',event)
      }
    }),
    catchError(error => {
      console.log("error interceptor ",error);
      const errors = error?.error?.errors
         if (errors) {
          const keys = Object.keys(errors)

           for (let i = 0; i<keys.length ; i++){
            // console.log("key",keys[i] , errors[keys[i]][0]);
            toastService.add({ severity: 'error', summary: 'Failed!', detail: errors[keys[i]][0] });
          }


         } else {
                 toastService.add({ severity: 'error', summary: 'Failed!', detail: error?.error?.message });

        }
      if (error.status == 401) {
        localStorage.clear()
        router.navigate(['/'])
      }
      else {

      }

      return throwError(() => error);
    })
  );
};
