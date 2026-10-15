import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  TemplateRef,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { SvgIcons } from '../../shared/svg-icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { SliderModule } from 'primeng/slider';
import { FlightService } from '../../services/flight/flight.service';
import { TosterService } from '../../services/common/toaster.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import {
  FlightFilters,
  FlightFilterService,
} from '../../services/flight/flight-filter.service';
import { combineLatest, debounceTime, distinctUntilChanged, filter, Subscription } from 'rxjs';
import { SharedService } from '../../services/shared/shared.service';
import { FlightsTabComponent } from '../../components/main-filter/flights-tab/flights-tab.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FlightFilterModalComponent } from '../../pages/flights-list/flight-filter-modal/flight-filter-modal.component';
import { TooltipModule } from 'primeng/tooltip';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';
import { FlightListSkeletonComponent } from '../../pages/flights-list/skeleton/flight-list-skeleton/flight-list-skeleton.component';
import { DeviceService } from '../../services/shared/device.service';
import { DurationToHoursPipe } from '../../pipes/duration-to-hours.pipe';
import { environment } from '../../../environments/environment';
import { SpinnerService } from '../../services/common/spinner.service';
import { HotelService } from '../../services/hotel/hotel.service';
import { PackagesTabComponent } from '../../components/main-filter/packages-tab/packages-tab.component';
import { Skeleton } from 'primeng/skeleton';

Swiper.use([Navigation]);

@Component({
  selector: "app-flights-list",
  imports: [
    NgFor,
    NgIf,
    DrawerModule,
    SliderModule,
    AutoCompleteModule,
    CommonModule,
    FlightsTabComponent,
    DialogModule,
    ButtonModule,
    FlightFilterModalComponent,
    TooltipModule,
    ClickOutsideDirective,
    TruncateWordsPipe,
    FlightListSkeletonComponent,
    RouterLink,
    DurationToHoursPipe,
    FormsModule,
    PackagesTabComponent,
    Skeleton
  ],
  templateUrl: "./flights-list.component.html",
  styleUrl: "./flights-list.component.scss",
})
export class FlightsListComponent implements OnInit, AfterViewInit {
  @ViewChild("swiperContainer", { static: false }) swiperContainer!: ElementRef;
  @ViewChild("tableWrapper") tableWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild("drawerRef") drawerRef!: Drawer;

  @ViewChild("tooltipRightContent", { static: true }) tooltipRightContent!:
    | TemplateRef<any>
    | undefined;
  @ViewChild("tooltipMultipleContent", { static: true })
  tooltipMultipleContent!: TemplateRef<any> | undefined;
  @ViewChild("tooltipMiddleContent", { static: true }) tooltipMiddleContent!:
    | TemplateRef<any>
    | undefined;
  @ViewChild("tooltipLeftContent", { static: true }) tooltipLeftContent!:
    | TemplateRef<any>
    | undefined;
  @ViewChildren('dropdownPanel') dropdownPanels!: QueryList<ElementRef>;

  isMobile: boolean = false;
  private destroyRef: DestroyRef = inject(DestroyRef);
  submitted: boolean = false;
  private searchService: SearchService = inject(SearchService);
  protected icons: SvgIcons = inject(SvgIcons);
  private router: Router = inject(Router);
  fullStopWiseLowestFare: Record<string, number> = {};
  selectedTab: string = "cheapest";
  scrollAmount: number = 150;
  isScrollLeftDisabled: boolean = true;
  isScrollRightDisabled: boolean = false;
  showDetailsMap: { [key: string]: boolean } = {};
  lowestPrice: number = 0;
  highestPrice: number = 100000;
  sliderValue: number[] = [0, 100000];
  visible: boolean = false;
  inputValue: string = "";
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;
  isRotated: boolean = false; // Track rotation state for switch airports icon
  visibleSegments: any[] = [];
  allSegments: any[] = [];
  loading = false;
  spinloading = false;
  spinloader = false;
  isStaging: boolean = environment.isStaging;
  loadBatch = 10;
  selectedAdults: number = 1;
  selectedChildren: number = 0;
  selectedInfants_lap: number = 0;
  selectedInfants_seat: number = 0;
  selectedFare: {
    price: number;
    stopType: number;
    carrierName: string;
  } | null = null;

  selectedCabin = { name: "Economy", value: "E" };
  selectCabinForClasscheck = "";
  filters!: FlightFilters;
  private SpinnerService: SpinnerService = inject(SpinnerService);
  isnewData: boolean = false;
  private filterSub!: Subscription;
    private hotelService: HotelService = inject(HotelService);
    roomDetails: any;
    rateDetails: any;
    hotelDetails: any;
  getData: any = "";
  stopOptions = [
    { value: 0, key: "stopes_0", label: "Non Stop" },
    { value: 1, key: "stopes_1", label: "1 stop" },
    { value: 2, key: "stopes_more", label: "1+ stops" },
  ];
  classMap: { [key: string]: string } = {
    E: "Economy",
    Econom: "Economy",
    F: "First",
    B: "Business",
    P: "Premium Economy",
    PE: "Premium Economy",
  };
  cabinOptions = [
    { name: "Economy", value: "E" },
    { name: "First", value: "F" },
    { name: "Business", value: "B" },
    { name: "Premium Economy", value: "PE" },
    { name: "Premium Economy", value: "P" },
  ];

  dates = [
    { date: "May 9", fare: 13676.45 },
    { date: "May 10", fare: 13676.45 },
    { date: "May 11", fare: 13676.45 },
    { date: "May 12", fare: 13676.45 },
    { date: "May 13", fare: 13676.45 },
    { date: "May 14", fare: 13676.45 },
    { date: "May 15", fare: 13676.45 },
    { date: "Calendar", fare: 13676.45 },
  ];

  visibleAirlineCount = 5;
  visibleConnectingAirlineCount = 5;
  getFlightsAdvanced: any = "";
  getFlightAllDetails: any[] = [];
  getMainDetails: any = [];
  getNearbyDetails: any[] = [];
  getNearbyfare: any[] = [];
  randomInsertIndexes: number[] = [];
  adultsList = Array.from({ length: 9 }, (_, i) => i + 1);
  childrenList = Array.from({ length: 8 }, (_, i) => i + 1);
  infantsList = Array.from({ length: 5 }, (_, i) => i);
  departureAirports: any[] = [];
  getAllCarrierWiseFares: any[] = [];
  imageUrl: string = environment.imageUrl;
  swiper!: Swiper;
  showAllAirlines = false;
  showAllConnectingAirlines = false;
  showArrivalTimeFilters: boolean = false;
  showReturnArrivalTimeFilters: boolean = false;
  showMore: boolean = false;

