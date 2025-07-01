import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('refresh-token')) {
    return next(req)
  } else {
    const authToken = 'Bearer '+JSON.parse(`${localStorage.getItem('userData')}`)?.token
  const newRequest = req.clone({
    headers:
        req.headers.append('authorization', authToken || ''),

  })
  return next(newRequest);
  }
};
