import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FlightFilterService } from '../flight/flight-filter.service';
import { FlightService } from '../flight/flight.service';
import { SearchService } from '../search.service';

@Injectable({
  providedIn: 'root'
})
export class RouteListenerService {
  constructor(private router: Router, private filterService: FlightFilterService,private flightService:FlightService,private searchService:SearchService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      const fromFlight = this.router.url.includes('/flight') || this.router.url.includes('/package');
      const toFlight = event.url.includes('/flight') || event.url.includes('/package');

      if (fromFlight && !toFlight) {
        this.filterService.resetFilters();
        this.flightService.clearFareSummary();
         this.flightService.clearTravelData();
         this.flightService.clearseatData();
         this.searchService.clearSearchData();
      }
    });
  }
}
