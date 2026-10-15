import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  Input,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef,
  HostListener,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgClass, NgFor, NgIf, isPlatformBrowser } from "@angular/common";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { SearchService } from "../../../services/search.service";
import { SvgIcons } from "../../../shared/svg-icons";
import { AutoComplete, AutoCompleteModule } from "primeng/autocomplete";
import { FlightService } from "../../../services/flight/flight.service";
import { TosterService } from "../../../services/common/toaster.service";
import { SharedService } from "../../../services/shared/shared.service";
import { LocationService } from "../../../services/shared/location.service";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { DrawerWrapperComponent } from "./drawer/drawer-wrapper/drawer-wrapper.component";
import { AirportDrawerComponent } from "./drawer/airport-drawer/airport-drawer.component";
import { DatesDrawerComponent } from "./drawer/dates-drawer/dates-drawer.component";
import { GuestDrawerComponent } from "./drawer/guest-drawer/guest-drawer.component";
import { Popover } from "primeng/popover";
import { FlightFilterService } from "../../../services/flight/flight-filter.service";
import { DeviceService } from "../../../services/shared/device.service";
import { BehaviorSubject, catchError, combineLatest, debounceTime, filter, forkJoin, map, Observable, of, Subscription } from "rxjs";
import { DESTINATION_AIRPORT_MAP } from './destination-airports';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  selector: "app-flights-tab",
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf,
    AutoCompleteModule,
    DrawerModule,
    ButtonModule,
    DrawerWrapperComponent,
    AirportDrawerComponent,
    GuestDrawerComponent,
    DatesDrawerComponent,
    Popover,
    NgClass,
  ],
  templateUrl: "./flights-tab.component.html",
  styleUrl: "./flights-tab.component.scss",
})
export class FlightsTabComponent {
  @ViewChild("guestDrawer") guestDrawer!: GuestDrawerComponent;
  @ViewChild("op") op!: Popover;
  @ViewChild("poparrival") poparrival!: Popover;
  @ViewChild("popdeparture") popdeparture!: Popover;
  @ViewChild("arrivalAC") arrivalAutoComplete!: AutoComplete;
  @ViewChild("departureAC") DepartAutoComplete!: AutoComplete;
  @ViewChildren("multiDepartureAC")
  departureACList!: QueryList<AutoComplete>;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private shareService: SharedService = inject(SharedService);
  @ViewChild('flightFormSection') flightFormSection?: ElementRef;
showHeader:boolean=false;
  @ViewChildren("multiArrivalAC")
  arrivalACList!: QueryList<AutoComplete>;
  @ViewChildren('multiPopDeparture') multiPopDeparture!: QueryList<any>;
  @ViewChild('scrollContainer')
scrollContainer!: ElementRef;
  protected icons = inject(SvgIcons);
  private locationService: LocationService = inject(LocationService);
  inputValue: string = "";
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;
  isRotated: boolean = false; // Track rotation state for switch airports icon
  selectedAdults: number = 1;
  selectedChildren: number = 0;
  selectedinfants: number = 0;
  // selectedInfants_seat: number = 0;
  private router = inject(Router);
  private searchService = inject(SearchService);
  private deviceService = inject(DeviceService);
  // isMobile: boolean = false;
  isMobile: boolean = false;
  getData: any = "";
  selectedCabin = { name: "Economy", value: "E" };
  departureAirports: any[] = [];
  arrivalAirports: any[] = [];
  allAirports: any[] = [];
  submitted: boolean = false;
  cabinOptions = [
    { name: "Economy", value: "E" },
    { name: "First", value: "F" },
    { name: "Business", value: "B" },
    { name: "Premium Economy", value: "PE" },
        { name: "Premium Economy", value: "PE" },
  ];

  adultsList = Array.from({ length: 9 }, (_, i) => i + 1);
  childrenList = Array.from({ length: 8 }, (_, i) => i + 1);
  infantsList = Array.from({ length: 5 }, (_, i) => i);
  origin: string = "";
  destination: string = "";
  showDrawer: boolean = false;
  drawerTitle = "";
  isBrowser: boolean = false;
  formattedDepartureDate = "";
  formattedArrivalDate = "";
  activeDrawer:
    | "departure"
    | "arrival"
    | "departureDate"
    | "arrivalDate"
    | "guests"
    | null = null;
  ismodifySearch: boolean = false;
  flightForm: FormGroup;
  source: string = "all";
  isAndroid = false;
  activeInput: string = "";
    slugValue: string = '';
destinations = [
    { id: 1, name: "Los Angeles, USA", route: "/los-angeles" },
    { id: 2, name: "New York City, USA", route: "/new-york" },
    { id: 3, name: "San Diego, USA", route: "/san-diego" },
    { id: 4, name: "Dallas, USA", route: "/dallas" },
    { id: 6, name: "Minneapolis, USA", route: "/minneapolis" },
    { id: 7, name: "Charlotte, USA", route: "/charlotte" },
    { id: 8, name: "Salt Lake City, USA", route: "/salt-lake-city" },
    { id: 9, name: "New Orleans, USA", route: "/new-orleans" },
     { id: 10, name: "Phoenix, USA", route: "/phoenix" },
  { id: 11, name: "Las Vegas, USA", route: "/las-vegas" },
  { id: 12, name: "Denver, USA", route: "/denver" },
  { id: 13, name: "Nashville, USA", route: "/nashville" },
  ];
  private isDomestic$ = new BehaviorSubject<boolean | null>(null);

setIsDomestic(val: boolean) {
  this.isDomestic$.next(val);
}

watchDomesticChange() {
  return this.isDomestic$.asObservable().pipe(
    filter(v => v !== null)
  );
}
deviceReady = false;
  private routerSub!: Subscription;
isFormChanged = false;
  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private flightFilter: FlightFilterService,
    private toasterService: TosterService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser=isPlatformBrowser(this.platformId);
 if (this.isBrowser) {
  this.isMobile=window.innerWidth < 992;
   this.deviceReady = true;
 }

   
    this.flightForm = this.fb.group({
      tripType: ["roundtrip"],
      departureAirport: [""],
      arrivalAirport: [""],
      departureDate: [""],
      arrivalDate: [""],
      directFlightsOnly: [false],
      passengers: this.fb.group({
        adults: [this.selectedAdults],
        children: [this.selectedChildren],
        infants: [this.selectedinfants],
        // infants_seat: [this.selectedInfants_seat],
        cabin: ["E"],
      }),
      multiCitySegments: this.fb.array([]),
    });
    this.handleTripTypeValidation();
    this.handleAirportChangeValidation();
    this.updateInput();
  }
  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  ngOnInit(): void {
    if(this.isBrowser){
      this.deviceService.isMobile$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((status) => {
      this.isMobile = status;
      this.deviceReady = true;
      this.cdr.markForCheck(); 
      this.cdr.detectChanges();// only if OnPush
    });
    this.getData = this.shareService.getcompanyName();
  }
   this.routerSub = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
          this.updateHeaderVisibility(event.urlAfterRedirects);
      });
    this.updateHeaderVisibility(this.router.url);
    this.checkIfModifySearch();
    this.flightForm.valueChanges.subscribe(() => {
      this.isFormChanged = true;
      console.log("this.isFormChanged",this.isFormChanged)
    });
    // Ensure the drawer is closed and state is reset on component load
    this.route.paramMap.subscribe(params => {
    this.slugValue = params.get('slug') || '';
  });
    this.showDrawer = false;
    this.activeDrawer = null;
    // This is a good practice to clean up from previous navigations.
    if (this.isBrowser) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      document.body.style.overflow = "";
    }

    // Replace this with real data from an API if needed
    this.allAirports = [
      { name: "Los Angeles International Airport (LAX)" },
      { name: "John F. Kennedy International Airport (JFK)" },
      { name: "Heathrow Airport (LHR)" },
      { name: "Dubai International Airport (DXB)" },
      { name: "Tokyo Haneda Airport (HND)" },
    ];
// Replace the combineLatest subscription inside ngOnInit():

