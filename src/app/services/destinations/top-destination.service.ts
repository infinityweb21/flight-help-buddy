import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopDestinationService {

  apiUrl: string = environment.MOBILE_APP_URL;

  constructor(private http: HttpClient) { }
  getTopDestinations(params?: { category?: string; origin?: string; destination?: string }): Observable<any> {
    let httpParams = new HttpParams();

    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params?.origin) {
      httpParams = httpParams.set('origin', params.origin);
    }
    if (params?.destination) {
      httpParams = httpParams.set('destination', params.destination);
    }

    return this.http.get(`${this.apiUrl}${environment.TOP_DESTINATIONS}`, {
      params: httpParams
    }).pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }
  getTopDestinationsDetails(slug: any): Observable<any> {
    return this.http.get(`${this.apiUrl}${environment.TOP_DESTINATIONS_DETAILS}/${slug}`).pipe(
      retry(1),
      catchError(this.errorHandler)
    );
  }
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
