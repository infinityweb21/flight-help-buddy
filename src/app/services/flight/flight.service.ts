
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EncryptDecryptService } from '../common/encrypt-decrypt.service';
import { FlightSearchRequest } from "../../core/models/flight.model";

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  apiUrl: string = environment.API_URL;
  MOBILE_APP_URL: string = environment.MOBILE_APP_URL;
  DEMO_CRM_FLIGHT_BOOKING: string = environment.CRM_FLIGHT_BOOKING;
  private fareSummaryData: any;
  private readonly STORAGE_KEY = 'fare_summary';
  private travelData: any;
  private confirmData: any;
  private readonly CONFIRMDATA_KEY = 'confirm_data';
  private readonly TRAVELDATA_KEY = 'travel_data';
  private repriceData: any;
  private fareFamilyData: any;
  private fullfareFamilyData: any;

  private readonly REPRICEDATA_KEY = 'reprice_data';
  private readonly FAREFAMILYDATA_KEY = 'fare_family_data';
  private readonly FULLFAREFAMILYDATA_KEY = 'full_fare_family_data';


  private detailsData: any;
  private readonly DETAILSDATA_KEY = 'details_data';
  private flightsSubject = new BehaviorSubject<any[] | null>(null);
  flights$ = this.flightsSubject.asObservable();
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private encryptDecryptService: EncryptDecryptService) { }
  airportlList(input: any): Observable<any> {
    const params = { input };

    return this.http.get(`${this.apiUrl}${environment.AIRPORT_LIST}`, { params })
      .pipe(retry(1), catchError(this.errorHandler))
  }
  getflightList(data: FlightSearchRequest, origindestination: any): Observable<any> {
    const params: any = {};
    if (data.CabinClass) params.CabinClass = data.CabinClass;
    if (data.NoOfAdults) params.NoOfAdults = data.NoOfAdults;
    // if (data.NoOfInfantSeat) params.NoOfInfantSeat = data.NoOfInfantSeat;
    if (data.NoOfInfants) params.NoOfInfants = data.NoOfInfants;
    if (data.NoOfChildren) params.NoOfChildren = data.NoOfChildren;
    if (data.tripType) params.tripType = data.tripType;
    if (data.source) params.source = data.source;
    if (data.CurrencyCode) params.CurrencyCode = data.CurrencyCode;
    if (data.MarketingAirlineName) params.MarketingAirlineName = data.MarketingAirlineName;
    if (data.providers) params.providers = data.providers;
    if (data.maxResultsPerProvider) params.maxResultsPerProvider = data.maxResultsPerProvider;
    if (data.limit) params.limit = data.limit;

    return this.http
      .post(`${this.apiUrl}${environment.FLIGHT_LIST}`, origindestination, { params })
      .pipe(retry(1), catchError(this.errorHandler));
  }
  getFlightfareFamily(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.FLIGHT_FARE_FAMILY}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }


  getFlightReprice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.FLIGHT_REPRICE}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }

  getFlightAvailableSeat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.FLIGTH_SEAT_AVILABILITY}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }

  flightRequestSeat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.FLIGHT_SEAT_REQUEST}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
  flightConfirmSeat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.FLIGHT_BOOKING}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
  createFlightbookings(data: any): Observable<any> {
    return this.http.post(`${this.MOBILE_APP_URL}${environment.CREATE_FLIGHT_BOOKING_MOBILEAPP}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
        getFlightTicket(id: any): Observable<any> {
    return this.http.get(`${this.MOBILE_APP_URL}${environment.GENERATE_FLIGHT_TICKET}/${id}`)
      .pipe(retry(1), catchError(this.errorHandler))
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
  setconfirmData(data: any): void {
    this.confirmData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CONFIRMDATA_KEY, JSON.stringify(data));
    }
  }

  getconfirmData(): any {
    if (!this.confirmData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.CONFIRMDATA_KEY);
      this.confirmData = saved ? JSON.parse(saved) : null;
    }
    return this.confirmData;
  }

  clearconfirmData(): void {
    this.confirmData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CONFIRMDATA_KEY);
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
  setFareFamilyData(data: any): void {
    this.fareFamilyData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.FAREFAMILYDATA_KEY, JSON.stringify(data));
    }
  }

  getFareFamilyData(): any {
    if (!this.fareFamilyData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.FAREFAMILYDATA_KEY);
      this.fareFamilyData = saved ? JSON.parse(saved) : null;
    }
    return this.fareFamilyData;
  }

  clearFareFamilyData(): void {
    this.fareFamilyData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.FAREFAMILYDATA_KEY);
    }
  }

  setFullFareFamilyData(data: any): void {
    this.fullfareFamilyData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.FULLFAREFAMILYDATA_KEY, JSON.stringify(data));
    }
  }

  getFullFareFamilyData(): any {
    if (!this.fareFamilyData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.FULLFAREFAMILYDATA_KEY);
      this.fullfareFamilyData = saved ? JSON.parse(saved) : null;
    }
    return this.fullfareFamilyData;
  }

  clearFullFareFamilyData(): void {
    this.fullfareFamilyData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.FULLFAREFAMILYDATA_KEY);
    }
  }
  /** ✅ Save encrypted details to localStorage */
  setDetailsData(data: any): void {
    this.detailsData = data;
    if (isPlatformBrowser(this.platformId)) {
      const encrypted = this.encryptDecryptService.encryptData(data);
      localStorage.setItem(this.DETAILSDATA_KEY, encrypted);
    }
  }

  /** ✅ Get decrypted details from localStorage */
  getDetailsData(): any {
    if (!this.detailsData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.DETAILSDATA_KEY);
      this.detailsData = saved
        ? this.encryptDecryptService.decryptData(saved)
        : null;
    }
    return this.detailsData;
  }

  /** ✅ Clear stored data */
  clearDetailsData(): void {
    this.detailsData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.DETAILSDATA_KEY);
    }
  }


  private seatData: any = null;
  private readonly SEATDATA_KEY = 'SEATDATA';

  setseatData(data: any): void {
    this.seatData = data;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.SEATDATA_KEY, JSON.stringify(data));
    }
  }

  getseatData(): any {
    if (!this.seatData && isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.SEATDATA_KEY);
      this.seatData = saved ? JSON.parse(saved) : null;
    }
    return this.seatData;
  }

  clearseatData(): void {
    this.seatData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.SEATDATA_KEY);
    }
  }
  /** 🔹 Set flight data from anywhere (list component usually) */
  setFlights(flights: any[]) {
    this.flightsSubject.next(flights);
  }

  /** 🔹 Get current flights snapshot synchronously */
  getFlights(): any | null {
    return this.flightsSubject.getValue();
  }

  /** 🔹 Clear cache (optional, e.g. when changing filters) */
  clearFlights() {
    this.flightsSubject.next(null);
  }
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }

  getCarLIst(data: any): Observable<any> {
    return this.http.post(`${environment.CAR_SEARCH}}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
}