combineLatest([
  this.route.queryParams,
  this.searchService.searchData$
])
.pipe(takeUntilDestroyed(this.destroyRef),debounceTime(10),)
.subscribe(([routeData, searchData]: [any, any]) => {
  const isRouteEmpty = !routeData || Object.keys(routeData).length === 0;


  const isSearchDataEmpty =
    !searchData || Object.keys(searchData).length === 0;

  console.log('routeData:', routeData);
  console.log('searchData:', searchData);
  console.log('isRouteEmpty:', isRouteEmpty);
  console.log('isSearchDataEmpty:', isSearchDataEmpty);

  // If route data OR search data is empty
  if (isRouteEmpty || isSearchDataEmpty) {

    const formValue = this.flightForm.value;

    console.log('formValue:', formValue);

    // Only call if departure airport is also empty
    if (!formValue?.departureAirport?.code) {

      this.locationService.getNearestAirport().subscribe({
        next: (nearestAirport: any) => {

          if (!nearestAirport) return;

          const formattedAirport: any = {
            type: "main",
            airport_name: nearestAirport.airport_name,
            code: nearestAirport.airport_code || nearestAirport.code,
            city: nearestAirport.city,
            country: nearestAirport.country,
            latitude: nearestAirport.latitude,
            longitude: nearestAirport.longitude,
            address: nearestAirport.address,

            displayName: `${nearestAirport.city || nearestAirport.state} (${
              nearestAirport.airport_code || nearestAirport.code
            }) ${nearestAirport.airport_name}`,

            nearbyAirports: []
          };

          // Update dropdown
          this.departureAirports = [formattedAirport];

          // Patch form
          this.flightForm.patchValue({
            departureAirport: formattedAirport
          });

          this.departCountry = formattedAirport.country;
          this.routeDepartueData = formattedAirport;

          console.log(
            'Nearest airport applied:',
            formattedAirport
          );
        },

        error: (err) => {
          console.error('Failed to get nearest airport:', err);
        }
      });

      return;
    }
  }
  if (isRouteEmpty) return;

  const tripType = routeData.tripType || 'roundtrip';
  // 1. Reset component dates before evaluating new parameters
  this.formattedDepartureDate = '';
  this.formattedArrivalDate = '';
  this.departureDateObj = null;
  this.arrivalDateObj = null;

  this.selectedAdults = Number(routeData?.NoOfAdults) || 1;
  this.selectedChildren = Number(routeData?.NoOfChildren) || 0;
  this.selectedinfants = Number(routeData?.NoOfInfants) || 0;
  this.source = routeData?.source || "all";

  this.selectedCabin = {
    name: "Economy",
    value: routeData?.CabinClass || "E",
  };

  let departureCode = '';
  let arrivalCode = '';
  let departureDate = '';
  let returnDate = '';

  // 2. Parse from SearchData or fallback to Route Params
  if (searchData?.originDestination?.length) {
    if (tripType === "oneway") {
      const seg = searchData.originDestination[0];
      departureCode = seg.DepartureLocationCode;
      arrivalCode = seg.ArrivalLocationCode;
      departureDate = seg.DepartureTime;
      returnDate = ''; // Clear return date explicitly
    } else if (tripType === "roundtrip") {
      const seg1 = searchData.originDestination[0];
      const seg2 = searchData.originDestination[1];

      departureCode = seg1?.DepartureLocationCode || '';
      arrivalCode = seg1?.ArrivalLocationCode || '';
      departureDate = seg1?.DepartureTime || '';
      // Fallback: If modifying from One-Way to Round-Trip, calculate default return date (+7 days)
      returnDate = seg2?.DepartureTime || this.getFutureDateFrom(departureDate, 7);
    }
  } else {
    departureCode = routeData.origin || '';
    arrivalCode = routeData.destination || '';
    departureDate = routeData.departureDate || '';
    returnDate = tripType === 'roundtrip' ? (routeData.returnDate || this.getFutureDateFrom(departureDate, 7)) : '';
  }

  // 3. Fetch Airport Data & Patch Form
  const requests: Observable<boolean>[] = [];
  if (departureCode) requests.push(this.fetchAirportAndSetCountry(departureCode, "departure"));
  if (arrivalCode) requests.push(this.fetchAirportAndSetCountry(arrivalCode, "arrival"));

  forkJoin(requests).subscribe(() => {
    // Synchronize Form TripType first so validation rules update
    this.flightForm.get('tripType')?.setValue(tripType, { emitEvent: false });

    this.flightForm.patchValue({
      tripType: tripType,
      departureAirport: this.routeDepartueData,
      arrivalAirport: this.routeArrivalData,
      departureDate: this.normalizeToISO(departureDate),
      arrivalDate: tripType === 'roundtrip' ? this.normalizeToISO(returnDate) : '',
      passengers: {
        adults: this.selectedAdults,
        children: this.selectedChildren,
        infants: this.selectedinfants,
        cabin: routeData?.CabinClass || "E",
      },
    }, { emitEvent: false });

    // Format UI display dates
    this.updateFormattedDates(departureDate, returnDate, tripType);
        this.handleTripTypeValidation();

    this.updateInput();
    this.isFormChanged = false;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  });
});
          this.setDomestick();

    this.isFormChanged = false;
        this.flightFilter.resetFilters();
  }

  // Helper to calculate relative date if modifying from One-Way -> Round-Trip dynamically
