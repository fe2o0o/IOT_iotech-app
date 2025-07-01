import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // التحقق إذا كنا في بيئة المتصفح
  if (isPlatformBrowser(platformId) && typeof window !== 'undefined') {
    const userData = JSON.parse(localStorage.getItem("userData") || 'null');

    if (!userData) {
      return true;
    } else {
      router.navigate(['/iotech_app/devices-management/list']);
      return false;
    }
  }

  return false;
};

