import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const requiredLoginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const userData = JSON.parse(localStorage.getItem("userData") || 'null');

    if (userData) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  }

  return false;
};
