import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopRoutesService  {
  apiUrl: string = environment.MOBILE_APP_URL;

  constructor(private http: HttpClient) { }
getToproutes(params?: { category?: string; origin?: string; destination?: string }): Observable<any> {
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

  return this.http.get(`${this.apiUrl}${environment.TOP_ROUTES}`, {
    params: httpParams
  }).pipe(
    retry(1),
    catchError(this.errorHandler)
  );
}
getToproutesDetails(slug:any): Observable<any> {

  return this.http.get(`${this.apiUrl}${environment.TOP_ROUTES_DETAILS}/${slug}`).pipe(
    retry(1),
    catchError(this.errorHandler)
  );
}
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
