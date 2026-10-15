import {
  Component,
  HostListener,
  inject,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { SharedService } from '../../services/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-contact',
  imports: [],
  templateUrl: './quick-contact.component.html',
  styleUrl: './quick-contact.component.scss',
})
export class QuickContactComponent {

  private shareService: SharedService =
    inject(SharedService);

  getData: any = '';

  dropdownVisible: boolean = false;

  forceDropdown: boolean = false; // For mobile view at top
  isBrowser = false;
    private router = inject(Router);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.isBrowser =
      isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {

    this.getData =
      this.shareService.getcompanyName();

    // Set initial CTA state
    this.updateScrollCta();
  }


  @HostListener('window:scroll')
  onWindowScroll(): void {

    this.updateScrollCta();

  }


  private updateScrollCta(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const cta =
      document.getElementById('tpScrollCta');

    if (!cta) {
      return;
    }

    if (window.scrollY > 40) {

      cta.classList.add('active');

    } else {

      cta.classList.remove('active');

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

   if (
    url.includes('/flights-booking') 
  ) {
    return this.getData?.phoneNumber|| '';
  }
    if (
    url.includes('/ca/en-ca') 
  ) {
    return this.getData?.flightContactNumber|| '';
  }
      if (
    url.includes('/en-usa') 
  ) {
    return this.getData?.flightContactNumber|| '';
  }
   if (
    url.includes('/flights-destination') 
  ) {
    return this.getData?.phoneNumber|| '';
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