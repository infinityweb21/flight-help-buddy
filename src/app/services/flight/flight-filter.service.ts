import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FlightFilters {
  airlines: string[];
  stopes: number[];
  rangeValues: number[];
  departureTime: string[];
  arrivalTime: string[];
  returnDepartureTime: string[];
  returnArrivalTime: string[];
  connectingAirports: string[];
  getNearbyfaredepart: string[];
  getNearbyfarereturn: string[];
  durations: {
    [key: string]: number; // citypair_0, citypair_1, citypair_2...
  };
  sortBy: string;
  severalFlights?: boolean;
  carryOnBaggage?: boolean; // New property for carry-on baggage filter
}

const DEFAULT_FILTERS: FlightFilters = {
  airlines: [],
  stopes: [],
  rangeValues: [0, 1000000],
  departureTime: [],
  arrivalTime: [],
  returnDepartureTime: [],
  returnArrivalTime: [],
  connectingAirports: [],
  getNearbyfaredepart: [],
  getNearbyfarereturn: [],
  durations: {},

  sortBy: '',
  severalFlights: true,
  carryOnBaggage: false, // Default value for carry-on baggage filter


};

@Injectable({
  providedIn: 'root'
})
export class FlightFilterService {
  private readonly storageKey = 'flightFilters';

  private filterSubject: BehaviorSubject<FlightFilters>;
  filters$: Observable<FlightFilters>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ✅ Initialize AFTER platformId is set
    this.filterSubject = new BehaviorSubject<FlightFilters>(this.loadFilters());
    this.filters$ = this.filterSubject.asObservable();
  }

  /** Load from localStorage or return defaults */
  private loadFilters(): FlightFilters {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : { ...DEFAULT_FILTERS };
    }
    return { ...DEFAULT_FILTERS };
  }

  /** Get the current filters */
  get currentFilters(): FlightFilters {
    return this.filterSubject.getValue();
  }

  /** Set and persist filters */
  setFilters(filters: FlightFilters) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(filters));
    }
    this.filterSubject.next(filters);
  }
  /** ✅ NEW: Get filter data directly (from storage or defaults) */
  getFilterData(): FlightFilters {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      console.log("savedsaved", saved)
      return saved ? JSON.parse(saved) : { ...DEFAULT_FILTERS };
    }
    return { ...DEFAULT_FILTERS };
  }

  /** Reset filters to defaults */
  resetFilters() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
    this.filterSubject.next({ ...DEFAULT_FILTERS });
  }
}
