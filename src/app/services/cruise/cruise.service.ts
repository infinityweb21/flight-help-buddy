
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CruiseService {
  apiUrl: string = environment.API_URL;
  MOBILE_APP_URL: string = environment.MOBILE_APP_URL;
    private fareSummaryData: any; 
  private readonly STORAGE_KEY = 'cruisefare_summary';
   private travelData: any; 
  private readonly TRAVELDATA_KEY = 'cruisetravel_data';
    private repriceData: any; 
  private readonly REPRICEDATA_KEY = 'cruisereprice_data';
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }
  cruiseLinelList(searchQuery: any): Observable<any> {
    const params = { searchQuery };

    return this.http.get(`${this.apiUrl}${environment.CRUISE_LINE_SEARCH}`, { params })
      .pipe(retry(1), catchError(this.errorHandler))
  }
   cruisePortList(searchQuery: any): Observable<any> {
    const params = { searchQuery };

    return this.http.get(`${this.apiUrl}${environment.CRUISE_PORT_SEARCH}`, { params })
      .pipe(retry(1), catchError(this.errorHandler))
  }
    getCruiseList(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CRUISE_SEARCH_LIST}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }

      getcruiseDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CRUISE_DETAILS}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
  
      cruiseBook(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CRUISE_BOOKING}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
        cruiseBookLead(data: any): Observable<any> {
    return this.http.post(`${this.MOBILE_APP_URL}${environment.CRUISE_BOOKING_LEAD}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }

  
    setTravelData(data: any): void {
    this.travelData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TRAVELDATA_KEY, JSON.stringify(data));
    }
  }

  getTravelData(): any {
    if (!this.travelData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.TRAVELDATA_KEY);
      this.travelData = saved ? JSON.parse(saved) : null;
    }
    return this.travelData;
  }

  clearTravelData(): void {
    this.travelData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TRAVELDATA_KEY);
    }
  }
  setFareSummary(data: any): void {
    this.fareSummaryData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
  }

  getFareSummary(): any {
    if (!this.fareSummaryData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      this.fareSummaryData = saved ? JSON.parse(saved) : null;
    }
    return this.fareSummaryData;
  }

  clearFareSummary(): void {
    this.fareSummaryData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
    setRepriceData(data: any): void {
    this.repriceData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.REPRICEDATA_KEY, JSON.stringify(data));
    }
  }

  getRepriceData(): any {
    if (!this.repriceData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.REPRICEDATA_KEY);
      this.repriceData = saved ? JSON.parse(saved) : null;
    }
    return this.repriceData;
  }

  clearRepriceData(): void {
    this.repriceData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.REPRICEDATA_KEY);
    }
  }
  
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
