import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  DestroyRef,
  inject,
  isDevMode,
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
import { firstValueFrom, timeout } from "rxjs";
import { HotelService } from "../../services/hotel/hotel.service";
import { HotelFilterService } from "../../services/hotel/hotel-filter.service";
import { TosterService } from "../../services/common/toaster.service";

// jQuery / Owl Carousel
declare var $: any;

declare global {
  interface Window {
    Trustpilot: any;
  }
}

/*
 * ============================================
 * POPULAR HOTEL TYPES
 * ============================================
 */

interface PopularHotel {
  image: string;
  title: string;
  location: string; // shown on the card
  city: string;
  state: string;
  country: string;
  nearby: string[];
  score: string;
  scoreLabel: string;
  reviews: string;
}

interface MatchResult {
  match: any | null;
  score: number;
  query: string;
}

interface PopularHotelTab {
  id: string; // must match the tab button's data-bs-target / aria-controls
  hotels: PopularHotel[];
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
export class HotelComponent implements OnInit, AfterViewInit, OnDestroy {
  /*
   * ============================================
   * SERVICES
   * ============================================
   */

  private shareService: SharedService = inject(SharedService);
  private searchService: SearchService = inject(SearchService);
  private deviceService: DeviceService = inject(DeviceService);
  private hotelService: HotelService = inject(HotelService);
  private hotelFilterService: HotelFilterService = inject(HotelFilterService);
  private toasterService: TosterService = inject(TosterService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  /*
   * ============================================
   * STATE
   * ============================================
   */

  getData: any;

  loadingHotel: string | null = null;

  deviceReady = false;

  isMobile = true;

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
      image: "assets/images/hotel/hualalai-hotel1.jfif",
      alt: "Four Seasons Resort Hualalai luxury hotel in Kailua-Kona, Hawaii",
      rating: "4.98",
      reviews: "1248",
      title: "Four Seasons Resort Hualalai",
      location: "Kailua-Kona, Hawaii",
      city: "Kailua-Kona",
      state: "Hawaii",
      country: "United States",
      nearby: [] as string[],
      price: "$895.00",
      priceUnit: "/ night",
    },
    {
      label: "Top Rated",
      image: "assets/images/hotel/lanai-hotel2.jpeg",
      alt: "Four Seasons Resort Lanai luxury hotel in Lanai City, Hawaii",
      rating: "4.97",
      reviews: "986",
      title: "Four Seasons Resort Lanai",
      location: "Lanai City, Hawaii",
      city: "Lanai City",
      state: "Hawaii",
      country: "United States",
      nearby: [] as string[],
      price: "$1,150.00",
      priceUnit: "/ night",
    },
    {
      label: "Top Rated",
      image: "assets/images/hotel/langham-hotel5.jfif",
      alt: "The Langham Chicago luxury hotel in Chicago, Illinois",
      rating: "4.96",
      reviews: "672",
      title: "The Langham Chicago",
      location: "Chicago, Illinois",
      city: "Chicago",
      state: "Illinois",
      country: "United States",
      nearby: [] as string[],
      price: "$285.00",
      priceUnit: "/ night",
    },
    {
      label: "Top Rated",
      image: "assets/images/hotel/oriental-hotel3.jfif",
      alt: "Mandarin Oriental luxury hotel in New York City",
      rating: "4.95",
      reviews: "845",
      title: "Mandarin Oriental, New York",
      location: "New York, New York",
      city: "New York",
      state: "New York",
      country: "United States",
      nearby: ["Manhattan"],
      price: "$750.00",
      priceUnit: "/ night",
    },
    {
      label: "Top Rated",
      image: "assets/images/hotel/mandarin-hotel4.jfif",
      alt: "Mandarin Oriental luxury hotel in Boston, Massachusetts",
      rating: "4.94",
      reviews: "738",
      title: "Mandarin Oriental, Boston",
      location: "Boston, Massachusetts",
      city: "Boston",
      state: "Massachusetts",
      country: "United States",
      nearby: [] as string[],
      price: "$625.00",
      priceUnit: "/ night",
    },
  ];

  // ============================================
  // POPULAR HOTELS TABS DATA
  // (Domestic / International / Asia / Europe /
  //  Middle East / North America)
  // ============================================

