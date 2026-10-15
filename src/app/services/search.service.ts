import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FlightFilters {
  airlines: string[];
  stopes: number[];
  rangeValues: number[];
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime: string;
  returnArrivalTime: string;
}

const DEFAULT_FILTERS: FlightFilters = {
  airlines: [],
  stopes: [],
  rangeValues: [0, 10000],
  departureTime: '',
  arrivalTime: '',
  returnDepartureTime: '',
  returnArrivalTime: ''
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchDataSubject: BehaviorSubject<any>;
  private hotelSearchDataSubject: BehaviorSubject<any>;
  private hotelDetailsSearchDataSubject: BehaviorSubject<any>;
  private cruiseSearchDataSubject: BehaviorSubject<any>;
    private packageSearchDataSubject: BehaviorSubject<any>;
  private searchParamsDataSubject: BehaviorSubject<any>;
  private carSearchDataSubject: BehaviorSubject<any>;

  private _routeData: any;
  private _hotelrouteData: any;

  searchData$: Observable<any>;
hotelSearchData$: Observable<any>;
hotelDetailsSearchData$: Observable<any>;

cruiseSearchData$: Observable<any>;
packageSearchData$: Observable<any>;
  searchParamsData$: Observable<any>;
  carSearchData$: Observable<any>;

constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  this.searchDataSubject = new BehaviorSubject<any>(this.getFromStorage());
  this.hotelSearchDataSubject = new BehaviorSubject<any>(this.getHotelFromStorage());
    this.hotelDetailsSearchDataSubject = new BehaviorSubject<any>(this.getHotelDetailsFromStorage());

  this.cruiseSearchDataSubject = new BehaviorSubject<any>(this.getCruiseFromStorage());
  this.packageSearchDataSubject = new BehaviorSubject<any>(this.getpackageFromStorage());
    this.carSearchDataSubject = new BehaviorSubject<any>(this.getCarFromStorage());
    this.searchParamsDataSubject = new BehaviorSubject<any>(this.getFromParamsStorage());

  this.searchData$ = this.searchDataSubject.asObservable();
  this.hotelSearchData$ = this.hotelSearchDataSubject.asObservable();
  this.hotelDetailsSearchData$ = this.hotelDetailsSearchDataSubject.asObservable();
  this.cruiseSearchData$ = this.cruiseSearchDataSubject.asObservable();
  this.carSearchData$ = this.carSearchDataSubject.asObservable();
    this.packageSearchData$ = this.packageSearchDataSubject.asObservable();
      this.searchParamsData$ = this.searchParamsDataSubject.asObservable();

}

  // -------------------- Flight Search --------------------
setSearchData(updatedData: any) {
  if (isPlatformBrowser(this.platformId)) {
    const existingData = this.getFromStorage() || {}; // get old data
    const newData = { ...existingData, ...updatedData }; // merge updates

    localStorage.setItem('flightSearchData', JSON.stringify(newData));
    this.searchDataSubject.next(newData); // update observable
  }
}

getFromStorage() {
  if (isPlatformBrowser(this.platformId)) {
    const data = localStorage.getItem('flightSearchData');
    return data ? JSON.parse(data) : null;
  }
  return null;
}


  getCurrentData() {
    return this.searchDataSubject.value;
  }

  clearSearchData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('flightSearchData');
    }
    this.searchDataSubject.next(null);
  }
  // -------------------- Flight Params Search --------------------
setSearchParamsData(updatedData: any) {
  if (isPlatformBrowser(this.platformId)) {
    const existingData = this.getFromParamsStorage() || {}; // get old data
    const newData = { ...existingData, ...updatedData }; // merge updates

    localStorage.setItem('flightParamsSearchData', JSON.stringify(newData));
    this.searchParamsDataSubject.next(newData); // update observable
  }
}

getFromParamsStorage() {
  if (isPlatformBrowser(this.platformId)) {
    const data = localStorage.getItem('flightParamsSearchData');
    return data ? JSON.parse(data) : null;
  }
  return null;
}


  getCurrentParamsData() {
    return this.searchParamsDataSubject.value;
  }

  clearParamsSearchData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('flightParamsSearchData');
    }
    this.searchParamsDataSubject.next(null);
  }
  // -------------------- Hotel Search --------------------
  setSearchHotelData(data: any) {
    this.hotelSearchDataSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hotelSearchData', JSON.stringify(data));
    }
  }

  getHotelFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('hotelSearchData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getCurrentHotelData() {
    return this.hotelSearchDataSubject.value;
  }

  clearSearchHotelData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hotelSearchData');
    }
    this.hotelSearchDataSubject.next(null);
  }

    // -------------------- Hotel Details Search --------------------
  setSearchHotelDetailsData(data: any) {
    this.hotelDetailsSearchDataSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hotelDetailsSearchData', JSON.stringify(data));
    }
  }

  getHotelDetailsFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('hotelDetailsSearchData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getCurrentHotelDetailsData() {
    return this.hotelDetailsSearchDataSubject.value;
  }

  clearSearchHotelDetailsData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hotelDetailsSearchData');
    }
    this.hotelDetailsSearchDataSubject.next(null);
  }
    // -------------------- Cruise Search --------------------
  setSearchCruiseData(data: any) {
    this.cruiseSearchDataSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cruiseSearchData', JSON.stringify(data));
    }
  }

  getCruiseFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('cruiseSearchData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getCurrentCruiseData() {
    return this.cruiseSearchDataSubject.value;
  }

  clearSearchCruiseData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cruiseSearchData');
    }
    this.cruiseSearchDataSubject.next(null);
  }

    // -------------------- Car Search --------------------
  setSearchCarData(data: any) {
    this.carSearchDataSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carSearchData', JSON.stringify(data));
    }
  }

  getCarFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('carSearchData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getCurrentCarData() {
    return this.carSearchDataSubject.value;
  }

  clearSearchCarData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('carSearchData');
    }
    this.carSearchDataSubject.next(null);
  }

    // -------------------- Package Search --------------------
  setSearchpackageData(data: any) {
    this.packageSearchDataSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('packageSearchData', JSON.stringify(data));
    }
  }

  getpackageFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('packageSearchData');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getCurrentpackageData() {
    return this.packageSearchDataSubject.value;
  }

  clearSearchpackageData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('packageSearchData');
    }
    this.packageSearchDataSubject.next(null);
  }
  

  // -------------------- Route Data --------------------
  setRouteData(data: any) {
    this._routeData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('routeData', JSON.stringify(data));
    }
  }

  getRouteData(): any {
    if (!this._routeData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('routeData');
      if (saved) {
        this._routeData = JSON.parse(saved);
      }
    }
    return this._routeData;
  }
  

  clearRouteData() {
    this._routeData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('routeData');
    }
  }

  // -------------------- Hotel Route Data --------------------
  setHotelRouteData(data: any) {
    this._hotelrouteData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hotelrouteData', JSON.stringify(data));
    }
  }

  getHotelRouteData(): any {
    if (!this._hotelrouteData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('hotelrouteData');
      if (saved) {
        this._hotelrouteData = JSON.parse(saved);
      }
    }
    return this._hotelrouteData;
  }

  clearHotelRouteData() {
    console.warn("jhsdfysdfg")
    this._hotelrouteData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('hotelrouteData');
    }
  }
}