private getFutureDateFrom(baseDateStr: string, addDays: number): string {
  const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
  if (isNaN(baseDate.getTime())) return this.getFutureDate(addDays);

  baseDate.setDate(baseDate.getDate() + addDays);
  const yyyy = baseDate.getFullYear();
  const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
  const dd = String(baseDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Unified Date Formatting method
private updateFormattedDates(depDateStr: string, arrDateStr: string, tripType: string): void {
  const depApi = this.formatToAPIDate(depDateStr) || depDateStr;
  const arrApi = this.formatToAPIDate(arrDateStr) || arrDateStr;

  if (depApi) {
    this.departureDateObj = depApi ? new Date(depApi) : null;

          this.formattedDepartureDate = depApi
          ? this.dateFromApiString(depApi).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "";

  } else {
    this.formattedDepartureDate = '';
    this.departureDateObj = null;
  }

  if (tripType === 'roundtrip' && arrApi) {
            this.arrivalDateObj = arrApi ? new Date(arrApi) : null;

        this.formattedArrivalDate = arrApi
          ? this.dateFromApiString(arrApi).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "";
  } else {
    this.formattedArrivalDate = '';
    this.arrivalDateObj = null;
  }




   
}

// private handleTripTypeValidation(): void {
//   const arrivalDateControl = this.flightForm.get('arrivalDate');
//   const departureDateControl = this.flightForm.get('departureDate');

//   this.flightForm.get('tripType')?.valueChanges
//     .pipe(takeUntilDestroyed(this.destroyRef))
//     .subscribe((tripType: string) => {

//       if (tripType === 'oneway') {
//         // 1. Clear value & reset internal UI date variables
//         arrivalDateControl?.setValue('', { emitEvent: false });
//         this.formattedArrivalDate = '';
//         this.arrivalDateObj = null;

//         // 2. Remove validator completely
//         arrivalDateControl?.clearValidators();

//       } else if (tripType === 'roundtrip') {
//         // 1. Restore required validator
//         arrivalDateControl?.setValidators([Validators.required]);

//         // 2. If return date is missing, set a default (+7 days from departure)
//         if (!arrivalDateControl?.value && departureDateControl?.value) {
//           const defaultReturn = this.getFutureDateFrom(departureDateControl.value, 7);
//           arrivalDateControl?.setValue(defaultReturn, { emitEvent: false });
//           this.updateFormattedDates(departureDateControl.value, defaultReturn, 'roundtrip');
//         }
//       } else if (tripType === 'multicity') {
//         // Handle multicity clearing if applicable
//         arrivalDateControl?.clearValidators();
//         arrivalDateControl?.setValue('', { emitEvent: false });
//       }

//       // 3. Recalculate control validity state
//       arrivalDateControl?.updateValueAndValidity();

//       // 4. Force Angular change detection
//       this.cdr.markForCheck();
//     });
// }
  private getFutureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`; // ISO format
}
  dateFromApiString(apiDate: string): Date {
    const [year, month, day] = apiDate.split("-").map(Number);
    return new Date(year, month - 1, day); // local date
  }
  formatToAPIDate(dateString: string): string {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  routeDepartueData: any = "";
  routeArrivalData: any = "";
  fetchAirportAndSetCountry(
    code: string,
    type: "departure" | "arrival",
  ): Observable<boolean> {
    if (!code) return of(false);

    return this.flightService.airportlList(code).pipe(
      map((res: any) => {
        if (!res?.success || !res.data?.length) return false;

        const airport = res.data.find((a: any) => a.airport_code === code);
        if (!airport) return false;

        const mainAirport: any = {
          type: "main",
          airport_name: airport.airport_name,
          code: airport.airport_code,
          city: airport.city,
          country: airport.country,
          latitude: airport.latitude,
          longitude: airport.longitude,
          address: airport.address,
          state:airport.state,
          displayName: `${airport.city || airport.state} (${airport.airport_code}) ${airport.airport_name}`,
          nearbyAirports: [],
        };

        if (airport.groupData?.length) {
          mainAirport.nearbyAirports = airport.groupData.map((nearby: any) => ({
            type: "nearby",
            airport_name: nearby.airport_name,
            code: nearby.airport_code,
            city: nearby.city,
            country: nearby.country,
            latitude: nearby.latitude,
            longitude: nearby.longitude,
            address: nearby.address,
            state:nearby.state,
            displayName: `${nearby.city || nearby.state} (${nearby.airport_code}) ${nearby.airport_name}`,
            distanceInfoText: nearby.distanceInfoText || null,
          }));
        }

        if (type === "departure") {
          this.routeDepartueData = mainAirport;
          this.departCountry = airport.country;
        } else {
          this.routeArrivalData = mainAirport;
          this.arrivalCountry = airport.country;
        }


        // ✅ Domestic check only when both exist
        if (this.departCountry && this.arrivalCountry) {
          this.isDomestic = this.departCountry === this.arrivalCountry;

          if (this.isBrowser) {
            localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
          }
        }

        return true;
      }),
      catchError(() => of(false)),
    );
  }
  getAirportObject(code: string): Observable<any> {
    return this.flightService.airportlList(code).pipe(
      map((res: any) => {
        if (!res?.success || !res.data?.length) return null;

        const airport = res.data.find((a: any) => a.airport_code === code);
        if (!airport) return null;

        return {
          type: "main",
          airport_name: airport.airport_name,
          code: airport.airport_code,
          city: airport.city,
          country: airport.country,
          displayName: `${airport.city} (${airport.airport_code}) ${airport.airport_name}`,
        };
      }),
      catchError(() => of(null))
    );
  }
  patchFormFromRoute(routeData: any): void {
    const depDateRaw = this.formatToAPIDate(routeData.DepartureTime) || "";
    const arrDateRaw = this.formatToAPIDate(routeData.returnDate) || "";

    this.flightForm.patchValue({
      tripType: routeData.tripType || "roundtrip",
      departureAirport: this.routeDepartueData || "",
      arrivalAirport: this.routeArrivalData || "",
      departureDate: this.normalizeToISO(routeData.DepartureTime) || "",
      arrivalDate: this.normalizeToISO(routeData.returnDate) || "",
      directFlightsOnly: false,
      passengers: {
        adults: this.selectedAdults,
        children: this.selectedChildren,
        infants: this.selectedinfants,
        // infants_seat: this.selectedInfants_seat,
        cabin: routeData?.CabinClass,
      },
    });


    this.departureDateObj = depDateRaw ? new Date(depDateRaw) : null;
    this.arrivalDateObj = arrDateRaw ? new Date(arrDateRaw) : null;
    const formatDate = (date: string) => {
      if (!date) return "";
      const [y, m, d] = date.split("-");
      return `${d}/${m}/${y}`;
    };
    // this.flightFilter.resetFilters();
    // this.flightService.clearFlights();
    const formValue = this.flightForm.value;
    const passengers = formValue.passengers;
    const tripType = formValue.tripType;
    const payload = this.buildFlightPayload();
    this.searchService.setSearchData(payload);
    let queryParams: any;

    if (tripType === "roundtrip") {
      queryParams = {

        CabinClass: passengers.cabin,
        NoOfAdults: passengers.adults,
        // NoOfInfantSeat: passengers.infants_seat,
        NoOfInfants: passengers.infants,
        NoOfChildren: passengers.children,
        tripType: tripType,
        source: this.source || "all",
        MarketingAirlineName: "",
        providers: "",
        CurrencyCode: "USD",
        OC: formValue.departureAirport.country,
      };
    } else {
      queryParams = {

        CabinClass: passengers.cabin,
        NoOfAdults: passengers.adults,
        // NoOfInfantSeat: passengers.infants_seat,
        NoOfInfants: passengers.infants,
        NoOfChildren: passengers.children,
        tripType: tripType,
        source: this.source || "all",
        MarketingAirlineName: "",
        providers: "",
        CurrencyCode: "USD",
        OC: formValue.departureAirport.country,
      };
    }

    const storedParams = {
      ...queryParams,

      // ✅ Add city details ONLY for internal use
      departureCity: formValue.departureAirport.city,
      arrivalCity: formValue.arrivalAirport.city,

      // (optional but useful)
      departureCountry: formValue.departureAirport.country,
      arrivalCountry: formValue.arrivalAirport.country,
    };

    /** 🔥 STORE PARAMS */
    this.searchService.setSearchParamsData(storedParams);
    this.updateInput();
  }
  private normalizeToISO(date: string): string {
    if (!date) return "";

    // If already ISO → keep it
    if (date.includes("-")) {
      return date;
    }

    // If coming as DD/MM/YYYY → convert
    if (date.includes("/")) {
      const [d, m, y] = date.split("/");
      return `${y}-${m}-${d}`;
    }

    return "";
  }

  checkIfModifySearch(): void {
    const currentUrl = this.router.url;
    this.ismodifySearch = currentUrl.includes("/flights-list");
  }
  extractAirportName(fullName: string): string {
    return fullName?.split(",")[0]?.trim() || "";
  }

  extractCity(fullName: string): string {
    return fullName?.split(",")[1]?.trim() || "";
  }

  extractCountry(fullName: string): string {
    return fullName?.split(",")[2]?.trim() || "";
  }

  buildDisplayName(fullName: string): string {
    const city = this.extractCity(fullName);
    const country = this.extractCountry(fullName);
    return city ? `${city} - ${country}` : ` - ${country}`;
  }
  private handleTripTypeValidation() {
    const controls = this.flightForm.controls;

    this.flightForm
      .get("tripType")
      ?.valueChanges.subscribe((tripType: string) => {
        this.clearValidators();

        if (tripType === "oneway") {
          // Add validators: required + no leading/trailing spaces
          controls["departureAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);

          controls["arrivalAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);
          controls["departureDate"].setValidators(Validators.required);
          this.passengersGroup.setValidators(Validators.required);
          this.clearSegments();
        } else if (tripType === "roundtrip") {
          // Add validators: required + no leading/trailing spaces
          controls["departureAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);

          controls["arrivalAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);
          controls["departureDate"].setValidators(Validators.required);
          controls["arrivalDate"].setValidators(Validators.required);
          this.passengersGroup.setValidators(Validators.required);
          this.clearSegments();
        } else if (tripType === "multicity") {
          controls["departureAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);

          controls["arrivalAirport"].setValidators([
            Validators.required,
            Validators.pattern(/^\S(.*\S)?$/),
          ]);
          controls["departureDate"].setValidators(Validators.required);
          this.passengersGroup.setValidators(Validators.required);
          this.clearSegments();
          // Set required initially
          this.multiCitySegments.setValidators(Validators.required);

          // Add 1 segment if empty
          if (this.multiCitySegments.length === 0) {
          }

          // Watch for changes and remove validation after at least one is added
          this.multiCitySegments.clearValidators();
          this.multiCitySegments.updateValueAndValidity({ emitEvent: false });
        }

        // Refresh form control validation
        Object.values(controls).forEach((ctrl) => {
          ctrl.updateValueAndValidity({ emitEvent: false });
        });

        this.passengersGroup.updateValueAndValidity();
        this.multiCitySegments.updateValueAndValidity();
      });

    const tripType = this.flightForm.get("tripType")?.value;
    if (tripType) {
      this.flightForm.get("tripType")?.setValue(tripType);
    }
  }
handleAirportChangeValidation() {
  combineLatest([
    this.flightForm.get('departureAirport')!.valueChanges,
    this.flightForm.get('arrivalAirport')!.valueChanges
  ])
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(([departure, arrival]) => {

    if (!departure?.code || !arrival?.code) return;

    const newIsDomestic =
      departure?.country &&
      arrival?.country &&
      departure.country === arrival.country;

    const departureDateStr = this.flightForm.get('departureDate')?.value;

    if (!departureDateStr) {
      this.isDomestic = newIsDomestic;
      return;
    }

    const selectedDate = new Date(departureDateStr);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minIntlDate = new Date(today);
    minIntlDate.setDate(today.getDate() + 2);

    let shouldClear = false;

    // ✅ Domestic → keep all
    if (newIsDomestic) {
      shouldClear = false;
    }
    // ✅ International → validate
    else {
      if (selectedDate < minIntlDate) {
        shouldClear = true;
      }
    }

    if (this.isDomestic !== newIsDomestic || shouldClear) {

      this.isDomestic = newIsDomestic;

      if (shouldClear) {
        this.flightForm.patchValue({
          departureDate: null,
          arrivalDate: null
        });

        this.departureDateObj = null;
        this.arrivalDateObj = null;

        this.formattedDepartureDate = '';
        this.formattedArrivalDate = '';

        this.flightForm.get('departureDate')?.markAsTouched();
        this.flightForm.get('departureDate')?.updateValueAndValidity();
      }
    }
  });
}

  private clearValidators() {
    const controls = this.flightForm.controls;

    controls["departureAirport"].clearValidators();
    controls["arrivalAirport"].clearValidators();
    controls["departureDate"].clearValidators();
    controls["arrivalDate"].clearValidators();
    this.passengersGroup.clearValidators();
    this.multiCitySegments.clearValidators();
  }

  filterCountry(event: any) {

    // If code exists → call API with code
    if (event.code) {
      this.getallAirport(event.code);
    }
    // Otherwise, call API with query/displayName
    else {
      this.getallAirport(event.query);
    }
  }
  getallAirport(data: any) {
    if (data.length < 3 && data.length !== 0) {
      return;
    }
    this.flightService.airportlList(data).subscribe((res: any) => {
      if (res.success && res.data.length > 0) {
        this.departureAirports = [];

        res.data.forEach((airport: any) => {
          // Prepare main airport object
          const mainAirport: any = {
            type: "main",
            airport_name: airport.airport_name,
            code: airport.airport_code,
            city: airport.city,
            country: airport.country,
            latitude: airport.latitude,
            longitude: airport.longitude,
            address: airport.address,
            state:airport.state,
            displayName: `${airport.city || airport.state} (${airport.airport_code
              }) ${airport.airport_name}`,

            nearbyAirports: [], // initialize empty array
          };

          // If groupData exists, add as nested nearby airports
          if (airport.groupData && airport.groupData.length > 0) {
            mainAirport.nearbyAirports = airport.groupData.map(
              (nearby: any) => ({
                type: "nearby",
                airport_name: nearby.airport_name,
                code: nearby.airport_code,
                city: nearby.city,
                country: nearby.country,
                latitude: nearby.latitude,
                longitude: nearby.longitude,
                address: nearby.address,
                state:nearby.state,
                displayName: `${nearby.city || nearby.state} (${nearby.airport_code
                  }) ${nearby.airport_name}`,

                distanceInfoText: nearby.distanceInfoText || null,
              }),
            );
          }

          // Push the main airport with nested nearby airports
          this.departureAirports.push(mainAirport);
          this.cdr.markForCheck();
        });
      }
    });
  }

  onDepartureSelect(selected: any) {
    this.flightForm.get("departureAirport")?.setValue(selected.code); // store only 'CCU'
  }
  compareCabins = (c1: any, c2: any) => c1?.value === c2?.value;

  get multiCitySegments(): FormArray {
    return this.flightForm.get("multiCitySegments") as FormArray;
  }

  get passengersGroup(): FormGroup {
    return this.flightForm.get("passengers") as FormGroup;
  }
  // isArrival:string='arrival';
  onDatesSelected(event: { departure: string; arrival?: string }) {
    if (event.departure) {
      const depDateRaw = event.departure || "";

      const depDateFormatted = depDateRaw
        ? this.dateFromApiString(depDateRaw).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "";
      this.flightForm.get("departureDate")?.setValue(event.departure); // keep backend format YYYY-MM-DD
      this.formattedDepartureDate = depDateFormatted;
      this.departureDateObj = depDateRaw ? new Date(depDateRaw) : null;
    } else {
      this.flightForm.get("departureDate")?.setValue("");
      this.formattedDepartureDate = "";
    }

    if (event.arrival) {
      const arrDateRaw = event.arrival || "";
      const arrDateFormatted = arrDateRaw
        ? this.dateFromApiString(arrDateRaw).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "";
      this.flightForm.get("arrivalDate")?.setValue(event.arrival);
      this.formattedArrivalDate = arrDateFormatted;
      this.arrivalDateObj = arrDateRaw ? new Date(arrDateRaw) : null;
    } else {
      this.flightForm.get("arrivalDate")?.setValue("");
      this.formattedArrivalDate = "";
    }
    this.cdr.detectChanges();
  }
  // Current linked range
  // Linked range objects
  departureDateObj: Date | null = null;
  arrivalDateObj: Date | null = null;

  formattedMultiDates: string[] = [];
  onDatesApplied(event: {
    departure: string;
    arrival?: string;
    formattedDeparture: string;
    formattedArrival?: string;
  }) {

    this.activeInput = '';
    // this.toggleDrawerScroll(false);

    const tripType = this.flightForm.get('tripType')?.value;

    // ===============================
    // ✅ MULTICITY
    // ===============================
    if (tripType === 'multicity' && this.activeSegmentIndex !== null) {

      const segmentGroup = this.multiCitySegments.at(this.activeSegmentIndex);

      // Update form value
      segmentGroup.get('departureDate')?.setValue(event.departure);

      // Mark touched for validation
      segmentGroup.get('departureDate')?.markAsTouched();

      // ✅ Store formatted date per segment
      if (!this.formattedMultiDates) {
        this.formattedMultiDates = [];
      }

      this.formattedMultiDates[this.activeSegmentIndex] =
        event.formattedDeparture;

    }

    // ===============================
    // ✅ ONEWAY / ROUNDTRIP
    // ===============================
    else {

      this.flightForm.get('departureDate')?.setValue(event.departure);
      this.flightForm.get('arrivalDate')?.setValue(event.arrival || '');

      this.flightForm.get('departureDate')?.markAsTouched();
      this.flightForm.get('arrivalDate')?.markAsTouched();

      // Update formatted display
      this.formattedDepartureDate = event.formattedDeparture;
      this.formattedArrivalDate = event.formattedArrival || '';

    }

    // ===============================
    // ✅ Update Date Objects (Used for calendar min/max)
    // ===============================

    this.departureDateObj = event.departure
      ? new Date(event.departure)
      : null;

    this.arrivalDateObj = event.arrival
      ? new Date(event.arrival)
      : null;

          if (this.showHeader) {

      this.scrollToFlightForm();

  }
  }
  onDatesChanged(event: {
    departure: string;
    arrival?: string;
    formattedDeparture: string;
    formattedArrival?: string;
  }) {
    // ✅ Update form immediately
    this.flightForm.get("departureDate")?.setValue(event.departure);

    this.flightForm.get("arrivalDate")?.setValue(event.arrival || "");

    // ✅ Update display instantly
    this.formattedDepartureDate = event.formattedDeparture;
    this.formattedArrivalDate = event.formattedArrival || "";

    // ✅ Update linked objects instantly
    this.departureDateObj = event.departure ? new Date(event.departure) : null;
    this.arrivalDateObj = event.arrival ? new Date(event.arrival) : null;
  }

  // Track formatted dates per segment
  formattedDepartureDates: string[] = [];
  formattedArrivalDates: string[] = [];

  // Updated onDatesSelected for multicity segment
  onMultiDatesSelected(
    event: { departure: string; arrival?: string; segments?: any[] },
    index: number
  ) {

    // ✅ 🔥 NEW: handle cascade update from child
    if (event?.segments) {

      event.segments.forEach((seg, i) => {
        const segmentGroup = this.multiCitySegments.at(i) as FormGroup;

        if (seg?.departureDate) {
          segmentGroup.get('departureDate')?.setValue(seg.departureDate);

          this.formattedDepartureDates[i] = this.dateFromApiString(seg.departureDate)
            .toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
        } else {
          segmentGroup.get('departureDate')?.setValue('');
          this.formattedDepartureDates[i] = '';
        }
      });

      this.cdr.detectChanges();
      return;
    }

    // ✅ OLD LOGIC (unchanged)
    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    if (event.departure) {
      const depDateFormatted = this.dateFromApiString(event.departure)
        .toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

      segmentGroup.get('departureDate')?.setValue(event.departure);
      this.formattedDepartureDates[index] = depDateFormatted;
    } else {
      segmentGroup.get('departureDate')?.setValue('');
      this.formattedDepartureDates[index] = '';
    }

    this.cdr.detectChanges();
  }

  // Use onDatesApplied per segment
  onMultiDatesApplied(event: any, index: number) {

    // ✅ NEW: handle cascade
    if (event?.segments) {
      event.segments.forEach((seg: any, i: number) => {
        const segmentGroup = this.multiCitySegments.at(i) as FormGroup;

        segmentGroup.get('departureDate')?.setValue(seg.departureDate);

        this.formattedDepartureDates[i] = this.dateFromApiString(seg.departureDate)
          .toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
      });

      this.cdr.detectChanges();
      return;
    }

    // ✅ OLD (unchanged)
    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    segmentGroup.get('departure')?.setValue(event.departure);
    segmentGroup.get('arrival')?.setValue(event.arrival || '');

    this.formattedDepartureDates[index] = event.formattedDeparture;
    this.formattedArrivalDates[index] = event.formattedArrival || '';
  }

  // Open departure drawer
  openDepartureDrawer() {
    this.activeDrawer = "departureDate";
    this.showDrawer = true;
  }

  // Open arrival drawer
  openArrivalDrawer() {
    this.activeDrawer = "arrivalDate";
    this.showDrawer = true;
  }

  onMultiCityDateSelected(event: { departure: string }, index: number): void {
    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;
    segmentGroup.get("departureDate")?.setValue(event.departure);
  }
  createCityPairGroup(): FormGroup {
    return this.fb.group({
      departureAirport: ["", Validators.required],
      arrivalAirport: ["", Validators.required],
      departureDate: ["", Validators.required],
    });
  }
  addSegment(): void {
    if (this.multiCitySegments.length >= 5) return;

    const lastIndex = this.multiCitySegments.length - 1;
    const lastSegment = this.multiCitySegments.at(lastIndex)?.value;

    const group = this.createCityPairGroup();

    group.patchValue({
      departureAirport: lastSegment?.arrivalAirport || "",
    });

    // ✅ SAFE PUSH
    (this.multiCitySegments as FormArray<FormGroup>).push(group);

    this.formattedMultiDates.push('');

    this.multiCitySegments.updateValueAndValidity({ emitEvent: true });
  }

  removeSegment(index: number): void {
    this.multiCitySegments.removeAt(index);
  }

  clearSegments(): void {
    this.multiCitySegments.clear();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  selectPassenger(
    type: "adult" | "child" | "infant_seat" | "infants",
    count: number,
    event: Event,
  ) {
    event.stopPropagation();

    // Future values based on input
    let futureAdults = this.selectedAdults;
    let futureChildren = this.selectedChildren;
    let futureInfantsLap = this.selectedinfants;
    // let futureInfantsSeat = this.selectedInfants_seat;

    if (type === "adult") {
      futureAdults = count;
    } else if (type === "child") {
      futureChildren = count;
    } else if (type === "infants") {
      futureInfantsLap = count;
    }
    //  else if (type === "infant_seat") {
    //   futureInfantsSeat = count;
    // }
    const totalInfants = futureInfantsLap;

    // const totalInfants = futureInfantsLap + futureInfantsSeat;
    const totalPassengers = futureAdults + futureChildren + totalInfants;

    // Reset previous err

    // ✅ Rule 1: Must have at least 1 adult
    if (futureAdults < 1) {
      this.toasterService.showError("Please select at least 1 adult traveler");
      return;
    }

    // ✅ Rule 2: Infant restrictions
    if (futureAdults === 1) {
      if (futureInfantsLap > 1) {
        this.toasterService.showError(
          "With 1 adult, maximum 1 infant is allowed",
        );
        return;
      }

      // if (futureInfantsSeat > 2) {
      //   this.toasterService.showError(
      //     "With 1 adult, maximum 2 seat infants are allowed",
      //   );
      //   return;
      // }
      if (totalInfants > 1) {
        this.toasterService.showError(
          "With 1 adult, total infant cannot exceed 1",
        );
        return;
      }
    } else {
      if (totalInfants > futureAdults * 1) {
        this.toasterService.showError(
          "Each adult can accompany up to 1 infant",
        );
        return;
      }
    }

    // ✅ Rule 3: Children require at least 1 adult
    if (futureChildren > 0 && futureAdults < 1) {
      this.toasterService.showError(
        "At least 1 adult is required when booking children",
      );
      return;
    }

    // ✅ Rule 4: Total passengers (adults + children + infants) cannot exceed 9
    if (totalPassengers > 9) {
      this.toasterService.showError("Total travelers cannot exceed 9");
      return;
    }

    // ✅ Passed validation → update values
    if (type === "adult") {
      this.selectedAdults = count;
      this.passengersGroup.get("adults")?.setValue(count);

      // Adjust infants if adults decrease
      if (totalInfants > this.selectedAdults * 1) {
        const allowedInfants = this.selectedAdults * 1;

        // Prioritize keeping lap infants if needed
        if (this.selectedinfants > allowedInfants) {
          this.selectedinfants = allowedInfants;
          this.passengersGroup
            .get("infants")
            ?.setValue(this.selectedinfants);
          // this.selectedInfants_seat = 0;
          // this.passengersGroup.get("infants_seat")?.setValue(0);
        }
        //  else {
        //   this.selectedInfants_seat = allowedInfants - this.selectedinfants;
        //   this.passengersGroup
        //     .get("infants_seat")
        //     ?.setValue(this.selectedInfants_seat);
        // }
      }
    } else if (type === "child") {
      this.selectedChildren = count;
      this.passengersGroup.get("children")?.setValue(count);
    } else if (type === "infants") {
      this.selectedinfants = count;
      this.passengersGroup.get("infants")?.setValue(count);
    }
    // else if (type === "infant_seat") {
    //   this.selectedInfants_seat = count;
    //   this.passengersGroup.get("infants_seat")?.setValue(count);
    // }

    // ✅ Reflect final values in input display
    this.updateInput();
  }

  updateInput() {
    const total =
      this.selectedAdults +
      this.selectedChildren +
      this.selectedinfants;
    // this.selectedInfants_seat;
    const selectedCabin = this.passengersGroup.get("cabin")?.value;
    this.selectedCabin = selectedCabin;
    // Find the cabin name from the cabinOptions
    const cabinName =
      this.cabinOptions.find((option) => option.value === selectedCabin)
        ?.name || "";

    this.inputValue = `${total} Traveler${total !== 1 ? "s" : ""
      }, ${cabinName}`;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  switchAirports() {
    const departure = this.flightForm.get("departureAirport")?.value;
    const arrival = this.flightForm.get("arrivalAirport")?.value;
    this.flightForm.patchValue({
      departureAirport: arrival,
      arrivalAirport: departure,
    });
    // Toggle rotation state for smooth animation
    this.isRotated = !this.isRotated;
  }
  get f() {
    return this.flightForm.controls;
  }
  getSegmentControl(index: number, controlName: string) {
    return this.multiCitySegments.at(index).get(controlName);
  }
  getMultiSegmentFormGroup(index: number): FormGroup {
    return this.multiCitySegments.at(index) as FormGroup;
  }
  arrivalCountry: string = "";
  departCountry: string = "";
  isDomestic: boolean = false;
  arrivalCountries: string[] = [];
  departureCountries: string[] = [];
  departureError: string = "";
  arrivalError: string = "";
  departSubmit: boolean = false;
  arriveSubmit: boolean = false;
  // Departure selection

  onDepartSelected(event: any) {
    const selectedDepart = event?.value;
    if (!selectedDepart) return;
    this.processDepartSelection(selectedDepart);
  }

  onNearbyDepartSelected(selectedDepart: any, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!selectedDepart) return;
    this.processDepartSelection(selectedDepart);
    if (this.DepartAutoComplete) {
      this.DepartAutoComplete.hide();
    }
  }

  processDepartSelection(selectedDepart: any) {
const arrivalAirport = this.flightForm.get("arrivalAirport")?.value;
    const control = this.flightForm.get("departureAirport");
    control?.markAsTouched();
 this.departCountry=control?.value?.country;

    if (arrivalAirport && arrivalAirport.code === selectedDepart.code) {
      control?.reset();
      control?.setErrors({ sameAirport: true });
      this.departureError = "Departure & Arrival cities cannot be the same.";
      this.arriveSubmit = true;
      this.flightForm.get("departureAirport")?.markAsTouched();
      this.flightForm.get("arrivalAirport")?.markAsTouched();
    } else {
      control?.setErrors(null);
      control?.setValue(selectedDepart);
      this.arrivalError = "";
      this.arriveSubmit = false;
    }
           this.setDomestick();

    this.cdr.detectChanges();
  }
  onArrivalSelected(event: any) {
    const selectedArrival = event?.value;
    if (!selectedArrival) return;
    this.processArrivalSelection(selectedArrival);
  }

  onNearbyArrivalSelected(selectedArrival: any, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!selectedArrival) return;
    this.processArrivalSelection(selectedArrival);
    if (this.arrivalAutoComplete) {
      this.arrivalAutoComplete.hide();
    }
  }

  processArrivalSelection(selectedArrival: any) {

    const departureAirport = this.flightForm.get("departureAirport")?.value;
    const control = this.flightForm.get("arrivalAirport");
    control?.markAsTouched();
     this.arrivalCountry=control?.value?.country;
    if (departureAirport && departureAirport.code === selectedArrival.code) {
      control?.reset();
      control?.setErrors({ sameAirport: true });
      this.arrivalError = "Departure & Arrival cities cannot be the same.";
      this.arriveSubmit = true;
      this.flightForm.get("departureAirport")?.markAsTouched();
      this.flightForm.get("arrivalAirport")?.markAsTouched();
    } else {
      control?.setErrors(null);
      control?.setValue(selectedArrival);
      this.arrivalError = "";
      this.arriveSubmit = false;
    }
      this.setDomestick();

    this.cdr.detectChanges();
  }


  setDomestick(){
        const formValue = this.flightForm.value;

     if (formValue?.tripType == "multicity") {
        this.isDomestic = this.checkIfAllDomestic();
        if (this.isBrowser) {
          localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
        }
      } else {
        if (this.arrivalCountry === this.departCountry) {
          this.isDomestic = true;
          if (this.isBrowser) {
            localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
          }
        } else {
          this.isDomestic = false;
          if (this.isBrowser) {
            localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
          }
        }
      }
  }
  // Form getters for template convenience

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
    if (this.arrivalCountry) allCountries.add(this.arrivalCountry);
    if (this.departCountry) allCountries.add(this.departCountry);
    this.arrivalCountries.forEach((country) => allCountries.add(country));
    this.departureCountries.forEach((country) => allCountries.add(country));
    return allCountries.size === 1;
  }
  buildFlightPayload(): any {
    const formValue = this.flightForm.value;
    const tripType = formValue.tripType;
    const payload: any = {
      originDestination: [],
    };
    const formatDate = (date: string) => {
      if (!date) return "";
      const [y, m, d] = date.split("-");
      return `${d}/${m}/${y}`;
    };
    if (tripType === "oneway") {
      payload.originDestination.push({
        DepartureTime: formatDate(formValue.departureDate),
        DepartureLocationCode: formValue.departureAirport.code,
        ArrivalLocationCode: formValue.arrivalAirport.code
      });
    } else if (tripType === "roundtrip") {
      payload.originDestination.push(
        {
          DepartureTime: formatDate(formValue.departureDate),
          DepartureLocationCode: formValue.departureAirport.code,
          ArrivalLocationCode: formValue.arrivalAirport.code
        },
        {
          DepartureTime: formatDate(formValue.arrivalDate),
          DepartureLocationCode: formValue.arrivalAirport.code,
          ArrivalLocationCode: formValue.departureAirport.code
        },
      );
    } else if (tripType === "multicity") {
      payload.originDestination.push({
        DepartureTime: formatDate(formValue.departureDate),
        DepartureLocationCode: formValue.departureAirport.code,
        ArrivalLocationCode: formValue.arrivalAirport.code
      });

      this.multiCitySegments.controls.forEach((segment: any) => {
        const segValue = segment.value;

        payload.originDestination.push({
          DepartureTime: formatDate(segValue.departureDate),
          DepartureLocationCode: segValue.departureAirport.code,
          ArrivalLocationCode: segValue.arrivalAirport.code
        });
      });
    }

    return payload;
  }
  searchFlights() {
    // this.toasterService.showError("test screen")
    this.submitted = true;
    console.log("this.flightForm.valid",this.flightForm.value)
    if (this.flightForm.valid) {
          if(this.isBrowser){
    const html = document.documentElement;
    const body = document.body;

  
      html.classList.add("modal-backdrop-hide");
      body.classList.add("modal-backdrop-hide");
    }
      console.log("yes valid")
        this.isFormChanged = false;
      const html = document.documentElement;
      const body = document.body;
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
      const formValue = this.flightForm.value;

      if (formValue?.tripType == "multicity") {
        this.isDomestic = this.checkIfAllDomestic();
        if (this.isBrowser) {
          localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
        }
      } else {
        if (this.arrivalCountry === this.departCountry) {
          this.isDomestic = true;
          if (this.isBrowser) {
            localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
          }
        } else {
          this.isDomestic = false;
          if (this.isBrowser) {
            localStorage.setItem("isDomestic", JSON.stringify(this.isDomestic));
          }
        }
      }

      const formatDate = (date: string) => {
        if (!date) return "";
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
      };


      const passengers = formValue.passengers;
      const tripType = formValue.tripType;
      const payload = this.buildFlightPayload();
      this.searchService.setSearchData(payload);
      let queryParams: any;
      if (tripType === "roundtrip") {
        queryParams = {
          CabinClass: passengers.cabin,
          NoOfAdults: passengers.adults,
          // NoOfInfantSeat: passengers.infants_seat,
          NoOfInfants: passengers.infants,
          NoOfChildren: passengers.children,
          tripType: tripType,
          source: this.source || "all",
          MarketingAirlineName: "",
          providers: "",
          CurrencyCode: "USD",
          OC: formValue.departureAirport.country,
              maxResultsPerProvider:60,
          limit:180,
         tag:this.slugValue||''

        };
      } else if (tripType === "oneway") {
        queryParams = {
          CabinClass: passengers.cabin,
          NoOfAdults: passengers.adults,
          // NoOfInfantSeat: passengers.infants_seat,
          NoOfInfants: passengers.infants,
          NoOfChildren: passengers.children,
          tripType: tripType,
          source: this.source || "all",
          MarketingAirlineName: "",
          providers: "",
          CurrencyCode: "USD",
          OC: formValue.departureAirport.country,
              maxResultsPerProvider:60,
          limit:180,
           tag:this.slugValue||''

        };
      } else if (tripType === "multicity") {
        queryParams = {
          CabinClass: passengers.cabin,
          NoOfAdults: passengers.adults,
          // NoOfInfantSeat: passengers.infants_seat,
          NoOfInfants: passengers.infants,
          NoOfChildren: passengers.children,
          tripType: tripType,
          source: this.source || "all",
          MarketingAirlineName: "",
          providers: "",
          CurrencyCode: "USD",
          OC: formValue.departureAirport.country,
          maxResultsPerProvider:60,
          limit:180,
          tag:this.slugValue||''
        };
      }
      const storedParams = {
        ...queryParams,

        departureCity: formValue.departureAirport.city,
        arrivalCity: formValue.arrivalAirport.city,

        // (optional but useful)
        departureCountry: formValue.departureAirport.country,
        arrivalCountry: formValue.arrivalAirport.country,
      };


      this.flightFilter.resetFilters();
      this.flightService.clearFlights();
      this.searchService.setSearchParamsData(storedParams);
      // --- DATA LAYER PUSH ---
if (this.isBrowser) {
  const originCode = formValue.departureAirport?.code || formValue.departureAirport?.city || '';
  const destCode = formValue.arrivalAirport?.code || formValue.arrivalAirport?.city || '';
  const totalPassengers =
    (Number(passengers.adults) || 0) +
    (Number(passengers.children) || 0) +
    (Number(passengers.infants) || 0);

  // Construct the search payload object
  const searchPayload = {
    event: 'flight_search',
    search_term: `${originCode} to ${destCode}`,
    flight_type: tripType,
    origin: originCode,
    destination: destCode,
    departure_date: formValue.departureDate || '',
    return_date: tripType === 'roundtrip' ? (formValue.returnDate || '') : null,
    passengers_count: totalPassengers,
    cabin_class: passengers.cabin || '',
    is_domestic: this.isDomestic
  };

  // 1. Log the payload before pushing
  console.log('[DataLayer] Pushing flight_search event:', searchPayload);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(searchPayload);

  // 2. Log full dataLayer array to verify it was added successfully
  console.log('[DataLayer] Updated window.dataLayer contents:', (window as any).dataLayer);
}
 if (this.isBrowser) {

      const currentUrl = this.router.url.toLowerCase();


const isBestFlightRoute =
  currentUrl.includes('/flights/') &&
  currentUrl.includes('-best-flight');



const shouldOpenInNewTab = isBestFlightRoute ;

if (shouldOpenInNewTab) {

  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${window.location.origin}/flights-list?${queryString}`;

  // window.open(fullUrl, '_blank');


} else {
  if(!this.isMobile && !this.ismodifySearch){
const urlTree = this.router.createUrlTree(
  ['/flights-list'],
  { queryParams }
);

const url = this.router.serializeUrl(urlTree);

window.open(url, '_blank', 'noopener,noreferrer');
  }else{
     this.router.navigate(['/flights-list'], { queryParams });
  }
  // this.router.navigate(['/flights-list'], { queryParams });

}
 }
 else {

  this.router.navigate(['/flights-list'], { queryParams });
this.flightForm.reset();
}

    } else {
      this.flightForm.markAllAsTouched();
    }
  }
  clearDepartureAirport(): void {
    this.flightForm.get("departureAirport")?.setValue("");
    this.flightForm.get("departureAirport")?.markAsPristine();
    this.flightForm.get("departureAirport")?.markAsUntouched();
  }
  clearArrivalAirport(): void {
    this.flightForm.get("arrivalAirport")?.setValue("");
    this.flightForm.get("arrivalAirport")?.markAsPristine();
    this.flightForm.get("arrivalAirport")?.markAsUntouched();
  }
  clearMultiDeparture(index: number): void {
    const segment = this.multiCitySegments.at(index);
    segment.get("departure")?.reset(null);
    segment.get("departure")?.markAsPristine();
    segment.get("departure")?.markAsUntouched();
  }

  clearMultiArrival(index: number): void {
    const segment = this.multiCitySegments.at(index);
    segment.get("arrival")?.reset(null);
    segment.get("arrival")?.markAsPristine();
    segment.get("arrival")?.markAsUntouched();
  }
  blockScroll: boolean = true;
  activeSegmentIndex: number | null = null;
  onInputFocus(
    drawerType: 'departure' | 'arrival' | 'departureDate' | 'arrivalDate' | 'guests',
    index?: number
  ) {
    if (!this.isMobile) return;
     console.log("I am heat ")
    this.showDrawer = true;
    this.activeDrawer = drawerType;

    const tripType = this.flightForm.get('tripType')?.value;

    // ============================
    // ✅ SET ACTIVE SEGMENT
    // ============================
    if (tripType === 'multicity' && index !== undefined) {
      this.activeSegmentIndex = index;
    } else {
      this.activeSegmentIndex = null;
    }

    // ============================
    // ✅ GET CORRECT FORMGROUP
    // ============================
    let formGroup: FormGroup;

    if (tripType === 'multicity' && this.activeSegmentIndex !== null) {
      formGroup = this.multiCitySegments.at(this.activeSegmentIndex) as FormGroup;
    } else {
      formGroup = this.flightForm;
    }

    // ============================
    // ✅ PREFILL AIRPORT SEARCH (ONLY FOR departure / arrival)
    // ============================
    if (drawerType === 'departure' || drawerType === 'arrival') {

      const controlName = drawerType + 'Airport';
      const controlValue = formGroup.get(controlName)?.value;

      if (controlValue) {
        formGroup.get(controlName)?.setValue(controlValue);

        this.filterCountry({
          query: controlValue.displayName || '',
          code: controlValue.code
        });

      } else {
        this.filterCountry({ query: '' });
      }
    }

    // ============================
    // ✅ SET DRAWER TITLE
    // ============================
    switch (drawerType) {
      case "departure":
        this.drawerTitle = "Select Departure";
        break;
      case "arrival":
        this.drawerTitle = "Select Arrival";
        break;
      case "departureDate":
        this.drawerTitle = "Select Departure Date";
        break;
      case "arrivalDate":
        this.drawerTitle = "Select Arrival Date";
        break;
      case "guests":
        this.drawerTitle = "Select Guests";
        break;
    }

  //   this.toggleDrawerScroll(true);
  //       if (this.showHeader) {

  //     this.scrollToFlightForm();

  // }
    this.cdr.detectChanges();
  }
  getActiveFormGroup(): FormGroup {
    const tripType = this.flightForm.get('tripType')?.value;

    if (tripType === 'multicity' && this.activeSegmentIndex !== null) {
      return this.multiCitySegments.at(this.activeSegmentIndex) as FormGroup;
    }

    return this.flightForm;
  }

  closeDrawer() {
    this.showDrawer = false;
    this.activeDrawer = null;
    this.activeInput = '';
    // this.toggleDrawerScroll(false);
      if (this.showHeader) {

      this.scrollToFlightForm();

  }
    this.cdr.detectChanges();


  }

  onPassengersApply(passengers: any) {

    // ⛔ HARD GUARD (prevents crash)
    if (
      !passengers ||
      typeof passengers !== 'object' ||
      passengers.adults === undefined
    ) {
      return;
    }

    this.showDrawer = false;

    this.selectedAdults = passengers.adults;
    this.selectedChildren = passengers.children;
    this.selectedinfants = passengers.infants;
    // this.selectedInfants_seat = passengers.infants_seat;

    this.flightForm.get('passengers')?.patchValue(passengers);

    this.updateInput();
  }

  ngOnDestroy(): void {
    this.showDrawer = false;
    this.activeDrawer = null;
    if (this.isBrowser) {
      document.body.style.overflow = "";
      document
        .querySelectorAll(".arrival-popover, .departure-popover")
        .forEach((el) => el.remove());
    }
    this.poparrival?.hide();
    this.popdeparture?.hide();
    this.op?.hide();
    // Optional: remove popover DOM manually (extra safety)
  }
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
  allowOnlyLetters(event: KeyboardEvent) {
    const char = event.key;
    const allowedPattern = /^[A-Za-z\s-]+$/;

    if (!allowedPattern.test(char)) {
      event.preventDefault();
    }
  }

  sanitizePaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData ?? (window as any).clipboardData;
    const pastedText = clipboardData?.getData("text") ?? "";
    const cleanedText = pastedText.replace(/[^A-Za-z\s-]/g, "");
    const target = event.target as HTMLInputElement;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? 0;
    target.value =
      target.value.substring(0, start) +
      cleanedText +
      target.value.substring(end);
    const inputEvent = new Event("input", { bubbles: true });
    target.dispatchEvent(inputEvent);
  }
  isdesktopGuest: boolean = false;
  showDesktop() {
    this.isdesktopGuest = true;
  }
  showGuestPopover(event: MouseEvent, target: HTMLElement) {
    this.popdeparture.hide();
    this.poparrival.hide();
    this.op.show(event, target);

    // Wait until the popover DOM is rendered, then reposition
    setTimeout(() => {
      const overlay = document.querySelector(".guest-popover") as HTMLElement;
      if (overlay && target) {
        const rect = target.getBoundingClientRect();
        const overlayWidth = overlay.offsetWidth;

        overlay.style.position = "absolute";
        overlay.style.left = rect.right - overlayWidth + "px";
        overlay.style.top = rect.bottom + window.scrollY + 8 + "px"; // small gap below input

        // Optional: add class for animation
        overlay.classList.add("slide-from-right");
      }
    }, 0);
  }
  showArrivalPopover(event: MouseEvent, target: HTMLElement, drawerType: any) {
    this.popdeparture.hide();
    this.op.hide();
    this.poparrival.show(event, target);
    this.popdeparture.hide();
    this.op.hide();
    this.poparrival.show(event, target);
    this.activeInput = drawerType;
       this.arrivalAutoComplete.hide();
    this.DepartAutoComplete.hide();
    setTimeout(() => {
      const overlay = document.querySelector(".arrival-popover") as HTMLElement;
      if (!overlay || !target) return;

      const targetRect = target.getBoundingClientRect();
      const overlayWidth = overlay.offsetWidth;

      // 🔹 Center align with target
      let left = targetRect.left + targetRect.width / 2 - overlayWidth / 2;

      const top = targetRect.bottom + window.scrollY + 8;

      // 🔹 Prevent overflow on edges (important for last input)
      const padding = 8;
      const maxLeft = window.innerWidth - overlayWidth - padding;

      if (left < padding) {
        left = padding;
      } else if (left > maxLeft) {
        left = maxLeft;
      }

      overlay.style.position = "absolute";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;

      overlay.classList.add("slide-from-bottom");
    }, 0);
  }

  showDeparturePopover(
    event: MouseEvent,
    target: HTMLElement,
    drawerType: any
  ) {
    event.preventDefault();
    event.stopPropagation();

    // ✅ Close other main popovers
    this.op?.hide();
    this.poparrival?.hide();
    this.arrivalAutoComplete.hide();
    this.DepartAutoComplete.hide();
    // ✅ Close ALL multicity popovers also
    this.multiPopDeparture?.forEach((p) => p.hide());
    this.activeMultiPopoverIndex = null;

    // ✅ Toggle if same already open
    if (this.popdeparture?.overlayVisible) {
      this.popdeparture.hide();
      return;
    }

    // ✅ Show Departure popover
    this.popdeparture.show(event, target);
    this.activeInput = drawerType;

    setTimeout(() => {
      // ✅ Always select latest overlay
      const overlays = document.querySelectorAll(".departure-popover");
      const overlay = overlays[overlays.length - 1] as HTMLElement;

      if (!overlay || !target) return;

      const targetRect = target.getBoundingClientRect();
      const overlayWidth = overlay.offsetWidth;

      // 🔹 Center align
      let left =
        targetRect.left + targetRect.width / 2 - overlayWidth / 2;

      const top = targetRect.bottom + window.scrollY + 8;

      // 🔹 Prevent overflow
      const padding = 8;
      const maxLeft = window.innerWidth - overlayWidth - padding;

      if (left < padding) left = padding;
      else if (left > maxLeft) left = maxLeft;

      overlay.style.position = "absolute";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;

      overlay.classList.remove("slide-from-bottom");
      void overlay.offsetWidth; // reset animation
      overlay.classList.add("slide-from-bottom");
    }, 0);
  }

  // Store multiple popovers if needed
  activeMultiPopoverIndex: number | null = null;

  showMultiDeparturePopover(event: MouseEvent, target: HTMLElement, index: number) {
    event.preventDefault();
    event.stopPropagation();

    // Close main popovers
    this.op?.hide();
    this.poparrival?.hide();
    this.popdeparture?.hide();

    // Close other multicity popovers
    this.multiPopDeparture?.forEach((p, i) => {
      if (i !== index) {
        p.hide();
      }
    });
    const popover = this.multiPopDeparture.toArray()[index];
    if (!popover) return;

    // Toggle same popover
    if (this.activeMultiPopoverIndex === index) {
      popover.hide();
      this.activeMultiPopoverIndex = null;
      return;
    }

    // Open new popover
    this.activeMultiPopoverIndex = index;
    popover.show(event, target);

    this.activeInput = "departureDate";

    // ✅ Keep timeout same
    setTimeout(() => {

      // Always select latest overlay
      const overlays = document.querySelectorAll(".departure-popover");
      const overlay = overlays[overlays.length - 1] as HTMLElement;

      if (!overlay || !target) return;

      const targetRect = target.getBoundingClientRect();
      const overlayWidth = overlay.offsetWidth;

      // ✅ RIGHT ALIGN FIX
      let left = targetRect.right - overlayWidth;

      const top = targetRect.bottom + window.scrollY + 8;

      // Prevent overflow on screen
      const padding = 8;

      if (left < padding) {
        left = padding;
      }

      overlay.style.position = "absolute";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;

      overlay.classList.add("slide-from-bottom");

    }, 0);
  }
  textHighlightedDeparture = false;
  clickedOnceDeparture = false;

  highlightDepartureText(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      setTimeout(() => {
        input.select(); // highlight full text
        this.textHighlightedDeparture = true;
        this.clickedOnceDeparture = false; // reset click tracker
      });
    }
  }

  handleDepartureClick(event: MouseEvent) {
    this.popdeparture.hide();
    this.op.hide();
    this.poparrival.hide();
    const input = event.target as HTMLInputElement;
    const control = this.flightForm.get("departureAirport");

    // Highlighted → clicking clears
    if (this.textHighlightedDeparture) {
      control?.setValue("");
      this.textHighlightedDeparture = false;
      this.clickedOnceDeparture = false;

      setTimeout(() => input.focus(), 0);
      return;
    }
    this.clickedOnceDeparture = false;
  }
  onMultiDepartSelected(event: any, index: number) {
    const selectedDepart = event?.value;
    if (!selectedDepart) return;

    this.processMultiDepartSelection(selectedDepart, index);
  }

  onNearbyMultiDepartSelected(selectedDepart: any, index: number, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.processMultiDepartSelection(selectedDepart, index);

    const autoComplete = this.departureACList.toArray()[index];
    autoComplete?.hide();
  }
  processMultiDepartSelection(selectedDepart: any, index: number) {

    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    const arrivalAirport = segmentGroup.get("arrivalAirport")?.value;
    const control = segmentGroup.get("departureAirport");

    control?.markAsTouched();

    // ❌ Prevent Same Airport
    if (arrivalAirport && arrivalAirport.code === selectedDepart.code) {
      control?.reset();
      control?.setErrors({ sameAirport: true });

      this.departureError = "Departure & Arrival cannot be the same.";
    } else {
      control?.setErrors(null);
      control?.setValue(selectedDepart);

      this.departureError = "";
    }

    this.cdr.detectChanges();
  }
  handleDepartureSelection(event: any) {

    const tripType = this.flightForm.get('tripType')?.value;

    // =========================
    // ✅ MULTICITY
    // =========================
    if (tripType === 'multicity' && this.activeSegmentIndex !== null) {
      this.onMultiDepartSelected(event, this.activeSegmentIndex);
    }

    // =========================
    // ✅ ONEWAY / ROUNDTRIP
    // =========================
    else {
      this.onDepartSelected(event);
    }

    // Close drawer if mobile
    if (this.isMobile) {
      this.closeDrawer();
    }
  }
  handleArrivalSelection(event: any) {

    const tripType = this.flightForm.get('tripType')?.value;

    // =========================
    // ✅ MULTICITY
    // =========================
    if (tripType === 'multicity' && this.activeSegmentIndex !== null) {
      this.onMultiArrivalSelected(event, this.activeSegmentIndex);
    }

    // =========================
    // ✅ ONEWAY / ROUNDTRIP
    // =========================
    else {
      this.onArrivalSelected(event);
    }

    // Close drawer if mobile
    if (this.isMobile) {
      this.closeDrawer();
    }
  }
  onMultiArrivalSelected(event: any, index: number) {
    const selectedArrival = event?.value;
    if (!selectedArrival) return;

    this.processMultiArrivalSelection(selectedArrival, index);
  }
  onNearbyMultiArrivalSelected(selectedArrival: any, index: number, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.processMultiArrivalSelection(selectedArrival, index);

    const autoComplete = this.arrivalACList.toArray()[index];
    autoComplete?.hide();
  }
  processMultiArrivalSelection(selectedArrival: any, index: number) {

    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    const departureAirport = segmentGroup.get("departureAirport")?.value;
    const control = segmentGroup.get("arrivalAirport");

    control?.markAsTouched();

    // ❌ Prevent Same Airport
    if (departureAirport && departureAirport.code === selectedArrival.code) {
      control?.reset();
      control?.setErrors({ sameAirport: true });

      this.arrivalError = "Departure & Arrival cannot be the same.";
    } else {
      control?.setErrors(null);
      control?.setValue(selectedArrival);

      this.arrivalError = "";
    }

    this.cdr.detectChanges();
  }

  textHighlightedDepartureMulti: boolean[] = [];
  clickedOnceDepartureMulti: boolean[] = [];
  textHighlightedArrivalMulti: boolean[] = [];
  clickedOnceArrivalMulti: boolean[] = [];
  highlightMultiDepartureText(event: any, index: number) {

    const input = event.target as HTMLInputElement;

    if (input && input.value) {
      setTimeout(() => {
        input.select();

        this.textHighlightedDepartureMulti[index] = true;
        this.clickedOnceDepartureMulti[index] = false;
      });
    }
  }

  handleMultiDepartureClick(event: MouseEvent, index: number) {

    const input = event.target as HTMLInputElement;
    const control = this.multiCitySegments.at(index).get("departureAirport");

    if (this.textHighlightedDepartureMulti[index]) {
      control?.setValue("");

      this.textHighlightedDepartureMulti[index] = false;
      this.clickedOnceDepartureMulti[index] = false;

      setTimeout(() => input.focus(), 0);
      return;
    }

    this.clickedOnceDepartureMulti[index] = false;
  }

  clearMultiDepartureIfHighlightedOnKey(
    event: KeyboardEvent,
    index: number
  ) {

    const input = event.target as HTMLInputElement;

    const control = this.multiCitySegments.at(index).get("departureAirport");

    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 &&
      input.selectionEnd === input.value.length;

    if (isAllSelected) {

      const key = event.key;
      const isTextOnly = /^[a-zA-Z\s]$/.test(key);

      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      this.textHighlightedDepartureMulti[index] = false;
      this.clickedOnceDepartureMulti[index] = false;

      setTimeout(() => input.focus(), 0);
    }
  }

  highlightMultiArrivalText(event: any, index: number) {

    const input = event.target as HTMLInputElement;

    if (input && input.value) {
      setTimeout(() => {
        input.select();

        this.textHighlightedArrivalMulti[index] = true;
        this.clickedOnceArrivalMulti[index] = false;
      });
    }
  }


  handleMultiArrivalClick(event: MouseEvent, index: number) {

    const input = event.target as HTMLInputElement;
    const control = this.multiCitySegments.at(index).get("arrivalAirport");

    if (this.textHighlightedArrivalMulti[index]) {
      control?.setValue("");

      this.textHighlightedArrivalMulti[index] = false;
      this.clickedOnceArrivalMulti[index] = false;

      setTimeout(() => input.focus(), 0);
      return;
    }

    this.clickedOnceArrivalMulti[index] = false;
  }

  clearMultiArrivalIfHighlightedOnKey(
    event: KeyboardEvent,
    index: number
  ) {

    const input = event.target as HTMLInputElement;

    const control = this.multiCitySegments.at(index).get("arrivalAirport");

    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 &&
      input.selectionEnd === input.value.length;

    if (isAllSelected) {

      const key = event.key;
      const isTextOnly = /^[a-zA-Z\s]$/.test(key);

      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      this.textHighlightedArrivalMulti[index] = false;
      this.clickedOnceArrivalMulti[index] = false;

      setTimeout(() => input.focus(), 0);
    }
  }
  checkMultiDepartOpen(index: number) {

    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    const controlValue = segmentGroup.get("departureAirport")?.value;

    // Case 1 → Selected airport object exists
    if (controlValue && controlValue.displayName?.trim() !== "") {
      this.openMultiDepartSuggestions(index);
    }
  }
  openMultiDepartSuggestions(index: number) {
    setTimeout(() => {
      const autoComplete = this.departureACList.toArray()[index];
      if (!autoComplete) return;

      autoComplete.show();

      const segmentGroup = this.multiCitySegments.at(index) as FormGroup;
      const value = segmentGroup.get("departureAirport")?.value;

      this.filterCountry({
        query: value?.displayName || "",
        code: value?.code || "",
      });
    }, 0);
  }
  checkMultiArrivalOpen(index: number) {

    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;

    const controlValue = segmentGroup.get("arrivalAirport")?.value;

    // Case 1 → Selected airport object exists
    if (controlValue && controlValue.displayName?.trim() !== "") {
      this.openMultiArrivalSuggestions(index);
    }
  }
  openMultiArrivalSuggestions(index: number) {
    setTimeout(() => {
      const autoComplete = this.arrivalACList.toArray()[index];
      if (!autoComplete) return;

      autoComplete.show();

      const segmentGroup = this.multiCitySegments.at(index) as FormGroup;
      const value = segmentGroup.get("arrivalAirport")?.value;

      this.filterCountry({
        query: value?.displayName || "",
        code: value?.code || "",
      });
    }, 0);
  }
  checkDepartOpen() {
    const control = this.flightForm.get("departureAirport")?.value;

    // Case 1 → Selected airport object
    if (control && control.displayName && control.displayName.trim() !== "") {
      this.openDepartSuggestions();
      return;
    }
  }
  openDepartSuggestions() {
    setTimeout(() => {
      if (this.DepartAutoComplete) {
        this.DepartAutoComplete.show();
        const controlValue = this.flightForm.get("departureAirport")?.value;
        if (controlValue.code != "") {
          this.flightForm.get("departureAirport")?.setValue(controlValue);
          this.filterCountry({
            query: controlValue.displayName || "",
            code: controlValue.code,
          });
        } else {
          this.filterCountry({ query: "" });
        }
      }
    }, 0);
  }
  clearDepartureIfHighlightedOnKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.flightForm.get("departureAirport");
    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 && input.selectionEnd === input.value.length;

    if (isAllSelected) {
      const key = event.key;
      const isTextOnly = /^[a-zA-Z\s]$/.test(key);
      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      this.textHighlightedDeparture = false;
      this.clickedOnceDeparture = false;

      setTimeout(() => input.focus(), 0);
    }
  }

  textHighlightedArrival = false;
  clickedOnceArrival = false;

  highlightArrivalText(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      setTimeout(() => {
        input.select(); // highlight full text
        this.textHighlightedArrival = true;
        this.clickedOnceArrival = false; // reset click tracker
      });
    }
  }

  handleArrivalClick(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.flightForm.get("arrivalAirport");
    this.popdeparture.hide();
    this.op.hide();
    this.poparrival.hide();
    // Highlighted → clicking clears
    if (this.textHighlightedArrival) {
      control?.setValue("");
      this.textHighlightedArrival = false;
      this.clickedOnceArrival = false;

      setTimeout(() => input.focus(), 0);
      return;
    }

    this.clickedOnceArrival = false;
  }

  checkArrivalOpen() {
    const control = this.flightForm.get("arrivalAirport")?.value;

    // Case 1 → Selected airport object
    if (control && control.displayName && control.displayName.trim() !== "") {
      this.openArrivalSuggestions();
      return;
    }
  }

  openArrivalSuggestions() {
    setTimeout(() => {
      if (this.arrivalAutoComplete) {
        this.arrivalAutoComplete.show();
        const controlValue = this.flightForm.get("arrivalAirport")?.value;

        if (controlValue.code != "") {
          this.flightForm.get("arrivalAirport")?.setValue(controlValue);
          this.filterCountry({
            query: controlValue.displayName || "",
            code: controlValue.code,
          });
        } else {
          this.filterCountry({ query: "" });
        }
      }
    }, 0);
  }
  clearArrivalIfHighlightedOnKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.flightForm.get("arrivalAirport");
    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 && input.selectionEnd === input.value.length;

    if (isAllSelected) {
      const key = event.key;
      const isTextOnly = /^[a-zA-Z\s]$/.test(key);
      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      this.textHighlightedArrival = false;
      this.clickedOnceArrival = false;

      setTimeout(() => input.focus(), 0);
    }
  }

  onSourceChange(event: any) {
    const selectedSource = event.target.value;
    this.source = selectedSource; // Store in a variable if needed

    // Trigger your API or filter logic here
    // this.getFlightsBySource(selectedSource);
  }

  // private toggleDrawerScroll(lock: boolean) {
  //   const html = document.documentElement;
  //   const body = document.body;

  //   if (lock) {
  //     html.classList.add("overflow-hidden");
  //     body.classList.add("overflow-hidden");
  //   } else {
  //     html.classList.remove("overflow-hidden");
  //     body.classList.remove("overflow-hidden");
  //   }
  // }

  onGuestPopoverClose() {
    if (this.guestDrawer) {
      this.guestDrawer.close();

    }
  }
  resetActiveInput() {
    this.activeInput = "";
  }
  closeMultiPopover(index: number) {
    const popover = this.multiPopDeparture.toArray()[index];
    popover?.hide();
    this.resetActiveInput();
  }
  onPopoverHide() {
    this.activeMultiPopoverIndex = null;
    this.resetActiveInput();
  }


