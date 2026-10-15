import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  let modifiedReq = req;

  // Read sessionId only in browser
  if (isBrowser) {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      modifiedReq = req.clone({
        setHeaders: {
          "x-session-id": sessionId
        }
      });
    }
  }

  return next(modifiedReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse && isBrowser) {
        const newSessionId = event.headers.get("x-session-id");

        if (newSessionId) {
          localStorage.setItem("sessionId", newSessionId);
          console.log("Updated session ID:", newSessionId);
        }
      }
    })
  );
};
