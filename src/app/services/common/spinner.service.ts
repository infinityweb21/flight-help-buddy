import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<any>({ loading: false, data: {} });
  public isLoading$ = this.loadingSubject.asObservable();
  private  spinner:NgxSpinnerService=inject(NgxSpinnerService)

  private requestCount = 0; // 🔸 Track active API calls

  isLoading = false;
  loaderType: 'hotel' | 'flight'|'cruise'|'package' |'car'| null = null;

  showLoader(type: 'hotel' | 'flight'|'cruise'|'package'|'car', body: any = {}) {
    this.requestCount++; // 🔹 Increment on every API call
    this.loaderType = type;
    this.isLoading = true;
    const payload = {
      loading: true,
      data: body
    };
    this.loadingSubject.next(payload);
  }

  hideLoader() {
    this.requestCount--; // 🔹 Decrement when one API call finishes

    if (this.requestCount <= 0) {
      this.requestCount = 0; // safety check
      this.isLoading = false;
      this.loaderType = null;
      this.loadingSubject.next({ loading: false, data: {} });
      console.log('hide loader');
    }
  }

  // 🔸 Optional: Forcefully reset everything (e.g., in error case)
  resetLoader() {
    this.requestCount = 0;
    this.isLoading = false;
    this.loaderType = null;
    this.loadingSubject.next({ loading: false, data: {} });
    console.log('force hide loader');
  }
  show(): void {
     this.requestCount++;
    this.spinner.show();
  }

  // Hide the spinner
  hide(): void {
     this.requestCount--; // 🔹 Decrement when one API call finishes

    if (this.requestCount <= 0) {
      this.requestCount = 0; // safety check
          this.spinner.hide();
    }

  }
     private flightLoadingSubject = new BehaviorSubject<boolean>(false);
  flightLoading$ = this.flightLoadingSubject.asObservable();


  setLoading(isLoading: boolean) {
    this.flightLoadingSubject.next(isLoading);
  }
      private hotelLoadingSubject = new BehaviorSubject<boolean>(false);
  hotelLoading$ = this.hotelLoadingSubject.asObservable();


  setHotelLoading(isLoading: boolean) {
    this.hotelLoadingSubject.next(isLoading);
  }
}
