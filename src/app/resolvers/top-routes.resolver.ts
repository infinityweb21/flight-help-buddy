import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TopRoutesService } from '../services/destinations/top-routes.service';

export const topRoutesResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  const topRoutesService = inject(TopRoutesService);


  return topRoutesService.getToproutes({'category':'top-routes'}).pipe(
    catchError((error) => {
      console.error('Blog details resolver error:', error);
      return of(null);
    })
  );
};