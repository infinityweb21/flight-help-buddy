import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FlightFilterService } from '../flight/flight-filter.service';
import { SearchService } from '../search.service';

@Injectable({
  providedIn: 'root'
})
export class RouteListnerCarService {
  constructor(private router: Router, private searchService: SearchService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      const fromHotel = this.router.url.includes('/car');
      const toHotel = event.url.includes('/car');

      if (fromHotel && !toHotel) {
        this.searchService.clearSearchCarData();
        
      }
    });
  }
}
