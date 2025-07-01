import { HttpInterceptorFn } from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {

  const language = localStorage.getItem('user-language') || 'en';
  const newRequest = req.clone({
    headers: req.headers.set('lang', language)
  });
  return next(newRequest);
};
