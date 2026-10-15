
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnDestroy,
  inject,
  DestroyRef,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from "@angular/core";

import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { CommonModule, isPlatformBrowser, NgFor } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { SharedService } from "../../services/shared/shared.service";

import {
  FormGroup,
  FormBuilder,
} from "@angular/forms";

import { SearchService } from "../../services/search.service";
import { CarouselModule } from "primeng/carousel";
import { DeviceService } from "../../services/shared/device.service";

// Owl Carousel / jQuery
declare var $: any;

@Component({
  selector: "app-flight",

  imports: [
    MainFilterComponent,
    NgFor,
    CommonModule,
    CarouselModule,
  ],

  templateUrl: "./flight.component.html",

  styleUrl: "./flight.component.scss",

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FlightComponent implements AfterViewInit, OnDestroy {
  getData: any;

  private shareService: SharedService = inject(SharedService);

  private destroyRef: DestroyRef = inject(DestroyRef);

  private router = inject(Router);

  private searchService = inject(SearchService);

  private deviceService = inject(DeviceService);

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  
  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
  }

  specialResponsiveOptions: any[] | undefined;

  trastedResponsiveOptions: any[] | undefined;

  flightForm: FormGroup;

  selectedAdults: number = 0;

  selectedChildren: number = 0;

  selectedInfants: number = 0;

  selectedCabin = {
    name: "Economy",
    value: "E"
  };

  inputValue: string = "";

  deviceReady = false;

  isMobile: boolean = true;

  /*
   * ============================================
   * DOMESTIC ROUTE SLIDER DATA
   * ============================================
   */
getDynamicRouteDate(
  startDay: number,
  endDay: number,
  endMonthOffset: number = 0
): string {

  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    startDay
  );

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + endMonthOffset,
    endDay
  );

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };

  const start = startDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);

  return `${start} - ${end}`;
}


domesticRoutes = [
  {
    image: "assets/images/flight/california.jpg",
    title: "California",
    alt: "California",
    startDay: 11,
    endDay: 2,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/hawaii.jpg",
    title: "Hawaii",
    alt: "Hawaii",
    startDay: 16,
    endDay: 20,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/arizona.jpg",
    title: "Arizona",
    alt: "Arizona",
    startDay: 8,
    endDay: 11,
    endMonthOffset: 0,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/alaska.jpg",
    title: "Alaska",
    alt: "Alaska",
    startDay: 8,
    endDay: 14,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/oregon.webp",
    title: "Oregon",
    alt: "Oregon",
    startDay: 10,
    endDay: 16,
    endMonthOffset: 1,
    tripType: "Round-trip",
  }
];

internationalRoutes = [
  {
    image: "assets/images/flight/japan.jpg",
    title: "Japan",
    alt: "Japan",
    startDay: 11,
    endDay: 20,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/france.jpg",
    title: "France",
    alt: "France",
    startDay: 11,
    endDay: 2,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/italy.jpg",
    title: "Italy",
    alt: "Italy",
    startDay: 8,
    endDay: 11,
    endMonthOffset: 0,
    tripType: "Round-trip",
  },
  {
    image: "assets/images/flight/spain.jpg",
    title: "Spain",
    alt: "Spain",
    startDay: 8,
    endDay: 14,
    endMonthOffset: 1,
    tripType: "Round-trip",
  },
];


