import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.API_URL;

  constructor(private http: HttpClient) { }
  sendEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${environment.SEND_EMAIl}`, data)
      .pipe(retry(1), catchError(this.errorHandler))
  }
  private errorHandler(error: any): Observable<never> {
    return throwError(() => (error || "Server Error"));
  }
}
