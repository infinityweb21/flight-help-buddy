import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  DestroyRef,
  inject,
} from "@angular/core";

import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SearchService } from "../../services/search.service";
import { CarouselModule } from "primeng/carousel";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { DeviceService } from "../../services/shared/device.service";
import { QuickContactComponent } from "../../components/quick-contact/quick-contact.component";

// jQuery / Owl Carousel
declare var $: any;

declare global {
  interface Window {
    Trustpilot: any;
  }
}

@Component({
  selector: "app-hotel",

  imports: [
    MainFilterComponent,
    RouterLink,
    CarouselModule,
    CommonModule,
    QuickContactComponent,
  ],

  templateUrl: "./hotel.component.html",

  styleUrl: "./hotel.component.scss",

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotelComponent implements AfterViewInit, OnDestroy {
  getData: any;
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
  }

  toggleWishlist(hotel: any, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    console.log("Wishlist hotel:", hotel);
  }
  bookHotel(_t79: {
    label: string;
    image: string;
    alt: string;
    rating: string;
    reviews: string;
    title: string;
    location: string;
    price: string;
    priceUnit: string;
  }) {
    throw new Error("Method not implemented.");
  }
  private shareService: SharedService = inject(SharedService);

  private searchService: SearchService = inject(SearchService);

  private deviceService: DeviceService = inject(DeviceService);

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  private router: Router = inject(Router);

  private destroyRef: DestroyRef = inject(DestroyRef);
  getDynamicDateRange(startDay: number, endDay: number): string {
    const now = new Date();

    // Start and end dates in next month
    const startDate = new Date(now.getFullYear(), now.getMonth() + 1, startDay);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, endDay);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    const start = startDate.toLocaleDateString("en-US", options);
    const end = endDate.toLocaleDateString("en-US", options);

    return `${start} - ${end}`;
  }
  /*
   * ============================================
   * HOTEL SLIDER DATA
   * ============================================
   */
  hotelCards = [
    {
      image: "assets/images/hotel/luxury-hotel.jpg",
      title: "Luxury Hotels",
      alt: "Luxury Hotels",
      startDay: 15,
      endDay: 21,
      guests: "2 adults",
      available: "259 available",
    },
    {
      image: "assets/images/hotel/resort-hotels.jpg",
      title: "Resort Stays",
      alt: "Resort Stays",
      startDay: 18,
      endDay: 24,
      guests: "2 adults",
      available: "230 available",
    },
    {
      image: "assets/images/hotel/campgrounds.jpg",
      title: "Campgrounds",
      alt: "Campgrounds",
      startDay: 24,
      endDay: 30,
      guests: "2 adults",
      available: "134 available",
    },
    {
      image: "assets/images/hotel/boutique-hotel.jpg",
      title: "Boutique Hotels",
      alt: "Boutique Hotels",
      startDay: 20,
      endDay: 26,
      guests: "2 adults",
      available: "159 available",
    },
    {
      image: "assets/images/hotel/heritage-hotels.avif",
      title: "Heritage Stays",
      alt: "Heritage Stays",
      startDay: 22,
      endDay: 28,
      guests: "2 adults",
      available: "122 available",
    },

    {
      image: "assets/images/hotel/guest-houses.jpg",
      title: "Guest Houses",
      alt: "Guest Houses",
      startDay: 25,
      endDay: 31,
      guests: "2 adults",
      available: "232 available",
    },
  ];

  // ============================================
  // NEW HOTEL SLIDER DATA
  // ============================================

  hotelSliderCards = [
    {
      label: "Top Rated",
      image: "assets/images/hotel/northamerica-hotel5.webp",
      alt: "The Langham Chicago hotel in Chicago, Illinois",
      rating: "4.96",
      reviews: "672",
      title: "The Langham Chicago",
      location: "Chicago, Illinois",
      price: "$285.00",
      priceUnit: "/ night",
    },

    {
      label: "Top Rated",
      image: "assets/images/hotel/northamerica-hotel3.webp",
      alt: "The Beverly Hills Hotel in Beverly Hills, California",
      rating: "4.95",
      reviews: "589",
      title: "The Beverly Hills Hotel",
      location: "Beverly Hills, California",
      price: "$495.00",
      priceUnit: "/ night",
    },

    {
      label: "Top Rated",
      image: "assets/images/hotel/international-hotel1.webp",
      alt: "Rosewood Hong Kong luxury hotel in Hong Kong",
      rating: "4.94",
      reviews: "524",
      title: "Rosewood Hong Kong",
      location: "Hong Kong",
      price: "$420.00",
      priceUnit: "/ night",
    },

    {
      label: "Top Rated",
      image: "assets/images/hotel/asia-hotel1.webp",
      alt: "Amanpuri luxury resort in Phuket, Thailand",
      rating: "4.93",
      reviews: "478",
      title: "Amanpuri",
      location: "Phuket, Thailand",
      price: "$650.00",
      priceUnit: "/ night",
    },

    {
      label: "Top Rated",
      image: "assets/images/hotel/middleeast-hotel1.webp",
      alt: "Emirates Palace Mandarin Oriental in Abu Dhabi, UAE",
      rating: "4.92",
      reviews: "615",
      title: "Emirates Palace Mandarin Oriental",
      location: "Abu Dhabi, UAE",
      price: "$385.00",
      priceUnit: "/ night",
    },
  ];

  /*
   * ============================================
   * DEVICE
   * ============================================
   */

  deviceReady = false;

  isMobile = true;

  constructor(
    private meta: Meta,

    private title: Title,

    private route: ActivatedRoute,

    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {}

  /*
   * ============================================
   * AFTER VIEW INIT
   * ============================================
   */

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    /*
     * Wait until Angular has rendered
     * the *ngFor hotel cards.
     */
    setTimeout(() => {
      // Existing slider
      this.initHotelCarousel();

      // NEW hotel slider
      this.initHotelSliderCarousel();
    }, 0);
  }

  /*
   * ============================================
   * HOTEL OWL CAROUSEL
   * ============================================
   */

  // ============================================
  // NEW HOTEL SLIDER CAROUSEL
  // ============================================
  private initHotelSliderCarousel(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const init = () => {
      const slider = $(".hotel-slider");

      if (!slider.length || slider.hasClass("owl-loaded")) {
        return;
      }

      slider.owlCarousel({
        items: 4,
        margin: 15,
        loop: false,
        nav: false,
        dots: false,
        autoplay: false,
        smartSpeed: 200,
        lazyLoad: true,

        responsive: {
          0: {
            items: 1.2,
            margin: 8,
          },
          600: {
            items: 2.2,
          },
          1000: {
            items: 3,
          },
          1200: {
            items: 4,
          },
        },
      });
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(init);
    } else {
      window.addEventListener("load", init, { once: true });
    }
  }

  private initHotelCarousel(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const init = () => {
      const slider = $(".tabhotels-slider");

      if (!slider.length || slider.hasClass("owl-loaded")) {
        return;
      }

      slider.owlCarousel({
        items: 4,
        margin: 15,
        loop: false,
        nav: false,
        dots: false,
        autoplay: false,
        smartSpeed: 200,
        lazyLoad: true,

        responsive: {
          0: {
            items: 1.3,
            margin: 8,
          },
          600: {
            items: 2.3,
          },
          992: {
            items: 3,
          },
          1200: {
            items: 4,
          },
        },
      });
    };

    if (document.readyState === "complete") {
      requestAnimationFrame(init);
    } else {
      window.addEventListener("load", init, { once: true });
    }
  }

  /*
   * ============================================
   * HOTEL NEXT
   * ============================================
   */

  hotelNext(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".tabhotels-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  /*
   * ============================================
   * HOTEL PREVIOUS
   * ============================================
   */

  hotelPrevious(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".tabhotels-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("prev.owl.carousel");
    }
  }

  // ============================================
  // NEW HOTEL SLIDER NEXT
  // ============================================

  hotelSliderNext(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".hotel-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  // ============================================
  // NEW HOTEL SLIDER PREVIOUS
  // ============================================

  hotelSliderPrevious(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".hotel-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("prev.owl.carousel");
    }
  }
  /*
   * ============================================
   * DESTROY OWL CAROUSEL
   * ============================================
   */

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    if (!$.fn || !$.fn.owlCarousel) {
      return;
    }

    // ============================================
    // EXISTING TAB HOTEL SLIDER
    // ============================================

    const tabHotelSlider = $(".tabhotels-slider");

    if (tabHotelSlider.length && tabHotelSlider.hasClass("owl-loaded")) {
      tabHotelSlider.trigger("destroy.owl.carousel");
    }

    // ============================================
    // NEW HOTEL SLIDER
    // ============================================

    const hotelSlider = $(".hotel-slider");

    if (hotelSlider.length && hotelSlider.hasClass("owl-loaded")) {
      hotelSlider.trigger("destroy.owl.carousel");
    }
  }
}
