import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  DestroyRef,
  ViewChild,
} from "@angular/core";
import { HotelsTabComponent } from "../../components/main-filter/hotels-tab/hotels-tab.component";
import { CarouselModule } from "primeng/carousel";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { HotelFilterModalComponent } from "./hotel-filter-modal/hotel-filter-modal.component";
import { DeviceService } from "../../services/shared/device.service";
import { DialogModule } from "primeng/dialog";
import { API_PROVIDERS } from "./hotelstaticdata";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Drawer, DrawerModule } from "primeng/drawer";
import { SearchService } from "../../services/search.service";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HotelService } from "../../services/hotel/hotel.service";
import { TosterService } from "../../services/common/toaster.service";
import { SharedService } from "../../services/shared/shared.service";
import { AutoCompleteModule } from "primeng/autocomplete";
import { RatingModule } from "primeng/rating";
import { SliderModule } from "primeng/slider";
import { PaginatorModule } from "primeng/paginator";
import {
  HotelFilters,
  HotelFilterService,
} from "../../services/hotel/hotel-filter.service";
import { combineLatest, debounceTime, distinctUntilChanged } from "rxjs";
import { HotelListSkeletonComponent } from "./skeleton/hotel-list-skeleton/hotel-list-skeleton.component";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";
import { FlightService } from "../../services/flight/flight.service";
import { PackagesTabComponent } from "../../components/main-filter/packages-tab/packages-tab.component";
declare var $: any;
@Component({
  selector: "app-hotels-list",
  imports: [
    HotelsTabComponent,
    CarouselModule,
    CommonModule,
    HotelFilterModalComponent,
    DialogModule,
    DrawerModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    RatingModule,
    FormsModule,
    CurrencyPipe,
    SliderModule,
    PaginatorModule,
    HotelListSkeletonComponent,
    PackagesTabComponent
  ],
  templateUrl: "./hotels-list.component.html",
  styleUrl: "./hotels-list.component.scss",
})
export class HotelsListComponent implements OnInit {
  private deviceService = inject(DeviceService);

  /* == Mobile Filter Dropdown Start == */
  isFilterOpen = false;
  isFilterOpenmobile = false;
  isAndroid = false;
  isBrowser = false;
  isMobile = false;
  isfilterDialogOpen = false;
  @ViewChild("drawerRef") drawerRef!: Drawer;

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private hotelService: HotelService = inject(HotelService);
  private toasterService: TosterService = inject(TosterService);
  private sharedService: SharedService = inject(SharedService);
  private flightService: FlightService = inject(FlightService);

  selectedRatings: number[] = [];
  public departureAirports: any[] = [];
  randomInsertIndexes: number[] = [];

  maxBaseFare: number = 0;
  minBaseFare: number = 0;
  visible: boolean = false;
  showGuestDropdown: boolean = false;
  selectedTab: string = "recommended";
  properties: any[] = [];
  propertiesAll: any[] = [];

  filteredProperties: any[] = [];
  uniqueRateAmenities: any[] = [];
  count = 2;
  minCheckOutDate: any;
  staticdata: any = "";
  requestId: string = "";

  public cityName: string = "";
  cityNameShow: string = "";
  public source: string = "";
  private mainsource: string = "";
  private shareService: SharedService = inject(SharedService);
  private hotelFilterService = inject(HotelFilterService);
  getData: any = "";
  /* == Desktop Lightbox gallery End == */

  /* == Sidebar Price Graph == */
  data: any = [];

  /* == Mobile Filter Dropdown End == */

  /* == Desktop Lightbox gallery Start == */

  mobImages: string[] = [
    "/assets/images/hotel/gallery-list/mobile/banner1.jpg",
    "/assets/images/hotel/gallery-list/mobile/banner2.jpg",
    "/assets/images/hotel/gallery-list/mobile/banner1.jpg",
    "/assets/images/hotel/gallery-list/mobile/banner2.jpg",
    "/assets/images/hotel/gallery-list/mobile/banner1.jpg",
    "/assets/images/hotel/gallery-list/mobile/banner2.jpg",
  ];
  images: string[] = [
    "/assets/images/hotel/gallery-list/desktop/hotel-gallery-list-1.jpg",
    "/assets/images/hotel/gallery-list/desktop/hotel-gallery-list-2.jpg",
    "/assets/images/hotel/gallery-list/desktop/hotel-gallery-list-3.jpg",
    "/assets/images/hotel/gallery-list/desktop/hotel-gallery-list-4.jpg",
    "/assets/images/hotel/gallery-list/desktop/hotel-gallery-list-5.jpg",
  ];

  desktopLightboxOpen = false;
  desktopCurrentIndex = 0;
  isDesktop = false;
  selectedHotel: any = null;

  activeFilters: HotelFilters = this.hotelFilterService.currentFilters;
  filtersForModal: HotelFilters | null = null;
  allAmenities: any = [];
  allStarRatings: any = [];
  allGuestRatings: any = [];
  allMeals: any = [];
  allPropertyTypes: any = [];
  allLocations: any = [];
  allLandmarks: any = [];
  noOfNights: number = 0;
  isMobileSearchVisible = true;
  isdialogopen = false;
  hotelSearchData: any;

  totalGuests: any = "";

  totalRooms: number = 0;

  filtersData: any = {};

  // Selected Filters
  selectedStarRatings: number[] = [];
  selectedGuestRatings: number[] = [];
  selectedMealPlans: string[] = [];
  selectedAmenities: string[] = [];
  selectedPropertyTypes: string[] = [];
  selectedLocations: string[] = [];
  selectedLandmarks: string[] = [];

  // Price
  minPrice: number = 0;
  maxPrice: number = 1000000;
  averagePrice: number = 0;
  // Slider
  min = 0;
  max = 1000000;

  minValue = 0;
  maxValue = 1000000;

  // Show More
  showAllAmenities = false;
  showAllPropertyTypes = false;
  showAllLocations = false;
  showAllLandmarks = false;
  first: number = 0;
  rows: number = 20;
  totalRecords: number = 0;
  currentPage: number = 1;
  isSkeleton: boolean = false;
  storeFullData: any = "";
  packageTabActive = false;
  currentYear: number = new Date().getFullYear();

    packagediparture: string = "";
  packagearrival: string = "";
  packagedipartureDate: string = "";
  packagearrivalDate: string = "";
  packagetotalPassenger: number = 0;
  packagetripType: string = "";
  packagecabinName: string = "";
   cabinOptions = [
    { name: "Economy", value: "E" },
    { name: "First", value: "F" },
    { name: "Business", value: "B" },
    { name: "Premium Economy", value: "PE" },
    { name: "Premium Economy", value: "P" },
  ];
  selectedCabin = { name: "Economy", value: "E" };
  constructor(
    private eRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {
    const url = this.router.url;

    this.packageTabActive = url.includes("package");
    this.isBrowser = isPlatformBrowser(this.platformId);
    // this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
  }
  onEditClick() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.toggleDrawerScroll(true);
    this.isMobileSearchVisible = false;
    this.isdialogopen = true;
    document.body.classList.remove("dialog-open");
  }

