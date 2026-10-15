

import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  apiUrl: string = environment.API_URL;
  MOBILE_APP_URL: string = environment.MOBILE_APP_URL;
    private fareSummaryData: any; 
  private readonly STORAGE_KEY = 'carfare_summary';

  private finalCarAmount: any; 
  private readonly CAR_FINAL_AMOUNT_STORAGE_KEY = 'car_final_amount';

   private travelData: any; 
  private readonly TRAVELDATA_KEY = 'cartravel_data';
    private repriceData: any; 
  private readonly REPRICEDATA_KEY = 'cardetails_data';
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }
  carLinelList(searchQuery: any): Observable<any> {
    const params = { searchQuery };

    return this.http.get(`${this.apiUrl}${environment.CAR_SEARCH}`, { params })
      .pipe(retry(1), catchError(this.errorHandler))
  }
    getcarList(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CAR_LIST}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }

      getcarDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CAR_BOOKING_DETAILS}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
  

        carBookLead(data: any): Observable<any> {
    return this.http.post(`${environment.CAR_BOOKING_LEAD}`, data)
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


    /*
    Final Car Amount
    */
    setFinalCarAmount(data: any): void {
        this.finalCarAmount = data;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.CAR_FINAL_AMOUNT_STORAGE_KEY, JSON.stringify(data));
        }
    }

    getFinalCarAmount(): any {
        if (!this.finalCarAmount && isPlatformBrowser(this.platformId)) {
            const saved = localStorage.getItem(this.CAR_FINAL_AMOUNT_STORAGE_KEY);
            this.finalCarAmount = saved ? JSON.parse(saved) : null;
        }
        return this.finalCarAmount;
    }

    clearFinalCarAmount(): void {
        this.finalCarAmount = null;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.CAR_FINAL_AMOUNT_STORAGE_KEY);
        }
    }
    /*
      Final Car Amount
    */

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