  popularHotelTabs: PopularHotelTab[] = [
    // ==================== DOMESTIC ====================
    {
      id: "domestic",
      hotels: [
        {
          image: "assets/images/hotel/domestic-hotel1.webp",
          title: "The Langham Chicago",
          location: "Chicago, Illinois",
          city: "Chicago",
          state: "Illinois",
          country: "United States",
          nearby: [],
          score: "8.1",
          scoreLabel: "Very Good",
          reviews: "9,842",
        },
        {
          image: "assets/images/hotel/domestic-hotel2.webp",
          title: "The Beverly Hills Hotel",
          location: "Beverly Hills, California",
          city: "Beverly Hills",
          state: "California",
          country: "United States",
          nearby: ["Los Angeles"],
          score: "8.7",
          scoreLabel: "Very Good",
          reviews: "3,426",
        },
        {
          image: "assets/images/hotel/domestic-hotel3.webp",
          title: "Mandarin Oriental, New York",
          location: "New York City",
          city: "New York",
          state: "New York",
          country: "United States",
          nearby: ["Manhattan"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "6,318",
        },
        {
          image: "assets/images/hotel/domestic-hotel4.webp",
          title: "Four Seasons Hotel at The Surf Club",
          location: "Surfside, Florida",
          city: "Surfside",
          state: "Florida",
          country: "United States",
          nearby: ["Miami Beach", "Miami"],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "4,275",
        },
        {
          image: "assets/images/hotel/domestic-hotel5.webp",
          title: "Amangiri",
          location: "Canyon Point, Utah",
          city: "Canyon Point",
          state: "Utah",
          country: "United States",
          nearby: ["Big Water", "Page"],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "1,864",
        },
        {
          image: "assets/images/hotel/domestic-hotel6.webp",
          title: "Auberge du Soleil",
          location: "Napa Valley, California",
          city: "Rutherford",
          state: "California",
          country: "United States",
          nearby: ["Napa", "St. Helena"],
          score: "8.8",
          scoreLabel: "Excellent",
          reviews: "2,753",
        },
        {
          image: "assets/images/hotel/domestic-hotel7.webp",
          title: "Rancho Valencia Resort & Spa",
          location: "Rancho Santa Fe, California",
          city: "Rancho Santa Fe",
          state: "California",
          country: "United States",
          nearby: ["Del Mar", "San Diego"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "1,592",
        },
        {
          image: "assets/images/hotel/domestic-hotel8.webp",
          title: "Montage Palmetto Bluff",
          location: "Bluffton, South Carolina",
          city: "Bluffton",
          state: "South Carolina",
          country: "United States",
          nearby: ["Hilton Head Island", "Savannah"],
          score: "8.6",
          scoreLabel: "Excellent",
          reviews: "3,187",
        },
      ],
    },

    // ==================== INTERNATIONAL ====================
    {
      id: "international",
      hotels: [
        {
          image: "assets/images/hotel/international-hotel1.webp",
          title: "Rosewood Hong Kong",
          location: "Hong Kong",
          city: "Hong Kong",
          state: "",
          country: "Hong Kong",
          nearby: ["Kowloon"],
          score: "8.2",
          scoreLabel: "Very Good",
          reviews: "5,842",
        },
        {
          image: "assets/images/hotel/international-hotel2.webp",
          title: "Capella Bangkok",
          location: "Bangkok, Thailand",
          city: "Bangkok",
          state: "",
          country: "Thailand",
          nearby: [],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "3,275",
        },
        {
          image: "assets/images/hotel/international-hotel3.webp",
          title: "Passalacqua",
          location: "Lake Como, Italy",
          city: "Moltrasio",
          state: "Lombardy",
          country: "Italy",
          nearby: ["Lake Como", "Como"],
          score: "9.4",
          scoreLabel: "Excellent",
          reviews: "1,684",
        },
        {
          image: "assets/images/hotel/international-hotel4.webp",
          title: "Park Hyatt Tokyo",
          location: "Tokyo, Japan",
          city: "Tokyo",
          state: "",
          country: "Japan",
          nearby: ["Shinjuku"],
          score: "8.8",
          scoreLabel: "Excellent",
          reviews: "4,921",
        },
        {
          image: "assets/images/hotel/international-hotel5.webp",
          title: "Claridge’s",
          location: "London, UK",
          city: "London",
          state: "",
          country: "United Kingdom",
          nearby: ["Mayfair"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "2,638",
        },
        {
          image: "assets/images/hotel/international-hotel6.webp",
          title: "Atlantis The Royal",
          location: "Dubai, UAE",
          city: "Dubai",
          state: "",
          country: "United Arab Emirates",
          nearby: ["Palm Jumeirah"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "7,452",
        },
        {
          image: "assets/images/hotel/international-hotel7.webp",
          title: "Four Seasons Firenze",
          location: "Florence, Italy",
          city: "Florence",
          state: "Tuscany",
          country: "Italy",
          nearby: ["Firenze"],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "2,147",
        },
        {
          image: "assets/images/hotel/international-hotel8.webp",
          title: "Le Bristol Paris",
          location: "Paris, France",
          city: "Paris",
          state: "",
          country: "France",
          nearby: [],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "3,816",
        },
      ],
    },

    // ==================== ASIA ====================
    {
      id: "asia",
      hotels: [
        {
          image: "assets/images/hotel/asia-hotel1.webp",
          title: "Amanpuri",
          location: "Phuket, Thailand",
          city: "Phuket",
          state: "",
          country: "Thailand",
          nearby: [],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "4,286",
        },
        {
          image: "assets/images/hotel/asia-hotel2.webp",
          title: "The Taj Mahal Palace",
          location: "Mumbai, India",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          nearby: ["Colaba"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "6,742",
        },
        {
          image: "assets/images/hotel/asia-hotel3.webp",
          title: "The Oberoi Rajvilas",
          location: "Jaipur, India",
          city: "Jaipur",
          state: "Rajasthan",
          country: "India",
          nearby: [],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "3,518",
        },
        {
          image: "assets/images/hotel/asia-hotel4.webp",
          title: "Park Hyatt Tokyo",
          location: "Tokyo, Japan",
          city: "Tokyo",
          state: "",
          country: "Japan",
          nearby: ["Shinjuku"],
          score: "8.8",
          scoreLabel: "Excellent",
          reviews: "5,164",
        },
        {
          image: "assets/images/hotel/asia-hotel5.webp",
          title: "The Peninsula Hong Kong",
          location: "Hong Kong",
          city: "Hong Kong",
          state: "",
          country: "Hong Kong",
          nearby: ["Kowloon", "Tsim Sha Tsui"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "4,735",
        },
        {
          image: "assets/images/hotel/asia-hotel6.webp",
          title: "Bvlgari Resort Bali",
          location: "Bali, Indonesia",
          city: "Uluwatu",
          state: "Bali",
          country: "Indonesia",
          nearby: ["Bali", "Jimbaran", "Nusa Dua"],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "2,846",
        },
        {
          image: "assets/images/hotel/asia-hotel7.webp",
          title: "Aman Kyoto",
          location: "Kyoto, Japan",
          city: "Kyoto",
          state: "",
          country: "Japan",
          nearby: [],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "2,174",
        },
        {
          image: "assets/images/hotel/asia-hotel8.webp",
          title: "The Ritz-Carlton Maldives, Fari Islands",
          location: "Maldives",
          city: "Fari Islands",
          state: "",
          country: "Maldives",
          nearby: ["North Male Atoll", "Male"],
          score: "9.4",
          scoreLabel: "Excellent",
          reviews: "1,963",
        },
      ],
    },

    // ==================== EUROPE ====================
    {
      id: "europe",
      hotels: [
        {
          image: "assets/images/hotel/europe-hotel1.webp",
          title: "Akelarre",
          location: "San Sebastián, Spain",
          city: "San Sebastián",
          state: "Basque Country",
          country: "Spain",
          nearby: ["Donostia"],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "4,286",
        },
        {
          image: "assets/images/hotel/europe-hotel2.webp",
          title: "Aman Venice",
          location: "Venice, Italy",
          city: "Venice",
          state: "Veneto",
          country: "Italy",
          nearby: ["Venezia"],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "2,741",
        },
        {
          image: "assets/images/hotel/europe-hotel3.webp",
          title: "Borgo Egnazia",
          location: "Puglia, Italy",
          city: "Fasano",
          state: "Puglia",
          country: "Italy",
          nearby: ["Savelletri", "Brindisi"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "3,518",
        },
        {
          image: "assets/images/hotel/europe-hotel4.webp",
          title: "The Carlton Cannes, a Regent Hotel",
          location: "Cannes, France",
          city: "Cannes",
          state: "",
          country: "France",
          nearby: [],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "2,864",
        },
        {
          image: "assets/images/hotel/europe-hotel5.webp",
          title: "Airelles Gordes, La Bastide",
          location: "Gordes, France",
          city: "Gordes",
          state: "Provence",
          country: "France",
          nearby: ["Avignon"],
          score: "9.4",
          scoreLabel: "Excellent",
          reviews: "1,925",
        },
        {
          image: "assets/images/hotel/europe-hotel6.webp",
          title: "Castelfalfi",
          location: "Tuscany, Italy",
          city: "Montaione",
          state: "Tuscany",
          country: "Italy",
          nearby: ["Castelfalfi", "Florence"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "2,637",
        },
        {
          image: "assets/images/hotel/europe-hotel7.webp",
          title: "Fairmont Golden Prague",
          location: "Prague, Czechia",
          city: "Prague",
          state: "",
          country: "Czech Republic",
          nearby: ["Praha"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "3,184",
        },
        {
          image: "assets/images/hotel/europe-hotel8.webp",
          title: "Mandarin Oriental, Vienna",
          location: "Vienna, Austria",
          city: "Vienna",
          state: "",
          country: "Austria",
          nearby: ["Wien"],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "2,418",
        },
      ],
    },

    // ==================== MIDDLE EAST ====================
    {
      id: "middleeast",
      hotels: [
        {
          image: "assets/images/hotel/middleeast-hotel1.webp",
          title: "Emirates Palace Mandarin Oriental",
          location: "Abu Dhabi, UAE",
          city: "Abu Dhabi",
          state: "",
          country: "United Arab Emirates",
          nearby: [],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "5,846",
        },
        {
          image: "assets/images/hotel/middleeast-hotel2.webp",
          title: "Burj Al Arab Jumeirah",
          location: "Dubai, UAE",
          city: "Dubai",
          state: "",
          country: "United Arab Emirates",
          nearby: ["Jumeirah"],
          score: "9.4",
          scoreLabel: "Excellent",
          reviews: "7,325",
        },
        {
          image: "assets/images/hotel/middleeast-hotel3.webp",
          title: "Atlantis The Royal",
          location: "Dubai, UAE",
          city: "Dubai",
          state: "",
          country: "United Arab Emirates",
          nearby: ["Palm Jumeirah"],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "6,742",
        },
        {
          image: "assets/images/hotel/middleeast-hotel4.webp",
          title: "Jumeirah Al Qasr",
          location: "Dubai, UAE",
          city: "Dubai",
          state: "",
          country: "United Arab Emirates",
          nearby: ["Jumeirah"],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "4,518",
        },
        {
          image: "assets/images/hotel/middleeast-hotel5.webp",
          title: "The St. Regis Dubai, The Palm",
          location: "Dubai, UAE",
          city: "Dubai",
          state: "",
          country: "United Arab Emirates",
          nearby: ["Palm Jumeirah"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "3,864",
        },
        {
          image: "assets/images/hotel/middleeast-hotel6.webp",
          title: "Mandarin Oriental Doha",
          location: "Doha, Qatar",
          city: "Doha",
          state: "",
          country: "Qatar",
          nearby: [],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "2,741",
        },
        {
          image: "assets/images/hotel/middleeast-hotel7.webp",
          title: "The Ritz-Carlton, Doha",
          location: "Doha, Qatar",
          city: "Doha",
          state: "",
          country: "Qatar",
          nearby: [],
          score: "8.8",
          scoreLabel: "Excellent",
          reviews: "5,216",
        },
        {
          image: "assets/images/hotel/middleeast-hotel8.webp",
          title: "Fairmont Amman",
          location: "Amman, Jordan",
          city: "Amman",
          state: "",
          country: "Jordan",
          nearby: [],
          score: "8.7",
          scoreLabel: "Excellent",
          reviews: "3,492",
        },
      ],
    },

    // ==================== NORTH AMERICA ====================
    {
      id: "northamerica",
      hotels: [
        {
          image: "assets/images/hotel/northamerica-hotel1.webp",
          title: "Amangiri",
          location: "Utah, USA",
          city: "Canyon Point",
          state: "Utah",
          country: "United States",
          nearby: ["Big Water", "Page"],
          score: "9.2",
          scoreLabel: "Excellent",
          reviews: "4,286",
        },
        {
          image: "assets/images/hotel/northamerica-hotel2.webp",
          title: "Four Seasons Resort Lanai",
          location: "Hawaii, USA",
          city: "Lanai City",
          state: "Hawaii",
          country: "United States",
          nearby: ["Lanai", "Maui"],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "3,742",
        },
        {
          image: "assets/images/hotel/northamerica-hotel3.webp",
          title: "The Beverly Hills Hotel",
          location: "Beverly Hills, California, USA",
          city: "Beverly Hills",
          state: "California",
          country: "United States",
          nearby: ["Los Angeles"],
          score: "9.3",
          scoreLabel: "Excellent",
          reviews: "5,641",
        },
        {
          image: "assets/images/hotel/northamerica-hotel4.webp",
          title: "Waldorf Astoria New York",
          location: "New York City, USA",
          city: "New York",
          state: "New York",
          country: "United States",
          nearby: ["Manhattan"],
          score: "8.9",
          scoreLabel: "Excellent",
          reviews: "6,218",
        },
        {
          image: "assets/images/hotel/northamerica-hotel5.webp",
          title: "The Langham Chicago",
          location: "Chicago, Illinois, USA",
          city: "Chicago",
          state: "Illinois",
          country: "United States",
          nearby: [],
          score: "9.0",
          scoreLabel: "Excellent",
          reviews: "4,875",
        },
        {
          image: "assets/images/hotel/northamerica-hotel6.webp",
          title: "Fairmont Banff Springs",
          location: "Banff, Alberta, Canada",
          city: "Banff",
          state: "Alberta",
          country: "Canada",
          nearby: ["Canmore", "Calgary"],
          score: "8.8",
          scoreLabel: "Excellent",
          reviews: "7,392",
        },
        {
          image: "assets/images/hotel/northamerica-hotel7.webp",
          title: "Four Seasons Hotel Toronto",
          location: "Toronto, Canada",
          city: "Toronto",
          state: "Ontario",
          country: "Canada",
          nearby: [],
          score: "9.1",
          scoreLabel: "Excellent",
          reviews: "3,684",
        },
        {
          image: "assets/images/hotel/northamerica-hotel8.webp",
          title: "Zadún, a Ritz-Carlton Reserve",
          location: "San José del Cabo, Mexico",
          city: "San José del Cabo",
          state: "Baja California Sur",
          country: "Mexico",
          nearby: ["Los Cabos", "Cabo San Lucas"],
          score: "9.4",
          scoreLabel: "Excellent",
          reviews: "2,516",
        },
      ],
    },
  ];

  /*
   * ============================================
   * CONSTRUCTOR
   * ============================================
   */

  constructor(
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID)
    private platformId: Object,
  ) {}

  /*
   * ============================================
   * INIT
   * ============================================
   */

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
  }

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
     * DEV ONLY: type these in the browser console
     *   checkAllHotelSearches()
     *   checkHotelSearch("Amangiri")
     */
    if (isDevMode()) {
      (window as any).checkAllHotelSearches = () =>
        this.checkAllHotelSearches();
      (window as any).checkHotelSearch = (title: string) =>
        this.checkHotelSearch(title);
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
   * DATE RANGE
   * ============================================
   */
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
   * WISHLIST
   * ============================================
   */

  toggleWishlist(hotel: any, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    console.log("Wishlist hotel:", hotel);
  }

  /*
   * ============================================
   * HOTEL CARD SEARCH
   * --------------------------------------------
   * Tries several searches in order and scores
   * every API result against the card:
   *   1. hotel name            (best)
   *   2. city
   *   3. location text / nearby areas
   *   4. state / region
   *   5. country
   *   6. LAST RESORT: first area the API returned
   *      for any city/area search
   * ============================================
   */

  /*
   * Set to true if a hotel IS found but the results
   * page comes back empty (that one hotel has no rooms
   * for the dates). Then the hotel's CITY is searched
   * instead, so the list always shows hotels.
   */
  searchCityInsteadOfHotel = false;

  private readonly countryAliases: Record<string, string> = {
    uae: "united arab emirates",
    usa: "united states",
    us: "united states",
    "united states of america": "united states",
    uk: "united kingdom",
    "great britain": "united kingdom",
    england: "united kingdom",
    czechia: "czech republic",
  };

  // Words ignored when comparing hotel names
  private readonly ignoredWords = [
    "the",
    "hotel",
    "hotels",
    "resort",
    "spa",
    "and",
    "by",
    "at",
    "a",
  ];

  bookHotel(hotel: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation(); // stop the card click from firing too
    this.openHotelSearch(hotel);
  }

  async openHotelSearch(hotel: any): Promise<void> {
    console.log("[Hotel search] card clicked:", hotel.title);

    if (this.loadingHotel) {
      console.warn(
        `[Hotel search] click ignored, still searching "${this.loadingHotel}"`,
      );
      return; // prevent double clicks
    }

    this.loadingHotel = hotel.title;
    this.cdr.detectChanges();

    try {
      const result = await this.findBestMatch(hotel, true);

      if (!result.match) {
        this.toasterService.showError(`No hotels found for ${hotel.title}`);
        return;
      }

      this.goToHotelResults(result.match, result.score);
    } catch (err) {
      console.error("[Hotel search] failed:", err);
      this.toasterService.showError(
        "Unable to search hotels. Please try again.",
      );
    } finally {
      this.loadingHotel = null;
      this.cdr.detectChanges();
    }
  }

  // --------------------------------------------
  // Core: run searches, return the best result
  // --------------------------------------------
  private async findBestMatch(hotel: any, log: boolean): Promise<MatchResult> {
    const titleQueries = this.titleQueries(hotel);
    const queries = this.buildSearchQueries(hotel);

    if (log) console.log("[Hotel search] queries:", queries);

    let best: MatchResult = { match: null, score: 0, query: "" };
    let firstArea: MatchResult | null = null;

    for (const query of queries) {
      let list: any[] = [];

      try {
        // 10s limit so a slow / stuck API call can never freeze the cards
        const res: any = await firstValueFrom(
          this.hotelService.hotel_cityList(query).pipe(timeout(10000)),
        );
        list = res?.success && Array.isArray(res.data) ? res.data : [];

        if (log) {
          console.log(
            `[Hotel search] "${query}" → ${list.length} results`,
            res,
          );
        }
      } catch (err) {
        console.warn(`[Hotel search] "${query}" failed:`, err);
      }

      for (const item of list) {
        if (this.searchCityInsteadOfHotel && this.isHotel(item)) {
          continue;
        }

        const score = this.scoreResult(item, hotel);

        if (score > best.score) {
          best = { match: item, score, query };
        }

        // Remember the first city/area returned for a location search
        if (
          !firstArea &&
          !this.isHotel(item) &&
          !titleQueries.includes(query)
        ) {
          firstArea = { match: item, score: 5, query };
        }
      }

      // Good enough (hotel or its city found) → stop searching
      if (best.score >= 70) {
        break;
      }
    }

    if (best.match) {
      if (log) console.log("[Hotel search] best match:", best);
      return best;
    }

    // Nothing scored → use whatever area the API returned first
    if (firstArea) {
      if (log) console.log("[Hotel search] fallback area:", firstArea);
      return firstArea;
    }

    if (log) console.warn("[Hotel search] NOTHING FOUND for", hotel.title);
    return best;
  }

  // --------------------------------------------
  // Build the list of searches to try, in order
  // --------------------------------------------
  private titleQueries(hotel: any): string[] {
    if (this.searchCityInsteadOfHotel) {
      return [];
    }

    return this.uniqueQueries([
      hotel.title, // "The Langham Chicago"
      this.keywords(hotel.title).join(" "), // "langham chicago"
    ]);
  }

  private buildSearchQueries(hotel: any): string[] {
    const loc = this.getLocationParts(hotel);

    const locationText = String(hotel.location || "")
      .split(",")
      .map((p) => p.trim());

    return this.uniqueQueries([
      ...this.titleQueries(hotel),
      loc.city, // "Chicago"
      ...locationText, // "Napa Valley", "Lake Como"
      ...loc.nearby, // "Los Angeles"
      loc.state, // "Illinois"
      loc.country, // "United States"
    ]);
  }

  private uniqueQueries(values: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];

    for (const value of values) {
      const raw = String(value || "")
        .toLowerCase()
        .trim();

      // send accented form too ("san josé del cabo"), then plain form
      const forms = /[^\x00-\x7F]/.test(raw)
        ? [raw, this.normalize(raw)]
        : [this.normalize(raw)];

      for (const q of forms) {
        if (q.length >= 3 && !seen.has(q)) {
          seen.add(q);
          out.push(q);
        }
      }
    }

    return out;
  }

  // --------------------------------------------
  // Score one API result against the card
  // --------------------------------------------
  private scoreResult(item: any, hotel: any): number {
    const loc = this.getLocationParts(hotel);

    const hCity = this.normalize(loc.city);
    const hState = this.normalize(loc.state);
    const hCountry = this.normalize(loc.country);
    const hNearby = loc.nearby.map((n) => this.normalize(n));
    const hLocText = String(hotel.location || "")
      .split(",")
      .map((p) => this.normalize(p))
      .filter((p) => p.length >= 3);

    const name = this.normalize(item.name);
    const city = this.normalize(item.city);
    const state = this.normalize(item.state);
    const country = this.toCountry(item.country);

    const sameCity = !!hCity && (city === hCity || name === hCity);

    // ---------- HOTEL RESULTS ----------
    if (this.isHotel(item)) {
      if (name === this.normalize(hotel.title)) return 100;

      const titleWords = this.keywords(hotel.title);
      const nameWords = this.keywords(item.name);

      if (!titleWords.length) return 0;

      const common = titleWords.filter((w) => nameWords.includes(w)).length;
      const ratio = common / titleWords.length;

      if (ratio === 1) return sameCity ? 98 : 95;
      if (ratio >= 0.6 && sameCity) return 90;
      if (ratio >= 0.6) return 80;

      // A different hotel in the same city still lands in the right place
      if (sameCity) return 50;

      return 0;
    }

    // ---------- CITY / AREA RESULTS ----------
    if (sameCity) return 75;
    if (hNearby.some((n) => name === n || city === n)) return 70;
    if (hLocText.some((t) => name === t || city === t)) return 65;
    if (hCity && (name.includes(hCity) || city.includes(hCity))) return 60;
    if (hCity && name.length >= 4 && hCity.includes(name)) return 55;
    if (hNearby.some((n) => name.includes(n) || city.includes(n))) return 52;

    // ---------- STATE / REGION ----------
    if (hState && name === hState) return 45;
    if (hState && state === hState) return 40;

    // ---------- COUNTRY ----------
    if (hCountry && name === hCountry) return 25;
    if (hCountry && country === hCountry) return 20;

    return 0;
  }

  // --------------------------------------------
  // DEV: check API responses for every hotel card
  // Browser console:  checkAllHotelSearches()
  // --------------------------------------------
  async checkAllHotelSearches(): Promise<void> {
    const all: any[] = [
      ...this.hotelSliderCards,
      ...this.popularHotelTabs.flatMap((t) => t.hotels),
    ];

    const unique = all.filter(
      (h, i) => all.findIndex((x) => x.title === h.title) === i,
    );

    console.log(
      `[Hotel check] checking ${unique.length} hotels, please wait...`,
    );

    const rows: any[] = [];

    for (const hotel of unique) {
      console.groupCollapsed(`[Hotel check] ${hotel.title}`);
      const r = await this.findBestMatch(hotel, true);
      console.groupEnd();

      const code =
        r.match?.code || r.match?.cityid || r.match?.destinationCode || "";

      rows.push({
        hotel: hotel.title,
        status: !r.match
          ? "❌ NOT FOUND"
          : r.score >= 80
            ? "✅ hotel"
            : r.score >= 50
              ? "🟡 city / area"
              : r.score >= 20
                ? "🟠 region / country"
                : "⚪ fallback area",
        matchedName: r.match?.name ?? "-",
        type: r.match?.type ?? "-",
        city: r.match?.city ?? "-",
        country: r.match?.country ?? "-",
        score: r.score,
        query: r.query || "-",
        code: code || "⚠ MISSING",
      });
    }

    console.table(rows);
    console.log(
      "[Hotel check] Expand a hotel's group above to see the raw API responses.",
    );
  }

  // Browser console:  checkHotelSearch("Amangiri")
  async checkHotelSearch(title: string): Promise<void> {
    const all: any[] = [
      ...this.hotelSliderCards,
      ...this.popularHotelTabs.flatMap((t) => t.hotels),
    ];

    const hotel = all.find((h) =>
      this.normalize(h.title).includes(this.normalize(title)),
    );

    if (!hotel) {
      console.warn(`[Hotel check] no card matching "${title}"`);
      return;
    }

    const r = await this.findBestMatch(hotel, true);
    console.log("[Hotel check] RESULT:", r);
  }

  // --------------------------------------------
  // Helpers
  // --------------------------------------------
  private getLocationParts(hotel: any): {
    city: string;
    state: string;
    country: string;
    nearby: string[];
  } {
    const parts = String(hotel.location || "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    return {
      city: hotel.city || parts[0] || "",
      state: hotel.state || (parts.length > 2 ? parts[1] : ""),
      country: this.toCountry(hotel.country || parts[parts.length - 1] || ""),
      nearby: Array.isArray(hotel.nearby) ? hotel.nearby : [],
    };
  }

  private isHotel(item: any): boolean {
    return this.normalize(item?.type) === "hotel";
  }

  private toCountry(value: any): string {
    const v = this.normalize(value);
    return this.countryAliases[v] || v;
  }

  private normalize(value: any): string {
    return String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9\s]/g, " ") // remove punctuation
      .replace(/\s+/g, " ")
      .trim();
  }

  private keywords(value: any): string[] {
    return this.normalize(value)
      .split(" ")
      .filter((w) => w.length > 1 && !this.ignoredWords.includes(w));
  }

  // --------------------------------------------
  // Save search + go to results
  // --------------------------------------------
  private goToHotelResults(match: any, score: number): void {
    console.log(`[Hotel search] using (score ${score}):`, match);

    let displayName: string;

    if (this.isHotel(match)) {
      displayName = match.name;
    } else if (match.city) {
      displayName = match.state?.trim()
        ? `${match.city}, ${match.state}, ${match.country}`
        : `${match.city}, ${match.country}`;
    } else {
      displayName = match.country
        ? `${match.name}, ${match.country}`
        : match.name;
    }

    const destinationObj = {
      displayName,
      name: match.name,
      type: match.type,
      country: match.country,
      countrycode: match.countryCode || match.countrycode,
      city: match.city,
      code: match.code || match.cityid,
      destinationCode: match.destinationCode,
    };

    // Same-day check-in is blocked in the hotel form,
    // so default to a 2-night stay starting 7 days from today
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 7);

    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 2);

    const formData = {
      checkIn: this.formatLocalDate(checkInDate),
      checkOut: this.formatLocalDate(checkOutDate),
      rooms: [{ adults: 2, childAges: [] }],
      destination: destinationObj,
    };

    this.searchService.setSearchHotelData(formData);
    this.hotelFilterService.resetFilters();
    this.loadingHotel = null;

    this.router.navigate(["/hotels-list"], {
      queryParams: { source: "etg" },
    });
  }

  private formatLocalDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /*
   * ============================================
   * NEW HOTEL SLIDER CAROUSEL
   * ============================================
   */

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

  /*
   * ============================================
   * HOTEL OWL CAROUSEL
   * ============================================
   */

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
   * HOTEL NEXT / PREVIOUS
   * ============================================
   */

  hotelNext(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === "undefined") {
      return;
    }

    const slider = $(".tabhotels-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  hotelPrevious(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === "undefined") {
      return;
    }

    const slider = $(".tabhotels-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("prev.owl.carousel");
    }
  }

  /*
   * ============================================
   * NEW HOTEL SLIDER NEXT / PREVIOUS
   * ============================================
   */

  hotelSliderNext(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === "undefined") {
      return;
    }

    const slider = $(".hotel-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("next.owl.carousel");
    }
  }

  hotelSliderPrevious(): void {
    if (!isPlatformBrowser(this.platformId) || typeof $ === "undefined") {
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

    delete (window as any).checkAllHotelSearches;
    delete (window as any).checkHotelSearch;

    if (typeof $ === "undefined" || !$.fn || !$.fn.owlCarousel) {
      return;
    }

    const tabHotelSlider = $(".tabhotels-slider");

    if (tabHotelSlider.length && tabHotelSlider.hasClass("owl-loaded")) {
      tabHotelSlider.trigger("destroy.owl.carousel");
    }

    const hotelSlider = $(".hotel-slider");

    if (hotelSlider.length && hotelSlider.hasClass("owl-loaded")) {
      hotelSlider.trigger("destroy.owl.carousel");
    }
  }
}
