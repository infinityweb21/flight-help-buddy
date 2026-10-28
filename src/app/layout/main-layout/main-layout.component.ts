import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { SpinnerService } from "../../services/common/spinner.service";
import { CommonModule } from "@angular/common";
import { filter, Subscription } from "rxjs";
import { CookiesComponent } from "../../components/cookies/cookies.component";
import { QuickContactComponent } from "../../components/quick-contact/quick-contact.component";
import { SharedService } from "../../services/shared/shared.service";
import { DeviceService } from "../../services/shared/device.service";

@Component({
  selector: "app-main-layout",
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    CommonModule,
    CookiesComponent,
    QuickContactComponent,
  ],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  showCookies: boolean = false;
  hideFooter = false;
  isMobile: boolean = false;

  private sub!: Subscription;
  private cookieSub!: Subscription;
  private routerSub!: Subscription;
  private deviceService = inject(DeviceService);
  shareService: SharedService = inject(SharedService);
  deviceReady = false;

  constructor(
    public spinnerService: SpinnerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.deviceService.isMobile$.subscribe((status) => {
        this.isMobile = status;
        this.deviceReady = true;
      });
    }
  }

  ngOnInit(): void {
    // 🔹 Spinner subscription
    this.sub = this.spinnerService.isLoading$?.subscribe((val) => {
      this.isLoading = val;
    });
    if (!isPlatformBrowser(this.platformId)) return;
    // 🔹 SharedService subscription
    setTimeout(() => {
      this.cookieSub = this.shareService.showCookies$?.subscribe((val) => {
        this.showCookies = val;
      });
    }, 60000);
    // 🔹 Watch for router changes
    this.routerSub = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.updateFooterVisibility(event.urlAfterRedirects);
      });

    // Initial run
    this.updateFooterVisibility(this.router.url);
  }

  private updateFooterVisibility(currentUrl: string) {
    if (
      currentUrl.includes("/flight-details") ||
      currentUrl.includes("/flight/booking")
    ) {
      this.hideFooter = true;
    } else {
      this.hideFooter = false;
    }

    // Recheck mobile status (optional)
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
  }
  showQuickContact(): any {
    if (isPlatformBrowser(this.platformId)) {
      const url = this.router.url.split("?")[0].split("#")[0];

      const allowedRoutes = [
        "/",
        "/packages",
        "/cruise",
        "/car",
        "/hotel",
        "/flight",
        "/about",
        "/conatct",
        // Main pages
        "/airlines",
        "/tickets",
        "/international-route",
        "/flights-destination",
        "/travel-agency",
        "/airlines-destination",
        "/airlines-routes",

        // Airline detail pages
        "/airlines/air-mauritius",
        "/airlines/brussels-airlines",
        "/airlines/ethiopian-airlines",
        "/airlines/hawaiian-airlines",

        // International routes
        "/international-route/washington_dc-to-miami-flights",
        "/international-route/dallas-to-new_york_city-flights",
        "/international-route/columbia-to-orlando-flights",
        "/international-route/tampa-to-knoxville-flights",

        // Flight destinations
        "/flights-destination/flights-to-new_york_city",
        "/flights-destination/flights-to-washington_dc",
        "/flights-destination/flights-to-san_francisco",
        "/flights-destination/flights-to-denver",

        // Airline destinations
        "/airlines-destination/allegiant-air_flights-to-tampa",
        "/airlines-destination/frontier-airlines_flights-to-chicago",
        "/airlines-destination/american-airlines_flights-to-washington_dc",
        "/airlines-destination/united-airlines_flights-to-chicago",

        // Airline routes
        "/airlines-routes/american-airlines_los_angeles-to-atlanta",
        "/airlines-routes/united-airlines_austin-to-washington_dc",
        "/airlines-routes/american-airlines_cleveland-to-atlanta",
        "/airlines-routes/united-airlines_los_angeles-to-orlando",

        // Other pages
        "/terms-and-conditions",
        "/privacy-policy",
        "/cookie-policy",
        "/cancellation-policy",
        "/our-service-fees",
        "/post-ticketing-fees",
        "/flights-list",
        "/hotels-list",
           "/package-flights-list",
        "/package-hotels-list",
        "/package-review-and-payment",
        "/car-list",
        "/car-details",
        "/cruises-list",
        "/baggage",
        "/taxes-and-fees-usa",
        "/faq",
        "/flights-booking",
        "/business-class",
        "/online-travel-agency",
        "/site-map"

      ];

      return allowedRoutes.includes(url);
    }
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.cookieSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }
}
