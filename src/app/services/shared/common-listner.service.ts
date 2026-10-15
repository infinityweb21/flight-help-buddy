import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FlightFilterService } from '../flight/flight-filter.service';
import { FlightService } from '../flight/flight.service';
import { SearchService } from '../search.service';

@Injectable({
  providedIn: 'root'
})
export class CommonListnerService {
  constructor(private router: Router, private filterService: FlightFilterService,private flightService:FlightService,private searchService:SearchService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      const fromTop = this.router.url.includes('/top-routes');
      const toTop = event.url.includes('/top-routes');
     const fromTopHotel = this.router.url.includes('/hotel');
      const toTopHotel = event.url.includes('/hotel');
         const frompackage = this.router.url.includes('/package-booking-details');
      const topackage = event.url.includes('/select-package');
      if (fromTop && !toTop) {

         this.searchService.clearRouteData();
      }
      // For /top-hotel
      if (fromTopHotel && !toTopHotel) {
        this.searchService.clearSearchHotelData();
        this.searchService.clearHotelRouteData(); 
      }

            if (frompackage && !topackage) {
        this.searchService.clearSearchpackageData();
      }
    });
  }
}
