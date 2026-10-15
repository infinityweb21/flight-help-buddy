import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {

  private destroy$ = new Subject<void>();
  private isBrowser = false;

  // ✅ IMPORTANT: start with null (not false)
  private mobileSubject = new BehaviorSubject<boolean | null>(null);

  // ✅ expose only valid boolean values
  isMobile$ = this.mobileSubject.asObservable().pipe(
    filter((v): v is boolean => v !== null)
  );

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {

      // ✅ set initial value ONCE
      const initial = this.checkMobile();
      this.mobileSubject.next(initial);

      // ✅ listen to resize
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(200),
          map(() => this.checkMobile()),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((isMobile) => {
          this.mobileSubject.next(isMobile);
        });

    } else {
      // SSR fallback (still emit once)
      this.mobileSubject.next(false);
    }
  }

  private checkMobile(): boolean {
    return window.innerWidth < 992;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}