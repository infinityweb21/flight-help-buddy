import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CruiseLineService {
  apiUrl: string = environment.MOBILE_APP_URL;

  constructor(private http: HttpClient) { }
getCruise(): Observable<any> {
  return this.http.get(`${this.apiUrl}${environment.CRUISE_LINE}`,).pipe(
    retry(1),
    catchError(this.errorHandler)
  );
}
getCruiseDetails(cruise:any): Observable<any> {
  return this.http.get(`${this.apiUrl}${environment.CRUISE_LINE_DETAILS}/${cruise}`,).pipe(
    retry(1),
    catchError(this.errorHandler)
  );
}
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
