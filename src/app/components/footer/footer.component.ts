import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared/shared.service';
import { NgIf } from '@angular/common';
import { LocationService } from '../../services/shared/location.service';
import { filter, Subscription } from 'rxjs';
import { DeviceService } from '../../services/shared/device.service';
import { SnowComponent } from "../snow/snow.component";
@Component({
  selector: "app-footer",
  imports: [RouterLink, NgIf, SnowComponent],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
})
export class FooterComponent {
  private shareService: SharedService = inject(SharedService);
  getData: any = "";
  companyname: any = this.shareService.getcompanyName();
  hidePopup = false;
  private locationService: LocationService = inject(LocationService);
  private router: Router = inject(Router);
  private deviceService = inject(DeviceService);
  country: string = "";
  isFlightPage: boolean = false;
  isOtherPage: boolean = false;
  private routerSub!: Subscription;
      currentYear: number = new Date().getFullYear();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
  }
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.checkMobileView();

    this.locationService
      .getExactLocation()
      .then((location) => {
        if (location.address) {
          if (location.address.includes("Canada")) {
            this.country = "Canada";
          }
        }
      })
      .catch((err) => {});
    this.routerSub = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.updateFooterVisibility(event.urlAfterRedirects);
      });

    // Initial run
    this.updateFooterVisibility(this.router.url);
  }
  private updateFooterVisibility(currentUrl: string) {
    this.isFlightPage = false;
    this.isOtherPage = false;
    if (
      currentUrl.includes("/flight-details") ||
      currentUrl.includes("/flight/booking") ||
      currentUrl.includes("/flight-booking-confirmation") ||
      currentUrl.includes("/flights-list")
    ) {
      this.isFlightPage = true;
    } else {
      this.isOtherPage = true;
    }
  // ✅ Add/remove body class for hotel pages
  if (isPlatformBrowser(this.platformId)) {
    if (
      currentUrl.includes("/hotel-details") ||
      currentUrl.includes("/hotel-booking")
    ) {
      document.body.classList.add("footer-with-price-strip");
    } else {
      document.body.classList.remove("footer-with-price-strip");
    }
  }
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();

  if (isPlatformBrowser(this.platformId)) {
    document.body.classList.remove("footer-with-price-strip");
  }
  }
  isScrolled = false;
  isMobile = false;

  // Detect scroll
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.pageYOffset > 50; // you can fine-tune the value
    }
  }

  // Detect screen width
  @HostListener("window:resize", [])
  checkMobileView() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768; // adjust breakpoint as needed
    }
  }
  closeDetailsPopup(): void {
    this.hidePopup = true;
  }

  
}