  // X button: show mobile box again
  onCloseClick() {
    this.isMobileSearchVisible = true;
    this.isdialogopen = false;
    this.toggleDrawerScroll(false);
  }
  onMaskClick() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isMobileSearchVisible = true;
    this.isdialogopen = false;
    document.body.classList.remove("dialog-open");
  }
  private toggleDrawerScroll(lock: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    const body = document.body;

    if (lock) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }
  }
  toggleFilterDropdown(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }
  toggleFilterDropdownmobile(): void {
    this.isFilterOpenmobile = !this.isFilterOpenmobile;
  }

  getParamsData: any = "";
  tripType:string="";
  departureCity:string="";
  inputValue:any='';
  


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      this.checkScreen();
 
    }
   this.isMobileSearchVisible=false;
    this.loadSavedFilters();
    // =====================================
    // ✅ ROUTE PARAMS LISTENER
    // =====================================
    this.staticdata = API_PROVIDERS;

    this.getData = this.sharedService.getcompanyName();
    // const res=this.staticdata;
    //       this.propertiesAll = res?.data?.properties || [];
    //       this.requestId = res?.data?.requestId;
    //       this.mainsource = res?.source || 'Mondee';
    //       this.applyFilters();
    if (this.packageTabActive) {
        this.flightLoading = true;      // add this line
  this.syncSkeleton();            // and this one
      const paramsData = this.searchService.getCurrentParamsData();
      console.log("Params Data:", paramsData);
      this.tripType=paramsData?.tripType;
       this.selectedCabin = paramsData?.CabinClass || {
          name: "Economy",
          value: "E",
        };
        this.departureCity=paramsData?.departureCity;
    this.searchService.searchData$
    .pipe(takeUntilDestroyed(this.destroyRef))   // add this, the subscription leaks without it
    .subscribe((searchData) => {
        console.log("Received Flight Data:", searchData);
        const originDest = searchData?.originDestination || [];
        if (searchData) {
              if (paramsData?.tripType === "oneway") {
          // Force single-segment parsing even if searchData has leftover segments
          this.packagediparture = originDest[0]?.DepartureLocationCode();
          this.packagearrival = originDest[0]?.ArrivalLocationCode;
          this.packagedipartureDate = this.formatToAPIDate(originDest[0]?.DepartureTime);

          // CRITICAL: Explicitly wipe arrivalDate so API doesn't treat it as Round-Trip
          this.packagearrivalDate = "";

        }
        else if (paramsData?.tripType === "roundtrip") {
          this.packagediparture = originDest[0]?.DepartureLocationCode;
          this.packagearrival = originDest[0]?.ArrivalLocationCode;
          this.packagedipartureDate = this.formatToAPIDate(originDest[0]?.DepartureTime);
          this.packagearrivalDate = this.formatToAPIDate(originDest[1]?.DepartureTime);
        }
         const selectedCabin = this.selectedCabin;
            const cabinName =
      this.cabinOptions.find((option: any) => option.value === selectedCabin)
        ?.name || "";
          this.packagecabinName = cabinName;
          const total=paramsData?.NoOfAdults+paramsData?.NoOfChildren+paramsData?.NoOfInfants;
          this.inputValue = `${total} Traveler${total !== 1 ? "s" : ""} `;
          this.getFlights(paramsData, searchData);

          
        }
      });
    }
         this.route.queryParams.subscribe(params => {
      this.source = params['source'];

      console.log(this.source); // "etg"
    });
    this.searchService.hotelSearchData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (!data) return;
        this.hotelSearchData = data;
        const checkIn = new Date(data?.checkIn);

        const checkOut = new Date(data?.checkOut);

        const diffTime = checkOut.getTime() - checkIn.getTime();

        this.noOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.totalRooms = data?.rooms?.length || 0;

        // total guests
        this.getGuestSummary(data);
        this.initialgetHotelList(data, 1);
      });
  }

private hotelLoading = false;
private flightLoading = false;
private hotelReq = 0;     // ignore stale responses from older searches
private flightReq = 0;

