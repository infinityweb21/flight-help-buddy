import {
  OnInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from "@angular/core";

import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { HeroComponent } from "./hero/hero.component";

import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { CommonModule, isPlatformBrowser } from "@angular/common";

import { SharedService } from "../../services/shared/shared.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FlightFilterService } from "../../services/flight/flight-filter.service";
import { FlightService } from "../../services/flight/flight.service";
import { SearchService } from "../../services/search.service";
import { DeviceService } from "../../services/shared/device.service";
import { HotelService } from "../../services/hotel/hotel.service";
import { HotelFilterService } from "../../services/hotel/hotel-filter.service";
import { TosterService } from "../../services/common/toaster.service";
import { PopularRoutesComponent } from "../../components/popular-routes/popular-routes.component";
import {
  FlightCardComponent,
  FlightCard,
  DEFAULT_FLIGHT_CARDS,
} from "../../components/flight-card/flight-card.component";

Swiper.use([Navigation]);

// Owl Carousel / jQuery
declare var $: any;

// Trustpilot
declare global {
  interface Window {
    Trustpilot: any;
  }
}

@Component({
  selector: "app-home",
  imports: [
    HeroComponent,
    CommonModule,
    PopularRoutesComponent,
    FlightCardComponent,
  ],
  templateUrl: "./home.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  isBrowser = false;

  domesticDeals: any[] = [];
  internationalDeals: any[] = [];

  private destroyRef: DestroyRef = inject(DestroyRef);

  trustPilotReviews: any[] = [];
  reviewSlides: any[][] = [];

  private shareService: SharedService = inject(SharedService);
  private searchService: SearchService = inject(SearchService);
  private flightService: FlightService = inject(FlightService);
  private flightFilter: FlightFilterService = inject(FlightFilterService);
  private router = inject(Router);
  private deviceService = inject(DeviceService);
  private hotelService: HotelService = inject(HotelService);
  private hotelFilterService: HotelFilterService = inject(HotelFilterService);
  private toasterService: TosterService = inject(TosterService);

  deviceReady = false;
  isMobile = true;
  getData: any = "";

  /*
   * ============================================
   * AI CARD SLIDER DATA
   * ============================================
   */
  aiCards = [
    {
      title: "Make Your Travel Plans",
      description: "One-stop solution for all your trips",
      image: "assets/images/3d1.webp",
    },
    {
      title: "Travel Smartly",
      description: "Ask your questions & get quick answers",
      image: "assets/images/3d2.webp",
    },
    {
      title: "Best Time to Travel",
      description: "Know the right time to travel",
      image: "assets/images/3d3.webp",
    },
    {
      title: "Explore More",
      description: "Choose your destination within budget",
      image: "assets/images/3d4.webp",
    },
    {
      title: "Secure Booking",
      description: "Keep your payment process safe when booking",
      image: "assets/images/3d5.webp",
    },
    {
      title: "Get Best Deals",
      description: "Enjoy best discounts for your next getaway",
      image: "assets/images/3d6.webp",
    },
  ];

  // ============================================
  // HOTEL DESTINATIONS
  // ============================================

  loadingDestination: string | null = null;



  // Add this property to your component class
  destinations = [
    {
      name: "New York City",
      country: "United States",
      properties: 195,
      image: "assets/images/newyork.jpg",
    },
    {
      name: "Orlando",
      country: "United States",
      properties: 120,
      image: "assets/images/orlando.jpg",
    },
    {
      name: "Las Vegas",
      country: "United States",
      properties: 145,
      image: "assets/images/lasvegas.jpg",
    },
    {
      name: "Miami",
      country: "United States",
      properties: 110,
      image: "assets/images/miami.jpg",
    },
  ];
  // ============================================
  // FLIGHT CARD SLIDER DATA
  // --------------------------------------------
  // Each card is <app-flight-card [flight]="...">
  // inside <div class="flight-slider owl-carousel">.
  // Same 6 cards as the flight page; replace with
  // your own FlightCard[] list if needed.
  // ============================================

  flightCards: FlightCard[] = DEFAULT_FLIGHT_CARDS;

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sharedService: SharedService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // ============================================
    // META DATA
    // ============================================
    this.getData = this.shareService.getcompanyName();
    const metaTitle = this.route.snapshot.data["metaTitle"];
    const metaDescription = this.route.snapshot.data["metaDescription"];

    if (metaTitle) {
      this.title.setTitle(metaTitle);
    }

    if (metaDescription) {
      this.meta.updateTag({
        name: "description",
        content: metaDescription,
      });
    }

    this.meta.updateTag({
      name: "keywords",
      content:
        "travel, flights, hotels, cruises, booking, vacation, travel deals",
    });

    this.meta.updateTag({
      property: "og:title",
      content: metaTitle || "Your One-Stop Travel Platform",
    });

    this.meta.updateTag({
      property: "og:description",
      content:
        metaDescription || "Book flights, hotels, and cruises in one place.",
    });

    this.meta.updateTag({
      property: "og:type",
      content: "website",
    });

    this.meta.updateTag({
      name: "twitter:card",
      content: "summary",
    });

    this.meta.updateTag({
      name: "twitter:title",
      content: metaTitle || "Your One-Stop Travel Platform",
    });

    this.meta.updateTag({
      name: "twitter:description",
      content:
        metaDescription || "Book flights, hotels, and cruises in one place.",
    });

    // ============================================
    // BROWSER ONLY
    // ============================================

    if (!this.isBrowser) {
      return;
    }

    // ============================================
    // UTM PARAMETERS
    // ============================================

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const utmSource = params["utm_source"];
        const utmMedium = params["utm_medium"];
        const utmCampaign = params["utm_campaign"];
        const utmContent = params["utm_content"];
        const utmTerm = params["utm_term"];
        const gadSource = params["gad_source"];

        if (utmSource || gadSource) {
          const utmData = {
            utm_source: utmSource || "",
            utm_medium: utmMedium || "",
            utm_campaign: utmCampaign || "",
            utm_content: utmContent || "",
            utm_term: utmTerm || "",
            gad_source: gadSource || "",
          };

          sessionStorage.setItem("utm_data", JSON.stringify(utmData));
        }
      });

    // ============================================
    // DEVICE
    // ============================================

    this.deviceService.isMobile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        this.isMobile = status;
        this.deviceReady = true;

        this.cdr.markForCheck();
      });

    // ============================================
    // TRUSTPILOT SCRIPT
    // ============================================

    if (!window.Trustpilot) {
      const script = document.createElement("script");

      script.src =
        "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";

      script.async = true;

      document.head.appendChild(script);

      this.getTrustpilot();
    }

    // ============================================
    // INTERNATIONAL DEALS
    // ============================================

    this.internationalDeals = [
      {
        from: "JFK",
        to: "LHR",
        fromCity: "New York",
        toCity: "London",
        image: "/assets/images/home/flight-deals/international/london.webp",
        price: 906.49,
      },
      {
        from: "DFW",
        to: "MXP",
        fromCity: "Dallas",
        toCity: "Milan",
        image: "/assets/images/home/flight-deals/international/milan.webp",
        price: 836.68,
      },
      {
        from: "ORD",
        to: "CDG",
        fromCity: "Chicago",
        toCity: "Paris",
        image: "/assets/images/home/flight-deals/international/paris.webp",
        price: 939.95,
      },
      {
        from: "SFO",
        to: "DXB",
        fromCity: "San Francisco",
        toCity: "Dubai",
        image: "/assets/images/home/flight-deals/international/dubai.webp",
        price: 1110.85,
      },
      {
        from: "IAD",
        to: "SIN",
        fromCity: "Washington",
        toCity: "Singapore",
        image: "/assets/images/home/flight-deals/international/singapore.webp",
        price: 1429.46,
      },
      {
        from: "SEA",
        to: "BKK",
        fromCity: "Seattle",
        toCity: "Bangkok",
        image: "/assets/images/home/flight-deals/international/bangkok.webp",
        price: 929.32,
      },
    ].map((route, index) => ({
      ...route,
      ...this.generateDates(index),
    }));

    // ============================================
    // DOMESTIC DEALS
    // ============================================

    this.domesticDeals = [
      {
        from: "DFW",
        to: "DEN",
        fromCity: "Dallas",
        toCity: "Denver",
        image: "/assets/images/home/flight-deals/domestic/denver.webp",
        price: 167.08,
      },
      {
        from: "LAX",
        to: "LAS",
        fromCity: "Los Angeles",
        toCity: "Las Vegas",
        image: "/assets/images/home/flight-deals/domestic/las-vegas.webp",
        price: 111.49,
      },
      {
        from: "IAD",
        to: "CHI",
        fromCity: "Washington",
        toCity: "Chicago",
        image: "/assets/images/home/flight-deals/domestic/chicago.webp",
        price: 264.98,
      },
      {
        from: "JFK",
        to: "MIA",
        fromCity: "New York",
        toCity: "Miami",
        image: "/assets/images/home/flight-deals/domestic/miami.webp",
        price: 279.08,
      },
      {
        from: "SFO",
        to: "ATL",
        fromCity: "San Francisco",
        toCity: "Atlanta",
        image: "/assets/images/home/flight-deals/domestic/atlanta.webp",
        price: 364.44,
      },
      {
        from: "PHL",
        to: "SJC",
        fromCity: "Philadelphia",
        toCity: "San Jose",
        image: "/assets/images/home/flight-deals/domestic/san-jose.webp",
        price: 393.4,
      },
    ].map((route, index) => ({
      ...route,
      ...this.generateDates(index),
    }));

    this.getTrustPilotReview();
  }

  // ============================================
  // AFTER VIEW INIT
  // ============================================

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.getTrustpilot();

    /*
     * Angular needs to finish rendering the *ngFor
     * (including every <app-flight-card>) before
     * Owl Carousel is initialized.
     */
    setTimeout(() => {
      this.initAiCardCarousel();
      this.initFlightCarousel();
    }, 0);
  }

  // ============================================
  // OWL CAROUSEL INITIALIZATION
  // ============================================

  private initAiCardCarousel(): void {
    if (!this.isBrowser) {
      return;
    }

    // Check jQuery
    if (typeof $ === "undefined") {
      console.error(
        "jQuery is not loaded. Please add jQuery before Owl Carousel.",
      );
      return;
    }

    // Check Owl Carousel
    if (!$.fn || !$.fn.owlCarousel) {
      console.error(
        "Owl Carousel is not loaded. Please add owl.carousel.min.js.",
      );
      return;
    }

    const slider = $(".tp-ai-card-slider");

    if (!slider.length) {
      return;
    }

    // Prevent duplicate initialization
    if (slider.hasClass("owl-loaded")) {
      return;
    }

    slider.owlCarousel({
      loop: true,
      margin: 24,
      nav: false,
      dots: false,
      autoplay: true,
      smartSpeed: 600,

      responsive: {
        0: {
          items: 1.5,
          margin: 8,
        },

        575: {
          items: 2.1,
          margin: 14,
        },

        992: {
          items: 3,
          margin: 24,
        },

        1200: {
          items: 4,
          margin: 24,
        },
      },
    });
  }

  // ============================================
  // FLIGHT CAROUSEL INITIALIZATION
  // (cards inside are <app-flight-card>; their
  //  click-to-search also works on Owl's copies)
  // ============================================

  private initFlightCarousel(): void {
    if (!this.isBrowser) {
      return;
    }

    if (typeof $ === "undefined") {
      console.error("jQuery is not loaded.");
      return;
    }

    if (!$.fn || !$.fn.owlCarousel) {
      console.error("Owl Carousel is not loaded.");
      return;
    }

    const slider = $(".flight-slider");

    if (!slider.length) {
      return;
    }

    if (slider.hasClass("owl-loaded")) {
      return;
    }

    slider.owlCarousel({
      loop: true,
      margin: 15,
      nav: false,
      dots: false,
      autoplay: false,
      smartSpeed: 600,
      responsive: {
        0: {
          items: 1.3,
          margin: 8,
        },
        600: {
          items: 2.3,
          margin: 15,
        },
        992: {
          items: 3,
          margin: 15,
        },
        1200: {
          items: 4,
          margin: 15,
        },
      },
    });
  }

  // ============================================
  // FLIGHT NEXT / PREVIOUS
  // ============================================

  flightNext(): void {
    if (!this.isBrowser || typeof $ === "undefined") {
      return;
    }

    const slider = $(".flight-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  flightPrevious(): void {
    if (!this.isBrowser || typeof $ === "undefined") {
      return;
    }

    const slider = $(".flight-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("prev.owl.carousel");
    }
  }

  // ============================================
  // AI NEXT / PREVIOUS
  // ============================================

  aiNext(): void {
    if (!this.isBrowser || typeof $ === "undefined") {
      return;
    }

    const slider = $(".tp-ai-card-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  aiPrevious(): void {
    if (!this.isBrowser || typeof $ === "undefined") {
      return;
    }

    const slider = $(".tp-ai-card-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("prev.owl.carousel");
    }
  }

  // ============================================
  // DESTROY OWL
  // ============================================

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }

    if (typeof $ !== "undefined" && $.fn && $.fn.owlCarousel) {
      const aiSlider = $(".tp-ai-card-slider");

      if (aiSlider.length && aiSlider.hasClass("owl-loaded")) {
        aiSlider.trigger("destroy.owl.carousel");
      }

      const flightSlider = $(".flight-slider");

      if (flightSlider.length && flightSlider.hasClass("owl-loaded")) {
        flightSlider.trigger("destroy.owl.carousel");
      }
    }
  }

  // ============================================
  // DATE METHODS
  // ============================================

  // Local date (YYYY-MM-DD) — toISOString() uses UTC and can shift a day
  private getFormattedDate(date: Date): string {
    return this.formatLocalDate(date);
  }

  private formatLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  private addDays(date: Date, days: number): Date {
    const newDate = new Date(date);

    newDate.setDate(newDate.getDate() + days);

    return newDate;
  }

  private addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);

    newDate.setMonth(newDate.getMonth() + months);

    return newDate;
  }

  private generateDates(index: number) {
    const departure = this.addMonths(new Date(), 1);

    departure.setDate(departure.getDate() + index * 3);

    const returnDate = this.addDays(departure, 7);

    return {
      ob: this.getFormattedDate(departure),
      ib: this.getFormattedDate(returnDate),
    };
  }

  // ============================================
  // TRUSTPILOT
  // ============================================

  getTrustpilot(): void {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => {
      if (window.Trustpilot) {
        const widgets = document.querySelectorAll(".trustpilot-widget");

        widgets.forEach((widget: any) => {
          if (widget.dataset.templateId) {
            window.Trustpilot.loadFromElement(widget);
          }
        });
      }
    }, 100);

    this.cdr.markForCheck();
  }

  // ============================================
  // TRUSTPILOT REVIEWS
  // ============================================

  getTrustPilotReview(): void {
    this.sharedService
      .getTrustPilotReview()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.trustPilotReviews = (res?.reviews || []).map((review: any) => ({
            ...review,
            showFullText: false,
          }));

          this.reviewSlides = [];

          for (let i = 0; i < this.trustPilotReviews.length; i += 3) {
            this.reviewSlides.push(this.trustPilotReviews.slice(i, i + 3));
          }
        },

        error: (err) => {
          console.error("Trustpilot review error:", err);
        },
      });
  }

  // ============================================
  // AIRLINES
  // ============================================

  airlines = [
    { logo: "/assets/images/homeimages/american_logo.png" },
    { logo: "/assets/images/homeimages/delta_logo.png" },
    { logo: "/assets/images/homeimages/southwest_airlines_logo.png" },
    { logo: "/assets/images/homeimages/united_airlines_logo.png" },
    { logo: "/assets/images/homeimages/american_logo.png" },
    { logo: "/assets/images/homeimages/delta_logo.png" },
    { logo: "/assets/images/homeimages/southwest_airlines_logo.png" },
    { logo: "/assets/images/homeimages/united_airlines_logo.png" },
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();

    const reviewDate = new Date(dateString);

    const diffMs = now.getTime() - reviewDate.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    }

    if (diffDays === 1) {
      return "1 day ago";
    }

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    }

    const months = Math.floor(diffDays / 30);

    if (months === 1) {
      return "1 month ago";
    }

    return `${months} months ago`;
  }

  // ============================================
  // SEARCH HOTEL FROM DESTINATION CARD
  // ============================================

  searchHotelFromDestination(dest: any): void {
    if (this.loadingDestination) {
      return; // prevent double clicks
    }

    this.loadingDestination = dest.name;
    const query = (dest.searchCity || dest.name).toLowerCase();

    this.hotelService
      .hotel_cityList(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.loadingDestination = null;

          if (!res?.success || !res.data?.length) {
            this.toasterService.showError(`No hotels found for ${dest.name}`);
            return;
          }

          // Prefer a city match, then any city, then the first result
          const match =
            res.data.find(
              (item: any) =>
                item.type !== "hotel" &&
                item.name?.toLowerCase().includes(query),
            ) ||
            res.data.find((item: any) => item.type !== "hotel") ||
            res.data[0];

          const destinationObj = {
            displayName:
              match.type === "hotel"
                ? match.name
                : match.state?.trim()
                  ? `${match.city}, ${match.state}, ${match.country}`
                  : `${match.city}, ${match.country}`,
            name: match.name,
            type: match.type,
            country: match.country,
            countrycode: match.countryCode || match.countrycode,
            city: match.city,
            code: match.code || match.cityid,
            destinationCode: match.destinationCode,
          };

          // Same-day check-in is blocked in your hotel form,
          // so default to a 2-night stay starting 7 days from today
          const checkInDate = this.addDays(new Date(), 7);
          const checkOutDate = this.addDays(checkInDate, 2);

          const formData = {
            checkIn: this.formatLocalDate(checkInDate),
            checkOut: this.formatLocalDate(checkOutDate),
            rooms: [{ adults: 2, childAges: [] }],
            destination: destinationObj,
          };

          this.searchService.setSearchHotelData(formData);
          this.hotelFilterService.resetFilters();

          this.router.navigate(["/hotels-list"], {
            queryParams: { source: "etg" },
          });
        },

        error: (err) => {
          this.loadingDestination = null;
          console.error("Hotel city search error:", err);
          this.toasterService.showError(
            "Unable to search hotels. Please try again.",
          );
        },
      });
  }

  // ============================================
  // SEARCH FROM DEAL
  // ============================================

  searchFromDeal(deal: any): void {
    const formatDate = (date: string) => {
      const [y, m, d] = date.split("-");

      return `${d}/${m}/${y}`;
    };

    const payload = {
      originDestination: [
        {
          DepartureTime: formatDate(deal.ob),
          DepartureLocationCode: deal.from,
          ArrivalLocationCode: deal.to,
        },
        {
          DepartureTime: formatDate(deal.ib),
          DepartureLocationCode: deal.to,
          ArrivalLocationCode: deal.from,
        },
      ],
    };

    this.searchService.setSearchData(payload);

    const queryParams = {
      CabinClass: "E",
      NoOfAdults: 1,
      NoOfChildren: 0,
      NoOfInfants: 0,
      tripType: "roundtrip",
      source: "all",
      providers: "",
      CurrencyCode: "USD",
      maxResultsPerProvider: 40,
      limit: 120,
      tag: "",
    };

    this.flightFilter.resetFilters();

    this.flightService.clearFlights();

    this.searchService.setSearchParamsData(queryParams);

    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = this.router.url.toLowerCase();

      const isBestFlightRoute =
        currentUrl.includes("/flights/") && currentUrl.includes("-best-flight");

      if (isBestFlightRoute) {
        const queryString = new URLSearchParams(
          Object.entries(queryParams).reduce((acc: any, [key, value]) => {
            acc[key] = String(value);

            return acc;
          }, {}),
        ).toString();

        const fullUrl = `${window.location.origin}/flights-list?${queryString}`;

        window.open(fullUrl, "_blank");
      } else {
        this.router.navigate(["/flights-list"], { queryParams });
      }
    } else {
      this.router.navigate(["/flights-list"], { queryParams });
    }
  }
}