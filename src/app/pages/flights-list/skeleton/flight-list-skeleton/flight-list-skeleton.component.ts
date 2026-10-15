import { Component, inject, Input, signal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { SearchService } from '../../../../services/search.service';

interface SliderItem {
  label: string;
}

@Component({
  selector: 'app-flight-list-skeleton',
  imports: [SkeletonModule],
  templateUrl: './flight-list-skeleton.component.html',
  styleUrl: './flight-list-skeleton.component.scss'
})
export class FlightListSkeletonComponent {
skeletonCount = 6;
skeletonlistCount = 6;
skeletonCountDesktop=10;
  private searchService = inject(SearchService);


/* ================== =================*/
 /** ms between auto-advances */
  @Input() autoplayInterval = 3000;
 
  readonly items: SliderItem[] = [
    { label: '24x7 Customer Assistance' },
    { label: 'Best Price Promise' },
    { label: 'Flexible Cancellation' },
  ];
 
  activeIndex = signal(0);
  diparture:string='';
  arrival:string='';
  private timerId?: ReturnType<typeof setInterval>;
  ngOnInit(): void {
    this.startAutoplay();
        const paramsData = this.searchService.getCurrentParamsData();

          this.searchService.searchData$.subscribe((searchData) => {
        console.log('Received Flight Data:', searchData);
        if (searchData) {
          if (paramsData.tripType !== "multicity") {
            this.diparture =
              paramsData?.departureCity;
            this.arrival =
              paramsData?.arrivalCity;
          } else {
            const lastIndex = searchData.originDestination.length - 1;

            this.diparture =
              searchData?.originDestination[0].DepartureLocationCode;
            this.arrival =
              searchData.originDestination[lastIndex].ArrivalLocationCode;
          }
        }
      })
  }
 
  ngOnDestroy(): void {
    this.stopAutoplay();
  }
 
  startAutoplay(): void {
    this.stopAutoplay();
    // only bother autoplaying if there's more than one card
    if (this.items.length > 1) {
      this.timerId = setInterval(() => this.next(), this.autoplayInterval);
    }
  }
 
  stopAutoplay(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
 
  next(): void {
    this.activeIndex.update((i) => (i + 1) % this.items.length);
  }
 
  goTo(index: number): void {
    this.activeIndex.set(index);
    // reset the timer so a manual click doesn't get instantly overridden
    this.startAutoplay();
  }
/* ================== ================*/
}