private syncSkeleton(): void {
  // Package tab: wait for both. Other tabs: hotels only.
  const busy = this.hotelLoading || (this.packageTabActive && this.flightLoading);
  this.isSkeleton = busy;
  if (!busy) {
    document.documentElement.classList.remove("overflow-hidden");
    document.body.classList.remove("overflow-hidden");
  }
    setTimeout(() => this.initHotelCarousel(), 0);
  this.cdr.markForCheck();
}
    formatToAPIDate(dateString: string): string {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  getMainDetails: any[] = [];
  getNearbyDetails: any[] = [];
  visibleSegments: any = "";

  getFlights(routedata: any, payload: any) {
    const reqId = ++this.flightReq;
  this.flightLoading = true;
  this.syncSkeleton();
    this.flightService
      .getflightList(routedata, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
           if (reqId !== this.flightReq) return;
          // this.isSkeleton = false;
          this.storeFullData = res;

          // this.searchService.setSearchData(this.searchData);
          const flightItineraries = Array.isArray(res?.data?.FlightItinerary)
            ? res.data.FlightItinerary
            : [];

          const filteredItineraries =
            flightItineraries.length <= 1
              ? flightItineraries
              : flightItineraries.filter(
                  (itinerary: any) => Number(itinerary?.noOfSeats) > 0,
                );
          //  const filteredItineraries = res.data.FlightItinerary;
          this.getMainDetails = filteredItineraries || [];

          const nearbyItineraries = res?.data?.NearbyFlightItinerary || [];

          const filteredItinerariesNearby =
            nearbyItineraries.length === 1
              ? nearbyItineraries
              : nearbyItineraries.filter(
                  (itinerary: any) =>
                    itinerary?.noOfSeats && itinerary.noOfSeats > 0,
                );
          // const filteredItinerariesNearby = res?.data?.NearbyFlightItinerary
          this.getNearbyDetails = filteredItinerariesNearby || [];
          console.log("this.getNearbyDetails", this.getNearbyDetails.length);
          // ✅ Combine both lists
          const allFlights = [...this.getMainDetails, ...this.getNearbyDetails];

          // ------------------ Cheapest Calculation ------------------
          const cheapestSorted = this.getMainDetails.sort(
            (
              a: { Fares: { CCMax: number }[] },
              b: { Fares: { CCMax: number }[] },
            ) => {
              const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
              const fareB = b.Fares?.[0]?.CCMax ?? Infinity;
              return fareA - fareB;
            },
          );
          this.visibleSegments = cheapestSorted[0];
          console.log("this.visibleSegments", this.visibleSegments);

           this.flightLoading = false;
        this.syncSkeleton();

          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (err) => {
          // this.isSkeleton = false;
          if (reqId !== this.flightReq) return;
        this.getMainDetails = [];
        this.getNearbyDetails = [];
        this.visibleSegments = "";
        this.flightLoading = false;
        this.syncSkeleton();
        },
      });
  }
  getBaggageInfoCard(fare: any) {
    const baggage =
      fare?.Fares?.[0]?.BaggageAllowance || fare?.Fares?.[0]?.BaggageAllowance;

    let checkin = 0;
    let carryon = 0;

    if (!baggage) return { checkin, carryon };

    Object.values(baggage).forEach((segment: any) => {
      segment?.forEach((bag: any) => {
        // ✅ CHECKIN
        if (bag?.type === "CHECKIN") {
          if (bag?.count) {
            checkin = Math.max(checkin, Number(bag.count));
          }
          // else if (bag?.noOfPieces) {
          //   const match = bag.noOfPieces.match(/\d+/);
          //   if (match) checkin = Math.max(checkin, +match[0]);
          // }
          // else if (bag?.description1) {
          //   checkin = Math.max(checkin, 1);
          // }
        }

        // ✅ CARRYON
        if (bag?.type === "CARRYON") {
          if (bag?.count) {
            carryon = Math.max(carryon, Number(bag.count));
          }
          // else if (bag?.noOfPieces) {
          //   const match = bag.noOfPieces.match(/\d+/);
          //   if (match) carryon = Math.max(carryon, +match[0]);
          // }
          // else if (bag?.description1) {
          //   carryon = Math.max(carryon, 1);
          // }
        }
      });
    });

    return { checkin, carryon };
  }
  
  getGuestSummary(data: any): any {
    const rooms = data?.rooms || [];

    const adultsCount = rooms.reduce(
      (total: number, room: any) => total + (room?.adults || 0),
      0,
    );

    const childrenCount = rooms.reduce(
      (total: number, room: any) => total + (room?.childAges?.length || 0),
      0,
    );

    const totalRooms = rooms.length;

    let summary = `${adultsCount} Adult${adultsCount > 1 ? "s" : ""}`;

    if (childrenCount > 0) {
      summary += `, ${childrenCount} ${childrenCount === 1 ? "Child" : "Children"}`;
    }

    summary += `, ${totalRooms} Room${totalRooms > 1 ? "s" : ""}`;

    this.totalGuests = summary;
  }
  @HostListener("window:resize")
  onResize(): void {
    this.checkScreen();
  }

  private checkScreen(): void {
    if (!this.isBrowser) return;
    this.isDesktop = window.innerWidth >= 992;
  }

  desktopImages: string[] = [];
  currentHotelImages: any[] = []; // Store the original hotel image objects if needed

  // Method to open lightbox with hotel images
  desktopOpenLightbox(hotel: any, index: number = 0): void {
    // Extract image URLs from hotel object
    this.desktopImages = hotel.image.map((img: any) => img.imageUrl);
    this.desktopCurrentIndex = index;
    this.desktopLightboxOpen = true;
    // Store selected hotel
    this.selectedHotel = hotel;

    if (this.isBrowser) {
      document.body.classList.add("overflow-hidden");
    }
  }

  // Alternative method if you need to pass custom images array
  desktopOpenLightboxWithImages(images: any[], index: number = 0): void {
    // Extract image URLs from the images array
    this.desktopImages = images.map((img: any) => img.imageUrl || img);
    this.desktopCurrentIndex = index;
    this.desktopLightboxOpen = true;

    if (this.isBrowser) {
      document.body.classList.add("overflow-hidden");
    }
  }

  // Close lightbox
  desktopCloseLightbox(): void {
    this.desktopLightboxOpen = false;
    this.desktopImages = [];
    this.desktopCurrentIndex = 0;
    this.selectedHotel = null;
    if (this.isBrowser) {
      document.body.classList.remove("overflow-hidden");
    }
  }

  // Previous image
  desktopPrevImage(event: MouseEvent): void {
    event.stopPropagation();
    if (this.desktopImages.length > 0) {
      this.desktopCurrentIndex =
        (this.desktopCurrentIndex - 1 + this.desktopImages.length) %
        this.desktopImages.length;
    }
  }

  // Next image
  desktopNextImage(event: MouseEvent): void {
    event.stopPropagation();
    if (this.desktopImages.length > 0) {
      this.desktopCurrentIndex =
        (this.desktopCurrentIndex + 1) % this.desktopImages.length;
    }
  }

  // Get image count text
  getImageCountText(currentIndex: number, totalImages: number): string {
    return `${currentIndex + 1}/${totalImages}`;
  }

  // Optional: Keyboard navigation for desktop usability
  @HostListener("window:keydown", ["$event"])
  desktopKeyNavigation(event: KeyboardEvent): void {
    if (!this.desktopLightboxOpen) return;

    if (event.key === "ArrowLeft") {
      this.desktopPrevImage(event as any);
    } else if (event.key === "ArrowRight") {
      this.desktopNextImage(event as any);
    } else if (event.key === "Escape") {
      this.desktopCloseLightbox();
    }
  }

  /* == Sidebar Price Graph End == */
  /* === ==== */
  onFiltersApplied(filters: any) {
    this.isfilterDialogOpen = false;
    this.selectedStarRatings = filters.selectedStarRatings || [];

    this.selectedGuestRatings = filters.selectedGuestRatings || [];

    this.selectedMealPlans = filters.selectedMealPlans || [];

    this.selectedAmenities = filters.selectedAmenities || [];

    this.selectedPropertyTypes = filters.selectedPropertyTypes || [];

    this.selectedLocations = filters.selectedLocations || [];

    this.selectedLandmarks = filters.selectedLandmarks || [];

    this.minPrice = filters.minPrice;
    this.maxPrice = filters.maxPrice;

    this.getHotelList(this.hotelSearchData, 1);
  }
  openFilterDialog() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isfilterDialogOpen = true;
    document.body.classList.remove("dialog-open");
  }
  onClose() {
    this.isfilterDialogOpen = false;
    this.filtersForModal = null;
  }
  /* === ==== */
  private initialgetHotelList(formData: any, page: number = 1) {
    this.onCloseClick();
    this.filtersData = [];
    this.propertiesAll = [];

    this.data = [];
    //               const cached = this.hotelService.gethotels();
    //     // const cached = this.staticdata;
    //     if (cached) {
    //       const res = cached;
    //       this.storeFullData = res;
    //        console.log('HOTEL RESPONSE:', res);
    //         this.cityName=res?.data?.scope?.cityName;
    //         this.propertiesAll =
    //           res?.data?.properties || [];
    //   this.totalRecords =
    //     res?.data?.totalRecords ||
    //     res?.data?.total ||
    //     this.propertiesAll.length;

    //   this.currentPage = page;

    //   this.first =
    //     (page - 1) * this.rows;
    //         this.filtersData =
    //           res?.data?.filters || {};

    //         this.requestId =
    //           res?.data?.requestId;

    //         this.mainsource =
    //           res?.data?.source || 'Mondee';
    //  this.generatePriceChartData(
    //           this.propertiesAll
    //         );
    //         // ======================
    //         // PRICE FILTER
    //         // ======================

    //         const priceFilter =
    //           this.filtersData?.priceFilter;

    //         if (priceFilter) {

    //           this.min =
    //             priceFilter?.minPrice || 0;

    //           this.max =
    //             priceFilter?.maxPrice || 0;

    //          const savedFilters =
    //   this.hotelFilterService
    //     .getFilterData();

    // if (
    //   savedFilters?.rangeValues?.length === 2
    // ) {

    //   const savedMin =
    //     savedFilters.rangeValues[0];

    //   const savedMax =
    //     savedFilters.rangeValues[1];

    //   // adjust within latest backend range
    //   this.minValue = Math.max(
    //     this.min,
    //     savedMin
    //   );

    //   this.maxValue = Math.min(
    //     this.max,
    //     savedMax
    //   );

    //   // safety check
    //   if (this.minValue > this.maxValue) {
    //     this.minValue = this.min;
    //     this.maxValue = this.max;
    //   }

    // } else {

    //   this.minValue =
    //     priceFilter?.selectedMinPrice || this.min;

    //   this.maxValue =
    //     priceFilter?.selectedMaxPrice || this.max;

    // }

    // this.minPrice = this.minValue;
    // this.maxPrice = this.maxValue;

    //               this.averagePrice = priceFilter?.averagePrice || 0;
    //         }

    //         this.applyFilters();
    //                     this.cdr.markForCheck();
    //     } else {

const reqId = ++this.hotelReq;
this.hotelLoading = true;
this.syncSkeleton();
    //       const html = document.documentElement;
    // const body = document.body;
    //       html.classList.add("overflow-hidden");
    //   body.classList.add("overflow-hidden");
    this.cdr.markForCheck();

    const payload: any = {
      checkin: formData.checkIn,
      checkout: formData.checkOut,

      countryCode: formData.destination.countrycode,

      preferCached: true,
      includeFilters: true,

      page: page,
      limit: this.rows,

      guest: formData.rooms.map((room: any) => ({
        adults: room.adults,
        children: room.childAges || [],
      })),
    };

    // Set destination based on type
    if (formData.destination.type === "city") {
      this.cityName = formData.destination.name || "";
      this.cityNameShow = formData.destination.city || "";
      payload.cityName = formData.destination.name;
    } else if (formData.destination.type === "hotel") {
      this.cityNameShow = formData.destination.city || "";
      payload.hotelId = formData.destination.code;
    }

    // ======================
    // APPLY FILTERS
    // ======================

    if (this.selectedStarRatings?.length) {
      payload.starRatings = this.selectedStarRatings;
    }

    if (this.selectedGuestRatings?.length) {
      payload.guestRatings = this.selectedGuestRatings;
    }

    if (this.selectedMealPlans?.length) {
      payload.mealPlans = this.selectedMealPlans;
    }

    if (this.selectedAmenities?.length) {
      payload.amenityCodes = this.selectedAmenities;
    }

    if (this.selectedPropertyTypes?.length) {
      payload.propertyTypes = this.selectedPropertyTypes;
    }

    if (this.selectedLocations?.length) {
      payload.locations = this.selectedLocations;
    }

    if (this.selectedLandmarks?.length) {
      payload.popularLandmarks = this.selectedLandmarks;
    }

    if (this.minPrice > this.min || this.maxPrice < this.max) {
      payload.minPrice = this.minPrice;
      payload.maxPrice = this.maxPrice;
    }
    if (this.selectedSort) {
      payload.isLowToHigh = this.selectedSort === "highToLow";
    }
    const hotelName = (this.hotelName || "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (hotelName.replace(/\s/g, "").length >= 3) {
      payload.hotelName = hotelName;
    }
    payload.source = this.source;

    this.hotelService
      .hotelList(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const html = document.documentElement;
          const body = document.body;
          html.classList.remove("overflow-hidden");
          body.classList.remove("overflow-hidden");
 if (reqId !== this.hotelReq) return;     // a newer search replaced this one
  this.storeFullData = res;
          // this.cityName=res?.data?.scope?.cityName||'';
          this.propertiesAll = res?.data?.properties || [];
          this.totalRecords =
            res?.data?.totalRecords ||
            res?.data?.total ||
            this.propertiesAll.length;

          this.currentPage = page;

          this.first = (page - 1) * this.rows;
          this.filtersData = res?.data?.filters || {};

          this.requestId = res?.data?.requestId;

          this.mainsource = res?.data?.source || "Mondee";
          this.generatePriceChartData(this.propertiesAll);
          // ======================
          // PRICE FILTER
          // ======================

          const priceFilter = this.filtersData?.priceFilter;

          if (priceFilter) {
            this.min = priceFilter?.minPrice || 0;

            this.max = priceFilter?.maxPrice || 0;

            const savedFilters = this.hotelFilterService.getFilterData();

            if (savedFilters?.rangeValues?.length === 2) {
              const savedMin = savedFilters.rangeValues[0];

              const savedMax = savedFilters.rangeValues[1];

              // adjust within latest backend range
              this.minValue = Math.max(this.min, savedMin);

              this.maxValue = Math.min(this.max, savedMax);

              // safety check
              if (this.minValue > this.maxValue) {
                this.minValue = this.min;
                this.maxValue = this.max;
              }
            } else {
              this.minValue = priceFilter?.selectedMinPrice || this.min;

              this.maxValue = priceFilter?.selectedMaxPrice || this.max;
            }

            this.minPrice = this.minValue;
            this.maxPrice = this.maxValue;
            this.averagePrice = priceFilter?.averagePrice || 0;
          }
   this.hotelName = "";
  this.applyFilters();
  setTimeout(() => this.initHotelCarousel(), 0);
  this.hotelLoading = false;
  this.syncSkeleton();
          this.cdr.markForCheck();
        },

        error: (err) => {
   if (reqId !== this.hotelReq) return;
  this.hotelName = "";
  this.hotelLoading = false;
  this.syncSkeleton();
          const html = document.documentElement;
          const body = document.body;
          html.classList.remove("overflow-hidden");
          body.classList.remove("overflow-hidden");
        },
      });
    // }
  }
  private getHotelList(formData: any, page: number = 1) {
    this.onCloseClick();
    this.filtersData = [];
    this.propertiesAll = [];

    this.data = [];
    //               const cached = this.hotelService.gethotels();
    //     // const cached = this.staticdata;
    //     if (cached) {
    //       const res = cached;
    //       this.storeFullData = res;
    //        console.log('HOTEL RESPONSE:', res);
    //         this.cityName=res?.data?.scope?.cityName;
    //         this.propertiesAll =
    //           res?.data?.properties || [];
    //   this.totalRecords =
    //     res?.data?.totalRecords ||
    //     res?.data?.total ||
    //     this.propertiesAll.length;

    //   this.currentPage = page;

    //   this.first =
    //     (page - 1) * this.rows;
    //         this.filtersData =
    //           res?.data?.filters || {};

    //         this.requestId =
    //           res?.data?.requestId;

    //         this.mainsource =
    //           res?.data?.source || 'Mondee';
    //  this.generatePriceChartData(
    //           this.propertiesAll
    //         );
    //         // ======================
    //         // PRICE FILTER
    //         // ======================

    //         const priceFilter =
    //           this.filtersData?.priceFilter;

    //         if (priceFilter) {

    //           this.min =
    //             priceFilter?.minPrice || 0;

    //           this.max =
    //             priceFilter?.maxPrice || 0;

    //          const savedFilters =
    //   this.hotelFilterService
    //     .getFilterData();

    // if (
    //   savedFilters?.rangeValues?.length === 2
    // ) {

    //   const savedMin =
    //     savedFilters.rangeValues[0];

    //   const savedMax =
    //     savedFilters.rangeValues[1];

    //   // adjust within latest backend range
    //   this.minValue = Math.max(
    //     this.min,
    //     savedMin
    //   );

    //   this.maxValue = Math.min(
    //     this.max,
    //     savedMax
    //   );

    //   // safety check
    //   if (this.minValue > this.maxValue) {
    //     this.minValue = this.min;
    //     this.maxValue = this.max;
    //   }

    // } else {

    //   this.minValue =
    //     priceFilter?.selectedMinPrice || this.min;

    //   this.maxValue =
    //     priceFilter?.selectedMaxPrice || this.max;

    // }

    // this.minPrice = this.minValue;
    // this.maxPrice = this.maxValue;

    //               this.averagePrice = priceFilter?.averagePrice || 0;
    //         }

    //         this.applyFilters();
    //                     this.cdr.markForCheck();
    //     } else {

    this.isSkeleton = true;
    //       const html = document.documentElement;
    // const body = document.body;
    //       html.classList.add("overflow-hidden");
    //   body.classList.add("overflow-hidden");
    this.cdr.markForCheck();

    const payload: any = {
      checkin: formData.checkIn,
      checkout: formData.checkOut,

      countryCode: formData.destination.countrycode,

      preferCached: true,
      includeFilters: true,

      page: page,
      limit: this.rows,

      guest: formData.rooms.map((room: any) => ({
        adults: room.adults,
        children: room.childAges || [],
      })),
    };

    // Set destination based on type
    if (formData.destination.type === "city") {
      this.cityName = formData.destination.name || "";
      this.cityNameShow = formData.destination.city || "";
      payload.cityName = formData.destination.name;
    } else if (formData.destination.type === "hotel") {
      this.cityNameShow = formData.destination.city || "";
      payload.hotelId = formData.destination.code;
    }

    // ======================
    // APPLY FILTERS
    // ======================

    if (this.selectedStarRatings?.length) {
      payload.starRatings = this.selectedStarRatings;
    }

    if (this.selectedGuestRatings?.length) {
      payload.guestRatings = this.selectedGuestRatings;
    }

    if (this.selectedMealPlans?.length) {
      payload.mealPlans = this.selectedMealPlans;
    }

    if (this.selectedAmenities?.length) {
      payload.amenityCodes = this.selectedAmenities;
    }

    if (this.selectedPropertyTypes?.length) {
      payload.propertyTypes = this.selectedPropertyTypes;
    }

    if (this.selectedLocations?.length) {
      payload.locations = this.selectedLocations;
    }

    if (this.selectedLandmarks?.length) {
      payload.popularLandmarks = this.selectedLandmarks;
    }

    if (this.minPrice > this.min || this.maxPrice < this.max) {
      payload.minPrice = this.minPrice;
      payload.maxPrice = this.maxPrice;
    }
    if (this.selectedSort) {
      payload.isLowToHigh = this.selectedSort === "highToLow";
    }
    const hotelName = (this.hotelName || "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (hotelName.replace(/\s/g, "").length >= 3) {
      payload.hotelName = hotelName;
    }
    payload.source = this.source;

    this.hotelService
      .hotelList(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const html = document.documentElement;
          const body = document.body;
          html.classList.remove("overflow-hidden");
          body.classList.remove("overflow-hidden");
          this.isSkeleton = false;
          this.storeFullData = res;
          // this.cityName=res?.data?.scope?.cityName||'';
          this.propertiesAll = res?.data?.properties || [];
          this.totalRecords =
            res?.data?.totalRecords ||
            res?.data?.total ||
            this.propertiesAll.length;

          this.currentPage = page;

          this.first = (page - 1) * this.rows;
          this.filtersData = res?.data?.filters || {};

          this.requestId = res?.data?.requestId;

          this.mainsource = res?.data?.source || "Mondee";
          this.generatePriceChartData(this.propertiesAll);
          // ======================
          // PRICE FILTER
          // ======================

          const priceFilter = this.filtersData?.priceFilter;

          if (priceFilter) {
            this.min = priceFilter?.minPrice || 0;

            this.max = priceFilter?.maxPrice || 0;

            const savedFilters = this.hotelFilterService.getFilterData();

            if (savedFilters?.rangeValues?.length === 2) {
              const savedMin = savedFilters.rangeValues[0];

              const savedMax = savedFilters.rangeValues[1];

              // adjust within latest backend range
              this.minValue = Math.max(this.min, savedMin);

              this.maxValue = Math.min(this.max, savedMax);

              // safety check
              if (this.minValue > this.maxValue) {
                this.minValue = this.min;
                this.maxValue = this.max;
              }
            } else {
              this.minValue = priceFilter?.selectedMinPrice || this.min;

              this.maxValue = priceFilter?.selectedMaxPrice || this.max;
            }

            this.minPrice = this.minValue;
            this.maxPrice = this.maxValue;
            this.averagePrice = priceFilter?.averagePrice || 0;
          }
          this.hotelName = "";
          this.applyFilters();
          setTimeout(() => {
            this.initHotelCarousel();
          }, 0);
          this.cdr.markForCheck();
        },

        error: (err) => {
          this.hotelName = "";
          this.isSkeleton = false;
          const html = document.documentElement;
          const body = document.body;
          html.classList.remove("overflow-hidden");
          body.classList.remove("overflow-hidden");
        },
      });
    // }
  }
  // ================================
  // PAGINATOR CHANGE
  // ================================

  onPageChange(event: any) {
    this.first = event.first;

    this.rows = event.rows;

    const page = event.page + 1;

    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    this.getHotelList(this.hotelSearchData, page);
  }
  // ================================
  // APPLY FILTERS
  // ================================

  applyFilters() {
    if (!this.isBrowser) return;

    this.properties = this.propertiesAll;
    this.generateInsertIndexes();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  generateInsertIndexes() {
    const minGap = 4;
    const total = this.properties.length;
    const indexes: number[] = [];

    let i = Math.floor(Math.random() * minGap); // random start (0 to 3)
    while (i < total) {
      indexes.push(i);
      i += minGap + Math.floor(Math.random() * (minGap + 2)); // min gap + random 0-1-2
    }

    this.randomInsertIndexes = indexes;
  }
  // ================================
  // PRICE RANGE
  // ================================

  get minPercent() {
    return ((this.minValue - this.min) / (this.max - this.min)) * 100;
  }

  get maxPercent() {
    return ((this.maxValue - this.min) / (this.max - this.min)) * 100;
  }

  onMinChange(value: number) {
    const newValue = Number(value);

    if (newValue >= this.maxValue) {
      return;
    }

    this.minValue = newValue;
    this.minPrice = newValue;

    this.debounceFilterApiCall();
  }

  onMaxChange(value: number) {
    const newValue = Number(value);

    if (newValue <= this.minValue) {
      return;
    }

    this.maxValue = newValue;
    this.maxPrice = newValue;

    this.debounceFilterApiCall();
  }

  // ================================
  // ACTIVE BAR
  // ================================

  // store exact hotel prices

  generatePriceChartData(properties: any[]) {
    if (!properties?.length) {
      this.data = [];
      return;
    }

    // all hotel prices
    const prices = properties
      .map((hotel: any) => Number(hotel?.fare?.total || 0))
      .filter((price: number) => price > 0);

    if (!prices.length) {
      this.data = [];
      return;
    }

    // sort ascending
    prices.sort((a, b) => a - b);

    // min / max
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // slider values
    this.min = minPrice;
    this.max = maxPrice;

    // directly use prices as graph data
    // convert each price into height %
    this.data = prices.map((price) => {
      return Math.round(((price - minPrice) / (maxPrice - minPrice)) * 100);
    });
  }

  // ================================
  // ACTIVE BAR
  // ================================

  isActiveBar(index: number): boolean {
    const totalBars = this.data.length;
    const bucketSize = (this.max - this.min) / totalBars;

    const barCenterPrice = this.min + bucketSize * index + bucketSize / 2;

    return barCenterPrice >= this.minValue && barCenterPrice <= this.maxValue;
  }

  // ================================
  // STAR RATING
  // ================================
  hotelName = "";
  private hotelSearchTimeout: any;

  onHotelNameChange(event: any): void {
    // Allow only letters, numbers and spaces
    let value = event.target.value
      .replace(/[^a-zA-Z0-9\s]/g, "") // Remove &, %, @, #, etc.
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trimStart(); // Prevent leading spaces

    this.hotelName = value;
    event.target.value = value;

    clearTimeout(this.hotelSearchTimeout);

    // Don't search until at least 3 characters (excluding spaces)
    if (value.replace(/\s/g, "").length < 3) {
      return;
    }
    this.debounceFilterApiCall();
  }
  toggleStarRating(rating: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedStarRatings.includes(rating)) {
        this.selectedStarRatings.push(rating);
      }
    } else {
      this.selectedStarRatings = this.selectedStarRatings.filter(
        (x) => x !== rating,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // GUEST RATING
  // ================================

  toggleGuestRating(rating: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedGuestRatings.includes(rating)) {
        this.selectedGuestRatings.push(rating);
      }
    } else {
      this.selectedGuestRatings = this.selectedGuestRatings.filter(
        (x) => x !== rating,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // MEAL PLAN
  // ================================

  toggleMealPlan(mealKey: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedMealPlans.includes(mealKey)) {
        this.selectedMealPlans.push(mealKey);
      }
    } else {
      this.selectedMealPlans = this.selectedMealPlans.filter(
        (x) => x !== mealKey,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // AMENITIES
  // ================================

  toggleAmenity(code: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedAmenities.includes(code)) {
        this.selectedAmenities.push(code);
      }
    } else {
      this.selectedAmenities = this.selectedAmenities.filter((x) => x !== code);
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // PROPERTY TYPE
  // ================================

  togglePropertyType(property: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedPropertyTypes.includes(property)) {
        this.selectedPropertyTypes.push(property);
      }
    } else {
      this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
        (x) => x !== property,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // LOCATION
  // ================================

  toggleLocation(location: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedLocations.includes(location)) {
        this.selectedLocations.push(location);
      }
    } else {
      this.selectedLocations = this.selectedLocations.filter(
        (x) => x !== location,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // LANDMARK
  // ================================

  toggleLandmark(landmark: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedLandmarks.includes(landmark)) {
        this.selectedLandmarks.push(landmark);
      }
    } else {
      this.selectedLandmarks = this.selectedLandmarks.filter(
        (x) => x !== landmark,
      );
    }

    this.debounceFilterApiCall();
  }

  // ================================
  // FILTER API CALL
  // ================================
  selectedSort: "lowToHigh" | "highToLow" | null = null;

  selectSort(type: "lowToHigh" | "highToLow") {
    this.selectedSortValue =
      type === "lowToHigh"
        ? "Price (Low to High)"
        : type === "highToLow"
          ? "Price (High to Low)"
          : "";

    this.selectedSort = type;
    this.isFilterOpenmobile = false;
    this.isFilterOpen = false;
    this.debounceFilterApiCall();
  }
  filterTimeout: any;

  debounceFilterApiCall() {
    clearTimeout(this.filterTimeout);

    this.filterTimeout = setTimeout(() => {
      this.saveFiltersToStorage();
      this.getHotelList(this.hotelSearchData, 1);
    }, 500);
  }

  // ================================
  // CLEAR FILTERS
  // ================================

  clearFilter() {
    this.selectedStarRatings = [];
    this.selectedGuestRatings = [];
    this.selectedMealPlans = [];
    this.selectedAmenities = [];
    this.selectedPropertyTypes = [];
    this.selectedLocations = [];
    this.selectedLandmarks = [];

    // reset price
    this.minValue = this.min;
    this.maxValue = this.max;

    this.minPrice = this.min;
    this.maxPrice = this.max;

    // CLEAR STORAGE
    this.hotelFilterService.resetFilters();

    this.getHotelList(this.hotelSearchData, 1);
  }

  // ================================
  // SHOW MORE DATA
  // ================================

  get visibleAmenities() {
    const data = this.filtersData?.amenities || [];

    return this.showAllAmenities ? data : data.slice(0, 10);
  }

  get visiblePropertyTypes() {
    const data = this.filtersData?.property || [];

    return this.showAllPropertyTypes ? data : data.slice(0, 10);
  }

  get visibleLocations() {
    const data = this.filtersData?.location || [];

    return this.showAllLocations ? data : data.slice(0, 10);
  }

  get visibleLandmarks() {
    const data = this.filtersData?.popularLandmark || [];

    return this.showAllLandmarks ? data : data.slice(0, 10);
  }

  // ================================
  // TRACKBY
  // ================================

  trackByName(index: number, item: any): string {
    return item?.name || index;
  }
  generateAmenities(properties: any[]): void {
    const amenityMap = new Map<string, number>();

    // Store alongside amenities
    const alongsideMap = new Map<string, Set<string>>();

    properties.forEach((hotel: any) => {
      const amenities = [...new Set(hotel?.fare?.amenities || [])];

      amenities.forEach((amenity: any) => {
        const normalizedAmenity = amenity.trim();

        // Hotel Count
        amenityMap.set(
          normalizedAmenity,
          (amenityMap.get(normalizedAmenity) || 0) + 1,
        );

        // Create set if not exists
        if (!alongsideMap.has(normalizedAmenity)) {
          alongsideMap.set(normalizedAmenity, new Set());
        }

        // Store alongside amenities
        amenities.forEach((otherAmenity: any) => {
          const normalizedOther = otherAmenity.trim();

          if (normalizedAmenity !== normalizedOther) {
            alongsideMap.get(normalizedAmenity)?.add(normalizedOther);
          }
        });
      });
    });

    // Find max alongside count
    const maxAlongside = Math.max(
      ...Array.from(alongsideMap.values()).map((set) => set.size),
    );

    // Final Array
    this.allAmenities = Array.from(amenityMap.entries())
      .map(([name, count]) => {
        const alongsideCount = alongsideMap.get(name)?.size || 0;

        return {
          name,

          // hotel count
          count,

          checked: false,

          // how many different amenities it appears with
          alongsideCount,

          // most connected/common amenity
          isPopular: alongsideCount === maxAlongside,
        };
      })
      .sort((a, b) => b.alongsideCount - a.alongsideCount);
  }
  navigateToDetails(hotel: any) {
    if (isPlatformBrowser(this.platformId)) {
      //  this.hotelService.sethotels(this.storeFullData);

      localStorage.setItem("hoteldata", JSON.stringify(hotel));

      if (this.packageTabActive) {
        this.flightService.setDetailsData(this.visibleSegments);
        this.router.navigate(["/package-hotel-details"], {
          queryParams: {
            hotelId: hotel?.id,
            requestId: this.requestId,
            rateId: hotel?.fare?.rateId,
            source: this.mainsource,
          },
        });
      } else {
        this.router.navigate(["/hotel-details"], {
          queryParams: {
            hotelId: hotel?.id,
            requestId: this.requestId,
            rateId: hotel?.fare?.rateId,
            source: this.mainsource,
          },
        });
      }
    }
  }

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  ///////
  // Helper method to get star rating as array
  getStarArray(rating: any): number[] {
    const totalStars = Number(rating) || 0;

    return Array(totalStars).fill(0);
  }

  // Get first image URL or use placeholder
  getHotelImage(images: any[]): string {
    if (images && images.length > 0) {
      return images[0].imageUrl;
    }
    return "assets/placeholder-hotel.jpg";
  }

  // Get all image URLs for the carousel
  getAllImages(images: any[]): string[] {
    if (images && images.length > 0) {
      return images.map((img) => img.imageUrl).slice(0, 12);
    }
    return ["assets/placeholder-hotel.jpg"];
  }

  formatPrice(price: string): string {
    return `$${Number(price).toFixed(2)}`;
  }
  hasOfferAmount(offers: any[]): boolean {
    if (!offers?.length) {
      return false;
    }

    return offers.some(
      (offer: any) => offer?.amount && Number(offer.amount) !== 0,
    );
  }
  getOriginalPrice(fare: any): any | null {
    const nights = Number(this.noOfNights || 1);

    // Total discount from all offers
    const totalDiscount =
      fare?.offers?.reduce((total: number, offer: any) => {
        let discount = Number(offer?.amount);

        if (isNaN(discount)) {
          discount = Number(offer?.discountAmount);
        }

        if (isNaN(discount)) {
          discount = Number(offer?.value);
        }

        if (isNaN(discount)) {
          discount = 0;
        }

        return total + Math.abs(discount);
      }, 0) || 0;

    const baseAmount = Number(fare?.base || 0);

    const taxAmount =
      fare?.taxes?.reduce(
        (total: number, tax: any) => total + Number(tax?.amount || 0),
        0,
      ) || 0;

    const ccMax = this.packageTabActive
      ? Number(this.visibleSegments?.Fares?.[0]?.CCMax || 0)
      : 0;

    const originalPrice = fare?.includesTaxes
      ? (baseAmount - totalDiscount) / nights + ccMax
      : (baseAmount + taxAmount - totalDiscount) / nights + ccMax;

    return `$${originalPrice.toFixed(2)}`;
  }
  getPricePerNight(fare: any): string {
    const baseAmount = Number(fare?.base || 0);

    const taxAmount =
      fare?.taxes?.reduce(
        (total: number, tax: any) => total + Number(tax?.amount || 0),
        0,
      ) || 0;

    const nights = Number(this.noOfNights || 1);
    const ccMax = this.packageTabActive
      ? Number(this.visibleSegments?.Fares?.[0]?.CCMax || 0)
      : 0;

    const price = fare?.includesTaxes
      ? baseAmount / nights + ccMax
      : (baseAmount + taxAmount) / nights + ccMax;

    return price.toFixed(2);
  }

  // Check if breakfast is included
  getBreakfastText(mealsIncluded: string): string {
    if (mealsIncluded === "breakfast") {
      return "Breakfast Included";
    }
    return "";
  }

  // Get cancellation policy text
  getCancellationText(fare: any): string {
    if (fare.refundable) {
      // if (fare.cancellationFreeBefore) {
      //   const cancelDate = new Date(fare.cancellationFreeBefore);
      //   return `Free cancellation until ${cancelDate.toLocaleDateString()}`;
      // }
      return "Free Cancellation";
    }
    return "Non-refundable";
  }

  getAmenityIcon(amenity: string): string {
    const iconMap: { keywords: string[]; icon: string }[] = [
      // Internet & Tech
      { keywords: ["wifi", "internet"], icon: "fa-solid fa-wifi" },
      { keywords: ["tv", "television"], icon: "fa-solid fa-tv" },
      { keywords: ["phone"], icon: "fa-solid fa-phone" },
      { keywords: ["computer"], icon: "fa-solid fa-computer" },

      // Food & Drink
      { keywords: ["restaurant", "dining"], icon: "fa-solid fa-utensils" },
      { keywords: ["breakfast"], icon: "fa-solid fa-mug-hot" },
      { keywords: ["bar", "cocktail"], icon: "fa-solid fa-martini-glass" },
      { keywords: ["coffee"], icon: "fa-solid fa-mug-saucer" },
      { keywords: ["kitchen"], icon: "fa-solid fa-kitchen-set" },

      // Hotel Facilities
      { keywords: ["parking", "car park"], icon: "fa-solid fa-square-parking" },
      { keywords: ["pool", "swimming"], icon: "fa-solid fa-person-swimming" },
      { keywords: ["gym", "fitness"], icon: "fa-solid fa-dumbbell" },
      { keywords: ["spa"], icon: "fa-solid fa-spa" },
      { keywords: ["laundry"], icon: "fa-solid fa-shirt" },
      { keywords: ["elevator", "lift"], icon: "fa-solid fa-elevator" },
      { keywords: ["garden"], icon: "fa-solid fa-tree" },
      { keywords: ["terrace"], icon: "fa-solid fa-building" },
      { keywords: ["balcony"], icon: "fa-solid fa-building-user" },
      {
        keywords: ["wheelchair", "accessible", "Wheelchair-accessible"],
        icon: "fa-solid fa-wheelchair",
      },

      // Room Features
      { keywords: ["air conditioning", "ac"], icon: "fa-solid fa-snowflake" },
      { keywords: ["heating"], icon: "fa-solid fa-fire" },
      { keywords: ["safe"], icon: "fa-solid fa-vault" },
      { keywords: ["bathroom"], icon: "fa-solid fa-bath" },
      { keywords: ["shower"], icon: "fa-solid fa-shower" },
      { keywords: ["hairdryer"], icon: "fa-solid fa-wind" },
      { keywords: ["minibar"], icon: "fa-solid fa-bottle-water" },
      { keywords: ["fridge", "refrigerator"], icon: "fa-solid fa-box-open" },
      { keywords: ["bed"], icon: "fa-solid fa-bed" },

      // Accessibility

      // Transport
      { keywords: ["airport"], icon: "fa-solid fa-plane" },
      { keywords: ["taxi"], icon: "fa-solid fa-taxi" },
      { keywords: ["shuttle"], icon: "fa-solid fa-bus" },

      // Pets
      { keywords: ["pet", "dog", "cat"], icon: "fa-solid fa-paw" },

      // Safety
      { keywords: ["security"], icon: "fa-solid fa-shield-halved" },
      { keywords: ["smoke detector"], icon: "fa-solid fa-fire-extinguisher" },
      { keywords: ["cctv"], icon: "fa-solid fa-video" },

      // Outdoor
      { keywords: ["beach"], icon: "fa-solid fa-umbrella-beach" },
      { keywords: ["mountain"], icon: "fa-solid fa-mountain" },

      // Business
      { keywords: ["meeting", "conference"], icon: "fa-solid fa-people-group" },
      { keywords: ["business"], icon: "fa-solid fa-briefcase" },

      // Family
      { keywords: ["family"], icon: "fa-solid fa-people-roof" },
      { keywords: ["kids", "children"], icon: "fa-solid fa-child" },

      // Smoking
      { keywords: ["smoking"], icon: "fa-solid fa-smoking" },
      { keywords: ["non-smoking"], icon: "fa-solid fa-ban-smoking" },
      {
        keywords: ["wifi", "wi-fi", "wi fi", "wireless", "internet"],
        icon: "fa-solid fa-wifi",
      },

      {
        keywords: ["late checkout", "late check-out"],
        icon: "fa-solid fa-clock",
      },

      {
        keywords: ["early checkout", "early check-out"],
        icon: "fa-solid fa-hourglass-start",
      }, // Accessibility & Services
      {
        keywords: ["concierge"],
        icon: "fa-solid fa-concierge-bell",
      },
      {
        keywords: ["luggage"],
        icon: "fa-solid fa-suitcase-rolling",
      },
      {
        keywords: ["multilingual"],
        icon: "fa-solid fa-language",
      },
      {
        keywords: ["launderette"],
        icon: "fa-solid fa-soap",
      },
      {
        keywords: ["clothes dryer"],
        icon: "fa-solid fa-shirt",
      },

      // Outdoor & Relaxation
      {
        keywords: ["sun terrace"],
        icon: "fa-solid fa-sun",
      },
      {
        keywords: ["sun loungers"],
        icon: "fa-solid fa-chair",
      },
      {
        keywords: ["outdoor freshwater pool"],
        icon: "fa-solid fa-water-ladder",
      },

      // Hotel Features
      {
        keywords: ["air conditioning in public areas"],
        icon: "fa-solid fa-snowflake",
      },
      {
        keywords: ["smoke detector"],
        icon: "fa-solid fa-fire-extinguisher",
      },
      {
        keywords: ["hotel safe"],
        icon: "fa-solid fa-vault",
      },
      {
        keywords: ["lift access"],
        icon: "fa-solid fa-elevator",
      },
      {
        keywords: ["24-hour reception"],
        icon: "fa-solid fa-headset",
      },
      {
        keywords: ["car park"],
        icon: "fa-solid fa-square-parking",
      },
      {
        keywords: ["fitness"],
        icon: "fa-solid fa-dumbbell",
      },

      {
        keywords: [
          "24-hour reception",
          "24 hour reception",
          "24-hour front desk",
          "24 hour front desk",
          "reception",
          "front desk",
        ],
        icon: "fa-solid fa-headset",
      },
      {
        keywords: ["room service"],
        icon: "fa-solid fa-concierge-bell",
      },
    ];

    const lowerAmenity = (amenity || "").toLowerCase().trim();

    const matched = iconMap.find((item) =>
      item.keywords.some((keyword) => lowerAmenity.includes(keyword)),
    );

    return matched?.icon || "fa-solid fa-circle-check";
  }

  // ================================
  // APPLIED FILTER COUNT
  // ================================

  get appliedFilterCount(): number {
    let count = 0;

    count += this.selectedStarRatings.length;
    count += this.selectedGuestRatings.length;
    count += this.selectedMealPlans.length;
    count += this.selectedAmenities.length;
    count += this.selectedPropertyTypes.length;
    count += this.selectedLocations.length;
    count += this.selectedLandmarks.length;

    // price filter count
    if (this.minValue !== this.min || this.maxValue !== this.max) {
      count += 1;
    }

    return count;
  }

  // ================================
  // FILTER CHIPS
  // ================================

  get filterChips() {
    const chips: any[] = [];

    // Star Ratings
    this.selectedStarRatings.forEach((rating) => {
      const matched = this.filtersData?.starRating?.find(
        (item: any) => item.rating == rating || item.name == rating,
      );

      chips.push({
        type: "star",
        value: rating,
        label: matched ? `${matched.name} Star` : `${rating} Star`,
      });
    });

    // Guest Ratings
    this.selectedGuestRatings.forEach((rating) => {
      const matched = this.filtersData?.guestRating?.find(
        (item: any) => item.rating == rating || item.name == rating,
      );

      chips.push({
        type: "guest",
        value: rating,
        label: matched
          ? `${matched.name}+ Exceptional`
          : `${rating}+ Exceptional`,
      });
    });

    // Meal Plans
    this.selectedMealPlans.forEach((meal) => {
      const matched = this.filtersData?.mealPlan?.find(
        (item: any) => item.key == meal || item.name == meal,
      );

      chips.push({
        type: "meal",
        value: meal,
        label: matched?.name || meal,
      });
    });

    // Amenities
    this.selectedAmenities.forEach((item) => {
      const matched = this.filtersData?.amenities?.find(
        (amenity: any) => amenity.code == item || amenity.name == item,
      );

      chips.push({
        type: "amenity",
        value: item,
        label: matched?.name || item,
      });
    });

    // Property Types
    this.selectedPropertyTypes.forEach((item) => {
      const matched = this.filtersData?.property?.find(
        (property: any) => property.name == item,
      );

      chips.push({
        type: "property",
        value: item,
        label: matched?.name || item,
      });
    });

    // Locations
    this.selectedLocations.forEach((item) => {
      const matched = this.filtersData?.location?.find(
        (location: any) => location.name == item,
      );

      chips.push({
        type: "location",
        value: item,
        label: matched?.name || item,
      });
    });

    // Landmarks
    this.selectedLandmarks.forEach((item) => {
      const matched = this.filtersData?.popularLandmark?.find(
        (landmark: any) => landmark.name == item,
      );

      chips.push({
        type: "landmark",
        value: item,
        label: matched?.name || item,
      });
    });

    // Price
    if (this.minValue !== this.min || this.maxValue !== this.max) {
      chips.push({
        type: "price",
        value: "price",
        label: `$${this.minValue} - $${this.maxValue}`,
      });
    }

    return chips;
  }

  // ================================
  // REMOVE CHIP
  // ================================

  removeFilterChip(chip: any) {
    switch (chip.type) {
      case "star":
        this.selectedStarRatings = this.selectedStarRatings.filter(
          (x) => x !== chip.value,
        );
        break;

      case "guest":
        this.selectedGuestRatings = this.selectedGuestRatings.filter(
          (x) => x !== chip.value,
        );
        break;

      case "meal":
        this.selectedMealPlans = this.selectedMealPlans.filter(
          (x) => x !== chip.value,
        );
        break;

      case "amenity":
        this.selectedAmenities = this.selectedAmenities.filter(
          (x) => x !== chip.value,
        );
        break;

      case "property":
        this.selectedPropertyTypes = this.selectedPropertyTypes.filter(
          (x) => x !== chip.value,
        );
        break;

      case "location":
        this.selectedLocations = this.selectedLocations.filter(
          (x) => x !== chip.value,
        );
        break;

      case "landmark":
        this.selectedLandmarks = this.selectedLandmarks.filter(
          (x) => x !== chip.value,
        );
        break;

      case "price":
        this.minValue = this.min;
        this.maxValue = this.max;

        this.minPrice = this.min;
        this.maxPrice = this.max;
        break;
    }

    this.getHotelList(this.hotelSearchData, 1);
  }

  // ================================
  // SAVE FILTERS
  // ================================

  saveFiltersToStorage() {
    const filters: HotelFilters = {
      amenities: this.selectedAmenities,

      rangeValues: [this.minValue, this.maxValue],

      starRating: this.selectedStarRatings,

      guestRating: this.selectedGuestRatings,

      meal: this.selectedMealPlans,

      property: this.selectedPropertyTypes,

      location: this.selectedLocations,

      landmark: this.selectedLandmarks,
    };

    this.hotelFilterService.setFilters(filters);
  }

  // ================================
  // LOAD FILTERS
  // ================================

  loadSavedFilters() {
    const saved = this.hotelFilterService.getFilterData();

    if (!saved) return;

    this.selectedAmenities = saved.amenities || [];

    this.selectedStarRatings = saved.starRating || [];

    this.selectedGuestRatings = saved.guestRating || [];

    this.selectedMealPlans = saved.meal || [];

    this.selectedPropertyTypes = saved.property || [];

    this.selectedLocations = saved.location || [];

    this.selectedLandmarks = saved.landmark || [];

    // Price
    if (saved.rangeValues && saved.rangeValues.length === 2) {
      this.minValue = saved.rangeValues[0];

      this.maxValue = saved.rangeValues[1];

      this.minPrice = saved.rangeValues[0];

      this.maxPrice = saved.rangeValues[1];
    }
  }
  closeFilterDropdown() {
    this.isFilterOpen = false;
  }
  closeFilterDropdownmobile() {
    this.isFilterOpenmobile = false;
  }

  ngAfterViewInit(): void {
    this.initHotelCarousel();
    
    
  }

  private initHotelCarousel(): void {
    setTimeout(() => {
      const carousel = $(".hotel-carousel-unique");
      if (!carousel.length) return;

      if (carousel.hasClass("owl-loaded")) {
        carousel.trigger("destroy.owl.carousel");
      }

      carousel.owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        nav: true,
        autoplay: false,
        margin: 0,
        smartSpeed: 600,
        navText: [
          '<span class="room-nav-btn prev">&#10094;</span>',
          '<span class="room-nav-btn next">&#10095;</span>',
        ],
      });
    }, 0);
  }
  ngOnDestroy(): void {
    const carousel = $(".hotel-carousel-unique");
    if (carousel.length && carousel.hasClass("owl-loaded")) {
      carousel.trigger("destroy.owl.carousel");
    }
  }

  sbOpen = false;

  sbSelectedText = "";

  selectedSortValue = "Price (Low to High)";

  toggleSortDropdown(event: Event): void {
    event.stopPropagation();

    this.sbOpen = !this.sbOpen;
  }

  // ================================
  // FLIGHT POPOVER
  // ================================

  flightPopoverOpen: number | null = null;

  toggleFlightPopover(event: MouseEvent, index: number): void {
    event.stopPropagation();

    if (this.flightPopoverOpen === index) {
      // Close currently open popover
      this.flightPopoverOpen = null;
    } else {
      // Open clicked flight
      this.flightPopoverOpen = index;
    }
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest(".flight-popover-wrap")) {
      this.flightPopoverOpen = null;
    }
  }

  removeBackdrop(){
      if (!isPlatformBrowser(this.platformId)) return;
     
    const html = document.documentElement;
    const body = document.body;

    
      html.classList.remove("modal-backdrop-hide");
      body.classList.remove("modal-backdrop-hide");
    
  }
}
