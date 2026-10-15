import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CruiseLineService } from '../services/destinations/cruise-line.service';
import { catchError, of } from 'rxjs';

export const cruiseLinesResolver: ResolveFn<any> = (route, state) => {
  const cruiseLineService = inject(CruiseLineService);

  return cruiseLineService.getCruise().pipe(
    catchError((error) => {
      console.error('Cruise lines resolver error:', error);
      return of(null);
    })
  );
};