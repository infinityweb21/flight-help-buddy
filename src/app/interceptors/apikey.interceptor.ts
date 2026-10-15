

import { HttpInterceptorFn } from '@angular/common/http';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {

  const API_URL = 'https://mobileapp.theinfinitytravel.com/';
  const API_KEY = 'infinitytravel@bx1m3ny7us2cjg5ea46q'; // 🔥 replace or use environment

  if (req.url.includes(API_URL)) {
    const cloned = req.clone({
      setHeaders: {
        'X-API-KEY': API_KEY
      }
    });

    return next(cloned);
  }

  return next(req);
};