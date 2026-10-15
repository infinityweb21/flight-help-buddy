import { Component, HostListener, Inject, inject, PLATFORM_ID } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-cta',
  imports: [],
  templateUrl: './call-cta.component.html',
  styleUrl: './call-cta.component.scss'
})
export class CallCtaComponent {
isVisible = false;
  getData:any = '';
  private hideTimer: any = null;
  private readonly INACTIVITY_DELAY = 4000; // ms before auto-hide
   private shareService: SharedService = inject(SharedService);
     private router = inject(Router);

     isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.isBrowser =
      isPlatformBrowser(this.platformId);
  }
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBanner();
  }

  private showBanner(): void {
    this.isVisible = true;
    this.resetHideTimer();
  }

  private resetHideTimer(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.hideTimer = setTimeout(() => {
      this.isVisible = false;
    }, this.INACTIVITY_DELAY);
  }
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }
  ngOnDestroy(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  }
  getRouteContactNumber(): any {

    if (!this.isBrowser) {
      return;
    }
  const url = this.router.url
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();

  // Root / empty route
  if (url === '/' || url === '') {
    return this.getData?.phoneNumber || '';
  }

  // Hotel routes
  if (
    url.includes('/hotel') ||
    url.includes('/hotels')
  ) {
    return this.getData?.hotelContactNumber
      || this.getData?.phoneNumber
      || '';
  }

  // Cruise routes
  if (
    url.includes('/cruise') ||
    url.includes('/cruises')
  ) {
    return this.getData?.cruiseContactNumber
      || this.getData?.phoneNumber
      || '';
  }

  // Package routes
  if (
    url.includes('/package') ||
    url.includes('/packages')
  ) {
    return this.getData?.packageContactNumber
      || this.getData?.phoneNumber
      || '';
  }

  // Car routes
  if (
    url.includes('/car') ||
    url.includes('/cars')
  ) {
    return this.getData?.carContactNumber
      || this.getData?.phoneNumber
      || '';
  }

  // Flight routes
  if (
    url.includes('/flight') ||
    url.includes('/flights')
  ) {
    return this.getData?.flightContactNumber
      || this.getData?.phoneNumber
      || '';
  }

  // Default
  return this.getData?.phoneNumber || '';
}
}