scrollToFlightForm() {
  if (!this.flightFormSection) return;

  const element = this.flightFormSection.nativeElement;
  const yOffset = -80; // 👈 adjust based on your header height

  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
   if(this.isBrowser){
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}
}
private updateHeaderVisibility(currentUrl: string) {
  const routes = ['changes', 'seat-upgrade', 'cancellation', 'reservation'];
  const url = currentUrl.toLowerCase();

  this.showHeader = routes.some(route => url.includes(route));
}


scrollToSection(section: HTMLElement): void {
   if (!this.isBrowser) {
    return;
   }
   if(!this.ismodifySearch){

   
  const topOffset = 170;

  const startPosition = window.scrollY;
  const targetPosition =
    section.getBoundingClientRect().top +
    window.scrollY -
    topOffset;

  const distance = targetPosition - startPosition;
  const duration = 300; // increase for slower scroll

  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (!startTime) startTime = currentTime;

    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    // ease-in-out effect
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo({
      top: startPosition + distance * ease
    });

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
}
}
// Replace 'searchForm' with the name of your FormGroup instance
get selectedTripTypeLabel(): string {
  const value = this.flightForm.get('tripType')?.value;
  switch (value) {
    case 'oneway':
      return 'One Way';
    case 'roundtrip':
      return 'Round Trip';
    case 'multicity':
      return 'Multi City';
    default:
      return '';
  }
}
cabinMenuOpen = false;

toggleCabinMenu(): void {
  this.cabinMenuOpen = !this.cabinMenuOpen;
}

selectCabin(value: string): void {
  this.flightForm.get('passengers.cabin')?.setValue(value);

  this.cabinMenuOpen = false;
}

getCabinLabel(): string {
  const cabin = this.flightForm.get('passengers.cabin')?.value;

  switch (cabin) {
    case 'E':
      return 'Economy';

    case 'PE':
      return 'Premium Economy';

    case 'B':
      return 'Business';

    case 'F':
      return 'First Class';

    default:
      return 'Economy';
  }
}

@HostListener('window:scroll')
@HostListener('window:resize')
hideFlightPopovers(): void {
   if (this.isBrowser) {
  this.poparrival?.hide();
  this.popdeparture?.hide();
   this.op?.hide();
   }
}



focusDepartureInput(): void {
  const input = this.DepartAutoComplete?.inputEL?.nativeElement;

  if (input) {
    input.focus();
  }
}
focusArrivalInput(): void {
  const input = this.arrivalAutoComplete?.inputEL?.nativeElement;

  if (input) {
    input.focus();
  }
}
}