flightCards = [
  {
    tag: "Cheapest",
    rating: 4.5,
    image: "assets/images/flight/flight-01.jpg",
    alt: "Delta Air Lines flight from Miami to Tokyo",
    from: "Miami",
    to: "Tokyo",
    title: "Delta Express 901",
    airlineLogo: "assets/images/flight/delta-logo.png",
    airline: "Delta Air Lines",
    stop: "1-stop at Seoul",
    departureDate: "Sep 22, 2026",
    returnDate: "Sep 24, 2026"
  },
  {
    tag: "Best Value",
    rating: 4.4,
    image: "assets/images/flight/flight-02.jpg",
    alt: "Alaska Airlines flight from Los Angeles to New York",
    from: "Los Angeles",
    to: "New York",
    title: "Alaska Airlines 245",
    airlineLogo: "assets/images/flight/alaska-airlines-logo.png",
    airline: "Alaska Airlines",
    stop: "Non-stop",
    departureDate: "Oct 05, 2026",
    returnDate: "Oct 08, 2026"
  },
  {
    tag: "Popular",
    rating: 4.3,
    image: "assets/images/flight/flight-03.jpg",
    alt: "JetBlue Airways flight from Boston to Orlando",
    from: "Boston",
    to: "Orlando",
    title: "JetBlue Airways 672",
    airlineLogo: "assets/images/flight/jetblue-logo.png",
    airline: "JetBlue Airways",
    stop: "1-stop at New York",
    departureDate: "Oct 12, 2026",
    returnDate: "Oct 15, 2026"
  },
  {
    tag: "Cheapest",
    rating: 4.2,
    image: "assets/images/flight/flight-04.jpg",
    alt: "Frontier Airlines flight from Chicago to Las Vegas",
    from: "Chicago",
    to: "Las Vegas",
    title: "Frontier Airlines 318",
    airlineLogo: "assets/images/flight/frontier-airlines-logo.png",
    airline: "Frontier Airlines",
    stop: "Non-stop",
    departureDate: "Oct 18, 2026",
    returnDate: "Oct 21, 2026"
  },
  {
    tag: "Best Deal",
    rating: 4.1,
    image: "assets/images/flight/flight-05.jpg",
    alt: "Allegiant Air flight from Los Angeles to Honolulu",
    from: "Los Angeles",
    to: "Honolulu",
    title: "Allegiant Air 524",
    airlineLogo: "assets/images/flight/allegiant-air-logo.png",
    airline: "Allegiant Air",
    stop: "1-stop at Phoenix",
    departureDate: "Nov 02, 2026",
    returnDate: "Nov 06, 2026"
  },
  {
    tag: "Popular",
    rating: 4.5,
    image: "assets/images/flight/flight-06.jpg",
    alt: "Air Canada flight from Toronto to Vancouver",
    from: "Toronto",
    to: "Vancouver",
    title: "Air Canada 781",
    airlineLogo: "assets/images/flight/air-canada-logo.png",
    airline: "Air Canada",
    stop: "Non-stop",
    departureDate: "Nov 10, 2026",
    returnDate: "Nov 13, 2026"
  }
];

  /*
   * ============================================
   * CABIN OPTIONS
   * ============================================
   */

  cabinOptions = [
    {
      name: "Economy",
      value: "E"
    },

    {
      name: "First",
      value: "F"
    },

    {
      name: "Business",
      value: "B"
    },

    {
      name: "Premium Economy",
      value: "P"
    },
  ];

  constructor(
    private fb: FormBuilder,

    private meta: Meta,

    private title: Title,

    private route: ActivatedRoute,

    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {

    /*
     * ============================================
     * FLIGHT FORM
     * ============================================
     */

    this.flightForm = this.fb.group({

      tripType: ["oneway"],

      departureAirport: [""],

      arrivalAirport: [""],

      departureDate: [""],

      arrivalDate: [""],

      directFlightsOnly: [false],

      passengers: this.fb.group({

        adults: [this.selectedAdults],

        children: [this.selectedChildren],

        infants: [this.selectedInfants],

        cabin: ["E"],

      }),

      multiCitySegments: this.fb.array([]),

    });

    this.updateInput();
  }

  /*
   * ============================================
   * PASSENGERS GROUP
   * ============================================
   */

  get passengersGroup(): FormGroup {

    return this.flightForm.get(
      "passengers"
    ) as FormGroup;
  }

  /*
   * ============================================
   * UPDATE PASSENGER INPUT
   * ============================================
   */

  updateInput(): void {

    const total =
      this.selectedAdults +
      this.selectedChildren +
      this.selectedInfants;

    const selectedCabin =
      this.passengersGroup
        .get("cabin")
        ?.value;

    this.selectedCabin =
      selectedCabin;

    const cabinName =
      this.cabinOptions.find(
        (option) =>
          option.value === selectedCabin
      )?.name || "";

    this.inputValue =
      `${total} Passenger${
        total !== 1 ? "s" : ""
      } ${cabinName}`;
  }

  /*
   * ============================================
   * BUILD FLIGHT PAYLOAD
   * ============================================
   */

  buildFlightPayload(): any {

    const formValue =
      this.flightForm.value;

    const passengers =
      formValue.passengers;

    console.log(
      "passengers",
      passengers
    );

    const tripType =
      formValue.tripType;

    console.log(
      "tripType",
      tripType
    );

    const payload: any = {

      CurrencyCode: "USD",

      NoOfAdults:
        passengers.adults,

      NoOfInfants:
        passengers.infants,

      NoOfChildren:
        passengers.children,

      tripType:
        tripType,

      source: "mondee",

      returnDate: "",

      OriginDestination: [],
    };

    const formatDate = (
      date: string
    ) => {

      if (!date) {
        return "";
      }

      const d =
        new Date(date);

      return `${String(
        d.getDate()
      ).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    if (
      tripType === "oneway"
    ) {

      payload.OriginDestination.push({

        DepartureTime:
          formValue.departureDate,

        DepartureLocationCode:
          formValue.departureAirport,

        ArrivalLocationCode:
          formValue.arrivalAirport,

        CabinClass:
          passengers.cabin,

      });
    }

    return payload;
  }

  /*
   * ============================================
   * DESTINATION CLICK
   * ============================================
   */

  onDestinationClick(
    destination: any
  ): void {

    // Get date 15 days from today

    const today =
      new Date();

    const departureDate =
      new Date(today);

    departureDate.setDate(
      today.getDate() + 15
    );

    // Format date YYYY-MM-DD

    const formattedDate =
      departureDate
        .toISOString()
        .split("T")[0];

    this.flightForm.patchValue({

      tripType: "oneway",

      arrivalAirport:
        destination.arrivalAirport,

      departureAirport:
        destination.detpartureAirport,

      departureDate:
        formattedDate,

      arrivalDate: "",

      passengers: {

        adults: 1,

        children: 0,

        infants: 0,

        cabin: "E",

      },
    });

    console.log(
      "flightForm--------",
      destination
    );

    this.updateInput();

    this.searchFlights();
  }

  /*
   * ============================================
   * SEARCH FLIGHTS
   * ============================================
   */

  searchFlights(): void {

    const payload =
      this.buildFlightPayload();

    console.warn(
      "Final Payload:",
      payload
    );

    this.searchService
      .setSearchData(payload);

    console.log(
      "this.flightForm.value",
      this.flightForm.value
    );

    this.router.navigate([
      "/flights-list"
    ]);
  }

  /*
   * ============================================
   * SCROLL TO FLIGHT FORM
   * ============================================
   */

  scrollToFlightForm(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });
  }

  /*
   * ============================================
   * AFTER VIEW INIT
   * ============================================
   */

  ngAfterViewInit(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    /*
     * Wait for Angular DOM rendering
     * before initializing Owl Carousel.
     */

    setTimeout(() => {

      this.initDomesticRouteCarousel();

    }, 0);
     setTimeout(() => {

      this.initFlightCarousel();

    }, 0);
  }

  /*
   * ============================================
   * DOMESTIC ROUTE OWL CAROUSEL
   * ============================================
   */

  private initDomesticRouteCarousel(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    /*
     * Check jQuery
     */

    if (
      typeof $ === "undefined"
    ) {

      console.error(
        "jQuery is not loaded."
      );

      return;
    }

    /*
     * Check Owl Carousel
     */

    if (
      !$.fn ||
      !$.fn.owlCarousel
    ) {

      console.error(
        "Owl Carousel is not loaded."
      );

      return;
    }

    /*
     * Find slider
     */

    const slider =
      $(".domestic-tabflight-slider");

    if (!slider.length) {
      return;
    }

    /*
     * Prevent duplicate initialization
     */

    if (
      slider.hasClass(
        "owl-loaded"
      )
    ) {
      return;
    }

    /*
     * Initialize Owl Carousel
     */

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

  /*
   * ============================================
   * NEXT ROUTE
   * ============================================
   */

  domesticRouteNext(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    if (
      typeof $ === "undefined"
    ) {
      return;
    }

    const slider =
      $(".domestic-tabflight-slider");

    if (
      slider.length &&
      slider.hasClass(
        "owl-loaded"
      )
    ) {

      slider.trigger(
        "next.owl.carousel"
      );
    }
  }

  /*
   * ============================================
   * PREVIOUS ROUTE
   * ============================================
   */

  domesticRoutePrevious(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    if (
      typeof $ === "undefined"
    ) {
      return;
    }

    const slider =
      $(".domestic-tabflight-slider");

    if (
      slider.length &&
      slider.hasClass(
        "owl-loaded"
      )
    ) {

      slider.trigger(
        "prev.owl.carousel"
      );
    }
  }

  /*
   * ============================================
   * DESTROY OWL CAROUSEL
   * ============================================
   */

  ngOnDestroy(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }

    if (
      typeof $ === "undefined"
    ) {
      return;
    }

    if (
      !$.fn ||
      !$.fn.owlCarousel
    ) {
      return;
    }

    const slider =
      $(".domestic-tabflight-slider");

    if (
      slider.length &&
      slider.hasClass(
        "owl-loaded"
      )
    ) {

      slider.trigger(
        "destroy.owl.carousel"
      );
    }
  }


private initFlightCarousel(): void {

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
        margin: 8
      },

      600: {
        items: 2.3,
        margin: 15
      },

      992: {
        items: 3,
        margin: 15
      },

      1200: {
        items: 4,
        margin: 15
      }
    }
  });
}
flightNext(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  if (typeof $ === "undefined") {
    return;
  }

  const slider = $(".flight-slider");

  if (
    slider.length &&
    slider.hasClass("owl-loaded")
  ) {
    slider.trigger("next.owl.carousel");
  }
}

flightPrevious(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  if (typeof $ === "undefined") {
    return;
  }

  const slider = $(".flight-slider");

  if (
    slider.length &&
    slider.hasClass("owl-loaded")
  ) {
    slider.trigger("prev.owl.carousel");
  }
}

}
