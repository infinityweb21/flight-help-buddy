import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TopDestinationService } from '../services/destinations/top-destination.service';

@Injectable({
  providedIn: 'root',
})
export class DestinationsResolver implements Resolve<any> {
  private topDestinationsService: TopDestinationService = inject(TopDestinationService);

  resolve(): Observable<any> {
    return this.topDestinationsService.getTopDestinations();
  }
}