  currentTooltipSegment: any = null;
  currentLayover: any = null;
  layoverList: any[] = [];
  currentTooltipClass: string = "single-tool-tip";
  currentTooltipIndex: any;
  currenttooltip: any;
  tooltipRefreshKey = 0;
  totaltool: number = 0;
  activeTrollyIndex: number | null = null;
  activeLuggageIndex: number | null = null;
  luggagePanelPosition: 'top' | 'bottom' = 'bottom';
  trollyPanelPosition: 'top' | 'bottom' = 'bottom';
  luggagePanelReady = false;
  trollyPanelReady = false;
  private panelResizeObserver: ResizeObserver | null = null;
  // Initial state: mobile box visible
  isMobileSearchVisible = true;
  isdialogopen = false;
  // Edit button: hide mobile box
  isDropdownOpen = false;
  isfilterDialogOpen = false;
  activeFilters: FlightFilters = {
    airlines: [],
    stopes: [],
    rangeValues: [0, 1000000],
    departureTime: [],
    arrivalTime: [],
    returnDepartureTime: [],
    returnArrivalTime: [],
    connectingAirports: [],
    getNearbyfaredepart: [],
    getNearbyfarereturn: [],
    durations: {},
    sortBy: "",
    severalFlights: true,
    carryOnBaggage: false,

  };
  filtersForModal: FlightFilters | null = null;
  allAirlines: any[] = [];
  isBrowser = false;
  storeFullData: any = "";
  recommendedPrice: number = 0;
  cheapestPrice: number = 0;
  nearestPrice: number = 0;
  allFlights: any[] = [];
  displayedFlights: any[] = [];
  searchData: any = "";
  isSkeleton: boolean = false;
  getrangeValues: any = [0, 1000000];
  getarrivalDurations: number = 0;
  getdepartureDurations: number = 0;
  baggageAllowance: any = [];
  flightBaggage: any = {};
  departRoutes: any[] = [];
  selectedRouteIndex: number = 0;
  selectedRoute: any;
  returnRoutes: any[] = [];
  allRoutes: any[] = []; // <-- declare allRoutes
  departureDurationChanged = false;
  arrivalDurationChanged = false;
  private deviceService = inject(DeviceService);
  showDirect = false;
  showOneStop = false;
  showMoreStops = false;
  diparture: string = "";
  arrival: string = "";
  dipartureDate: string = "";
  arrivalDate: string = "";
  totalPassenger: number = 0;
  tripType: string = "";
  cabinName: string = "";
  finalLayoverFlights: any = [];
  filtersSummaryText: any = "";
  filterChips: any = "";
  private originCountry: string = "";
  showTooltip: boolean[] = [];
  staticdata: any = '';
  defaultDurations: { [key: string]: number } = {};
  searchServiceData: any = [];
    packageTabActive = false;
     noOfNights: number = 0;
    adultCount: number = 0;
    childCount: number = 0;
    room: number = 0;
    packageFlightDetails:any='';
  markup: number = 10;
  searchHotelData:any='';
  currentYear: number = new Date().getFullYear();
  constructor(
    private flightService: FlightService,
    private toasterService: TosterService,
    private filterService: FlightFilterService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;

    });
     const url = this.router.url;

  this.packageTabActive = url.includes('package');
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.swiper = new Swiper(".priceMonthCardSlider", {
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: ".price-slider-arrow-next",
        prevEl: ".price-slider-arrow-prev",
      },
      loop: false,
      breakpoints: {
        640: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 7,
        },
      },
    });
    setTimeout(() => {
      const active = document.querySelector('.flight-options--button.active')?.parentElement as HTMLElement;
      if (active) {
        this.onTabClick(this.selectedTab, 0, active);
      }

      // Initialize the additional vanilla-JS UI only after the view exists.
      this.initDfSlider();
      this.initSbSelect();
    });
  }

  formatToAPIDate(dateString: string): string {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  isAndroid = false;
  isfirstload = true;
  departureCity:string="";
   hotelSearchData: any;

  totalGuests: any = "";

  totalRooms: number = 0;
  ngOnInit() {
    if (!this.isBrowser) return;
    window.addEventListener("scroll", this.onScroll.bind(this));

    // ✅ Static data
    this.getData = this.sharedService.getcompanyName();
    this.defaultDurations = {};
    this.getMainDetails = [];
    this.isSkeleton = true;
    this.isfirstload = true;
    this.visibleSegments = [];
    this.filterService.resetFilters();
    this.resetFilters();

    //       const cached = this.flightService.getFlights();

    //     // const cached = this.staticdata;
    //     if (cached?.success){
    //       this.isSkeleton=true;
    //        this.isfirstload=true;

    //     }else{
    // this.isSkeleton=true;
    //  this.isfirstload=true;
    //     }
    // ✅ Filters subscription (SAFE)
    if(this.packageTabActive){
         this.packageFlightDetails = this.flightService.getDetailsData();
         console.log("this.packageFlightDetails",this.packageFlightDetails)
          this.hotelService.selectedRoom$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                console.log('booking room details', data);
                this.roomDetails = data?.selectedRoom;
                this.rateDetails = data?.selectedRate;
                this.hotelDetails = data?.hotelDetails;
            });
                   this.searchService.hotelSearchData$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
               

                this.searchHotelData = data;
               
                const checkIn = new Date(data?.checkIn);
                const checkOut = new Date(data?.checkOut);
                const diffTime =
                    checkOut.getTime() - checkIn.getTime();

                this.noOfNights = Math.ceil(
                    diffTime / (1000 * 60 * 60 * 24)
                );


                this.room = data?.rooms?.length || 0;

                this.adultCount = data?.rooms?.reduce(
                    (total: number, room: any) =>
                        total + (room?.adults || 0),
                    0
                );

                this.childCount = data?.rooms?.reduce(
                    (total: number, room: any) =>
                        total + (room?.childAges?.length || 0),
                    0
                );
                // this.hotelForm.patchValue(data);
            });
    }

    this.filterService.filters$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((f: FlightFilters) => {
        this.filters = f;
        this.activeFilters = f;

        this.filtersSummaryText = this.generateFilterSummary(f, {
          lowestPrice: this.lowestPrice,
          highestPrice: this.highestPrice,
          defaultDurations: this.defaultDurations,
        });
      });

    // ✅ MAIN FIX: combineLatest instead of nested subscribe
    combineLatest([
      this.route.queryParams,
      this.searchService.searchData$
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),

        // 1. Ensure both values exist
        filter(([routeData, searchData]) => {
          return Object.keys(routeData || {}).length > 0 && !!searchData;
        }),

        // 2. CRITICAL: Wait for BOTH queryParams & searchData$ to finish updating before firing!
        debounceTime(0),

        // 3. Prevent duplicate calls with same payload
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(([routeData, searchData]: any) => {


        this.onMaskClick();

        // Assign route data
        this.tripType = routeData.tripType || "oneway";
        this.originCountry = routeData.OC || "United States";
        this.departureCity = routeData?.departureCity || '';
        this.selectedAdults = Number(routeData?.NoOfAdults) ?? 1;
        this.selectedChildren = Number(routeData?.NoOfChildren) ?? 0;
        this.selectedInfants_lap = Number(routeData?.NoOfInfants) ?? 0;

        this.selectedCabin = routeData?.CabinClass || {
          name: "Economy",
          value: "E",
        };
        this.selectCabinForClasscheck = routeData?.CabinClass || '';

        // Store raw search data
        this.searchServiceData = searchData;

        const originDest = searchData?.originDestination || [];

        // ✅ SAFELY SYNC TRIP TYPE & PAYLOAD
        if (this.tripType === "oneway") {
          // Force single-segment parsing even if searchData has leftover segments
          this.diparture = originDest[0]?.DepartureLocationCode;
          this.arrival = originDest[0]?.ArrivalLocationCode;
          this.dipartureDate = this.formatToAPIDate(originDest[0]?.DepartureTime);

          // CRITICAL: Explicitly wipe arrivalDate so API doesn't treat it as Round-Trip
          this.arrivalDate = "";

          // Clean searchServiceData for API call
          this.searchServiceData = {
            ...searchData,
            originDestination: [originDest[0]] // Keep only 1 segment
          };
        }
        else if (this.tripType === "roundtrip") {
          this.diparture = originDest[0]?.DepartureLocationCode;
          this.arrival = originDest[0]?.ArrivalLocationCode;
          this.dipartureDate = this.formatToAPIDate(originDest[0]?.DepartureTime);
          this.arrivalDate = this.formatToAPIDate(originDest[1]?.DepartureTime);
        }
        else if (this.tripType === "multicity") {
          const lastIndex = originDest.length - 1;
          this.diparture = originDest[0]?.DepartureLocationCode;
          this.dipartureDate = this.formatToAPIDate(originDest[0]?.DepartureTime);
          this.arrival = originDest[lastIndex]?.ArrivalLocationCode;
          this.arrivalDate = this.formatToAPIDate(originDest[lastIndex]?.DepartureTime);
        }

        // ✅ API CALL (RUNS ONCE)
        this.getFlights(routeData, this.searchServiceData);

        // UI update
        this.updateInput();
      });

    // ✅ Clear old data (once)
    this.flightService.clearTravelData();
    this.flightService.clearseatData();
    this.flightService.clearFareFamilyData();
    this.flightService.clearFullFareFamilyData();

    // ✅ Device check
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }
  }

  updateInput() {

    const total =
      this.selectedAdults +
      this.selectedChildren +
      this.selectedInfants_lap +
      this.selectedInfants_seat;
    const selectedCabin = this.selectedCabin;
    // Find the cabin name from the cabinOptions
    const cabinName =
      this.cabinOptions.find((option: any) => option.value === selectedCabin)
        ?.name || "";

    this.inputValue = `${total} Traveler${total !== 1 ? "s" : ""} `;
    this.totalPassenger = total;
    this.cabinName = cabinName;
  }

  getFlights(routedata: any, payload: any) {
    this.isnewData = true;
    this.getMainDetails = [];
    this.filters.durations = {};
    this.getNearbyDetails = [];

    this.finalLayoverFlights = [];
    this.visibleSegments = [];
    this.filters.airlines = [];
    this.filterService.resetFilters();
    this.resetFilters();
    const cached = this.flightService.getFlights();
    // const cached = this.staticdata;
    if (cached) {

      this.isSkeleton = false;
      this.isfirstload = false;
      const res = cached;
      this.storeFullData = res;
      this.searchData = {
        CurrencyCode: res.data.SearchParams.CurrencyCode,
        NoOfAdults: Number(res.data.SearchParams.NoOfAdults),
        NoOfChildren: Number(res.data.SearchParams.NoOfChildren),
        NoOfInfants: Number(res.data.SearchParams.NoOfInfants),
        // NoOfInfantSeat: Number(res.data.SearchParams.NoOfInfantSeat),
        tripType: res.data.SearchParams.tripType,
        source: res.data.SearchParams.source,
        returnDate: res.data.SearchParams.returnDate,
        OriginDestination: [
          {
            DepartureLocationCode: {
              code: res.data.SearchParams.DepartureDetails.airport_code,
              airport_name: res.data.SearchParams.DepartureDetails.airport_name,
              city: res.data.SearchParams.DepartureDetails.city,
              country: res.data.SearchParams.DepartureDetails.country,
              displayName: `${res.data.SearchParams.DepartureDetails.city ||
                res.data.SearchParams.DepartureDetails.state
                } (${res.data.SearchParams.DepartureDetails.airport_code}) ${res.data.SearchParams.DepartureDetails.airport_name
                }`,
              address: res.data.SearchParams.DepartureDetails.address,
              latitude: res.data.SearchParams.DepartureDetails.latitude,
              longitude: res.data.SearchParams.DepartureDetails.longitude,
              type: "main",
            },
            ArrivalLocationCode: {
              code: res.data.SearchParams.ArrivalDetails.airport_code,
              airport_name: res.data.SearchParams.ArrivalDetails.airport_name,
              city: res.data.SearchParams.ArrivalDetails.city,
              country: res.data.SearchParams.ArrivalDetails.country,
              displayName: `${res.data.SearchParams.ArrivalDetails.city ||
                res.data.SearchParams.ArrivalDetails.state
                } (${res.data.SearchParams.ArrivalDetails.airport_code}) ${res.data.SearchParams.ArrivalDetails.airport_name
                }`,
              address: res.data.SearchParams.ArrivalDetails.address,
              latitude: res.data.SearchParams.ArrivalDetails.latitude,
              longitude: res.data.SearchParams.ArrivalDetails.longitude,
              type: "main",
            },
            DepartureTime: res.data.SearchParams.DepartureTime,
            CabinClass: res.data.SearchParams.CabinClass,
          },
          {
            DepartureLocationCode: {
              code: res.data.SearchParams.ArrivalDetails.airport_code,
              airport_name: res.data.SearchParams.ArrivalDetails.airport_name,
              city: res.data.SearchParams.ArrivalDetails.city,
              country: res.data.SearchParams.ArrivalDetails.country,
              displayName: `${res.data.SearchParams.ArrivalDetails.city ||
                res.data.SearchParams.ArrivalDetails.state
                } (${res.data.SearchParams.ArrivalDetails.airport_code}) ${res.data.SearchParams.ArrivalDetails.airport_name
                }`,
              address: res.data.SearchParams.ArrivalDetails.address,
              latitude: res.data.SearchParams.ArrivalDetails.latitude,
              longitude: res.data.SearchParams.ArrivalDetails.longitude,
              type: "main",
            },
            ArrivalLocationCode: {
              code: res.data.SearchParams.DepartureDetails.airport_code,
              airport_name: res.data.SearchParams.DepartureDetails.airport_name,
              city: res.data.SearchParams.DepartureDetails.city,
              country: res.data.SearchParams.DepartureDetails.country,
              displayName: `${res.data.SearchParams.DepartureDetails.city ||
                res.data.SearchParams.DepartureDetails.state
                } (${res.data.SearchParams.DepartureDetails.airport_code}) ${res.data.SearchParams.DepartureDetails.airport_name
                }`,
              address: res.data.SearchParams.DepartureDetails.address,
              latitude: res.data.SearchParams.DepartureDetails.latitude,
              longitude: res.data.SearchParams.DepartureDetails.longitude,
              type: "main",
            },
            DepartureTime: res.data.SearchParams.returnDate,
            CabinClass: res.data.SearchParams.CabinClass,
          },
        ],
      };
      // this.searchService.setSearchData(this.searchData);
      
const flightItineraries = Array.isArray(res?.data?.FlightItinerary)
  ? res.data.FlightItinerary
  : [];

const filteredItineraries = flightItineraries.length <= 1
  ? flightItineraries
  : flightItineraries.filter(
      (itinerary: any) => Number(itinerary?.noOfSeats) > 0
    );
      // const filteredItineraries = res.data.FlightItinerary;
      this.getMainDetails = filteredItineraries || [];
      this.fullStopWiseLowestFare = this.calculateStopWiseLowestFare(
        this.getMainDetails || []
      );

  const nearbyItineraries = res?.data?.NearbyFlightItinerary || [];

const filteredItinerariesNearby =
  nearbyItineraries.length === 1
    ? nearbyItineraries
    : nearbyItineraries.filter(
        (itinerary: any) => itinerary?.noOfSeats && itinerary.noOfSeats > 0
      );
      //  const filteredItinerariesNearby = res?.data?.NearbyFlightItinerary

      this.getNearbyDetails = filteredItinerariesNearby || [];
      // ✅ Combine both lists
      const allFlights = [...this.getMainDetails, ...this.getNearbyDetails];

      // ✅ Get all unique layover flights using common function

      this.finalLayoverFlights = this.processFlights(allFlights) || [];

      const result = this.processFlights(allFlights) as {
        duration: any[];
        segment: any[];
      };

      this.finalLayoverFlights = result || { duration: [], segment: [] };

      const durations = Array.isArray(result?.duration) ? result.duration : [];

      // ✅ NEW: support multiple citypairs
      durations.forEach((dur: any) => {
        const minutes = this.durationStringToMinutes(dur.highestDuration);

        // initialize filters.durations object
        if (!this.filters.durations) {
          this.filters.durations = {};
        }

        // ✅ only set if not already set
        if (!this.filters.durations[dur.type]) {
          this.filters.durations[dur.type] = minutes;
        }
      });

      // store defaults (for summary)
      this.defaultDurations = {};
      durations.forEach((dur: any) => {
        this.defaultDurations[dur.type] =
          this.durationStringToMinutes(dur.highestDuration);
      });
      this.getNearbyfare = this.filterNearbyItinerariesLowestFare(
        filteredItinerariesNearby || [],
        payload
      );
      // ------------------ Cheapest Calculation ------------------
      const cheapestSorted = this.getMainDetails.sort(
        (
          a: { Fares: { CCMax: number }[] },
          b: { Fares: { CCMax: number }[] }
        ) => {
          const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
          const fareB = b.Fares?.[0]?.CCMax ?? Infinity;
          return fareA - fareB;
        }
      );
      this.cheapestPrice = cheapestSorted[0]?.Fares?.[0]?.CCMax ?? 0;
      // ------------------ Recommended Calculation ------------------
      const recommendedSorted = this.getMainDetails.sort(
        (
          a: { Fares: { CCMax: number }[] },
          b: { Fares: { CCMax: number }[] }
        ) => {

          const durA = this.getTotalDurationInMinutes(a);
          const durB = this.getTotalDurationInMinutes(b);
          return durA - durB;
        }
      );

      this.recommendedPrice = recommendedSorted[0]?.Fares?.[0]?.CCMax ?? 0;
      // ------------------ Nearby Calculation ------------------
      const nearestPriceSorted = this.getNearbyDetails.sort(
        (a: any, b: any) => {
          const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
          const fareB = b.Fares?.[0]?.CCMax ?? Infinity;
          const stopsA = this.getTotalStops(a);
          const stopsB = this.getTotalStops(b);

          return fareA + stopsA * 100 - (fareB + stopsB * 100);
        }
      );

      this.nearestPrice = nearestPriceSorted[0]?.Fares?.[0]?.CCMax ?? 0;

      this.getAllCarrierWiseFares =
        this.buildCarrierWiseFares(filteredItineraries);

      this.calculateStopAvailability();
      this.applyFilter();
    } else {
      this.isSkeleton = true;
      this.isfirstload = true;
      this.filterService.resetFilters();
      this.resetFilters();
      this.getMainDetails = [];
      this.filters.airlines = [];
      this.getNearbyDetails = [];

      this.finalLayoverFlights = [];
      this.visibleSegments = [];
      this.flightService
        .getflightList(routedata, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {

            this.isSkeleton = false;
            this.isfirstload = false;
            this.storeFullData = res;
            this.searchData = {
              CurrencyCode: res?.data?.SearchParams?.CurrencyCode,
              NoOfAdults: Number(res?.data?.SearchParams?.NoOfAdults),
              NoOfChildren: Number(res?.data?.SearchParams?.NoOfChildren),
              NoOfInfants: Number(res?.data?.SearchParams?.NoOfInfants),
              // NoOfInfantSeat: Number(res?.data?.SearchParams?.NoOfInfantSeat),
              tripType: res?.data?.SearchParams?.tripType,
              source: res?.data?.SearchParams?.source,
              returnDate: res?.data?.SearchParams?.returnDate,
              OriginDestination: [
                {
                  DepartureLocationCode: {
                    code: res?.data?.SearchParams?.DepartureDetails.airport_code,
                    airport_name:
                      res?.data?.SearchParams?.DepartureDetails.airport_name,
                    city: res?.data?.SearchParams?.DepartureDetails.city,
                    country: res?.data?.SearchParams?.DepartureDetails.country,
                    displayName: `${res?.data?.SearchParams?.DepartureDetails.city ||
                      res?.data?.SearchParams?.DepartureDetails.state
                      } (${res?.data?.SearchParams?.DepartureDetails.airport_code
                      }) ${res?.data?.SearchParams?.DepartureDetails.airport_name}`,
                    address: res?.data?.SearchParams?.DepartureDetails.address,
                    latitude: res?.data?.SearchParams?.DepartureDetails.latitude,
                    longitude: res?.data?.SearchParams?.DepartureDetails.longitude,
                    type: "main",
                  },
                  ArrivalLocationCode: {
                    code: res?.data?.SearchParams?.ArrivalDetails.airport_code,
                    airport_name:
                      res?.data?.SearchParams?.ArrivalDetails.airport_name,
                    city: res?.data?.SearchParams?.ArrivalDetails.city,
                    country: res?.data?.SearchParams?.ArrivalDetails.country,
                    displayName: `${res?.data?.SearchParams?.ArrivalDetails.city ||
                      res?.data?.SearchParams?.ArrivalDetails.state
                      } (${res?.data?.SearchParams?.ArrivalDetails.airport_code}) ${res?.data?.SearchParams?.ArrivalDetails.airport_name
                      }`,
                    address: res?.data?.SearchParams?.ArrivalDetails.address,
                    latitude: res?.data?.SearchParams?.ArrivalDetails.latitude,
                    longitude: res?.data?.SearchParams?.ArrivalDetails.longitude,
                    type: "main",
                  },
                  DepartureTime: res?.data?.SearchParams?.DepartureTime,
                  CabinClass: res?.data?.SearchParams?.CabinClass,
                },
                {
                  DepartureLocationCode: {
                    code: res?.data?.SearchParams?.ArrivalDetails.airport_code,
                    airport_name:
                      res?.data?.SearchParams?.ArrivalDetails.airport_name,
                    city: res?.data?.SearchParams?.ArrivalDetails.city,
                    country: res?.data?.SearchParams?.ArrivalDetails.country,
                    displayName: `${res?.data?.SearchParams?.ArrivalDetails.city ||
                      res?.data?.SearchParams?.ArrivalDetails.state
                      } (${res?.data?.SearchParams?.ArrivalDetails.airport_code}) ${res?.data?.SearchParams?.ArrivalDetails.airport_name
                      }`,
                    address: res?.data?.SearchParams?.ArrivalDetails.address,
                    latitude: res?.data?.SearchParams?.ArrivalDetails.latitude,
                    longitude: res?.data?.SearchParams?.ArrivalDetails.longitude,
                    type: "main",
                  },
                  ArrivalLocationCode: {
                    code: res?.data?.SearchParams?.DepartureDetails.airport_code,
                    airport_name:
                      res?.data?.SearchParams?.DepartureDetails.airport_name,
                    city: res?.data?.SearchParams?.DepartureDetails.city,
                    country: res?.data?.SearchParams?.DepartureDetails.country,
                    displayName: `${res?.data?.SearchParams?.DepartureDetails.city ||
                      res?.data?.SearchParams?.DepartureDetails.state
                      } (${res?.data?.SearchParams?.DepartureDetails.airport_code
                      }) ${res?.data?.SearchParams?.DepartureDetails.airport_name}`,
                    address: res?.data?.SearchParams?.DepartureDetails.address,
                    latitude: res?.data?.SearchParams?.DepartureDetails.latitude,
                    longitude: res?.data?.SearchParams?.DepartureDetails.longitude,
                    type: "main",
                  },
                  DepartureTime: res?.data?.SearchParams?.returnDate,
                  CabinClass: res?.data?.SearchParams?.CabinClass,
                },
              ],
            };
            // this.searchService.setSearchData(this.searchData);
       const flightItineraries = Array.isArray(res?.data?.FlightItinerary)
  ? res.data.FlightItinerary
  : [];

const filteredItineraries = flightItineraries.length <= 1
  ? flightItineraries
  : flightItineraries.filter(
      (itinerary: any) => Number(itinerary?.noOfSeats) > 0
    );
            //  const filteredItineraries = res.data.FlightItinerary;
            this.getMainDetails = filteredItineraries || [];
            this.fullStopWiseLowestFare = this.calculateStopWiseLowestFare(
              this.getMainDetails || []
            );
      const nearbyItineraries = res?.data?.NearbyFlightItinerary || [];

const filteredItinerariesNearby =
  nearbyItineraries.length === 1
    ? nearbyItineraries
    : nearbyItineraries.filter(
        (itinerary: any) => itinerary?.noOfSeats && itinerary.noOfSeats > 0
      );
            // const filteredItinerariesNearby = res?.data?.NearbyFlightItinerary
            this.getNearbyDetails = filteredItinerariesNearby || [];
            console.log("this.getNearbyDetails",this.getNearbyDetails.length)
            // ✅ Combine both lists
            const allFlights = [
              ...this.getMainDetails,
              ...this.getNearbyDetails,
            ];
            if (this.isBrowser) {
  // Construct the payload object
  const viewItemListPayload = {
    event: 'view_flight_list',
    item_list_name: 'Flight Search Results',
    items: (allFlights || []).map((flight: any, index: number) => ({
      item_id: flight.ItineraryId,
      item_name: flight.ValidatingCarrierName,
      item_brand: flight.ValidatingCarrierCode,
      item_category: 'Flight',
      item_category2: flight.Citypairs?.[0]?.FlightSegment?.[0]?.CabinClass || '',
      price: flight.Fares?.[0]?.CCMax ?? 0,
      passengers_count: 1
    }))
  };

  // 1. Log payload before pushing
  console.log('[DataLayer] Pushing view_item_list event:', viewItemListPayload);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(viewItemListPayload);

  // 2. Log full dataLayer array to confirm addition
  console.log('[DataLayer] Updated window.dataLayer contents:', (window as any).dataLayer);
}
           
            // ✅ Get all unique layover flights using common function

            this.finalLayoverFlights = this.processFlights(allFlights) || [];

            const result = this.processFlights(allFlights) as {
              duration: any[];
              segment: any[];
            };

            this.finalLayoverFlights = result || { duration: [], segment: [] };

            const durations = Array.isArray(result?.duration) ? result.duration : [];

            // ✅ NEW: support multiple citypairs
            durations.forEach((dur: any) => {
              const minutes = this.durationStringToMinutes(dur.highestDuration);

              // // initialize filters.durations object
              if (!this.filters.durations) {
                this.filters.durations = {};
              }

              // ✅ only set if not already set

              this.filters.durations[dur.type] = minutes;

            });

            // store defaults (for summary)
            this.defaultDurations = {};
            durations.forEach((dur: any) => {
              this.defaultDurations[dur.type] =
                this.durationStringToMinutes(dur.highestDuration);
            });

            this.getNearbyfare = this.filterNearbyItinerariesLowestFare(
              filteredItinerariesNearby || [],
              payload
            );

            // ------------------ Cheapest Calculation ------------------
            const cheapestSorted = this.getMainDetails.sort(
              (
                a: { Fares: { CCMax: number }[] },
                b: { Fares: { CCMax: number }[] }
              ) => {
                const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
                const fareB = b.Fares?.[0]?.CCMax ?? Infinity;
                return fareA - fareB;
              }
            );

            this.cheapestPrice = cheapestSorted[0]?.Fares?.[0]?.CCMax ?? 0;
            // ------------------ Recommended Calculation ------------------
            const recommendedSorted = this.getMainDetails.sort(
              (
                a: { Fares: { CCMax: number }[] },
                b: { Fares: { CCMax: number }[] }
              ) => {

                const durA = this.getTotalDurationInMinutes(a);
                const durB = this.getTotalDurationInMinutes(b);
                return durA - durB;
              }
            );

            this.recommendedPrice =
              recommendedSorted[0]?.Fares?.[0]?.CCMax ?? 0;
            // ------------------ Nearby Calculation ------------------
            const nearestPriceSorted = this.getNearbyDetails.sort(
              (a: any, b: any) => {
                const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
                const fareB = b.Fares?.[0]?.CCMax ?? Infinity;
                const stopsA = this.getTotalStops(a);
                const stopsB = this.getTotalStops(b);

                return fareA + stopsA * 100 - (fareB + stopsB * 100);
              }
            );

            this.nearestPrice = nearestPriceSorted[0]?.Fares?.[0]?.CCMax ?? 0;
            this.getAllCarrierWiseFares =
              this.buildCarrierWiseFares(filteredItineraries);
            this.calculateStopAvailability();
            this.applyFilter();
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.isSkeleton = false;
            this.isfirstload = false;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
            this.getMainDetails = [];
            this.getNearbyDetails = [];
            this.getAllCarrierWiseFares = [];
            // this.toasterService.showError(
            //   err.error.message || 'Something went wrong while fetching data!'
            // );
          },
        });
    }


  }

  isCabinMatched(selectedCabin: string, itineraryCabin: string): boolean {
    if (!selectedCabin || !itineraryCabin) return false;

    const cabinMap: any = {
      E: ['E', 'ECONOMY', 'ECOM'],
      B: ['B', 'BUSINESS'],
      F: ['F', 'FIRST'],
      P: ['P', 'PE', 'PREMIUM ECONOMY', 'PRE ECOM', 'PREMIUM ECOM'],
      PE: ['P', 'PE', 'PREMIUM ECONOMY', 'PRE ECOM', 'PREMIUM ECOM']
    };

    const selectedKey = selectedCabin.toUpperCase();
    const itineraryValue = itineraryCabin.toUpperCase();

    const validCabins = cabinMap[selectedKey] || [selectedKey];

    return validCabins.some((c: any) => itineraryValue.includes(c));
  }
  calculateStopAvailability() {
    this.showDirect = this.getAllCarrierWiseFares.some(
      (a) => a.stopWiseFares["stopes_0"] > 0
    );
    this.showOneStop = this.getAllCarrierWiseFares.some(
      (a) => a.stopWiseFares["stopes_1"] > 0
    );
    this.showMoreStops = this.getAllCarrierWiseFares.some(
      (a) => a.stopWiseFares["stopes_more"] > 0
    );
  }
  filterNearbyItinerariesLowestFare(itineraries: any[], searchData: any): any {
    if (!itineraries || !searchData) return { departure: [], return: [] };

    const originCode =
      searchData?.OriginDestination?.[0]?.DepartureLocationCode;
    const arrivalCode = searchData?.OriginDestination?.[0]?.ArrivalLocationCode;

    const departResults: any[] = [];
    const returnResults: any[] = [];

    itineraries.forEach((itin) => {
      const citypairs = itin.Citypairs || [];

      // --- CITYPAIR 0 (departure) ---
      if (citypairs[0]) {
        const depSegment = citypairs[0]?.FlightSegment?.[0];
        if (depSegment?.DepartureLocationCode !== originCode) {
          const lowestFare = Math.min(
            ...(itin?.Fares?.map((f: { CCMax: number }) => f.CCMax) || [
              Infinity,
            ])
          );
          departResults.push({
            DepartureLocationCode: depSegment?.DepartureLocationCode,
            OriginAirportName: depSegment?.OriginAirportName,
            lowestFare: lowestFare === Infinity ? null : lowestFare,
          });
        }
      }

      // --- CITYPAIR 1 (return) ---
      if (citypairs[1]) {
        const retSegment = citypairs[1]?.FlightSegment?.[0];
        if (retSegment?.DepartureLocationCode !== arrivalCode) {
          const lowestFare = Math.min(
            ...(itin.Fares?.map((f: { CCMax: number }) => f.CCMax) || [
              Infinity,
            ])
          );
          returnResults.push({
            DepartureLocationCode: retSegment?.DepartureLocationCode,
            OriginAirportName: retSegment?.OriginAirportName,
            lowestFare: lowestFare === Infinity ? null : lowestFare,
          });
        }
      }
    });

    // --- Deduplicate departure ---
    const uniqueDepart: any[] = [];
    const seenDepart = new Set();
    departResults.forEach((r) => {
      const key = `${r.DepartureLocationCode}-${r.OriginAirportName}`;
      if (!seenDepart.has(key)) {
        seenDepart.add(key);
        uniqueDepart.push(r);
      }
    });

    // --- Deduplicate return ---
    const uniqueReturn: any[] = [];
    const seenReturn = new Set();
    returnResults.forEach((r) => {
      const key = `${r.DepartureLocationCode}-${r.OriginAirportName}`;
      if (!seenReturn.has(key)) {
        seenReturn.add(key);
        uniqueReturn.push(r);
      }
    });

    return {
      departure: uniqueDepart,
      return: uniqueReturn,
    };
  }

  // private processFlights(allFlights: any[]): any {
  //   if (!Array.isArray(allFlights)) return { duration: [], segment: [] };

  //   const duration: any[] = [];
  //   const segment: any[] = [];

  //   const durationToMinutes = (duration: string) => {
  //     const d = parseInt(duration.match(/(\d+)D/)?.[1] || "0");
  //     const h = parseInt(duration.match(/(\d+)H/)?.[1] || "0");
  //     const m = parseInt(duration.match(/(\d+)M/)?.[1] || "0");
  //     return d * 24 * 60 + h * 60 + m;
  //   };

  //   const formatMinutes = (min: number) =>
  //     `${Math.floor(min / 60)}H ${min % 60}M`;

  //   // ✅ allow both number and object (avoid TypeScript error)
  //   let highestDeparture: { minutes: number; data: any | null } = {
  //     minutes: 0,
  //     data: null,
  //   };
  //   let highestReturn: { minutes: number; data: any | null } = {
  //     minutes: 0,
  //     data: null,
  //   };

  //   allFlights.forEach((itinerary) => {
  //     const citypairs = itinerary?.Citypairs || [];

  //     // --- DEPARTURE ---
  //     if (citypairs[0]) {
  //       const depSegments = citypairs[0].FlightSegment || [];
  //       const depWithLayover = depSegments.filter(
  //         (seg: any) => seg?.LayoverTime
  //       );

  //       depWithLayover.forEach((seg: any) =>
  //         segment.push({
  //           DepartureLocationCode: seg.DepartureLocationCode,
  //           OriginAirportName: seg.OriginAirportName,
  //           LayoverTime: seg.LayoverTime,
  //           DepartureDateTime: seg.DepartureDateTime,
  //           ArrivalDateTime: seg.ArrivalDateTime,
  //           MarketingAirlineName: seg.MarketingAirlineName,
  //         })
  //       );

  //       if (citypairs[0].Duration) {
  //         const durMin = durationToMinutes(citypairs[0].Duration);
  //         if (durMin > highestDeparture.minutes) {
  //           highestDeparture = {
  //             minutes: durMin,
  //             data: {
  //               type: "departure",
  //               ItineraryId: itinerary.ItineraryId,
  //               ValidatingCarrierName: itinerary.ValidatingCarrierName,
  //               highestDuration: formatMinutes(durMin),
  //             },
  //           };
  //         }
  //       }
  //     }

  //     // --- RETURN ---
  //     if (citypairs[1]) {
  //       const retSegments = citypairs[1].FlightSegment || [];
  //       const retWithLayover = retSegments.filter(
  //         (seg: any) => seg?.LayoverTime
  //       );

  //       retWithLayover.forEach((seg: any) =>
  //         segment.push({
  //           DepartureLocationCode: seg.DepartureLocationCode,
  //           OriginAirportName: seg.OriginAirportName,
  //           LayoverTime: seg.LayoverTime,
  //           DepartureDateTime: seg.DepartureDateTime,
  //           ArrivalDateTime: seg.ArrivalDateTime,
  //           MarketingAirlineName: seg.MarketingAirlineName,
  //         })
  //       );

  //       if (citypairs[1].Duration) {
  //         const durMin = durationToMinutes(citypairs[1].Duration);
  //         if (durMin > highestReturn.minutes) {
  //           highestReturn = {
  //             minutes: durMin,
  //             data: {
  //               type: "return",
  //               ItineraryId: itinerary.ItineraryId,
  //               ValidatingCarrierName: itinerary.ValidatingCarrierName,
  //               highestDuration: formatMinutes(durMin),
  //             },
  //           };
  //         }
  //       }
  //     }
  //   });

  //   // Remove duplicate segments by DepartureLocationCode + OriginAirportName
  //   const uniqueSegments = segment.filter(
  //     (seg, index, self) =>
  //       index ===
  //       self.findIndex(
  //         (s) =>
  //           s.DepartureLocationCode === seg.DepartureLocationCode &&
  //           s.OriginAirportName === seg.OriginAirportName
  //       )
  //   );

  //   // ✅ Include only highest duration for each type
  //   const finalDurations: any[] = [];
  //   if (highestDeparture.data) finalDurations.push(highestDeparture.data);
  //   if (highestReturn.data) finalDurations.push(highestReturn.data);

  //   return { duration: finalDurations, segment: uniqueSegments };
  // }

  private processFlights(allFlights: any[]): any {
    if (!Array.isArray(allFlights)) return { duration: [], segment: [] };

    const duration: any[] = [];
    const segment: any[] = [];

    const durationToMinutes = (duration: string) => {
      const d = parseInt(duration.match(/(\d+)D/)?.[1] || "0");
      const h = parseInt(duration.match(/(\d+)H/)?.[1] || "0");
      const m = parseInt(duration.match(/(\d+)M/)?.[1] || "0");
      return d * 24 * 60 + h * 60 + m;
    };

    const formatMinutes = (min: number) =>
      `${Math.floor(min / 60)}H ${min % 60}M`;

    // ✅ Store highest duration per citypair index
    const highestMap = new Map<
      number,
      { minutes: number; data: any }
    >();

    allFlights.forEach((itinerary) => {
      const citypairs = itinerary?.Citypairs || [];

      citypairs.forEach((cp: any, index: number) => {

        const segments = cp?.FlightSegment || [];

        // 👉 collect layover segments
        const withLayover = segments.filter((seg: any) => seg?.LayoverTime);

        withLayover.forEach((seg: any) =>
          segment.push({
            DepartureLocationCode: seg.DepartureLocationCode,
            OriginAirportName: seg.OriginAirportName,
            LayoverTime: seg.LayoverTime,
            DepartureDateTime: seg.DepartureDateTime,
            ArrivalDateTime: seg.ArrivalDateTime,
            MarketingAirlineName: seg.MarketingAirlineName,
          })
        );

        // 👉 duration handling per citypair
        if (cp?.Duration) {
          const durMin = durationToMinutes(cp.Duration);

          const existing = highestMap.get(index);

          if (!existing || durMin > existing.minutes) {
            highestMap.set(index, {
              minutes: durMin,
              data: {
                type: `cp_${index}`, // 🔥 dynamic type
                index,
                ItineraryId: itinerary.ItineraryId,
                ValidatingCarrierName: itinerary.ValidatingCarrierName,
                highestDuration: formatMinutes(durMin),
                direction: itinerary.Direction || ''
              },
            });
          }
        }
      });
    });

    // ✅ remove duplicate segments
    const uniqueSegments = segment.filter(
      (seg, index, self) =>
        index ===
        self.findIndex(
          (s) =>
            s.DepartureLocationCode === seg.DepartureLocationCode
        )
    );

    // ✅ final duration array
    const finalDurations = Array.from(highestMap.values()).map(v => v.data);
    return { duration: finalDurations, segment: uniqueSegments };
  }

  calculateStopWiseLowestFare(itineraries: any[]) {
    const stopWiseLowestFareMap = new Map<number, number>();

    for (const itinerary of itineraries) {
      const baseFare = itinerary.Fares?.[0]?.CCMax ?? 0;
      const noOfStops = itinerary.Citypairs?.[0]?.NoOfStops ?? 0;

      const existingFare = stopWiseLowestFareMap.get(noOfStops);
      if (existingFare === undefined || baseFare < existingFare) {
        stopWiseLowestFareMap.set(noOfStops, baseFare);
      }
    }

    return {
      stopes_0: stopWiseLowestFareMap.get(0) ?? 0,
      stopes_1: stopWiseLowestFareMap.get(1) ?? 0,
      stopes_more: Array.from(stopWiseLowestFareMap.entries())
        .filter(([stops]) => stops > 1)
        .reduce((min, [_, fare]) => (min === 0 || fare < min ? fare : min), 0),
    };
  }
  private getItineraryMarketingAirlines(itinerary: any): string[] {
    const citypairs = itinerary.Citypairs || [];
    const airlineSet = new Set<string>();

    for (const cp of citypairs) {
      const segments = cp?.FlightSegment || [];

      for (const seg of segments) {
        const marketing = seg.MarketingAirlineName;
        if (marketing) {
          airlineSet.add(marketing);
        }
      }
    }

    return Array.from(airlineSet);
  }
  private getFirstSegmentAirlines(itinerary: any): string[] {
    const citypairs = itinerary.Citypairs || [];
    const airlineSet = new Set<string>();

    for (const cp of citypairs) {
      const firstSegment = cp?.FlightSegment?.[0];
      const airline = firstSegment?.MarketingAirlineName;

      if (airline) {
        airlineSet.add(airline);
      }
    }

    return Array.from(airlineSet);
  }
  private isItineraryMultiAirline(itinerary: any): boolean {
    const airlines = this.getItineraryMarketingAirlines(itinerary);

    // ✅ Multi airline if more than 1 unique airline exists
    return airlines.length > 1;
  }


  isMultiAirlineTrip: boolean = false;

  buildCarrierWiseFares(itineraries: any[]): any[] {

    // -----------------------------
    // Carrier Fare Group Map
    // -----------------------------
    const carriersMap = new Map<
      string,
      {
        image: string;
        stopFares: {
          stopes_0: number;
          stopes_1: number;
          stopes_more: number;
        };
      }
    >();

    // -----------------------------
    // Multi Airline Flag Map
    // -----------------------------
    const carrierMultiAirlineMap = new Map<string, boolean>();

    let minFare = Infinity;
    let maxFare = -Infinity;

    // ============================================
    // LOOP THROUGH ALL ITINERARIES
    // ============================================
    for (const itinerary of itineraries) {

      // ✅ Get ALL airlines involved in this itinerary
      const involvedAirlines = this.getItineraryMarketingAirlines(itinerary);

      if (!involvedAirlines.length) continue;

      // ✅ Multi airline if more than one airline exists
      const isMulti = involvedAirlines.length > 1;

      // ============================================
      // ✅ Mark ALL airlines involved as multi-airline
      // ============================================
      for (const airline of involvedAirlines) {

        if (isMulti) {
          // Once multi → always multi
          carrierMultiAirlineMap.set(airline, true);

        } else if (!carrierMultiAirlineMap.has(airline)) {
          // Single airline default false
          carrierMultiAirlineMap.set(airline, false);
        }
      }

      // ============================================
      // Fare grouping uses FIRST airline as validating carrier
      // ============================================
      const validatingCarrier = involvedAirlines[0];

      const logoFile =
        itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.FlightLogoName;

      const carrierImage = `${this.imageUrl}${logoFile}`;

      const baseFare = itinerary.Fares?.[0]?.CCMax ?? 0;
      const noOfStops = itinerary.Citypairs?.[0]?.NoOfStops ?? 0;

      // ============================================
      // Track min/max fare for slider
      // ============================================
      if (baseFare > 0) {
        minFare = Math.min(minFare, baseFare);
        maxFare = Math.max(maxFare, baseFare);
      }

      // ============================================
      // Init carrier if not exists
      // ============================================
      if (!carriersMap.has(validatingCarrier)) {
        carriersMap.set(validatingCarrier, {
          image: carrierImage,
          stopFares: {
            stopes_0: 0,
            stopes_1: 0,
            stopes_more: 0,
          },
        });
      }

      const carrier = carriersMap.get(validatingCarrier)!;

      // ============================================
      // Stop Fare Key
      // ============================================
      const fareKey =
        noOfStops === 0
          ? "stopes_0"
          : noOfStops === 1
            ? "stopes_1"
            : "stopes_more";

      // ============================================
      // Store lowest fare for that stop type
      // ============================================
      const existingFare = carrier.stopFares[fareKey];

      if (existingFare === 0 || baseFare < existingFare) {
        carrier.stopFares[fareKey] = baseFare;
      }
    }

    // ============================================
    // Update price slider values
    // ============================================
    this.lowestPrice = Math.floor(minFare);
    this.highestPrice = Math.ceil(maxFare);

    this.filters.rangeValues = [this.lowestPrice, this.highestPrice];
    this.sliderValue = [this.lowestPrice, this.highestPrice];

    // ============================================
    // Build Final Carrier List Output
    // ============================================
    const carrierList = Array.from(carriersMap.entries()).map(
      ([carrierName, data]) => {

        const fares = Object.values(data.stopFares).filter(f => f > 0);

        return {
          ValidatingCarrierName: carrierName,
          carrierImage: data.image,

          stopWiseFares: data.stopFares,
          lowestFare: fares.length ? Math.min(...fares) : 0,
          isMultiAirlineTrip: carrierMultiAirlineMap.get(carrierName) ?? false,
        };
      }
    );
    return carrierList.sort((a, b) => a.lowestFare - b.lowestFare);
  }

  // buildCarrierWiseFares(itineraries: any[]): any[] {

  //   // -----------------------------
  //   // Carrier Fare Group Map
  //   // -----------------------------
  //   const carriersMap = new Map<
  //     string,
  //     {
  //       image: string;
  //       stopFares: {
  //         stopes_0: number;
  //         stopes_1: number;
  //         stopes_more: number;
  //       };
  //     }
  //   >();

  //   // -----------------------------
  //   // Multi Airline Flag Map
  //   // -----------------------------
  //   const carrierMultiAirlineMap = new Map<string, boolean>();

  //   let minFare = Infinity;
  //   let maxFare = -Infinity;

  //   // ============================================
  //   // LOOP THROUGH ALL ITINERARIES
  //   // ============================================
  //   for (const itinerary of itineraries) {

  //     // ✅ Get ALL airlines (unchanged - used for multi-airline logic)
  //     const involvedAirlines = this.getItineraryMarketingAirlines(itinerary);
  //     if (!involvedAirlines.length) continue;

  //     // ✅ Multi-airline logic (UNCHANGED)
  //     const isMulti = involvedAirlines.length > 1;

  //     for (const airline of involvedAirlines) {
  //       if (isMulti) {
  //         carrierMultiAirlineMap.set(airline, true);
  //       } else if (!carrierMultiAirlineMap.has(airline)) {
  //         carrierMultiAirlineMap.set(airline, false);
  //       }
  //     }

  //     // ✅ NEW: get airlines from ONLY first segments
  //     const firstSegmentAirlines = this.getFirstSegmentAirlines(itinerary);
  //     if (!firstSegmentAirlines.length) continue;

  //     // ✅ UPDATED validating carrier
  //     const validatingCarrier = firstSegmentAirlines[0];
  //     let logoFile = '';

  //     // 👉 If multiple citypairs → loop all and take FlightSegment[0]
  //     if (itinerary.Citypairs?.length > 1) {

  //       for (const cp of itinerary.Citypairs) {
  //         const firstSegment = cp?.FlightSegment?.[0];

  //         if (
  //           firstSegment?.MarketingAirlineName === validatingCarrier &&
  //           firstSegment?.FlightLogoName
  //         ) {
  //           logoFile = firstSegment.FlightLogoName;
  //           break; // stop once found
  //         }
  //       }

  //     } else {
  //       // 👉 Single citypair (same as before)
  //       logoFile =
  //         itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.FlightLogoName || '';
  //     }

  //     // 👉 fallback safety (important)
  //     if (!logoFile) {
  //       logoFile =
  //         itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.FlightLogoName || '';
  //     }

  //     const carrierImage = `${this.imageUrl}${logoFile}`;

  //     const baseFare = itinerary.Fares?.[0]?.CCMax ?? 0;
  //     const noOfStops = itinerary.Citypairs?.[0]?.NoOfStops ?? 0;

  //     // ============================================
  //     // Track min/max fare for slider
  //     // ============================================
  //     if (baseFare > 0) {
  //       minFare = Math.min(minFare, baseFare);
  //       maxFare = Math.max(maxFare, baseFare);
  //     }

  //     // ============================================
  //     // Init carrier if not exists
  //     // ============================================
  //     if (!carriersMap.has(validatingCarrier)) {
  //       carriersMap.set(validatingCarrier, {
  //         image: carrierImage,
  //         stopFares: {
  //           stopes_0: 0,
  //           stopes_1: 0,
  //           stopes_more: 0,
  //         },
  //       });
  //     }

  //     const carrier = carriersMap.get(validatingCarrier)!;

  //     // ============================================
  //     // Stop Fare Key
  //     // ============================================
  //     const fareKey =
  //       noOfStops === 0
  //         ? "stopes_0"
  //         : noOfStops === 1
  //           ? "stopes_1"
  //           : "stopes_more";

  //     // ============================================
  //     // Store lowest fare for that stop type
  //     // ============================================
  //     const existingFare = carrier.stopFares[fareKey];

  //     if (existingFare === 0 || baseFare < existingFare) {
  //       carrier.stopFares[fareKey] = baseFare;
  //     }
  //   }

  //   // ============================================
  //   // Update price slider values
  //   // ============================================
  //   this.lowestPrice = Math.floor(minFare);
  //   this.highestPrice = Math.ceil(maxFare);

  //   this.filters.rangeValues = [this.lowestPrice, this.highestPrice];
  //   this.sliderValue = [this.lowestPrice, this.highestPrice];

  //   // ============================================
  //   // Build Final Carrier List Output
  //   // ============================================
  //   const carrierList = Array.from(carriersMap.entries()).map(
  //     ([carrierName, data]) => {

  //       const fares = Object.values(data.stopFares).filter(f => f > 0);

  //       return {
  //         ValidatingCarrierName: carrierName,
  //         carrierImage: data.image,

  //         stopWiseFares: data.stopFares,
  //         lowestFare: fares.length ? Math.min(...fares) : 0,
  //         isMultiAirlineTrip: carrierMultiAirlineMap.get(carrierName) ?? false,
  //       };
  //     }
  //   );
  //   return carrierList.sort((a, b) => a.lowestFare - b.lowestFare);
  // }


  getAllTimedetails: any = "";

  availableAirlines = ["Thai Airways", "Japan Airlines", "IndiGo", "Air India"];
  selectedAirlinesMap: { [key: string]: boolean } = {};
  showAllCarriers = false;
  onPriceRangeChange(): void {
    this.filters.rangeValues = this.sliderValue;
    this.applyFilter();
  }
  // Convert total minutes → "XD YH ZM"
  minutesToDurationString(totalMinutes: number): string {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}D ${hours}H ${minutes}M`;
  }

  // Convert duration string → total minutes
  durationStringToMinutes(duration: string): number {
    const days = parseInt(duration.match(/(\d+)D/)?.[1] || "0", 10);
    const hours = parseInt(duration.match(/(\d+)H/)?.[1] || "0", 10);
    const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || "0", 10);
    return days * 24 * 60 + hours * 60 + minutes;
  }

  applyFilter() {
    if (!this.isnewData) {
      this.SpinnerService.show();
    }
    this.filterSub = this.filterService.filters$.subscribe(
      (f: FlightFilters) => {
      
        this.filters = f;
        this.activeFilters = f;
        this.filtersSummaryText = this.generateFilterSummary(f, {
          lowestPrice: this.lowestPrice,
          highestPrice: this.highestPrice,
          defaultDurations: this.defaultDurations,
        });
      }
    );

    this.isnewData = false;
    this.filterService.setFilters(this.filters);
    const [minPrice, maxPrice] = this.filters.rangeValues;
     
    const itineraries =
      this.selectedTab === "alternate"
        ? this.getNearbyDetails || []
        : this.getMainDetails || [];

    const selectedAirlines = Array.isArray(this.filters?.airlines)
      ? this.filters?.airlines?.map((a) => a.toLowerCase())
      : [];

    const stopesFilter = this.filters.stopes;
    const depTimeFilter = this.filters.departureTime;
    const retTimeFilter = this.filters.returnDepartureTime;
    const depArivalTimeFilter = this.filters.arrivalTime;
    const retArivalTimeFilter = this.filters.returnArrivalTime;
    const connectingAirports = this.filters.connectingAirports;
    const getNearbyfaredepart = this.filters.getNearbyfaredepart;
    const getNearbyfarereturn = this.filters.getNearbyfarereturn;
    const durationFilters = this.filters.durations || {};
    const timeSlots: any = {
      night: { start: 1, end: 360 }, // 00:01 → 06:00
      morning: { start: 361, end: 720 }, // 06:01 → 12:00
      afternoon: { start: 721, end: 1080 }, // 12:01 → 18:00
      evening: { start: 1081, end: 1440 }, // 18:01 → 24:00
    };

    const getMinutes = (dateTime: string | Date) => {
      const d = new Date(dateTime);
      return d.getHours() * 60 + d.getMinutes();
    };

    this.getAllTimedetails = itineraries;
    const filtered = itineraries.filter((itinerary: any) => {
      const fare = itinerary.Fares?.[0]?.CCMax ?? 0;
      const validatingCarrier =
        itinerary.Citypairs
          ?.find((cp: { FlightSegment: string | any[]; }) => cp?.FlightSegment?.length > 0)
          ?.FlightSegment?.[0]?.MarketingAirlineName
          ?.toLowerCase() ?? "";

      // const validatingCarrier =
      //     itinerary.ValidatingCarrierName?.toLowerCase() ?? "";
      const totalStops = itinerary.Citypairs?.[0]?.NoOfStops ?? 0;
      let passes = true;
      const selectSeveral = this.filters.severalFlights;

      const getAllSegmentAirlines = (itinerary: any): string[] => {
        return (
          itinerary.Citypairs
            ?.flatMap((cp: any) =>
              cp?.FlightSegment?.length
                ? [cp.FlightSegment[0].MarketingAirlineName?.toLowerCase()]
                : []
            )
            .filter(Boolean) || []
        );
      };

      if (selectedAirlines.length > 0) {
        const segmentAirlines = getAllSegmentAirlines(itinerary);

        const hasMultipleSelectedAirlines = selectedAirlines.length > 1;
        const allowMultipleAirlines =
          selectSeveral === true || hasMultipleSelectedAirlines;

        if (allowMultipleAirlines) {
          // ✅ FLEXIBLE MODE
          // Any segment airline can match
          passes =
            passes &&
            segmentAirlines.some((airline) =>
              selectedAirlines.includes(airline)
            );
        } else {
          // ❌ STRICT MODE
          // 1. All segments must be SAME airline
          // 2. That airline must be the selected one
          const uniqueAirlines = [...new Set(segmentAirlines)];

          passes =
            passes &&
            uniqueAirlines.length === 1 &&
            selectedAirlines.includes(uniqueAirlines[0]);
        }
      }


      if (stopesFilter && stopesFilter.length > 0) {
        let match = false;
        for (const selectedStop of stopesFilter) {
          if (selectedStop === 0 && totalStops === 0) match = true;
          else if (selectedStop === 1 && totalStops === 1) match = true;
          else if (selectedStop === 2 && totalStops > 1) match = true;
        }
        passes = passes && match;
      }
      console.log("fare",fare)
            console.log("minPrice",minPrice)
                        console.log("maxPrice",maxPrice)


      passes = passes && fare >= minPrice && fare <= maxPrice;

      // if (depTimeFilter && timeSlots[depTimeFilter]) {
      //   const depTime =
      //     itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.DepartureDateTime;
      //   if (depTime) {
      //     const depHour = new Date(depTime).getHours();
      //     const { start, end } = timeSlots[depTimeFilter];
      //     if (!(depHour >= start && depHour < end)) passes = false;
      //   }
      // }


      if (depTimeFilter?.length) {

        const depTime =
          itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.DepartureDateTime;

        if (depTime) {
          const depMinutes = getMinutes(depTime);

          const matches = depTimeFilter.some((filter: string) => {
            const { start, end } = timeSlots[filter];
            return depMinutes >= start && depMinutes <= end;
          });

          if (!matches) passes = false;
        }
      }
      if (retTimeFilter?.length) {

        const retTime =
          itinerary.Citypairs?.[1]?.FlightSegment?.[0]?.DepartureDateTime;

        if (retTime) {
          const retMinutes = getMinutes(retTime);

          const matches = retTimeFilter.some((filter: string) => {
            const { start, end } = timeSlots[filter];
            return retMinutes >= start && retMinutes <= end;
          });

          if (!matches) passes = false;
        }
      }
      if (depArivalTimeFilter?.length) {

        const deepAtime =
          itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.ArrivalDateTime;

        if (deepAtime) {
          const depArrMinutes = getMinutes(deepAtime);

          const matches = depArivalTimeFilter.some((filter: string) => {
            const { start, end } = timeSlots[filter];
            return depArrMinutes >= start && depArrMinutes <= end;
          });

          if (!matches) passes = false;
        }
      }
      if (retArivalTimeFilter?.length) {

        const returnArrivalTime =
          itinerary.Citypairs?.[1]?.FlightSegment?.[0]?.ArrivalDateTime;

        if (returnArrivalTime) {
          const retArrMinutes = getMinutes(returnArrivalTime);

          const matches = retArivalTimeFilter.some((filter: string) => {
            const { start, end } = timeSlots[filter];
            return retArrMinutes >= start && retArrMinutes <= end;
          });

          if (!matches) passes = false;
        }
      }



      // if (retTimeFilter && timeSlots[retTimeFilter]) {
      //   const retTime =
      //     itinerary.Citypairs?.[1]?.FlightSegment?.[0]?.ArrivalDateTime;
      //   if (retTime) {
      //     const retHour = new Date(retTime).getHours();
      //     const { start, end } = timeSlots[retTimeFilter];
      //     if (!(retHour >= start && retHour < end)) passes = false;
      //   }
      // }


      // if (depArivalTimeFilter && timeSlots[depArivalTimeFilter]) {
      //   const deepAtime =
      //     itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.ArrivalDateTime;
      //   if (deepAtime) {
      //     const retHour = new Date(deepAtime).getHours();
      //     const { start, end } = timeSlots[depArivalTimeFilter];
      //     if (!(retHour >= start && retHour < end)) passes = false;
      //   }
      // }


      // if (retArivalTimeFilter && timeSlots[retArivalTimeFilter]) {
      //   const returnArrivalTime =
      //     itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.ArrivalDateTime;
      //   if (returnArrivalTime) {
      //     const retHour = new Date(returnArrivalTime).getHours();
      //     const { start, end } = timeSlots[retArivalTimeFilter];
      //     if (!(retHour >= start && retHour < end)) passes = false;
      //   }
      // }

if (this.filters?.carryOnBaggage) {

  const fare = itinerary?.Fares?.[0];

  const baggage = fare?.BaggageAllowance || {};

  const hasCarryOn = Object.values(baggage).some((bags: any) =>
    Array.isArray(bags) &&
    bags.some((bag: any) =>
      bag?.type === 'CARRYON' &&
      Number(bag?.count) > 0
    )
  );

  passes = passes && hasCarryOn;
}
      // ✅ Connecting airports filter
      if (connectingAirports && connectingAirports.length > 0) {
        const segments =
          itinerary.Citypairs?.flatMap(
            (cp: { FlightSegment: any }) => cp.FlightSegment
          ) || [];
        const hasConnectingAirport = segments.some(
          (seg: { DepartureLocationCode: string }) =>
            connectingAirports.includes(seg.DepartureLocationCode)
        );
        passes = passes && hasConnectingAirport;
      }
      // ✅ Nearby fare depart filter (citypairs[0])
      if (getNearbyfaredepart && getNearbyfaredepart.length > 0) {
        const depCode =
          itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.DepartureLocationCode;
        passes = passes && getNearbyfaredepart.includes(depCode);
      }

      // ✅ Nearby fare return filter (citypairs[1])
      if (getNearbyfarereturn && getNearbyfarereturn.length > 0) {
        const retCode =
          itinerary.Citypairs?.[1]?.FlightSegment?.[0]?.DepartureLocationCode;
        passes = passes && getNearbyfarereturn.includes(retCode);
      }

      // --- Existing filters here (price, stops, airlines, connecting airports, nearby fares, etc.) ---

      // ✅ NEW dynamic duration filter
      Object.keys(durationFilters).forEach((type) => {
        const index = Number(type.split("_")[1]); // citypair index

        const durationStr = itinerary.Citypairs?.[index]?.Duration;

        if (durationStr) {
          const minutes = this.durationStringToMinutes(durationStr);
          if (minutes > durationFilters[type]) {
            passes = false;
          }
        }
      });
      return passes;
    });

    // Store all

    this.getFlightAllDetails = filtered;
  
    console.log("filtered",filtered)
    // Update scroll buttons after DOM is updated
    setTimeout(() => {
      this.updateScrollButtons();
    }, 100);
    // ✅ Sort logic based on user selection
    if (this.filters.sortBy === "fastest") {
      this.getFlightAllDetails.sort((a, b) => {
        const durA = this.getTotalDurationInMinutes(a);
        const durB = this.getTotalDurationInMinutes(b);
        return durA - durB; // ascending = fastest first
      });
    }

    // ✅ NEW: Earliest Takeoff Sorting
    if (this.filters.sortBy === "earliest") {
      this.getFlightAllDetails.sort((a, b) => {
        const depA =
          a?.Citypairs?.[0]?.FlightSegment?.[0]?.DepartureDateTime ?? null;
        const depB =
          b?.Citypairs?.[0]?.FlightSegment?.[0]?.DepartureDateTime ?? null;

        if (!depA || !depB) return 0;

        const timeA = new Date(depA).getTime();
        const timeB = new Date(depB).getTime();

        return timeA - timeB; // earliest first
      });
    }
    if (this.filters.sortBy === "low") {
      this.getFlightAllDetails.sort((a, b) => {
        const durA = this.getTotalDurationInMinutes(a);
        const durB = this.getTotalDurationInMinutes(b);
        return durA - durB; // ascending = fastest first
      });
    }
    if (this.filters.sortBy === "high") {
      this.getFlightAllDetails.sort((a, b) => {
        const durA = this.getTotalDurationInMinutes(a);
        const durB = this.getTotalDurationInMinutes(b);
        return durA - durB; // ascending = fastest first
      });
    }

    if (this.selectedTab !== "alternate") {
      // Get sort type — default to ascending if null/empty
      const sortType = this.filters.sortBy?.toLowerCase() || "low";
      const isAscending = sortType === "low";
      const isDescending = sortType === "high";

      // ------------------ Cheapest Calculation ------------------
      const cheapestSorted = [...filtered].sort((a, b) => {
        const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
        const fareB = b.Fares?.[0]?.CCMax ?? Infinity;

        return isAscending
          ? fareA - fareB
          : isDescending
            ? fareB - fareA
            : fareA - fareB;
      });

      // ------------------ Recommended Calculation ------------------
      const recommendedSorted = [...filtered].sort((a, b) => {
        const durA = this.getTotalDurationInMinutes(a);
        const durB = this.getTotalDurationInMinutes(b);

        return isAscending
          ? durA - durB
          : isDescending
            ? durB - durA
            : durA - durB;
      });

      // ------------------ Handle Displayed Flights ------------------
      if (this.selectedTab === "recommended") {
        this.displayedFlights = recommendedSorted;
      } else if (this.selectedTab === "cheapest") {
        this.displayedFlights = cheapestSorted;
      } else {
        this.displayedFlights = filtered;
      }
      this.visibleSegments = this.displayedFlights.slice(0, this.loadBatch);
      this.showFirstLayoverTooltip();

    } else {
      // ------------------ Alternate tab (Nearest) ------------------
      const sortType = this.filters.sortBy?.toLowerCase() || "low";
      const isAscending = sortType === "low";
      const isDescending = sortType === "high";

      const cheapestSorted = [...filtered].sort((a, b) => {
        const fareA = a.Fares?.[0]?.CCMax ?? Infinity;
        const fareB = b.Fares?.[0]?.CCMax ?? Infinity;

        return isAscending
          ? fareA - fareB
          : isDescending
            ? fareB - fareA
            : fareA - fareB;
      });

      this.nearestPrice = cheapestSorted[0]?.Fares?.[0]?.CCMax ?? 0;
      this.displayedFlights = cheapestSorted;
      this.visibleSegments = this.displayedFlights.slice(0, this.loadBatch);
      console.log("this.visibleSegments",this.visibleSegments)
    }

    this.generateInsertIndexes();
    this.processFlightsAdvanced(this.displayedFlights);
    setTimeout(() => {
      this.SpinnerService.hide();
    }, 300);
  }

  //   onScroll(event: any) {
  //   const container = event.target;

  //   const atBottom =
  //     container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

  //   if (atBottom && !this.loading && this.visibleSegments.length < this.displayedFlights.length) {
  //     this.loading = true;
  //     setTimeout(() => {
  //       const next = this.displayedFlights.slice(
  //         this.visibleSegments.length,
  //         this.visibleSegments.length + this.loadBatch
  //       );
  //       this.visibleSegments = [...this.visibleSegments, ...next];
  //       this.loading = false;
  //     }, 50); // small delay for smoothness
  //   }
  // }
  private firstTooltipShown = false;
  isScrollDown = false;
  lastScrollTop = 0;
  onScroll(): void {
    if (!this.isBrowser) return;

    if (!this.isBrowser || this.loading) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 2400;

    const atBottom = scrollTop + windowHeight >= documentHeight - threshold;

    if (
      atBottom &&
      this.visibleSegments.length < this.displayedFlights.length
    ) {
      this.loading = true;
      setTimeout(() => {
        const next = this.displayedFlights.slice(
          this.visibleSegments.length,
          this.visibleSegments.length + this.loadBatch
        );
        this.visibleSegments = [...this.visibleSegments, ...next];
        this.loading = false;
        this.showFirstLayoverTooltip();
      }, 20);

    }




    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > this.lastScrollTop) {
      // Scrolling down
      this.isScrollDown = true;
    } else {
      // Scrolling up
      this.isScrollDown = false;
    }

    this.lastScrollTop = Math.max(st, 0);

  }
  showFirstLayoverTooltip() {
    console.log('showFirstLayoverTooltip called');

    if (this.firstTooltipShown) {
      console.log('Already shown. Returning...');
      return;
    }

    console.log('Visible Flights:', this.visibleSegments.length);

    for (const flight of this.visibleSegments) {
      console.log('Checking Flight:', flight.ItineraryId);

      if (!flight?.Citypairs?.length) {
        console.log('No Citypairs');
        continue;
      }

      for (let cityIndex = 0; cityIndex < flight.Citypairs.length; cityIndex++) {
        const cityPair = flight.Citypairs[cityIndex];

        console.log(
          `CityPair ${cityIndex} Stops:`,
          cityPair.NoOfStops
        );

        if ((cityPair?.NoOfStops || 0) > 0) {
          console.log('Found layover itinerary:', flight.ItineraryId);

          const layoverSegments = this.getLayoverSegments(
            cityPair.FlightSegment
          );

          console.log('Layover Segments:', layoverSegments);

          if (!layoverSegments.length) {
            console.log('No layover segments found');
            continue;
          }

          this.firstTooltipShown = true;


          console.log('Opening tooltip...');

          this.onSegmentClick(
            layoverSegments,
            0,
            cityIndex,
            flight.ItineraryId
          );

          setTimeout(() => {
            this.onTooltipHide();
          }, 4000);



          return;
        }
      }
    }

    console.log('No flight with layover found');
  }
  generateInsertIndexes() {
    const minGap = 4;
    const total = this.displayedFlights.length;
    const indexes: number[] = [];

    let i = Math.floor(Math.random() * minGap); // random start (0 to 3)
    while (i < total) {
      indexes.push(i);
      i += minGap + Math.floor(Math.random() * (minGap + 2)); // min gap + random 0-1-2
    }

    this.randomInsertIndexes = indexes;
  }
  onStopChange(value: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const index = this.filters.stopes.indexOf(value);

    if (checked && index === -1) {
      // Add stop if not already selected
      this.filters.stopes.push(value);
    } else if (!checked && index !== -1) {
      // Remove stop if unselected
      this.filters.stopes.splice(index, 1);
    }

    this.applyFilter();
  }
  toggleStopChip(stopValue: number): void {
    const index = this.filters.stopes.indexOf(stopValue);

    if (index > -1) {
      this.filters.stopes.splice(index, 1);
    } else {
      this.filters.stopes.push(stopValue);
    }

    this.applyFilter(); // or your existing filter method
  }
  toggleCarryOnChip(): void {
    this.filters.carryOnBaggage = !this.filters.carryOnBaggage;
    this.applyFilter();
  }

  onAirlineToggle(event: Event, airline: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.filters.airlines.includes(airline)) {
        this.filters.airlines.push(airline);
      }
    } else {
      this.filters.airlines = this.filters.airlines.filter(
        (a) => a !== airline
      );
    }

    this.applyFilter(); // Call your filter function
  }

  get visibleAirlines() {
    if (
      !this.getAllCarrierWiseFares ||
      this.getAllCarrierWiseFares.length === 0
    ) {
      return [];
    }

    // Show only the first `this.visibleAirlinesCount` airlines, for "show more" feature
    return this.getAllCarrierWiseFares.slice(0, this.visibleAirlineCount || 5);
  }

  showMoreAirlines(event: Event) {
    event.preventDefault();
    this.showAllAirlines = !this.showAllAirlines;
    this.visibleAirlineCount = this.showAllAirlines
      ? this.getFlightsAdvanced?.uniqueCarriersWithLowestFare?.length || 0
      : 5;
  }

  get visibleConnectingAirports() {
    if (!this.finalLayoverFlights?.segment?.length) {
      return [];
    }

    return this.finalLayoverFlights.segment.slice(
      0,
      this.visibleConnectingAirlineCount || 5
    );
  }

  showMoreConnectingAirlines(event: Event) {
    event.preventDefault();


    this.showAllConnectingAirlines = !this.showAllConnectingAirlines;

    this.visibleConnectingAirlineCount = this.showAllConnectingAirlines
      ? this.finalLayoverFlights?.segment?.length || 0   // ✅ FIXED
      : 5;

  }
  toggleAirlineSelection(carrierName: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.filters.airlines.includes(carrierName)) {
        this.filters.airlines.push(carrierName);
      }
    } else {
      this.filters.airlines = this.filters.airlines.filter(
        (name) => name !== carrierName
      );
    }

    this.applyFilter(); // or whatever action you want
  }
  toggleConnectingAirport(airport: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.filters.connectingAirports.includes(airport)) {
        this.filters.connectingAirports.push(airport);
      }
    } else {
      this.filters.connectingAirports = this.filters.connectingAirports.filter(
        (a) => a !== airport
      );
    }
    this.applyFilter();
  }
  getTotalDurationInMinutes(itinerary: any): number {
    return (
      itinerary.Citypairs?.reduce((total: number, cp: any) => {
        return (
          total + (cp.DurationInMinutes || this.parseDuration(cp.Duration))
        );
      }, 0) ?? 0
    );
  }

selectTab(tab: string): void {
  this.selectedTab = tab;

  // Build fares based on currently selected tab
  if (this.selectedTab === 'alternate') {
    this.getAllCarrierWiseFares = this.buildCarrierWiseFares(
      this.getNearbyDetails || []
    );
          this.fullStopWiseLowestFare = this.calculateStopWiseLowestFare(
        this.getNearbyDetails || []
      );
  } else {
    this.getAllCarrierWiseFares = this.buildCarrierWiseFares(
      this.getMainDetails || []
    );
      this.fullStopWiseLowestFare = this.calculateStopWiseLowestFare(
        this.getMainDetails || []
      );
  }
}
  // Fallback parser if DurationInMinutes is missing
  parseDuration(durationStr: string | null): number | null {
    if (!durationStr) return null;

    const match = durationStr.match(/(\d+)D\s*(\d+)H\s*(\d+)M/);
    if (!match) return null;

    const [, d, h, m] = match.map(Number);
    return (d || 0) * 1440 + (h || 0) * 60 + (m || 0);
  }
  getTotalStops(itinerary: any): number {
    return itinerary.Citypairs?.reduce(
      (acc: number, cp: any) => acc + (cp.NoOfStops || 0),
      0
    );
  }
  processFlightsAdvanced(filtered: any) {
    const itineraries = filtered || [];
    // Show all by default
    this.displayedFlights = [...itineraries];

    // Refresh tab selection
    this.selectTab(this.selectedTab);
    interface CarrierData {
      image: string;
      stopFares: {
        stopes_0: number;
        stopes_1: number;
        stopes_more: number;
      };
    }

    const carriersMap = new Map<string, CarrierData>();
    const stopWiseLowestFareMap = new Map<number, number>();
    const allBaseFares: number[] = [];

    let zeroStopCount = 0;
    let oneStopCount = 0;
    let moreThanOneStopCount = 0;

    for (const itinerary of itineraries) {
      const carrierName = itinerary.ValidatingCarrierName;
      const logoFile =
        itinerary.Citypairs?.[0]?.FlightSegment?.[0]?.FlightLogoName;
      const carrierImage = `${this.imageUrl}${logoFile}`;
      const baseFare = itinerary.Fares?.[0]?.CCMax ?? 0;
      const noOfStops = itinerary.Citypairs?.[0]?.NoOfStops ?? 0;

      allBaseFares.push(baseFare);
      // Count stops
      if (noOfStops === 0) zeroStopCount++;
      else if (noOfStops === 1) oneStopCount++;
      else moreThanOneStopCount++;

      // Track lowest stop-wise fare globally
      const existingGlobalFare = stopWiseLowestFareMap.get(noOfStops);

      if (existingGlobalFare === undefined || baseFare < existingGlobalFare) {
        stopWiseLowestFareMap.set(noOfStops, baseFare);
      }

      // Initialize carrier data if not exists
      if (!carriersMap.has(carrierName)) {
        carriersMap.set(carrierName, {
          image: carrierImage,
          stopFares: {
            stopes_0: 0,
            stopes_1: 0,
            stopes_more: 0,
          },
        });
      }

      const carrier = carriersMap.get(carrierName)!;
      const fareKey =
        noOfStops === 0
          ? "stopes_0"
          : noOfStops === 1
            ? "stopes_1"
            : "stopes_more";

      const existingFare = carrier.stopFares[fareKey];
      if (existingFare === 0 || baseFare < existingFare) {
        carrier.stopFares[fareKey] = baseFare;
      }
    }

    // Prepare result
    const uniqueCarriersWithLowestFare = Array.from(carriersMap.entries()).map(
      ([carrierName, data]) => {
        const stopFares = data.stopFares;

        // Get minimum non-zero value (if some stop type wasn't assigned yet, its default is 0)
        const fareValues = Object.values(stopFares).filter((f) => f > 0);
        const lowestFare = fareValues.length ? Math.min(...fareValues) : 0;

        return {
          ValidatingCarrierName: carrierName,
          carrierImage: data.image,
          stopWiseFares: stopFares,
          lowestFare: lowestFare, // ✅ Added key here
        };
      }
    );

    const stopWiseLowestFare: {
      stopes_0: number;
      stopes_1: number;
      stopes_more: number;
    } = {
      stopes_0: stopWiseLowestFareMap.get(0) ?? 0,
      stopes_1: stopWiseLowestFareMap.get(1) ?? 0,
      stopes_more: Array.from(stopWiseLowestFareMap.entries())
        .filter(([stops]) => stops > 1)
        .reduce((min, [_, fare]) => (min === 0 || fare < min ? fare : min), 0),
    };

    const lowestPrice = Math.min(...allBaseFares);
    const highestPrice = Math.max(...allBaseFares);

    const stopCounts = {
      stopes_0: zeroStopCount,
      stopes_1: oneStopCount,
      more_than_1: moreThanOneStopCount,
    };

    const result = {
      uniqueCarriersWithLowestFare,
      stopWiseLowestFare,
      lowestPrice,
      highestPrice,
      stopCounts,
    };

    this.getFlightsAdvanced = result;
    return result;
  }
getPackagePriceDifference(
  currentCCMax: number,
  packageCCMax: number
): number {
  return Number(currentCCMax - packageCCMax || 0);
}

getAbsoluteValue(value: number): number {
  return Math.abs(value);
}
  getTotalPrice(CCMax: number): number {
    return CCMax;
  }
  //     getTotalPrice(CCMax: number): number {
  //   return CCMax * (1 + this.markup / 100);
  // }
  //   getTotalPrice(CCMax: number, markup: number = 10): number {
  //   return CCMax + (CCMax * markup) / 100;
  // }
  getFareSubtotal(paxType: string, count: number, fare: any): number {
    const fareDetails =fare?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );
    if (!fareDetails) return 0;
    const baseFareWithMarkup =
      fareDetails.CCMax
      // const baseFareWithMarkup = fare.CCMax * (1 + this.markup / 100);

    return baseFareWithMarkup * count;
  }
    getTotal(f:any): number {
    const totalFare =
      this.getFareSubtotal('ADT', this.selectedAdults,f) +
      this.getFareSubtotal('CHD', this.selectedChildren,f) +
      this.getFareSubtotal('INF', this.selectedInfants_lap,f);

  
    return totalFare;
    //  return totalFare + totalSurcharge + this.getTravelProtectionTotal();
  }
  filterCountry(event: any) {
    this.flightService.airportlList(event.query).subscribe((res: any) => {
      if (res.success && res.data.length > 0) {
        const airport = res.data[0]; // main airport
        this.departureAirports = [];

        // Add main airport first
        this.departureAirports.push({
          type: "main",
          airport_name: airport.airport_name,
          code: airport.airport_code,
          city: airport.city,
          country: airport.country,
          latitude: airport.latitude,
          longitude: airport.longitude,
          address: airport.address,
          displayName:
            airport.city +
            ", " +
            airport.country +
            " - " +
            airport.airport_code,
        });

        // Add nearby label if groupData exists
        if (airport.groupData && airport.groupData.length > 0) {
          this.departureAirports.push({
            type: "label",
            text: `${airport.groupData.length} Nearby Airports found | within 200 km`,
          });

          // Add each nearby airport
          airport.groupData.forEach((nearby: any) => {
            this.departureAirports.push({
              type: "nearby",
              airport_name: nearby.airport_name,
              code: nearby.airport_code,
              city: nearby.city,
              country: nearby.country,
              latitude: nearby.latitude,
              longitude: nearby.longitude,
              address: nearby.address,
              displayName:
                nearby.city +
                ", " +
                nearby.country +
                " - " +
                nearby.airport_code,
            });
          });
        }
      }
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  showDropdownsort = false;
  activeSort: string = "";

  toggleDropdownsort(event: Event) {
    event.stopPropagation();
    this.showDropdownsort = !this.showDropdownsort;
  }

  closeDropdownsort() {
    this.showDropdownsort = false;
  }
selectedSortLabel = 'Cheapest Fare';

  selectSort(type: string) {
    this.activeSort = type;
    this.selectedSortLabel = type === 'cheapest' ? 'Cheapest Fare' : type === 'recommended' ? 'Recommended' : 'Nearby Airport';

    this.showDropdownsort = false; // close after selecting
    // if(type==='cheapest'){
    //   this.selectedTab='cheapest'
    // }
    this.filters.sortBy = type;
    this.applyFilter();
  }

  sendPayload(searchData: any): any {
    const payload: any = {
      CurrencyCode: "USD",
      NoOfAdults: Number(searchData?.NoOfAdults) || 1,
      // NoOfInfantSeat: Number(searchData?.NoOfInfantSeat) || 0,
      NoOfInfants: Number(searchData?.NoOfInfants) || 0,
      NoOfChildren: Number(searchData?.NoOfChildren) || 0,
      tripType: searchData?.tripType || "roundtrip",
      source: searchData?.source || "mondee",
      returnDate: "",
      OriginDestination: [],
    };

    const formatDate = (date: string) => {
      if (!date) return "";
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const tripType = payload.tripType;
    const originDest = searchData?.OriginDestination || [];
    const cabinClass = originDest[0]?.CabinClass || "ECONOMY";
    if (tripType === "oneway") {
      payload.OriginDestination.push({
        DepartureTime: formatDate(searchData?.DepartureTime),
        DepartureLocationCode: searchData?.DepartureLocationCode,
        ArrivalLocationCode: searchData?.ArrivalLocationCode,
        CabinClass: searchData?.cabinClass || "E",
      });
    } else if (tripType === "roundtrip") {
      payload.OriginDestination.push(
        {
          DepartureTime: formatDate(searchData?.DepartureTime),
          DepartureLocationCode: searchData?.DepartureLocationCode,
          ArrivalLocationCode: searchData?.ArrivalLocationCode,
          CabinClass: searchData?.cabinClass || "E",
        },
        {
          DepartureTime: formatDate(searchData?.ArrivalTime),
          DepartureLocationCode: searchData?.ArrivalLocationCode,
          ArrivalLocationCode: searchData?.DepartureLocationCode,
          CabinClass: searchData?.cabinClass || "E",
        }
      );
      payload.returnDate = formatDate(searchData?.ArrivalTime);
    } else if (tripType === "multicity") {
      originDest.forEach((seg: any) => {
        payload.OriginDestination.push({
          DepartureTime: formatDate(seg.DepartureTime),
          DepartureLocationCode: seg.DepartureLocationCode.code,
          ArrivalLocationCode: seg.ArrivalLocationCode.code,
          CabinClass: seg.CabinClass || cabinClass,
        });
      });
    }

    return payload;
  }

  // TODO: COPY TO SYNCINNS
  arrivalCountry: string = "";
  departCountry: string = "";
  isDomestic: boolean = false;
  arrivalCountries: string[] = [];
  departureCountries: string[] = [];
  onArrivalSelected(event: any) {
    this.arrivalCountry = event?.value?.country || "";
  }
  onDepartSelected(event: any) {
    this.departCountry = event?.value?.country || "";
  }
  onDepartureSelected(event: any, index: number) {
    const country = event?.value?.country || "";
    this.departureCountries[index] = country;
  }

  onArrivalSelectedMulti(event: any, index: number) {
    const country = event?.value?.country || "";
    this.arrivalCountries[index] = country;
  }
  checkIfAllDomestic(): boolean {
    const allCountries = new Set<string>();

    // Add top-level countries if any
    if (this.arrivalCountry) allCountries.add(this.arrivalCountry);
    if (this.departCountry) allCountries.add(this.departCountry);

    // Add countries from arrays
    this.arrivalCountries.forEach((country) => allCountries.add(country));
    this.departureCountries.forEach((country) => allCountries.add(country));
    // Domestic only if all are the same
    return allCountries.size === 1;
  }
  /** Get single airline card width */
  private readonly SLIDE_WIDTH = 140;


  scrollLeft(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.tableWrapper.nativeElement;

    const current = el.scrollLeft;
    const target =
      Math.floor(current / this.SLIDE_WIDTH) * this.SLIDE_WIDTH -
      this.SLIDE_WIDTH;

    el.scrollTo({
      left: Math.max(0, target),
      behavior: 'smooth'
    });

    setTimeout(() => this.updateScrollButtons(), 300);
  }


  scrollRight(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.tableWrapper.nativeElement;

    const current = el.scrollLeft;
    const target =
      Math.ceil(current / this.SLIDE_WIDTH) * this.SLIDE_WIDTH +
      this.SLIDE_WIDTH;

    el.scrollTo({
      left: Math.min(el.scrollWidth, target),
      behavior: 'smooth'
    });

    setTimeout(() => this.updateScrollButtons(), 300);
  }

currentSlideIndex = 0;
updateScrollButtons(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  if (!this.tableWrapper?.nativeElement) return;

  const el = this.tableWrapper.nativeElement;

  this.isScrollLeftDisabled = el.scrollLeft <= 0;

  this.isScrollRightDisabled =
    Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;

  // Get the slide currently at the right edge
  this.currentSlideIndex = Math.ceil(
    (el.scrollLeft + el.clientWidth) / this.SLIDE_WIDTH
  ) - 1;

  console.log('current slide index:', this.currentSlideIndex);
}


  @HostListener("window:resize")
  onResize(): void {
    this.updateScrollButtons();
    if (this.isMobile) {
      //  this.onCloseClick();
    }
  }

  showFlightDetails(itineraryId: number): void {
    this.showDetailsMap[itineraryId] = !this.showDetailsMap[itineraryId];
  }

  hideFlightDetails(itineraryId: number): void {
    this.showDetailsMap[itineraryId] = !this.showDetailsMap[itineraryId];
  }

  getSliderBackground(value: number): string {
    return `linear-gradient(to right, orange ${value}%, #ccc ${value}%)`;
  }

  navigateFlightDetails(data: any): void {
    this.spinloading = true;

    // // ✅ Only call API for agency flight
    // if (data?.Source === 'agency-flight') {
    //   this.spinloader = true;
    //   const payload = {
    //     OfferCode: data?.ItineraryId,
    //     SearchGuid: data?.SessionId,
    //     CurrencyCode: "USD"
    //   };

    //   this.flightService.getFlightfareFamily(payload).subscribe({
    //     next: (res: any) => {

    //       if (res?.success && res?.data?.fares?.length) {

    //         const upgradeOptions = (res.data.fares || []).map((item: any) => ({
    //           ...item,
    //           fares: (item.fares || []).sort((a: any, b: any) => a.price - b.price)
    //         }));

    //         // ✅ Store fare family
    //         this.flightService.setFullFareFamilyData(upgradeOptions);
    //         this.proceedNavigation(data, upgradeOptions);
    //         this.spinloader = false;
    //       } else {
    //         this.flightService.setFullFareFamilyData(null);
    //         this.proceedNavigation(data, null);
    //         this.spinloader = false;
    //       }

    //     },

    //     error: () => {
    //       this.flightService.setFullFareFamilyData(null);
    //       this.proceedNavigation(data, null);
    //       this.spinloader = false;
    //     }
    //   });

    // } else {
    //   // ✅ Non-agency → skip API
    //   this.flightService.setFullFareFamilyData(null);
    //   this.proceedNavigation(data, null);
    // }

    this.flightService.setFullFareFamilyData(null);

    this.proceedNavigation(data, null);
  }

  proceedNavigation(data: any, upgradeOptions?: any) {

    this.flightService.setFlights(this.storeFullData);
    this.flightService.setDetailsData(data);
 this.spinloading = false;
 if(this.packageTabActive){
  this.router.navigate(["/package-review-and-payment"], {
        queryParams: { id: data.ItineraryId }
      });
 }else{
   

  // this.router.navigate(["/flight/booking"], {
  //       queryParams: { id: data.ItineraryId }
  //     });
const urlTree = this.router.createUrlTree(
  ['/flight/booking'],
  {
        queryParams: { id: data.ItineraryId }
      }
);

const url = this.router.serializeUrl(urlTree);

window.open(url, '_blank', 'noopener,noreferrer');

      
    
 }
  
  }

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  slidePrev() {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  }

  slideNext() {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  }
  getMaxMinutes(duration: string): number {
    if (!duration) return 0;
    const hours = parseInt(duration.match(/(\d+)H/)?.[1] || "0", 10);
    const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || "0", 10);
    return hours * 60 + minutes;
  }
  reset(): void {
    this.filterService.resetFilters();
    this.resetFilters();
    this.sliderValue = [this.lowestPrice, this.highestPrice];
    this.filters.rangeValues = [this.lowestPrice, this.highestPrice];

    this.filters.stopes = [];
    this.filters.airlines = [];
    this.selectedFare = null;

    this.filters.connectingAirports = [];
    this.filters.getNearbyfaredepart = [];
    this.filters.getNearbyfarereturn = [];

    this.filters.returnArrivalTime = [];
    this.filters.returnDepartureTime = [];
    this.filters.sortBy = "";
    this.filters.arrivalTime = [];
    this.filters.departureTime = [];
    // if()
    // this.selectedTab = "cheapest";

    // ✅ IMPORTANT: reset durations object
    this.filters.durations = {};
    this.defaultDurations = {};
    if (
      !this.finalLayoverFlights ||
      !Array.isArray(this.finalLayoverFlights.duration)
    ) {
      this.applyFilter();
      return;
    }

    // ✅ MULTI-CITY RESET
    this.finalLayoverFlights.duration.forEach((item: any) => {
      const maxMinutes = this.getMaxMinutes(item.highestDuration);

      this.filters.durations[item.type] = maxMinutes;

      // also reset defaults (used in summary)
      if (!this.defaultDurations) {
        this.defaultDurations = {};
      }
      this.defaultDurations[item.type] = maxMinutes;
    });

    this.applyFilter();
  }

  ngOnDestroy() {
    this.filterSub?.unsubscribe();
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
  onAirlineHeaderClick(airlineName: string): void {
    const isSelected = this.filters.airlines.includes(airlineName);
    const fakeEvent = { target: { checked: !isSelected } } as unknown as Event;
    this.toggleAirlineSelection(airlineName, fakeEvent);
  }

  onFareClick(price: number, stopType: number, carrierName: string): void {

    const isSameSelection =
      this.selectedFare &&
      this.selectedFare.price === price &&
      this.selectedFare.stopType === stopType &&
      this.selectedFare.carrierName === carrierName;

    if (isSameSelection) {
      // ❌ Reset everything
      this.selectedFare = null;
      this.sliderValue = [this.lowestPrice, this.highestPrice];
      this.filters.rangeValues = [...this.sliderValue];
      this.filters.stopes = [];

      // ❌ ALSO remove airline selection
      const isSelected = this.filters.airlines.includes(carrierName);
      if (isSelected) {
        this.onAirlineHeaderClick(carrierName);
      }

    } else {
      // ✅ New selection
      const min = Math.max(price, this.lowestPrice);
      const max = this.highestPrice;

      this.sliderValue = [min, max];
      this.filters.rangeValues = [min, max];
      this.filters.stopes = [stopType];

      this.selectedFare = { price, stopType, carrierName };

      // ✅ ALSO select airline
      if (!this.filters.airlines.includes(carrierName)) {
        this.onAirlineHeaderClick(carrierName);
      }
    }

    this.onPriceRangeChange();
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

  // toggleLuggage(index: number, event: MouseEvent) {
  //   this.activeTrollyIndex = null;
  //   this.trollyPanelReady = false;

  //   const opening = this.activeLuggageIndex !== index;
  //   this.activeLuggageIndex = opening ? index : null;
  //   this.luggagePanelReady = false; // hide until positioned, even on reopen

  //   if (opening) {
  //     this.positionPanel(event.currentTarget as HTMLElement, 'luggage');
  //   }
  // }
  // closeLuggage() {
  //   this.activeLuggageIndex = null;
  //   this.luggagePanelReady = false;
  // }
  // toggleTrolly(index: number, event: MouseEvent) {
  //   this.activeLuggageIndex = null;
  //   this.luggagePanelReady = false;

  //   const opening = this.activeTrollyIndex !== index;
  //   this.activeTrollyIndex = opening ? index : null;
  //   this.trollyPanelReady = false;

  //   if (opening) {
  //     this.positionPanel(event.currentTarget as HTMLElement, 'trolly');
  //   }
  // }
  // closeTrolly() {
  //   this.activeTrollyIndex = null;
  //   this.trollyPanelReady = false;
  // }
  onMaskClick() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isMobileSearchVisible = true;
    this.isdialogopen = false;
    document.body.classList.remove("dialog-open");
  }
  getFormattedPrice(value: number | undefined | null): {
    integer: string;
    decimal: string;
  } {
    const num = value ?? 0;
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

    const [integer, decimal] = formatted.split(".");
    return { integer, decimal: decimal || "00" };
  }

  // ✅ Return only segments that have LayoverTime
  getLayoverSegments(segments: any[]): any[] {
    if (!segments || !Array.isArray(segments)) return [];
    const layovers = segments.filter(
      (s) => s.LayoverTime && s.LayoverTime.trim() !== ""
    );
    this.totaltool = layovers.length; // optional global count
    return layovers;
  }
  activeSegments: {
    [itineraryId: string]: {
      [cityIndex: number]: number | null;
    };
  } = {};
  tooltipVisible = false; // Track tooltip visibility

  // Detect clicks outside — this runs for every document click
  @HostListener("document:click", ["$event"])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const insideTooltip = target.closest(
      ".p-tooltip, .c-flight-list-card__segment--stop"
    );
    if (!insideTooltip) {
      this.clearAllActive();
      this.tooltipVisible = false;
    }
    const clickedInside = this.dropdownPanels?.some(panel =>
      panel.nativeElement.contains(event.target)
    );

    if (!clickedInside) {
      this.openIndex = null; // ✅ close dropdown
    }
  }

  // onSegmentClick(
  //   layoverSegments: any[],
  //   index: number,
  //   cityIndex: number,
  //   itineraryId: string
  // ) {
  //   // Ensure structure exists
  //   if (!this.activeSegments[itineraryId]) {
  //     this.activeSegments[itineraryId] = {};
  //   }

  //   const currentActive = this.activeSegments[itineraryId][cityIndex] ?? null;

  //   // ✅ Step 1: If the same one is clicked again → deactivate and close tooltip
  //   if (currentActive === index) {
  //     this.clearAllActive();
  //     this.tooltipVisible = false;
  //     return;
  //   }

  //   // ✅ Step 2: Clear all previous actives (only one active globally)
  //   this.clearAllActive();

  //   // ✅ Step 3: Activate the clicked one
  //   this.activeSegments[itineraryId][cityIndex] = index;
  //   this.tooltipVisible = true;

  //   // ✅ Step 4: Update tooltip data
  //   this.tooltipRefreshKey++;
  //   this.layoverList = layoverSegments;
  //   this.currentTooltipIndex = index;

  //   const totalStops = layoverSegments.length;
  //   const currentSegment = layoverSegments[index];
  //   this.currentTooltipClass = this.computeTooltipClass(layoverSegments, index);

  //   if (totalStops >= 3) {
  //     this.layoverList = layoverSegments;
  //   } else if (currentSegment) {
  //     this.currentLayover = {
  //       OriginAirportName: currentSegment.OriginAirportName,
  //       LayoverTime: currentSegment.LayoverTime,
  //     };
  //   }

  //   this.totaltool = totalStops;
  // }

  // // ✅ Tooltip hide event handler
  // onTooltipHide() {
  //   this.tooltipVisible = false;
  //   this.clearAllActive();
  // }

  // // ✅ Reusable helper to deactivate all
  // clearAllActive() {
  //   Object.keys(this.activeSegments).forEach((id) => {
  //     Object.keys(this.activeSegments[id]).forEach((city: any) => {
  //       this.activeSegments[id][city] = null;
  //     });
  //   });
  // }

  activateAllStops: any = {};
  tooltipContext: {
    itineraryId: string;
    cityIndex: number;
  } | null = null;

  onSegmentClick(
    layoverSegments: any[],
    index: number,
    cityIndex: number,
    itineraryId: string,
    event?: MouseEvent
  ) {
    event?.stopPropagation();

    this.layoverList = [];
    // Ensure structure exists
    if (!this.activeSegments[itineraryId]) {
      this.activeSegments[itineraryId] = {};
    }
    const currentActive = this.activeSegments[itineraryId][cityIndex] ?? null;

    // ✅ Step 1: If the same one is clicked again → deactivate and close tooltip
    if (currentActive === index) {
      this.clearAllActive();
      this.tooltipVisible = false;
      this.showTooltip[cityIndex] = false;

      return;
    }

    // ✅ Step 2: Clear all previous actives (only one active globally)
    this.clearAllActive();
    // ✅ Step 3: Activate the clicked one
    this.activeSegments[itineraryId][cityIndex] = index;
    this.tooltipContext = {
      itineraryId,
      cityIndex,
    };
    this.tooltipVisible = true;
    this.showTooltip[cityIndex] = true;

    // ✅ Step 4: Update tooltip data
    this.tooltipRefreshKey++;
    this.layoverList = layoverSegments;
    this.currentTooltipIndex = index;

    const totalStops = layoverSegments.length;
    const currentSegment = layoverSegments[index];
    this.currentTooltipClass = this.computeTooltipClass(layoverSegments, index);
    if (totalStops >= 1) {
      this.layoverList = layoverSegments;
    } else if (currentSegment) {
      this.currentLayover = {
        OriginAirportName: currentSegment.OriginAirportName,
        LayoverTime: currentSegment.LayoverTime,
      };
    }

    this.totaltool = totalStops;
  }
  getAirportLabel(name: string): string {
    if (!name) return "";

    return name
      .replace(/\binternational\b/gi, "intl.")
      .replace(/\bairport\b/gi, "apt.")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ✅ Tooltip hide event handler
  onTooltipHide() {
    this.tooltipVisible = false;
    this.clearAllActive();
    this.cdr.markForCheck();
  }

  // ✅ Reusable helper to deactivate all

  // Compute tooltip class
  computeTooltipClass(layoverSegments: any[], index: number | string): string {
    const total = layoverSegments.length;
    if (total >= 1) {
      // if (index === 0 || index === total - 1) return 'single-tool-tip';
      return "multiple-tool-tip";
    }
    return "multiple-tool-tip";
  }
  private autoTooltipTimer: any;

  onRouteClick(
    flightSegment: any[],
    cityIndex: number,
    itineraryId: string,
    event: MouseEvent
  ) {
    const layoverSegments = this.getLayoverSegments(flightSegment);
    if (!layoverSegments || layoverSegments.length === 0) return;

    // Reset flags
    this.clearAllActive();

    if (!this.activateAllStops[itineraryId]) {
      this.activateAllStops[itineraryId] = {};
    }

    // Mark ALL stops as active
    this.activateAllStops[itineraryId][cityIndex] = true;

    // Open tooltip using the first segment
    this.onSegmentClick(layoverSegments, 0, cityIndex, itineraryId, event);
  }
  clearAllActive() {
    // clear individual actives
    Object.keys(this.activeSegments).forEach((id) => {
      Object.keys(this.activeSegments[id]).forEach((city: any) => {
        this.activeSegments[id][city] = null;
      });
    });

    // clear activate-all flags
    this.activateAllStops = {};

    // 🔥 VERY IMPORTANT: close ALL tooltips
    this.showTooltip = [];
  }

  // // Compute tooltip class
  // computeTooltipClass(layoverSegments: any[], index: number | string): string {
  //   const total = layoverSegments.length;
  //   if (total === 1) return 'single-tool-tip';
  //   if (total === 2) return index === 0 ? 'single-tool-tip' : 'single-tool-tip';
  //   if (total >= 3) {
  //     if (index === 0 || index === total - 1) return 'single-tool-tip';
  //     return 'multiple-tool-tip';
  //   }
  //   return 'single-tool-tip';
  // }

  getBaggageInfo(type: string, baggageAllowance: any, flightInfo: any) {
    if (!baggageAllowance || !flightInfo?.Citypairs)
      return { depart: [], return: [] };
    const departBags: any[] = [];
    const returnBags: any[] = [];
    const cityPairs = flightInfo.Citypairs;

    cityPairs.forEach((pair: any, index: number) => {
      const flightSegments = pair?.FlightSegment || [];
      if (flightSegments.length === 0) return;

      // Determine direction (depart for first, return for second)
      const direction =
        cityPairs.length > 1 ? (index === 0 ? "depart" : "return") : "depart";

      // Build list of segment keys (e.g., "CCU-DOH", "DOH-LAX")
      const pairSegmentKeys = flightSegments.map(
        (seg: any) => `${seg.DepartureLocationCode}-${seg.ArrivalLocationCode}`
      );

      // Match baggageAllowance segments
      for (const segmentKey in baggageAllowance) {
        if (!baggageAllowance.hasOwnProperty(segmentKey)) continue;

        if (pairSegmentKeys.includes(segmentKey)) {
          baggageAllowance[segmentKey].forEach((bag: any) => {
            // ✅ Only include valid bags (not 0P and matching type)
            if (bag.type === type) {
              // Normalize piece count (string like '0P', '1P', etc.)
              const pieces = (bag.noOfPieces || "").toString().toUpperCase();

              const bagData = {
                seg: segmentKey,
                description1: "",
                description2: bag.description2 || bag.Description2 || "",
                weight: bag.weight || bag.Weight || "",
                count: bag.count || 0,
                direction,
                from: segmentKey.split("-")[0],
                to: segmentKey.split("-")[1],
              };
              const isOnePieceNoInfo =
                pieces === "1P" &&
                !bag.description1 &&
                !bagData.description2 &&
                (!bagData.weight || bagData.weight === 0);
              if (
                pieces === "0P" ||
                pieces === "0PCS" ||
                pieces === "0" ||
                pieces === "0Pieces"
              ) {
                // Show airline message if no pieces
                // bagData.description1 = "Kindly check with the airline.";
              } else {
                // Normal case: use actual description
                bagData.description1 =
                  bag.description1 || bag.Description1 || "";
              }

              // Push to correct array
              if (direction === "depart") departBags.push(bagData);
              else returnBags.push(bagData);
            }
          });
        }
      }
    });

    return { depart: departBags, return: returnBags };
  }

  // getDurationParts(duration: string): { days: number; time: string } {
  //   if (!duration) return { days: 0, time: "" };

  //   const dayMatch = duration.match(/(\d+)D/);
  //   const hourMinMatch = duration.match(/(?:\d+D\s*)?(\d+H\s*\d+M)/);

  //   const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  //   const time = hourMinMatch ? hourMinMatch[1] : "";

  //   return { days, time };
  // }
  getSegmentDurationParts(
    flightSegments: any[]
  ): { days: number; time: string } {

    if (!Array.isArray(flightSegments) || flightSegments.length < 2) {
      return {
        days: 0,
        time: ''
      };
    }

    const firstSegment = flightSegments[0];
    const lastSegment = flightSegments[flightSegments.length - 1];

    const departure = firstSegment?.DepartureDateTime;
    const arrival = lastSegment?.ArrivalDateTime;

    if (!departure || !arrival) {
      return {
        days: 0,
        time: ''
      };
    }

    // Backend datetime is already in the required local timezone.
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);

    // Compare only calendar dates
    const departureDay = Date.UTC(
      departureDate.getFullYear(),
      departureDate.getMonth(),
      departureDate.getDate()
    );

    const arrivalDay = Date.UTC(
      arrivalDate.getFullYear(),
      arrivalDate.getMonth(),
      arrivalDate.getDate()
    );

    const days = Math.max(
      0,
      Math.round(
        (arrivalDay - departureDay) /
        (1000 * 60 * 60 * 24)
      )
    );

    // Total actual duration
    const diffMs = arrivalDate.getTime() - departureDate.getTime();

    if (diffMs < 0) {
      return {
        days,
        time: ''
      };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      days,
      time: `${hours}H ${minutes}M`
    };
  }

  toggleReadMore() {
    this.showMore = !this.showMore;
  }
  //for filter on mobile

  openFilterModal() {
    // Create a deep copy to ensure changes inside the modal don't affect the main list
  }
  getDurations: { [key: string]: number } = {};
  openFilterDialog() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isfilterDialogOpen = true;

    this.getrangeValues = this.filters.rangeValues;

    // ❌ REMOVE old
    // this.getarrivalDurations = this.filters.arrivalDurations;
    // this.getdepartureDurations = this.filters.departureDurations;

    // ✅ NEW (clone durations object safely)
    this.getDurations = { ...(this.filters.durations || {}) };

    this.filtersForModal = { ...this.filters };

    this.toggleDrawerScroll(true);
    document.body.classList.remove("dialog-open");
  }
  // 2. Close Modal (optional, handles closing without applying)
  onClose() {
    this.isfilterDialogOpen = false;
    this.filtersForModal = null; // Clear the temporary data
    this.toggleDrawerScroll(false);
    this.applyFilter();
  }

  // 3. Apply Filters: Called when the modal emits the applied data
  onFiltersApplied(newFilters: FlightFilters) {
    this.toggleDrawerScroll(false);

    this.activeFilters = newFilters;
    this.filterService.setFilters(newFilters);

    this.isfilterDialogOpen = false;

    this.applyFilter();

    this.filtersForModal = null;

    this.sliderValue = [
      newFilters.rangeValues[0],
      newFilters.rangeValues[1],
    ];

    this.getrangeValues = this.filters.rangeValues;

    // ❌ REMOVE OLD
    // this.getarrivalDurations = this.filters.arrivalDurations;
    // this.getdepartureDurations = this.filters.departureDurations;

    // ✅ NEW (MULTI-CITY SUPPORT)
    this.getDurations = { ...(newFilters.durations || {}) };

    // ✅ Tab logic
    if (
      newFilters.getNearbyfarereturn.length !== 0 ||
      newFilters.getNearbyfaredepart.length !== 0
    ) {
      this.selectedTab = "alternate";
    } else {
      this.selectedTab = "cheapest";
    }
  }
  getOperatedAirlines(flightInfo: any): string[] {
    if (!flightInfo?.Citypairs) return [];

    const airlineSet = new Set<string>();

    flightInfo.Citypairs.forEach((pair: any) => {
      pair.FlightSegment?.forEach((seg: any) => {
        const operating = seg?.OperatingAirlineName?.trim();
        const marketing = seg?.MarketingAirlineName?.trim();

        // Add only if exists and not same as marketing airline
        if (operating && operating !== marketing) {
          airlineSet.add(operating);
        }
      });
    });

    return Array.from(airlineSet);
  }


  getDurationLabel(type: string, direction: string): string {
    const index = Number(type.split("_")[1]);

    if (direction === 'multicity') {
      return `Flight ${index + 1}`;
    }

    // one-way / roundtrip
    if (index === 0) return 'Departure';
    if (index === 1) return 'Return';

    return `Segment ${index + 1}`; // fallback
  }
  // --- Common function to generate summary and count active filters ---
  generateFilterSummary(
    filters: FlightFilters,
    defaults: {
      lowestPrice: number;
      highestPrice: number;
      defaultDurations: any;
    }
  ): { summary: string; activeCount: number } {

    this.filterChips = this.generateFilterChips(filters, defaults);
    const parts: string[] = [];
    let activeCount = 0;

    // Stops
    if (filters.stopes?.length) {
      const stopText = filters.stopes
        .map((s) => {
          if (s === 0) return "Non Stop";
          if (s === 1) return "1 stop";
          return "1+ stop";
        })
        .join(", ");
      parts.push(stopText);
      activeCount += 1;
    }

    // Airlines
    if (filters.airlines?.length) {
      parts.push(filters.airlines.join(", "));
      activeCount += 1;
    }
    const formatTimeLabel = (value: string): string => {
      switch (value?.toLowerCase()) {
        case "night":
          return "Early Morning";
        case "morning":
          return "Morning";
        case "afternoon":
          return "Afternoon";
        case "evening":
          return "Evening";
        default:
          return value;
      }
    };

    // Departure / Arrival times
    if (filters.departureTime?.length) {
      const depTimes = filters.departureTime
        .map(formatTimeLabel)
        .join(", ");
      parts.push(`Departure Time: ${depTimes}`);
      activeCount += 1;
    }
    if (filters.arrivalTime?.length) {
      const arrTimes = filters.arrivalTime
        .map(formatTimeLabel)
        .join(", ");
      parts.push(`Arrival Time: ${arrTimes}`);
      activeCount += 1;
    }


    // Return Departure Time
    if (filters.returnDepartureTime?.length) {
      const retDepTimes = filters.returnDepartureTime
        .map(formatTimeLabel)
        .join(", ");
      parts.push(`Return Departure Time: ${retDepTimes}`);
      activeCount += 1;
    }
    if (filters.returnArrivalTime?.length) {
      const retArrTimes = filters.returnArrivalTime
        .map(formatTimeLabel)
        .join(", ");
      parts.push(`Return Arrival Time: ${retArrTimes}`);
      activeCount += 1;
    }



    // Helper to convert "30H 43M" → total minutes
    function durationToMinutes(durationStr: string): number {
      const hoursMatch = durationStr.match(/(\d+)H/);
      const minsMatch = durationStr.match(/(\d+)M/);
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
      return hours * 60 + mins;
    }

    // --- Durations summary ---
    const partsArr: string[] = [];
    // Convert flight durations to minutes
    // ✅ NEW MULTI CITY DURATION SUMMARY
    if (this.finalLayoverFlights?.duration?.length > 0) {

      Object.keys(filters.durations || {}).forEach((type) => {
        const current = filters.durations[type];
        const def = defaults.defaultDurations?.[type];

        if (current !== def) {

          const d = this.formatDuration(current);

          const index = Number(type.split("_")[1]);

          // 🔥 GET DIRECTION
          const direction = this.finalLayoverFlights?.duration?.[0]?.direction;

          let label = '';

          if (direction === 'multicity') {
            // ✅ Flight 1, Flight 2...
            label = `Flight ${index + 1}`;
          } else {
            // ✅ Roundtrip / Oneway
            if (index == 0) {
              label = 'Departure';
            } else if (index == 1) {
              label = 'Return';
            } else {
              label = `Segment ${index + 1}`; // fallback
            }
          }

          parts.push(
            `${label} Duration: ${d.hours}h ${d.minutes}m`
          );

          activeCount += 1;
        }
      });
    }
    // Price range
    if (filters.rangeValues?.length === 2) {
      const [min, max] = filters.rangeValues;

      // Only show if not default AND different from actual lowest/highest price
      const isDefaultRange = min === 0 && max === 1000000;
      const isSameAsFlightRange =
        min === defaults.lowestPrice && max === defaults.highestPrice;

      if (!isDefaultRange && !isSameAsFlightRange) {
        parts.push(`$${min} - $${max}`);
        activeCount += 1;
      }
    }

    // Connecting airports
    if (filters.connectingAirports?.length) {
      parts.push(`Connecting: ${filters.connectingAirports.join(", ")}`);
      activeCount += 1;
    }

    // Nearby fares
    if (filters.getNearbyfarereturn?.length) {
      parts.push(`Nearby: ${filters.getNearbyfarereturn.join(", ")}`);
      activeCount += 1;
    }

    const summary = activeCount === 0 ? "Filter by" : parts.join(" | ");

    return {
      summary,
      activeCount,
    };
  }
  generateFilterChips(
    filters: FlightFilters,
    defaults: {
      lowestPrice: number;
      highestPrice: number;
      defaultDurations: any;
    }
  ) {
    const chips: any[] = [];

    // ----------- STOPES -----------
    if (filters.stopes?.length) {
      const stopText = filters.stopes.map((s) => {
        if (s === 0) return "Non Stop";
        if (s === 1) return "1 stop";
        return "1+ stop";
      });

      chips.push({
        label: stopText.join(", "),
        value: [...filters.stopes], // store raw stops [0,1,2]
        type: "stopes",
      });
    }

    // ----------- AIRLINES -----------
    if (filters.airlines?.length) {
      chips.push({
        label: filters.airlines.join(", "),
        value: [...filters.airlines],
        type: "airlines",
      });
    }

    const formatTimeLabel = (value: string): string => {
      switch (value?.toLowerCase()) {
        case "night":
          return "Early Morning";
        case "morning":
          return "Morning";
        case "afternoon":
          return "Afternoon";
        case "evening":
          return "Evening";
        default:
          return value;
      }
    };


    // ----------- DEPARTURE TIME -----------
    if (filters.departureTime?.length) {
      chips.push({
        label: `Departure Time: ${filters.departureTime.map(formatTimeLabel).join(", ")}`,
        value: [...filters.departureTime],
        type: "departureTime",
      });
    }
    // ----------- ARRIVAL TIME -----------

    if (filters.arrivalTime?.length) {
      chips.push({
        label: `Arrival Time: ${filters.arrivalTime.map(formatTimeLabel).join(", ")}`,
        value: [...filters.arrivalTime],
        type: "arrivalTime",
      });
    }
    // -----------Return DEPARTURE TIME -----------


    if (filters.returnDepartureTime?.length) {
      chips.push({
        label: `Return Departure Time: ${filters.returnDepartureTime.map(formatTimeLabel).join(", ")}`,
        value: [...filters.returnDepartureTime],
        type: "returnDepartureTime",
      });
    }

    // ----------- ARRIVAL TIME -----------

    if (filters.returnArrivalTime?.length) {
      chips.push({
        label: `Return Arrival Time: ${filters.returnArrivalTime.map(formatTimeLabel).join(", ")}`,
        value: [...filters.returnArrivalTime],
        type: "returnArrivalTime",
      });
    }

    // ----------- DURATION HELPERS -----------
    function durationToMinutes(durationStr: string): number {
      const hoursMatch = durationStr.match(/(\d+)H/);
      const minsMatch = durationStr.match(/(\d+)M/);
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
      return hours * 60 + mins;
    }

    // ----------- DURATION FILTERS -----------
    // ✅ MULTI CITY DURATION CHIPS
    Object.keys(filters.durations || {}).forEach((type) => {

      const current = filters.durations[type];
      const def = defaults.defaultDurations?.[type];


      if (current !== def) {
        if (current == null || def == null) {
          return; // or continue if this is inside a loop
        }
        const d = this.formatDuration(current);

        const direction = this.finalLayoverFlights?.duration?.[0]?.direction;
        const label = this.getDurationLabel(type, direction);
        chips.push({
          label: `${label} Duration: ${d.hours}h ${d.minutes}m`,
          value: current,
          type: "durations",
          key: type
        });
      }
    });

    // ----------- PRICE RANGE -----------
    if (filters.rangeValues?.length === 2) {
      const [min, max] = filters.rangeValues;

      const isDefaultRange = min === 0 && max === 1000000;
      const isSameAsFlightRange =
        min === defaults.lowestPrice && max === defaults.highestPrice;

      if (!isDefaultRange && !isSameAsFlightRange) {
        chips.push({
          label: `$${Math.round(this.getTotalPrice(min))} - $${Math.round(this.getTotalPrice(max))}`,
          value: [min, max],
          type: "rangeValues",
        });
      }
    }

    // ----------- CONNECTING AIRPORTS -----------
    if (filters.connectingAirports?.length) {
      chips.push({
        label: `Connecting: ${filters.connectingAirports.join(", ")}`,
        value: [...filters.connectingAirports],
        type: "connectingAirports",
      });
    }

    // ----------- NEARBY FARE -----------
    if (filters.getNearbyfarereturn?.length) {
      chips.push({
        label: `Nearby: ${filters.getNearbyfarereturn.join(", ")}`,
        value: [...filters.getNearbyfarereturn],
        type: "getNearbyfarereturn",
      });
    }

    return chips;
  }

  removeChip(chip: any) {
    switch (chip.type) {

      case "stopes":
        this.filters.stopes = [];
        break;

      case "airlines":
        this.filters.airlines = [];
        break;

      case "departureTime":
        this.filters.departureTime = [];
        break;

      case "arrivalTime":
        this.filters.arrivalTime = [];
        break;

      case "returnDepartureTime":
        this.filters.returnDepartureTime = [];
        break;

      case "returnArrivalTime":
        this.filters.returnArrivalTime = [];
        break;

      // ✅ NEW DYNAMIC DURATION RESET
      case "durations":
        if (
          this.finalLayoverFlights?.duration &&
          Array.isArray(this.finalLayoverFlights.duration)
        ) {
          this.finalLayoverFlights.duration.forEach((item: any, index: number) => {
            const key = item.type; // e.g. citypair_0

            const max = this.getMaxMinutes(item.highestDuration);

            if (!this.filters.durations) {
              this.filters.durations = {};
            }

            // ✅ reset each slider to max
            this.filters.durations[key] = max;
          });
        }
        break;

      case "rangeValues":
        this.sliderValue = [this.lowestPrice, this.highestPrice];
        this.filters.rangeValues = [this.lowestPrice, this.highestPrice];
        break;

      case "connectingAirports":
        this.filters.connectingAirports = [];
        break;

      case "getNearbyfaredepart":
        this.filters.getNearbyfaredepart = [];
        break;

      case "getNearbyfarereturn":
        this.filters.getNearbyfarereturn = [];
        break;
    }

    this.applyFilter(); // re-apply filters
  }

  // Convert total minutes → readable object {hours, minutes}
  formatDuration(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }

  // Get current duration value (in minutes)
  getCurrentDuration(type: string): number {
    return this.filters?.durations?.[type] ?? 0;
  }
  onDurationChange(type: string, event: Event): void {
    const inputVal = Number((event.target as HTMLInputElement).value);

    const dur = this.finalLayoverFlights?.duration?.find(
      (d: any) => d.type === type
    );

    const max = dur ? this.getMaxMinutes(dur.highestDuration) : 0;

    // ✅ allow 0, only fallback if invalid
    const valueToSet = isNaN(inputVal) ? max : inputVal;

    // ✅ ensure object exists
    if (!this.filters.durations) {
      this.filters.durations = {};
    }

    // ✅ dynamic assign
    this.filters.durations[type] = valueToSet;

    // ✅ sync helper values if needed (optional)
    // this.getDurations[type] = valueToSet;

    this.applyFilter();
  }

  getFillPercent(value: number, max: number): number {
    // ✅ Both zero → fully black
    if (value === 0 && max === 0) return 0;

    // ✅ Value zero but max exists → fully black
    if (value === 0) return 0;

    // ✅ Safety
    if (max === 0) return 0;

    // ✅ Normal case
    return (value / max) * 100;
  }

  get tripTypeLabel(): string {
    const type = this.tripType;
    switch (type) {
      case "oneway":
        return "one-way";
      case "roundtrip":
        return "round-trip";
      case "multicity":
        return "multi-city";
      default:
        return "";
    }
  }
  handleFlightDetailsClick(
    index: number,
    flightInfo: any,
    event: Event
  ) {
    event.stopPropagation();

    const isOpening = this.openIndex !== index;

    this.toggleDropdownFlightDetails(index, event);

    // Only when opening
    if (isOpening) {
      this.showBagage(flightInfo, index);

      // Wait for Angular to render the dropdown
      setTimeout(() => {
        const element = document.querySelector(
          `.o-flight-details-dropdown-panel__content[data-index="${index}"]`
        ) as HTMLElement;

        if (element) {
          const top =
            element.getBoundingClientRect().top +
            window.scrollY -
            180;

          window.scrollTo({
            top,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }
  // Flight Details dropdown
  openIndex: number | null = null;
  toggleDropdownFlightDetails(index: number, event: Event) {
    event.stopPropagation();

    this.openIndex = this.openIndex === index ? null : index;
  }

  bagageOpen: boolean[] = [];
  showBagage(flight: any, index: number) {

    // 🔥 RESET EVERYTHING FIRST
    this.allRoutes = [];
    this.selectedRouteIndex = 0;
    this.selectedRoute = null;
    this.flightBaggage = null;

    this.prepareRoutes(flight);

    this.bagageOpen[index] = true; // don't toggle blindly

    this.baggageAllowance = flight?.Fares?.[0]?.BaggageAllowance || "";
    this.flightBaggage = this.getBaggageInfodesktop(flight);

    if (this.flightBaggage) {

      const departRoutes = this.flightBaggage.depart
        ? Object.keys(this.flightBaggage.depart).map((key) => ({
          ...this.flightBaggage.depart[key],
          departure: key.split("-")[0],
          arrival: key.split("-")[1],
          routeType: "Departure",
        }))
        : [];

      const returnRoutes = this.flightBaggage.return
        ? Object.keys(this.flightBaggage.return).map((key) => ({
          ...this.flightBaggage.return[key],
          departure: key.split("-")[0],
          arrival: key.split("-")[1],
          routeType: "Return",
        }))
        : [];

      this.allRoutes = [...departRoutes, ...returnRoutes];

      if (this.allRoutes.length > 0) {
        this.selectedRouteIndex = 0;
        this.selectedRoute = this.allRoutes[0];
      }
    }
  }
  getBaggageInfodesktop(flight: any) {
    if (!this.baggageAllowance || !flight?.Citypairs) {
      return { depart: {}, return: {} };
    }

    const flightBaggage: any = { depart: {}, return: {} };
    const cityPairs = flight?.Citypairs;

    // Pre-build a lookup from segmentKey -> flightSegment object(s)
    // (segmentKey = "CCU-AUH")
    const flightLookup: Record<string, any[]> = {};
    cityPairs.forEach((pair: any) => {
      const flightSegments = pair?.FlightSegment || [];
      flightSegments.forEach((seg: any) => {
        const key = `${(seg.DepartureLocationCode || "").toUpperCase()}-${(
          seg.ArrivalLocationCode || ""
        ).toUpperCase()}`;
        if (!flightLookup[key]) flightLookup[key] = [];
        flightLookup[key].push(seg);
      });
    });

    cityPairs.forEach((pair: any, index: number) => {
      const flightSegments = pair?.FlightSegment || [];
      if (!flightSegments.length) return;

      // Determine direction
      const direction =
        cityPairs.length > 1 ? (index === 0 ? "depart" : "return") : "depart";

      // Collect all segment keys for this city pair
      const pairSegmentKeys = flightSegments.map(
        (seg: any) => `${seg.DepartureLocationCode}-${seg.ArrivalLocationCode}`
      );

      for (const segmentKey in this.baggageAllowance) {
        if (!this.baggageAllowance.hasOwnProperty(segmentKey)) continue;

        // normalize key variants (case-insensitive)
        const normalizedKey = segmentKey.toUpperCase();
        if (
          !pairSegmentKeys.some(
            (k: string) => k.toUpperCase() === normalizedKey
          )
        )
          continue;

        // Filter out 0P baggage items (case-insensitive) and normalize fields
        const validBags = (this.baggageAllowance[segmentKey] || [])
          .filter(
            (bag: any) =>
              !(bag.noOfPieces && String(bag.noOfPieces).toUpperCase() === "0P")
          )
          .map((bag: any) => ({
            noOfPieces: bag.noOfPieces || "",
            description1: bag.description1 || bag.Description1 || "",
            description2: bag.description2 || bag.Description2 || "",
            type: bag.type || "",
            weight: bag.weight ?? bag.Weight ?? 0,
            measuringType: bag.measuringType || bag.MeasuringType || "KG",
            count: bag.count || 0
          }));

        if (validBags.length === 0) {
          // nothing useful to add for this segment
          continue;
        }

        // Get flight segment(s) details from the lookup (if available)
        const matchedFlights = flightLookup[normalizedKey] || [];
        // If multiple flight segments map to same key, we can attach an array; otherwise attach single object.
        const flightDetails = matchedFlights.map((seg: any) => ({
          DepartureLocationCode: seg.DepartureLocationCode,
          ArrivalLocationCode: seg.ArrivalLocationCode,
          DepartureDisplayName: seg.DepartureDisplayName,
          DisplayName: seg.DisplayName,
          FlightLogoName: seg.FlightLogoName,
          BrandName: seg.BrandName,
          MarketingAirlineName: seg.MarketingAirlineName,
          MarketingAirline: seg.MarketingAirline,
          FlightNumber: seg.FlightNumber,
          AirEquipmentType: seg.AirEquipmentType,
          Duration: seg.Duration,
          DepartureDateTime: seg.DepartureDateTime,
          ArrivalDateTime: seg.ArrivalDateTime,
          BookingClass: seg.BookingClass,
          CabinClass: seg.CabinClass,
          SegmentReferenceKey: seg.SegmentReferenceKey,
        }));

        // Attach to flightBaggage under direction and normalized key (keep original key naming)
        flightBaggage[direction][segmentKey] = {
          bags: validBags,
          flights:
            flightDetails.length === 1 ? flightDetails[0] : flightDetails,
        };
      }
    });

    return flightBaggage;
  }
  selectRoute(index: number, routeItem: HTMLElement) {
    this.selectedRouteIndex = index;
    this.selectedRoute = this.allRoutes[index];

    // Smoothly scroll to the clicked item
    routeItem.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  onrouteTax() {
    if (!isPlatformBrowser(this.platformId)) return;
    const route =
      this.originCountry?.toLowerCase() === 'canada'
        ? '/taxes-and-fees-canada'
        : '/taxes-and-fees-usa';

    const url = this.router.serializeUrl(
      this.router.createUrlTree([route])
    );

    window.open(url, '_blank');
  }


  onrouteBagage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/baggage'])
    );

    window.open(url, '_blank');
  }
  // Tooltip Start
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
  toTitleCase(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
  onSeveralFlightsChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.filters.severalFlights = checked;
    this.filterService.setFilters(this.filters);
    this.applyFilter();
  }
  allCityPairs: any[] = [];
  selectedCityPairsIndex = 0;

  prepareRoutes(flightInfo: any) {
    if (!flightInfo?.Citypairs?.length) return;

    this.allCityPairs = flightInfo.Citypairs.map((cp: any, index: number) => {
      const segments = cp?.FlightSegment || [];

      return {
        index,
        departure: segments[0]?.DepartureLocationCode,
        arrival: segments[segments.length - 1]?.ArrivalLocationCode,
        citypair: cp // store full data
      };
    });
  }
  selectCityPairs(index: number) {
    this.selectedCityPairsIndex = index;
  }

  toggleDepartureTime(time: string) {

    const index = this.filters.departureTime.indexOf(time);

    if (index > -1) {
      this.filters.departureTime.splice(index, 1);
    } else {
      this.filters.departureTime.push(time);
    }

    this.applyFilter();
  }
  toggleReturnDepartureTime(time: string) {

    const index = this.filters.returnDepartureTime.indexOf(time);

    if (index > -1) {
      this.filters.returnDepartureTime.splice(index, 1);
    } else {
      this.filters.returnDepartureTime.push(time);
    }

    this.applyFilter();
  }
  toggleArrivalTime(time: string) {

    const index = this.filters.arrivalTime.indexOf(time);

    if (index > -1) {
      this.filters.arrivalTime.splice(index, 1);
    } else {
      this.filters.arrivalTime.push(time);
    }

    this.applyFilter();
  }
  toggleReturnArrivalTime(time: string) {

    const index = this.filters.returnArrivalTime.indexOf(time);

    if (index > -1) {
      this.filters.returnArrivalTime.splice(index, 1);
    } else {
      this.filters.returnArrivalTime.push(time);
    }

    this.applyFilter();
  }



  isNearbyRoute(routeList: any[], cityPairs: any[]): boolean {
    if (!routeList?.length || !cityPairs?.length) return false;

    return cityPairs.some(pair => {
      const segments = pair?.FlightSegment || [];
      if (!segments.length) return false;

      const departure = segments[0]?.DepartureLocationCode;
      const arrival = segments[segments.length - 1]?.ArrivalLocationCode;

      if (!departure || !arrival) return false;

      // check if NOT exact route match (same logic as your original)
      return !routeList.some(route => {
        const depCode = route?.DepartureLocationCode;
        const arrCode = route?.ArrivalLocationCode;

        return (
          (depCode === departure && arrCode === arrival) ||
          (depCode === arrival && arrCode === departure)
        );
      });
    });
  }

  isNearbyAirport(routeList: any[], code: string, type: 'departure' | 'arrival'): boolean {
    if (!routeList?.length || !code) return false;

    return !routeList.some(route => {
      return type === 'departure'
        ? route?.DepartureLocationCode === code
        : route?.ArrivalLocationCode === code;
    });
  }
  showCabinWarning = false;
  checkCabinWarning() {
    const isMatched = this.isCabinMatched(
      this.selectCabinForClasscheck,
      this.visibleSegments[0]?.cabinclass
    );

    if (!isMatched) {
      this.showCabinWarning = true;

      // ⏱ Auto hide after 5 sec
      setTimeout(() => {
        this.showCabinWarning = false;
      }, 5000);
    } else {
      this.showCabinWarning = false;
    }
  }
  dismissCabinWarning() {
    this.showCabinWarning = false;
  }

  handleCtaClick(number: string, event: Event) {

    if (this.isMobile) {
      return; // 📱 direct call
    }

    event.preventDefault();

    this.sharedService.open(number);

    // optional auto close
    setTimeout(() => {
      this.sharedService.close();
    }, 10000);
  }

  selectFilterTab(index: number, routeItem: HTMLElement) {
    this.selectedRouteIndex = index;
    this.selectedRoute = this.allRoutes[index];

    const parent = routeItem.parentElement as HTMLElement;
    const slider = parent?.querySelector('.flight-options__slider') as HTMLElement;

    if (parent && slider) {
      const elRect = routeItem.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      const left = elRect.left - parentRect.left + parent.scrollLeft;

      // ✅ Apply styles directly (no sliderStyle object)
      slider.style.width = `${routeItem.offsetWidth}px`;
      slider.style.transform = `translateX(${left}px)`;
    }

    // ✅ Smooth scroll
    routeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
  getTimeDetails() {
    return this.getAllTimedetails?.[1] || this.getAllTimedetails?.[0];
  }
  get filterTabs() {
    const tabs: any[] = [
      { key: 'cheapest', label: 'Cheapest Fare', price: this.cheapestPrice },
      { key: 'recommended', label: 'Fastest Fare', price: this.recommendedPrice }
    ];

    if (this.getNearbyDetails?.length) {
      tabs.push({
        key: 'alternate',
        label: 'Nearby Airport',
        price: this.nearestPrice
      });
    }

    return tabs;
  }

  onTabClick(tab: string, index: number, el: HTMLElement) {
    this.selectedTab = tab;
    this.applyFilter();

    // const parent = el.parentElement as HTMLElement;
    // const slider = parent?.querySelector('.flight-options__slider') as HTMLElement;

    // if (parent && slider) {
    //   const elRect = el.getBoundingClientRect();
    //   const parentRect = parent.getBoundingClientRect();

    //   const left = elRect.left - parentRect.left + parent.scrollLeft;

    //   slider.style.width = `${el.offsetWidth}px`;
    //   slider.style.transform = `translateX(${left}px)`;
    // }

    // el.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'nearest',
    //   inline: 'center'
    // });
  }
  hasCheckinBag(bags: any[]) {
    return bags?.some(b => b.type?.toUpperCase() === 'CHECKIN');
  }

  hasCarryOnBag(bags: any[]) {
    return bags?.some(b => b.type?.toUpperCase() === 'CARRYON');
  }

  getBag(type: string, bags: any[]) {
    return bags?.find(b => b.type?.toUpperCase() === type);
  }


  hasMissingBaggage(bagInfo: any): boolean {
    if (!bagInfo) {
      return true;
    }

    const allBags = [
      ...(bagInfo.depart || []),
      ...(bagInfo.return || [])
    ];

    return allBags.some(
      (bag: any) =>
        !bag ||
        bag.count == null ||
        bag.count === '' ||
        Number(bag.count) <= 0
    );
  }

  // Back to top btn

  showBtn = false;

  @HostListener('window:scroll')
  onScrollTop() {
    this.showBtn = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  //=================== Start ==========//

  // private positionPanel(iconEl: HTMLElement, type: 'luggage' | 'trolly') {
  //   // Don't set a default position here — panel stays hidden (ready = false)
  //   // until we know the real answer, so there's nothing wrong to flash.
  //   requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       const panelEl = iconEl.querySelector('.c-luggage-options__panel') as HTMLElement;
  //       if (!panelEl) return;

  //       const iconRect = iconEl.getBoundingClientRect();
  //       const panelHeight = panelEl.offsetHeight;

  //       const spaceBelow = window.innerHeight - iconRect.bottom;
  //       const spaceAbove = iconRect.top;

  //       let position: 'top' | 'bottom';
  //       if (spaceBelow >= panelHeight) {
  //         position = 'bottom';
  //       } else if (spaceAbove >= panelHeight) {
  //         position = 'top';
  //       } else {
  //         position = spaceAbove > spaceBelow ? 'top' : 'bottom';
  //       }

  //       if (type === 'luggage') {
  //         this.luggagePanelPosition = position;
  //         this.luggagePanelReady = true;
  //       } else {
  //         this.trollyPanelPosition = position;
  //         this.trollyPanelReady = true;
  //       }

  //       this.cdr.detectChanges();
  //     });
  //   });
  // }
  private positionPanel(iconEl: HTMLElement, type: 'luggage' | 'trolly') {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const panelEl = iconEl.querySelector('.c-luggage-options__panel') as HTMLElement;
        if (!panelEl) return;

        this.calculateAndApplyPosition(iconEl, panelEl, type);

        // Self-correct if the panel's real size settles later
        // (late-loading fonts/styles on cold page load)
        this.panelResizeObserver?.disconnect();
        this.panelResizeObserver = new ResizeObserver(() => {
          this.calculateAndApplyPosition(iconEl, panelEl, type);
        });
        this.panelResizeObserver.observe(panelEl);
      });
    });
  }

  private calculateAndApplyPosition(iconEl: HTMLElement, panelEl: HTMLElement, type: 'luggage' | 'trolly') {
    const iconRect = iconEl.getBoundingClientRect();
    const panelHeight = panelEl.offsetHeight;

    const spaceBelow = window.innerHeight - iconRect.bottom;
    const spaceAbove = iconRect.top;

    let position: 'top' | 'bottom';
    if (spaceBelow >= panelHeight) {
      position = 'bottom';
    } else if (spaceAbove >= panelHeight) {
      position = 'top';
    } else {
      position = spaceAbove > spaceBelow ? 'top' : 'bottom';
    }

    if (type === 'luggage') {
      this.luggagePanelPosition = position;
      this.luggagePanelReady = true;
    } else {
      this.trollyPanelPosition = position;
      this.trollyPanelReady = true;
    }
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  toggleLuggage(index: number, event: MouseEvent) {
    this.activeTrollyIndex = null;
    this.trollyPanelReady = false;
    
    const opening = this.activeLuggageIndex !== index;
    this.activeLuggageIndex = opening ? index : null;
    this.luggagePanelReady = false;
    this.panelResizeObserver?.disconnect();

    if (opening) {
      this.positionPanel(event.currentTarget as HTMLElement, 'luggage');
    }
  }

  toggleTrolly(index: number, event: MouseEvent) {
    this.activeLuggageIndex = null;
    this.luggagePanelReady = false;

    const opening = this.activeTrollyIndex !== index;
    this.activeTrollyIndex = opening ? index : null;
    this.trollyPanelReady = false;
    this.panelResizeObserver?.disconnect();

    if (opening) {
      this.positionPanel(event.currentTarget as HTMLElement, 'trolly');
    }
  }

  closeLuggage() {
    this.activeLuggageIndex = null;
    this.luggagePanelReady = false;
    this.panelResizeObserver?.disconnect();
  }

  closeTrolly() {
    this.activeTrollyIndex = null;
    this.trollyPanelReady = false;
    this.panelResizeObserver?.disconnect();
  }

  ngOnDestroyPanel() {
    this.panelResizeObserver?.disconnect();
  }


  @HostListener('window:scroll')
  onWindowScrollClose() {
    if (this.activeLuggageIndex !== null) {
      this.closeLuggage();
    }
    if (this.activeTrollyIndex !== null) {
      this.closeTrolly();
    }
  }
private getDefaultFilters(): FlightFilters {
  return {
    airlines: [],
    stopes: [],
    rangeValues: [0, 1000000],
    departureTime: [],
    arrivalTime: [],
    returnDepartureTime: [],
    returnArrivalTime: [],
    connectingAirports: [],
    getNearbyfaredepart: [],
    getNearbyfarereturn: [],
    durations: {},
    sortBy: '',
    severalFlights: true,
    carryOnBaggage: false
  };
}
  resetFilters(): void {
  const resetFilters = this.getDefaultFilters();

  this.filters = structuredClone(resetFilters);
  this.activeFilters = structuredClone(resetFilters);

  this.filterService.setFilters(structuredClone(resetFilters));

  this.filtersSummaryText = this.generateFilterSummary(
    this.filters,
    {
      lowestPrice: this.lowestPrice,
      highestPrice: this.highestPrice,
      defaultDurations: this.defaultDurations
    }
  );
}

  //=================== End =========== //

  sortMenuOpen = false;

toggleSortMenu(): void {
  this.sortMenuOpen = !this.sortMenuOpen;
}



openFlightDetails(event: Event, targetId: string): void {
  event.stopPropagation();

  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  // Check whether clicked details are already open
  const isOpen = target.classList.contains('fr-open');

  // Close all flight details
  document.querySelectorAll('.fr-details').forEach((details) => {
    details.classList.remove('fr-open');
  });

  // If it was closed, open it
  if (!isOpen) {
    target.classList.add('fr-open');
  }
}


closeFlightDetails(event: Event): void {
  event.stopPropagation();

  const button = event.currentTarget as HTMLElement;

  const details = button.closest('.fr-details');
  this.openIndex = null;
  if (details) {
    details.classList.remove('fr-open');
  }
}


/* =========================================
   DF SLIDER
========================================= */

private initDfSlider(): void {

  const track = document.querySelector('.df-track') as HTMLElement | null;
  const items = document.querySelectorAll('.df-item');
  const prevBtn = document.getElementById('dfPrev');
  const nextBtn = document.getElementById('dfNext');

  // Stop if slider does not exist
  if (
    !track ||
    items.length === 0 ||
    !prevBtn ||
    !nextBtn
  ) {
    return;
  }

  let index = 0;
  const visibleCount = 4;

  const updateSlider = (): void => {

    const firstItem = items[0] as HTMLElement;

    if (!firstItem) {
      return;
    }

    const itemWidth = firstItem.offsetWidth;

    track.style.transform =
      `translateX(-${index * itemWidth}px)`;
  };


  // NEXT
  nextBtn.addEventListener('click', () => {

    if (index < items.length - visibleCount) {

      index++;

      updateSlider();
    }

  });


  // PREVIOUS
  prevBtn.addEventListener('click', () => {

    if (index > 0) {

      index--;

      updateSlider();
    }

  });


  // ITEM CLICK
  items.forEach((item) => {

    item.addEventListener('click', () => {

      document
        .querySelector('.df-active')
        ?.classList.remove('df-active');

      item.classList.add('df-active');

    });

  });


  // WINDOW RESIZE
  window.addEventListener('resize', updateSlider);

  // Initial position
  updateSlider();
}


/* =========================================
   SORT BY DROPDOWN
========================================= */

private initSbSelect(): void {

  const sbSelect = document.getElementById('sbSelect');

  // Run only if element exists
  if (!sbSelect) {
    console.log('sbSelect not found - script skipped');
    return;
  }

  const sbText =
    document.getElementById('sbSelectedText');

  const selected =
    sbSelect.querySelector('.sb-selected');

  const options =
    sbSelect.querySelectorAll('.sb-options li');


  // Safety check
  if (!sbText || !selected) {
    return;
  }


  /* ================================
     OPEN / CLOSE DROPDOWN
  ================================= */

  selected.addEventListener('click', (event) => {

    event.stopPropagation();

    sbSelect.classList.toggle('sb-open');

  });


  /* ================================
     SELECT OPTION
  ================================= */

  options.forEach((option) => {

    option.addEventListener('click', (event) => {

      event.stopPropagation();

      sbText.textContent =
        option.textContent?.trim() || '';

      sbSelect.classList.remove('sb-open');

      console.log(
        'Sort by:',
        option.getAttribute('data-value')
      );

    });

  });


  /* ================================
     CLICK OUTSIDE
  ================================= */

  document.addEventListener('click', (event: Event) => {

    const target =
      event.target as Node;

    if (!sbSelect.contains(target)) {

      sbSelect.classList.remove('sb-open');

    }

  });

}



activeTravelTab: 'route' | 'baggage' | 'is' = 'route';

changeTravelTab(tab: 'route' | 'baggage' | 'is'): void {
  this.activeTravelTab = tab;
}




// package tooltip

 openTip: string | null = null;

  /**
   * Open/close a specific tooltip.
   */
  toggleTip(tip: string): void {
    this.openTip = this.openTip === tip ? null : tip;
  }

  /**
   * Close all tooltips.
   */
  closeAll(): void {
    this.openTip = null;
  }

  /**
   * Check whether a tooltip is currently open.
   */
  isTipOpen(tip: string): boolean {
    return this.openTip === tip;
  }

  /**
   * Continue booking.
   */
  onContinue(): void {
    // Add your continue/booking logic here
  }

  /**
   * Change hotel.
   */
  onChangeHotel(): void {
    this.router.navigate(['/package-hotels-list'], { queryParams: { source: 'etg' } });
  }

  /**
   * Change hotel room.
   */
  onChangeHotelRoom(): void {
    this.router.navigate(['/package-hotel-details'], { queryParams: { hotelId: this.hotelDetails?.hotelId, rateId: this.roomDetails?.rateList
[0]?.id, source: 'etg' } });
  }

  /**
   * Close tooltip when Escape is pressed.
   */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeAll();
    }
  }
 
    getRatePerNightTotalPackage(fare: any): number {
        const base = Number(this.rateDetails?.perNightBaseFare || 0);
        const taxes = Number(this.rateDetails?.perNightTaxesAndFees || 0);
        const ccMax = this.packageTabActive
  ? Number(fare.CCMax || 0)
  : 0;
        return this.rateDetails?.includesTaxes ? base+ccMax : base + taxes + ccMax;
    }

    getRatePerNightTotal(rate: any): number {
        const base = Number(rate?.perNightBaseFare || 0);
        const taxes = Number(rate?.perNightTaxesAndFees || 0);
        const ccMax = this.packageTabActive
  ? Number(this.packageFlightDetails?.Fares?.[0]?.CCMax || 0)
  : 0;
        return rate?.includesTaxes ? base+ccMax : base + taxes + ccMax;
    }

      removeBackdrop(){
      if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    const body = document.body;

    
      html.classList.remove("modal-backdrop-hide");
      body.classList.remove("modal-backdrop-hide");
    
  }

  getSortedVisibleSegments(): any[] {
  const selectedItineraryId = this.packageFlightDetails?.ItineraryId;

  return [...this.visibleSegments].sort((a, b) => {
    if (a.ItineraryId === selectedItineraryId) return -1;
    if (b.ItineraryId === selectedItineraryId) return 1;
    return 0;
  });
}
}
