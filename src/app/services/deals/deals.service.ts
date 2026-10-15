import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DealsService {
  apiUrl: string = environment.MOBILE_APP_URL;

  private http: HttpClient = inject(HttpClient);
  getDeal(): Observable<any> {
    const url = `${this.apiUrl}${environment.DEALS}`;
    return this.http.get(url).pipe(retry(1), catchError(this.errorHandler));
  }

  getDeals(slug: string): Observable<any> {
    const url = `${this.apiUrl}${environment.DEALS_DETAILS}/${slug}`;
    return this.http.get(url).pipe(retry(1), catchError(this.errorHandler));
  }
  private errorHandler(error: any): Observable<never> {
    return throwError(() => error || 'Server Error');
  }
}
