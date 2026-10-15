import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class SharedService {
  apiUrl: string = environment.API_URL;


  private data = {
    companyName: "Flighthelpbuddy",
    phoneNumber: "0 (000) 000-0000",
    flightContactNumber: "0 (000) 000-0000",
    hotelContactNumber: "0 (000) 000-0000",
    cruiseContactNumber: "0 (000) 000-0000",
    email: "connect@Flighthelpbuddy.com",
    sendemail: ["connect@Flighthelpbuddy.com"],
    link: "https://Flighthelpbuddy.com/",
    appName: "Flighthelpbuddy",
    address:
      "17875 Von Karman Ave, Suite 150 & 250, Irvine, California, 92614, United States of America",
    markupPercentage: 0,
  };

   private readonly STORAGE_KEY = "selectedSeatTotal";

  private showCookiesSubject: BehaviorSubject<boolean>;
  showCookies$: Observable<boolean>;
  selectedSeatTotal: ReturnType<typeof signal<number>>;
 private ctaState = new BehaviorSubject<{
    show: boolean;
    phone: string;
  }>({ show: false, phone: '' });

  ctaState$ = this.ctaState.asObservable();


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ Initialize AFTER platformId is injected
    this.showCookiesSubject = new BehaviorSubject<boolean>(
      this.getFromStorage()
    );
    this.showCookies$ = this.showCookiesSubject.asObservable();

    this.selectedSeatTotal = signal<number>(this.loadFromStorage());
  }

private setCookie(
  name: string,
  value: string,
  days: number = 365
): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const maxAge = days * 24 * 60 * 60;

  document.cookie =
    `${name}=${encodeURIComponent(value)};` +
    `max-age=${maxAge};` +
    `path=/;` +
    `SameSite=Lax`;

  console.log('Cookie set:', document.cookie);
}

private getCookie(name: string): string | null {
  if (!isPlatformBrowser(this.platformId)) {
    return null;
  }

  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');

    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }

  return null;
}
private getFromStorage(): boolean {
  const value = this.getCookie("showCookies");
  return value !== "false"; // default true
}
  /** Accept cookies and persist setting */
acceptCookies(): void {
  this.setCookie("showCookies", "false", 365); // store for 1 year
  this.showCookiesSubject.next(false);
}
  /** API call: Get airport list */
  airportlList(city: any): Observable<any> {
    const params = { city };
    return this.http
      .get(`${this.apiUrl}${environment.AIRPORT_LIST}`, { params })
      .pipe(retry(1), catchError(this.errorHandler));
  }


  /** API call: Get city list */
  cityList(city: any): Observable<any> {
    const params = { cityName: city     };
    return this.http
      .get(`${this.apiUrl}${environment.CITY_LIST}`, { params })
      .pipe(retry(1), catchError(this.errorHandler));
  }
  countryList(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}${environment.COMMON_CITY_LIST}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  stateList(city: any): Observable<any> {
    const params = { cityName: city };
    return this.http
      .get(`${this.apiUrl}${environment.COMMON_CITY_LIST}`, { params })
      .pipe(retry(1), catchError(this.errorHandler));
  }
  //   webCheckinLink(search?: any): Observable<any> {
  //   const params = { search };

  //   return this.http.get(`${this.apiUrl}${environment.WEB_CKECKIN_AIRLINE}`, { params })
  //     .pipe(retry(1), catchError(this.errorHandler))
  // }
  /** Static company details */
  getcompanyName(): any {
    return this.data;
  }

  /** Load seat total from storage */
  private loadFromStorage(): number {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? parseFloat(stored) : 0;
    }
    return 0;
  }

  /** Save seat total */
  setSeatTotal(amount: number) {
    this.selectedSeatTotal.set(amount);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, amount.toString());
    }
  }

  /** Get seat total (number) */
  getSeatTotal(): number {
    return this.selectedSeatTotal();
  }

  /** Get signal reference */
  seatTotalSignal() {
    return this.selectedSeatTotal;
  }

  /** Clear seat total */
  clearSeatTotal() {
    this.selectedSeatTotal.set(0);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }


  open(phone: string) {
    this.ctaState.next({ show: true, phone });
  }

  close() {
    this.ctaState.next({ show: false, phone: '' });
  }

  getTrustPilotReview(): Observable<any> {
    return this.http
      .get(`${environment.MOBILE_APP_URL}${environment.TRUSTPILOT_REVIEWS}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }
  /** Error handler */
  private errorHandler(error: any): Observable<never> {
    return throwError(() => error || "Server Error");
  }
}
