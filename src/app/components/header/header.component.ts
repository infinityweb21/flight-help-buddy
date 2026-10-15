import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationStart
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SharedService } from '../../services/shared/shared.service';
import { DeviceService } from '../../services/shared/device.service';
import { SnowComponent } from '../snow/snow.component';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ClickOutsideDirective,
    SnowComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // Services
  private shareService = inject(SharedService);
  private router = inject(Router);
  private deviceService = inject(DeviceService);

  // UI states
  isMobile = false;
  visible = false;
  submenuOpen = false;
  profileDropdownOpen = false;
  isCurrencyDropdownShown = false;

  // Scroll states
  lastScrollTop = 0;
  isHidden = false;

  // SSR
  isBrowser = false;

  // Company data
  getData: any = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.isBrowser =
      isPlatformBrowser(this.platformId);

    this.deviceService.isMobile$.subscribe(
      (status) => {

        this.isMobile = status;

        if (!this.isMobile) {
          this.isHidden = false;
        }
      }
    );
  }

  ngOnInit(): void {

    this.getData =
      this.shareService.getcompanyName();

    /**
     * Automatically close Bootstrap
     * offcanvas whenever route changes
     */
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart
        )
      )
      .subscribe(() => {

        this.closeOffcanvas();
      });
  }

  /**
   * Close Bootstrap Offcanvas
   */
  closeOffcanvas(): void {

    // Only run in browser
    if (!this.isBrowser) {
      return;
    }

    const offcanvasElement =
      document.getElementById('navbarScroll');

    if (!offcanvasElement) {
      return;
    }

    // Get existing Bootstrap instance
    let offcanvas =
      bootstrap.Offcanvas.getInstance(
        offcanvasElement
      );

    // If no instance exists, create one
    if (!offcanvas) {
      offcanvas =
        bootstrap.Offcanvas.getOrCreateInstance(
          offcanvasElement
        );
    }

    // Close Bootstrap drawer
    offcanvas.hide();

    // Reset related states
    this.visible = false;
    this.submenuOpen = false;
  }

  /**
   * Toggle mobile submenu
   */
  toggleSubmenu(event: Event): void {

    event.preventDefault();

    this.submenuOpen =
      !this.submenuOpen;
  }

  /**
   * Handle window scroll
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {

    if (!this.isBrowser) {
      return;
    }

    const currentScrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;

    /**
     * Navbar fixed class
     */
    const navbar =
      document.querySelector('.navbar');

    if (currentScrollTop >= 10) {

      navbar?.classList.add(
        'header-fixed'
      );

    } else {

      navbar?.classList.remove(
        'header-fixed'
      );
    }

    /**
     * Top searchbar fixed class
     */
    const topSearchbar =
      document.querySelector(
        '.top-searchbar'
      );

    if (currentScrollTop >= 10) {

      topSearchbar?.classList.add(
        'topheader-fixed'
      );

    } else {

      topSearchbar?.classList.remove(
        'topheader-fixed'
      );
    }

    /**
     * Mobile header hide/show
     */
    if (!this.isMobile) {
      return;
    }

    const hideOnRoutes = [
      '/flight/booking',
      '/flights-list'
    ];

    const shouldHide =
      hideOnRoutes.some(
        (route) =>
          this.router.url.startsWith(route)
      );

    if (!shouldHide) {

      this.isHidden = false;
      this.lastScrollTop =
        currentScrollTop;

      return;
    }

    /**
     * Scroll down
     */
    if (
      currentScrollTop >
      this.lastScrollTop
    ) {

      this.isHidden = true;
    }

    /**
     * Scroll up
     */
    else if (
      currentScrollTop <
      this.lastScrollTop
    ) {

      this.isHidden = false;
    }

    this.lastScrollTop =
      Math.max(
        currentScrollTop,
        0
      );
  }

  /**
   * Handle browser resize
   */
  @HostListener(
    'window:resize',
    ['$event']
  )
  onResize(event: Event): void {

    if (!this.isBrowser) {
      return;
    }

    const width =
      (event.target as Window).innerWidth;

    // Close Bootstrap drawer on desktop
    if (width > 991) {

      this.closeOffcanvas();

      this.submenuOpen = false;
    }
  }

  /**
   * Profile dropdown
   */
  toggleProfileDropdown(
    event: MouseEvent
  ): void {

    event.stopPropagation();

    this.profileDropdownOpen =
      !this.profileDropdownOpen;
  }

  closeProfileDropdown(): void {

    this.profileDropdownOpen = false;
  }

  /**
   * Currency dropdown
   */
  toggleCurrencyDropdown(): void {

    this.isCurrencyDropdownShown =
      !this.isCurrencyDropdownShown;
  }

  closeCurrencyDropdown(): void {

    this.isCurrencyDropdownShown = false;
  }

  /**
   * Open customer login
   */
  openLoginRoute(): void {

    if (!this.isBrowser) {
      return;
    }

    window.open(
      'https://customer.theinfinitytravel.com/login',
      '_blank'
    );
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