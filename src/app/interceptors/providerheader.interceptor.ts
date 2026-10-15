import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export const providerInterceptor: HttpInterceptorFn = (req, next) => {

  const excludedDomains = [
    'centralapi.theinfinitytravel.com',
    'mobileapp.theinfinitytravel.com',
    'api.theinfinitytravel.com',
    'demo.theinfinitytravel.com'
  ];

  const isExcluded = excludedDomains.some(domain =>
    req.url.includes(domain)
  );

  if (isExcluded) {
    return next(req);
  }

  if (req.headers.has('skipProvider')) {
    return next(req);
  }

  const modifiedReq = req.clone({
    setHeaders: {
      provider: environment.providerName
    }
  });

  return next(modifiedReq);
};