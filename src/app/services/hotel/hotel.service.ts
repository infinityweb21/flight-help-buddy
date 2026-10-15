import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, Observable, of, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HotelService {
  apiUrl: string = environment.API_URL;
  private selectedRoomSubject: BehaviorSubject<any>;
  selectedRoom$: Observable<any>;
    private hotelsSubject = new BehaviorSubject<any[] | null>(null);
  hotels$ = this.hotelsSubject.asObservable();
    private travelData: any;
  private readonly TRAVELDATA_KEY = 'hotel_travel_data';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Initialize after platformId is injected
    this.selectedRoomSubject = new BehaviorSubject<any>(this.getFromStorage());
    this.selectedRoom$ = this.selectedRoomSubject.asObservable();
  }

  setSearchData(data: any) {
    this.selectedRoomSubject.next(data);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectectedRoom', JSON.stringify(data));
    }
  }

  getFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('selectectedRoom');
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
  /** API call: Get city list */
  hotel_cityList(city: any): Observable<any> {
    const params = { name: city,
     
     };
    return this.http
      .get(`${this.apiUrl}${environment.CITY_LIST}`, { params })
      .pipe(retry(1), catchError(this.errorHandler));
  }
  hotelList( payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_LIST}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  hotelDetails(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_DETAILS}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  hotelRooms(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_ROOM_DETAILS}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  hotelBooking(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_ROOM_BOOK}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }
    hotelPreRate(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_ROOM_PRE_RATE}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  getBookingDetails(tripId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.HOTEL_BOOKING_DETAILS}/${tripId}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  createBooking(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.CREATE_BOOKING}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }
    createBooking_Process(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.HOTEL_CREATE_BOOKINGPROCESS}`, payload)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  getCustomerBookingDetails(bookingId: string): Observable<any> {
    return this.http.get(`${environment.MOBILE_APP_URL}${environment.CUSTOMER_BOOKING_DETAILS}/${bookingId}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  generateHotelBookingTicket(bookingId: string) {
    return this.http.get(`${environment.MOBILE_APP_URL}${environment.GENERATE_TICKET_PDF}/${bookingId}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }
   /** 🔹 Set flight data from anywhere (list component usually) */
  sethotels(hotels: any[]) {
    this.hotelsSubject.next(hotels);
  }

  /** 🔹 Get current hotels snapshot synchronously */
  gethotels(): any | null {
    return this.hotelsSubject.getValue();
  }

  /** 🔹 Clear cache (optional, e.g. when changing filters) */
  clearhotels() {
    this.hotelsSubject.next(null);
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
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
