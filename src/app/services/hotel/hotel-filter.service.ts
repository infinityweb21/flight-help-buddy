import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HotelFilters {
  amenities: string[];
  rangeValues: number[];
  starRating: number[];
  guestRating: number[];
  meal: string[];
  property: string[];
  location: string[];
  landmark: string[];
}

const DEFAULT_FILTERS: HotelFilters = {
  amenities: [],
  rangeValues: [0, 1000000],
  starRating: [],
  guestRating: [],
  meal: [],
  property: [],
  location: [],
  landmark: [],
};

@Injectable({
  providedIn: 'root'
})
export class HotelFilterService {

  private readonly storageKey = 'hotelFilters';

  private filterSubject: BehaviorSubject<HotelFilters>;
  filters$: Observable<HotelFilters>;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {

    this.filterSubject =
      new BehaviorSubject<HotelFilters>(
        this.loadFilters()
      );

    this.filters$ =
      this.filterSubject.asObservable();
  }

  /** Load filters */
  private loadFilters(): HotelFilters {

    if (isPlatformBrowser(this.platformId)) {

      const saved =
        localStorage.getItem(this.storageKey);

      return saved
        ? JSON.parse(saved)
        : { ...DEFAULT_FILTERS };

    }

    return { ...DEFAULT_FILTERS };
  }

  /** Current filters */
  get currentFilters(): HotelFilters {

    return this.filterSubject.getValue();

  }

  /** Save filters */
  setFilters(filters: HotelFilters) {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(filters)
      );

    }

    this.filterSubject.next(filters);

  }

  /** Get filter data */
  getFilterData(): HotelFilters {

    if (isPlatformBrowser(this.platformId)) {

      const saved =
        localStorage.getItem(this.storageKey);

      return saved
        ? JSON.parse(saved)
        : { ...DEFAULT_FILTERS };

    }

    return { ...DEFAULT_FILTERS };

  }

  /** Reset filters */
  resetFilters() {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem(this.storageKey);

    }

    this.filterSubject.next({
      ...DEFAULT_FILTERS
    });

  }
}