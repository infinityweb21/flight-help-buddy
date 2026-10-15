import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http:HttpClient) { }


   getAllBlog():Observable<any> {
      return this.http.get(`${environment.MOBILE_APP_URL}${environment.ALL_BLOG}`)
        .pipe(retry(1), catchError(this.errorHandler))
    }
    getBlogDetails(slug:any):Observable<any>{
      const params={
        slug:slug
      }
      return this.http.get(`${environment.MOBILE_APP_URL}${environment.BLOG_DETAILS}`,{params})
        .pipe(retry(1), catchError(this.errorHandler))
    }
    private errorHandler(error: any): Observable<never> {
      return throwError(() => (error || "Server Error"));
    }
}
