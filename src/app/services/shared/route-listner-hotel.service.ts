import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FlightFilterService } from '../flight/flight-filter.service';
import { SearchService } from '../search.service';

@Injectable({
  providedIn: 'root'
})
export class RouteListnerHotelService {
  constructor(private router: Router, private searchService: SearchService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      const fromHotel = this.router.url.includes('/hotel')|| this.router.url.includes('/package');;
      const toHotel = event.url.includes('/hotel')|| event.url.includes('/package');;

      if (fromHotel && !toHotel) {
      this.searchService.clearSearchHotelData();
        
      }
    });
  }
}
