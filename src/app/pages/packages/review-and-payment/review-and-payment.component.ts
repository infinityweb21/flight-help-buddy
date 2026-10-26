import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  ViewChild,
} from "@angular/core";
import {
  ViewportScroller,
  CommonModule,
  isPlatformBrowser,
} from "@angular/common";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from "ngx-intl-tel-input";
import {
  DestroyRef,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
  HostListener,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormControl,
  FormsModule,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { TooltipModule } from "primeng/tooltip";
import { Location } from "@angular/common";
import { CommonValidatorDirective } from "../../../directives/validate.directive";
import { AllowMiddleSpaceDirective } from "../../../directives/allow-middle-space.directive";
import { BackDirective } from "../../../directives/back.directive";
import { SharedService } from "../../../services/shared/shared.service";
import { TosterService } from "../../../services/common/toaster.service";
import { FlightService } from "../../../services/flight/flight.service";
import { FlightFilterService } from "../../../services/flight/flight-filter.service";
import { SearchService } from "../../../services/search.service";
import { SvgIcons } from "../../../shared/svg-icons";
import { DropdownModule } from "primeng/dropdown";
import { DatePickerModule } from "primeng/datepicker";
import { LocationService } from "../../../services/shared/location.service";
import { SpinnerService } from "../../../services/common/spinner.service";
import { CardNumberDirective } from "../../../directives/card-number.directive";
import { FlightPaymentSkeletonComponent } from "../../flights-list/skeleton/flight-payment-skeleton/flight-payment-skeleton.component";
import { FlightCommonSkeletonComponent } from "../../flights-list/skeleton/flight-common-skeleton/flight-common-skeleton.component";
import html2canvas from "html2canvas";
import { DeviceService } from "../../../services/shared/device.service";
import { DurationToHoursPipe } from "../../../pipes/duration-to-hours.pipe";
import { NgxCaptureService } from 'ngx-capture';
import { NgxCaptureModule } from 'ngx-capture';
import { environment } from "../../../../environments/environment";
import { MMDDYYYYDirective } from "../../../directives/mmddyyyy.directive";
import { PaymentLoaderComponent } from "../../flights-list/skeleton/payment-loader/payment-loader.component";
import { firstValueFrom, take } from "rxjs";
import { HotelService } from "../../../services/hotel/hotel.service";
import { ReviewPaymentLoadingComponent } from "../review-and-payment/review-payment-loading/review-payment-loading.component";
@Component({
  selector: 'app-review-and-payment',
   imports: [
      CommonModule,
      ReactiveFormsModule,
      NgxIntlTelInputModule,
      TooltipModule,
      DropdownModule,
      DatePickerModule,
      CommonValidatorDirective,
      AllowMiddleSpaceDirective,
      BackDirective,
      CardNumberDirective,
      FlightPaymentSkeletonComponent,
      DurationToHoursPipe,
      NgxCaptureModule,
      MMDDYYYYDirective,
      PaymentLoaderComponent,
      ReviewPaymentLoadingComponent
    ],
  templateUrl: './review-and-payment.component.html',
  styleUrl: './review-and-payment.component.scss'
})
export class ReviewAndPaymentComponent {
 @ViewChild("stepsList") stepsList!: ElementRef;

  // Inteliinput
  @ViewChild("phoneGroup") phoneGroup!: ElementRef;

  @ViewChildren("stepItem") stepItems!: QueryList<ElementRef>;
  private renderer: Renderer2;
  isflightPaymentPopupOpen = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  today: Date = new Date();
  private location: Location = inject(Location);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private deviceService = inject(DeviceService);
  isOpen = false;

  // ================= TOOLTIP =================
openTip: string | null = null;

toggleTip(tipId: string): void {
  this.openTip = this.openTip === tipId ? null : tipId;
}

isTipOpen(tipId: string): boolean {
  return this.openTip === tipId;
}

closeAllTips(): void {
  this.openTip = null;
}




  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  loading: boolean = false;
  private destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChildren("error") errorElements!: QueryList<ElementRef>;

  itnearyId: string = "";
  getMainDetails: any = "";
  imageUrl: string = environment.imageUrl;
   classMap: { [key: string]: string } = {
    E: "Economy",
    Econom:"Economy",
    F: "First",
    B: "Business",
    P: "Premium Economy",
    PE: "Premium Economy",
  };
  public selectedAdults: number = 0;
  public selectedChildren: number = 0;
  public selectedInfants: number = 0;
  // public selectedInfants_seat: number = 0;
  public selectedInfants_lap: number = 0;
  public selectedCabin = "E";
  public bookingForm!: FormGroup;
  public submitted = false;
  public travelData: any = "";
  public segmentSeatMaps: any = "";
  public isSeatAvailable: boolean = false;
  public isDomestic: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private shareService: SharedService = inject(SharedService);
  public getData: any = "";
  public totalPassengers: number = 0;
  baggageAllowance: any = [];

  flightBaggage: any = {}; // your full JSON response
  departRoutes: any[] = [];
  selectedRouteIndex: number = 0;
  selectedRoute: any;
  returnRoutes: any[] = [];
  allRoutes: any[] = []; // <-- declare allRoutes
  currentTooltipSegment: any = null;
  currentLayover: any = null;
  layoverList: any[] = [];
  currentTooltipClass: string = "single-tool-tip";
  currentTooltipIndex: any;
  currenttooltip: any;
  tooltipRefreshKey = 0;
  totaltool: number = 0;
  protected icon = inject(SvgIcons);
  private _route: Router = inject(Router);
  checkoutForm!: FormGroup;
  travelProtectionAdded = false;
  travelProtectionPercent = 10;
  travelProtectionAmount = 0;
  travelProtectionTotal: any = 0;
  fareSummary: any;
  farefamily: any;

  selectedSeatTotal: number = 0;
  serviceTaxRate: number = 0.18; // 18% GST example
  serviceTaxAmount: number = 0;
  finalTotal: number = 0;
  SeatAssignmentFee: number = 0;
  discountAmount: number = 0;
  basefareAmount: number = 0;
  taxAmount: number = 0;
  totalAmount: number = 0;
  markup: number = 10;
  travelSeat: any[] = [];
  flattenedSeatData: any = [];
  flightDetails: any[] = [];
  getFlights: any = "";
  pnr: any = "";
  flightBookingResponse: any;
  markupPercentage: number = 10;
  private bs64Image: string = "";
      private hotelService: HotelService = inject(HotelService);

  public titles = [
    { label: "Mr.", value: "Mr." },
    { label: "Ms.", value: "Ms." },
    { label: "Mrs.", value: "Mrs." },
    { label: "Miss.", value: "Miss." },
    { label: "Mstr.", value: "Master." },
  ];
  public gender = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  public specialServices = [
    {
      label: "No Special services Requested",
      value: "No Special services Requested",
    },
    { label: "Blind Passenger", value: "Blind Passenger" },
    { label: "Bassinet for Infant", value: "Bassinet for Infant" },
    { label: "Deaf Passenger", value: "Deaf Passenger" },
    { label: "Stretcher Assistance", value: "Stretcher Assistance" },
    {
      label:
        "Wheelchair - all the way to seat",
      value:
        "Wheelchair - all the way to seat",
    },
    {
      label: "Wheelchair - for ramp",
      value: "Wheelchair - for ramp",
    },
    {
      label:
        "Wheelchair - up and down steps",
      value:
        "Wheelchair - up and down steps",
    },
    {
      label:
        "Wheelchair - manual power (US carriers only)",
      value:
        "Wheelchair - manual power (US carriers only)",
    },
    {
      label:
        "Wheelchair - on board",
      value:
        "Wheelchair - on board",
    },
  ];

  public meal = [
    { label: "Vegetarian Hindu meal", value: "AVML" },
    { label: "Baby meal", value: "BBML" },
    { label: "Bland meal", value: "BLML" },
    { label: "Child meal", value: "CHML" },
    { label: "Chicken meal", value: "CNML" },
    { label: "Diabetic meal", value: "DBML" },
    { label: "Fruit platter meal", value: "FPML" },
    { label: "Fish meal", value: "FSML" },
    { label: "Gluten intolerant meal", value: "GFML" },
    { label: "Hindu (non-vegetarian) meal", value: "HNML" },
    { label: "Indian vegetarian meal", value: "IVML" },
    { label: "Japanese meal", value: "JPML" },
    { label: "Kosher meal", value: "KSML" },
    { label: "Low calorie meal", value: "LCML" },
    { label: "Low fat meal", value: "LFML" },
    { label: "Low salt meal", value: "LSML" },
    { label: "Muslim meal", value: "MOML" },
    { label: "No fish meal (LH specific)", value: "NFML" },
    { label: "Non-lactose meal", value: "NLML" },
    { label: "Japanese Obento meal (UA specific)", value: "OBML" },
    { label: "Vegetarian raw meal", value: "RVML" },
    { label: "Seafood meal", value: "SFML" },
    { label: "Special meal - specify food", value: "SPML" },
    { label: "Vegetarian vegan meal", value: "VGML" },
    { label: "Vegetarian Jain meal", value: "VJML" },
    { label: "Vegetarian Oriental meal", value: "VOML" },
    { label: "Vegetarian lacto-ovo meal", value: "VLML" },
  ];
  public country = [];
  public state = [];

  months = [
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "May", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Aug", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Oct", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Dec", value: 12 },
  ];

  years: any[] = [];
  daysList: any[] = []; // we will generate based on month/year

  selectedCountryISO: CountryISO = CountryISO.UnitedStates;
  isChildValue: boolean = false;
  isAdultValue: boolean = false;
  isInfantValue: boolean = false;
  isSkeleton: boolean = false;
  iscommonSkeleton: boolean = false;
  frequentFlyerAirlines: any[] = [];
  diparture: string = "";
  arrival: string = "";
  tripType: string = "";
  isMobile: boolean = false;
  booking_image: string = "";
  lastScrollTop = 0;
  isHidden = false;
  isBrowser = false;
  activeTab: string = "flight-travelers-details";
  sectionIds = [
    "flight-travelers-details",
    "flight-seat-preference",
    "flight-price-summary",
    "flight-payment-option",
    "flight-billing-information",
  ];

  private sectionOffsets: { id: string; offset: number }[] = [];
  istravellershow: boolean = true;
  isPriceshow: boolean = false;
  isPaymentshow: boolean = false;
  isBillingshow: boolean = false;
  totalTime = 30 * 60; // 30 minutes (in seconds)
  timeLeft = this.totalTime;

  minutes = 0;
  seconds = 0;

  showTimerCard = false;
  showExtraTimer = false;
  showTimerBack = false;
  extraTimerAlreadyShown = false;

  interval: any;
  getSearchData: any = '';
  getParamsData: any = '';
  NO_ZIP_COUNTRIES = [
    'AE', // UAE
    'HK', // Hong Kong
    'MO', // Macau
    'QA', // Qatar
    'SA', // Saudi Arabia
    'KW', // Kuwait
    'OM', // Oman
    'BH'  // Bahrain
  ];
  hasStates = false;
  hasZipCode = true;
  upgradeOptions: any = '';
  formStartedAt: any = '';
  searchServiceData: any = [];
    packageTabActive = true;
     noOfNights: number = 0;
    adultCount: number = 0;
    childCount: number = 0;
    room: number = 0;
    packageFlightDetails:any='';
  searchHotelData:any='';
    roomDetails: any;
    rateDetails: any;
    hotelDetails: any;
  constructor(
    rendererFactory: RendererFactory2,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private flightService: FlightService,
    private toasterService: TosterService,
    private filterService: FlightFilterService,
    private searchService: SearchService,
    private locationService: LocationService,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private captureService: NgxCaptureService,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
    // Initialize renderer
    this.renderer = rendererFactory.createRenderer(null, null);
    this.route.queryParams.subscribe(({ id }) => {
      if (id) {
        this.itnearyId = id;
      }
    });
    if (!isPlatformBrowser(this.platformId)) return;

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
        const html = document.documentElement;
    const body = document.body;
    html.classList.add("sesion-page-overflow");
    body.classList.add("sesion-page-overflow");
    const isDomestic = localStorage.getItem("isDomestic");
    if (isDomestic == "true") {
      this.isDomestic = true;
    } else {
      this.isDomestic = false;
    }

    this.bookingForm = this.fb.group({
      contactInfo: this.fb.group({
        firstName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneCode: [""],
        phoneNumber: [
          "",
          [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)],
        ],
        isSendMessage: [false, [Validators.required]],
      }),
      billingInfo: this.fb.group({
        CardNumber: [
          "",
          [
            Validators.required,
            this.invalidCardTypeValidator,
            this.cardLengthValidator,
          ],
        ],
        cardHolder: ["", Validators.required],
        ExpiryDate: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
            this.expiryRangeValidator(),
          ],
        ],
        CVV: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(4),
          ],
        ],
        street: ["", Validators.required],
        City: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^(?!.*[\p{Extended_Pictographic}])[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/u
            ),
            Validators.maxLength(100),
          ],
        ],

        ZipCode: [
          "",
          [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{4,11}$/)],
        ],
        State: ["", Validators.required],
        Country: ["", Validators.required],
        BillingPhoneNum: [
          undefined,
          [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)],
        ],
        BillingEmail: ["", [Validators.required, Validators.email]],
        isBillingsendMessage: [false, [Validators.required]],
      }),
      travelers: this.fb.array([]),
      seatPreference: this.fb.array([]),
      passengers: this.fb.group({
        adults: [],
        children: [],
        infants: [],
        // infants_seat: [],
      }),
    });
  }
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.sectionOffsets = this.sectionIds.map((id) => {
        const el = document.getElementById(id);
        return el ? { id, offset: el.offsetTop } : { id, offset: 0 };
      });
    }, 500);
  }

  private scrollTicking = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
        
    if (!this.scrollTicking) {
      this.scrollTicking = true;

      requestAnimationFrame(() => {
        this.handleScrollIOSSafe();
        this.scrollTicking = false;
      });
    }
      this.closeAllTips();
  }








  private handleScrollIOSSafe() {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollingElement =
      document.scrollingElement || document.documentElement;

    const st = scrollingElement.scrollTop;

    /** -------------------------------
   * ⭐ MOBILE HEADER HIDE/SHOW (iOS SAFE)
   --------------------------------*/
    if (this.isMobile) {
      const delta = st - this.lastScrollTop;

      // Ignore small iOS bounce or toolbar collapse changes
      if (Math.abs(delta) > 5) {
        this.isHidden = delta > 0; // scrolling down = hide
      }
    }

    this.lastScrollTop = Math.max(0, st);

    /** -------------------------------
   * ⭐ IOS-SAFE SECTION DETECTION
   --------------------------------*/
    let active = this.activeTab;

    for (let id of this.sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();

      // iOS-safe detection using middle of screen instead of fixed px
      const screenMid = window.innerHeight * 0.3; // 30% from top

      if (rect.top <= screenMid && rect.bottom >= screenMid) {
        active = id;
        break;
      }
    }

    if (active !== this.activeTab) {
      this.activeTab = active;
      this.scrollTabIntoView();
    }
  }

  onCountryChange(event: any) {
    const dialCode = `+${event.dialCode}`;

    // Update form control with just the dial code
    this.contactInfo.get("phoneCode")?.setValue(dialCode);
  }

  // ===== Payment Popup =====
  openFlightPaymentPopup() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isflightPaymentPopupOpen = true;
    this.renderer.setStyle(document.body, "overflow", "hidden");
  }

  closeFlightPaymentPopup() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isflightPaymentPopupOpen = false;
    this.renderer.removeStyle(document.body, "overflow");
  }
  private smoothScrollTo(targetY: number, duration = 500) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const time = timestamp - startTime;
      const percent = Math.min(time / duration, 1);
      const eased = ease(percent);

      window.scrollTo(0, startY + diff * eased);

      if (time < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  scrollTabIntoView() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.stepItems) return;

    const activeEl = this.stepItems.find(
      (item) => item.nativeElement.getAttribute("data-id") === this.activeTab
    );

    if (!activeEl) return;

    const el = activeEl.nativeElement;
    const parent = el.parentElement;

    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Calculate center alignment manually (iOS safe)
    const targetScroll =
      parent.scrollLeft +
      (elRect.left - parentRect.left) -
      parentRect.width / 2 +
      elRect.width / 2;

    this.smoothHorizontalScroll(parent, targetScroll);
  }

  private smoothHorizontalScroll(
    container: HTMLElement,
    target: number,
    duration = 400
  ) {
    const start = container.scrollLeft;
    const diff = target - start;
    let startTime: number | null = null;

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const time = timestamp - startTime;
      const percent = Math.min(time / duration, 1);

      container.scrollLeft = start + diff * ease(percent);

      if (time < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  // ===== Scroll Menu to Section =====
  scrollTo(section: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const headerOffset = 100;
    const el = document.getElementById(section);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    this.smoothScrollTo(y);

    this.activeTab = section;
    this.scrollTabIntoView();
    if (section == "flight-travelers-details") {
      this.istravellershow = true;
    }
    if (section == "flight-seat-preference") {
      const travellersArray = this.travelers as FormArray;

      // ✅ Check if no travellers added
      if (!travellersArray || travellersArray.length === 0) {
        this.activeTab = "flight-travelers-details";
        this.scrollTo("flight-travelers-details");
        return;
      }

      // ✅ Check validity of traveller forms
      if (travellersArray.invalid) {
        this.activeTab = "flight-travelers-details";
        this.logInvalidTravellers(travellersArray);
        this.istravellershow = true;
        this.markTravellersAsTouched(travellersArray);
        this.scrollTo("flight-travelers-details");
        this.scrollToFirstError();
        return;
      }

      // ✅ All valid → toggle accordion and populate
      this.isSeatPreferenceOpen = true;
      if (this.isSeatPreferenceOpen) {
        this.populateSeatPreferences();
      }
    }
    if (section == "flight-price-summary") {
      this.isPriceshow = true;
    }

    if (section == "flight-payment-option") {
      this.isPaymentshow = true;
    }

    if (section == "flight-billing-information") {
      this.isBillingshow = true;
    }
    // this.scrollTabIntoView();
  }

  // Option Request
  isSeatPreferenceOpen = false;
  isOptionRequestOpen: boolean[] = [];
  isOptionRequestOpenTraveller: boolean[] = [];
  private markTravellersAsTouched(travellersArray: FormArray): void {
    travellersArray.controls.forEach((group: AbstractControl) => {
      group.markAllAsTouched(); // marks each traveller group
    });
  }

  toggleAccordion(section: string): void {
    if (section === "seatPreference") {
      const travellersArray = this.travelers as FormArray;

      // ✅ Check if no travellers added
      if (!travellersArray || travellersArray.length === 0) {
        this.scrollTo("flight-travelers-details");
        return;
      }

      // ✅ Check validity of traveller forms
      if (travellersArray.invalid) {
        this.logInvalidTravellers(travellersArray);
        this.istravellershow = true;
        this.markTravellersAsTouched(travellersArray);
        this.scrollTo("flight-travelers-details");
        this.scrollToFirstError();
        return;
      }

      // ✅ All valid → toggle accordion and populate
      this.isSeatPreferenceOpen = true;
      if (this.isSeatPreferenceOpen) {
        this.populateSeatPreferences();
      }
    }
  }

  /** 🔍 Helper: Logs invalid traveller fields */
  /** 🔍 Helper: Logs invalid traveller fields */
  private logInvalidTravellers(travellers: FormArray): void {
    if (!isPlatformBrowser(this.platformId)) return;

    travellers.controls.forEach((travellerGroup, index) => {
      const invalidFields: string[] = [];
      Object.keys((travellerGroup as FormGroup).controls).forEach((key) => {
        const control = (travellerGroup as FormGroup).get(key);
        if (control && control.invalid) {
          invalidFields.push(key);
        }
      });

      if (invalidFields.length > 0) {
        // console.warn(
        //   `Traveller ${index + 1} invalid fields: ${invalidFields.join(", ")}`
        // );
      }
    });

    // ✅ Optionally auto-scroll to first invalid field
    setTimeout(() => {
      const firstInvalid = document.querySelector(".ng-invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }
  toggleOptionalRequest(index: number): void {
    this.isOptionRequestOpen[index] = true;
  }

  @Input() truncateCity = 7;
  private originCountry: string = "";

  ngOnInit() {
    this.startTimer();
    this.formStartedAt = Date.now();
    console.log("this.formStartedAt",this.formStartedAt)
    this.getData = this.shareService.getcompanyName();
    this.getIso();
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 100; y--) {
      this.years.push({ label: y, value: y });
    }
    this.generateDefaultDays();
    const paramsData = this.searchService.getCurrentParamsData();
    if (paramsData) {
      this.originCountry = paramsData.OC || "United States";
      this.getParamsData = paramsData;
      this.tripType = paramsData.tripType || "oneway";
      this.searchService.searchData$.subscribe((searchData) => {
        console.log('Received Flight Data:', searchData);
        if (searchData) {
          if (paramsData.tripType !== "multicity") {
            this.diparture =
              searchData?.originDestination[0]?.DepartureLocationCode;
            this.arrival =
              searchData?.originDestination[0]?.ArrivalLocationCode;
          } else {
            const lastIndex = searchData.originDestination.length - 1;

            this.diparture =
              searchData?.originDestination[0].DepartureLocationCode;
            this.arrival =
              searchData.originDestination[lastIndex].ArrivalLocationCode;
          }
        }
      })
      this.selectedAdults = paramsData?.NoOfAdults ?? 0;
      this.selectedChildren =
        (paramsData?.NoOfChildren || 0);
      //  this.selectedChildren =
      // (searchData?.NoOfChildren || 0) + (searchData?.NoOfInfantSeat ?? 0);
      this.selectedInfants = paramsData?.NoOfInfants ?? 0;
      this.selectedCabin = paramsData?.CabinClass || {
        name: "Economy",
        value: "E",
      };
      console.log("this.selectedCabin", paramsData, this.selectedInfants);
      this.selectedInfants_lap = paramsData?.NoOfInfants ?? 0;
      this.totalPassengers =
        this.selectedAdults + this.selectedChildren + this.selectedInfants;
      this.bookingForm.patchValue({
        passengers: {
          adults: this.selectedAdults,
          children: this.selectedChildren,
          infants: this.selectedInfants_lap,
          // infants_seat: this.selectedInfants_seat,
        },
      });
    } else {
    }

    this.getFlightsByItinerary();
    this.getCountry();
    const summary = this.flightService.getFareSummary();

    if (summary) {
      this.fareSummary = summary;

      // Calculate on load
      this.updateTotalWithSeatAndServiceTax();
    } else {
    }
    const response = this.flightService.getFareFamilyData();
    console.log('RAW:', response);


    // ✅ Filter where price > 0
    if (response?.fare?.price > 0) {
      this.farefamily = response;
    }


    console.log('FINAL upgradeOptions:', this.farefamily);
    //
    const text = this.el.nativeElement.textContent.trim();
    if (text.length > this.truncateCity) {
      this.el.nativeElement.classList.add("city--long");
    }
  }
  startTimer() {
    this.updateDisplay();

    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.timeLeft--;

        this.ngZone.run(() => {
          this.updateDisplay();
          this.cdr.markForCheck();

          /** ⏰ Show timer card at 20 min */
          if (this.timeLeft <= 20 * 60 && this.timeLeft > 2 * 60) {
            this.showTimerCard = true;
            this.showExtraTimer = false;
            this.showTimerBack = false;
          }

          /** ⏰ Show extra warning ONLY ONCE */
          if (
            this.timeLeft <= 2 * 60 &&
            this.timeLeft > 0 &&
            !this.extraTimerAlreadyShown
          ) {
            this.showExtraTimer = true;
            this.showTimerCard = false;
            this.showTimerBack = false;

            /** 🔒 lock it */
            this.extraTimerAlreadyShown = true;
          }

          /** ⏹ Time finished */
          if (this.timeLeft <= 0) {
            clearInterval(this.interval);
            this.showTimerBack = true;
            this.showTimerCard = false;
            this.showExtraTimer = false;
          }

          this.toggleBodyOverflowClass();
        });
      }, 1000);
    });
  }

  updateDisplay() {
    this.minutes = Math.floor(this.timeLeft / 60);
    this.seconds = this.timeLeft % 60;
  }

  addExtraTime() {
    this.timeLeft += 10 * 60; // add 10 minutes

    this.showExtraTimer = false;
    this.showTimerCard = true;
    this.showTimerBack = false;

    this.updateDisplay();
    this.toggleBodyOverflowClass();
  }

  private toggleBodyOverflowClass(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const shouldAdd =
      this.showExtraTimer === true || this.showTimerBack === true;
    const html = document.documentElement;
    const body = document.body;
    if (shouldAdd) {
      html.classList.add("sesion-page-overflow");
      body.classList.add("sesion-page-overflow");
    } else {
      html.classList.remove("sesion-page-overflow");
      body.classList.remove("sesion-page-overflow");
    }
  }

  generateDefaultDays() {
    this.daysList = [];
    for (let d = 1; d <= 31; d++) {
      this.daysList.push({ label: d, value: d });
    }
  }
  getDays(month: number, year: number) {
    if (!month || !year) return;

    const totalDays = new Date(year, month, 0).getDate();

    this.daysList = [];
    for (let d = 1; d <= totalDays; d++) {
      this.daysList.push({ label: d, value: d });
    }
  }

  onMonthOrYearChange(i: number) {
    const traveler = this.travelers.at(i) as FormGroup;

    const m = traveler.get("month")?.value;
    const y = traveler.get("year")?.value;

    // If month or year missing → show default 31 days
    if (!m || !y) {
      this.generateDefaultDays();
      return;
    }

    // Generate correct days for selected month/year
    this.getDays(m, y);

    const selectedDay = traveler.get("day")?.value;

    // If 31 selected but month has 30 → reset day
    if (selectedDay > this.daysList.length) {
      traveler.get("day")?.setValue(null);
    }
    this.updateTravelerDOB(i);
  }
  updateTravelerDOB(i: number) {
    const tr = this.travelers.at(i) as FormGroup;

    const d = tr.get("day")?.value;
    const m = tr.get("month")?.value;
    const y = tr.get("year")?.value;

    const dobControl = tr.get("dateOfBirth");

    if (d && m && y) {
      const finalDate = new Date(y, m - 1, d);

      // ✅ Check valid date
      if (!isNaN(finalDate.getTime())) {
        dobControl?.setValue(finalDate);

        // 🔹 Now apply validators
        this.applyDobValidator(tr);
      }
    } else {
      dobControl?.setValue(null);
    }

    // Show validation errors immediately
    dobControl?.markAsTouched();
    dobControl?.markAsDirty();
  }

  applyDobValidator(trav: FormGroup) {
    const paxType = trav.get("PaxType")?.value;
    const dobControl = trav.get("dateOfBirth");
    if (!dobControl) {
      return;
    }

    // Clear old validators
    dobControl.clearValidators();

    const today = new Date();

    // ---------------- ADULT ----------------
    if (paxType === "ADT") {
      const minAdultDate = new Date(
        today.getFullYear() - 12,
        today.getMonth(),
        today.getDate()
      );

      dobControl.addValidators([
        Validators.required,
        (control) => {
          const dob = new Date(control.value);

          if (isNaN(dob.getTime())) {
            return null;
          }

          const result = dob > minAdultDate ? { adultAgeInvalid: true } : null;
          return result;
        },
        this.ageRangeValidator(16, 120),
      ]);
    }

    // ---------------- CHILD ----------------
    if (paxType === "CHD") {
      const maxChildDate = new Date(
        today.getFullYear() - 2,
        today.getMonth(),
        today.getDate()
      );
      const minChildDate = new Date(
        today.getFullYear() - 12,
        today.getMonth(),
        today.getDate()
      );

      dobControl.addValidators([
        Validators.required,
        this.ageRangeValidator(2, 15),
        (control) => {
          const dob = new Date(control.value);

          if (isNaN(dob.getTime())) {
            return null;
          }

          if (dob > maxChildDate) {
            return { childTooYoung: true };
          }

          if (dob < minChildDate) {
            return { childTooOld: true };
          }

          return null;
        },
      ]);
    }
    // ---------------- INFANT ----------------
    if (paxType === "INF") {
      const maxDob = new Date(
        today.getFullYear() - 2,
        today.getMonth(),
        today.getDate()
      );

      dobControl.addValidators([
        Validators.required,

        (control) => {
          const dob = new Date(control.value);
          if (isNaN(dob.getTime())) return null;

          // Too old (>2 years)
          if (dob < maxDob) {
            return { infantTooOld: true };
          }

          // Future date
          if (dob > today) {
            return { infantFutureDate: true };
          }

          return null;
        },
      ]);
    }

    // Apply validators
    dobControl.updateValueAndValidity();
  }

  dateValidator(group: AbstractControl) {
    const d = group.get("day")?.value;
    const m = group.get("month")?.value;
    const y = group.get("year")?.value;

    if (!d || !m || !y) return null;

    const date = new Date(y, m - 1, d);

    // invalid date (example: 31 Feb)
    if (
      date.getDate() !== d ||
      date.getMonth() !== m - 1 ||
      date.getFullYear() !== y
    ) {
      return { invalidDate: true };
    }

    // future date restriction
    if (date > new Date()) {
      return { futureDate: true };
    }

    return null;
  }

getIso() {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  this.locationService.getNearestAirport().subscribe({
    next: (res: any) => {

      if (!res) {
        this.selectedCountryISO = CountryISO.UnitedStates;
        return;
      }

      const country = res?.country || res?.country_code || "";

      if (country && CountryISO[country as keyof typeof CountryISO]) {
        this.selectedCountryISO =
          CountryISO[country as keyof typeof CountryISO];
      } else {
        // ✅ fallback
        this.selectedCountryISO = CountryISO.UnitedStates;
      }
    },

    error: () => {
      // ✅ fallback on error
      this.selectedCountryISO = CountryISO.UnitedStates;
    }
  });
}

  onPlaceSelectedNation(place: any, index: number) {
    if (place?.address_components && Array.isArray(place.address_components)) {
      let countryCode = "";

      place.address_components.forEach((component: any) => {
        if (component.types.includes("country")) {
          countryCode = component.short_name; // e.g., 'IN'
        }
      });

      const travelersArray = this.bookingForm.get("travelers") as FormArray;
      const travelerGroup = travelersArray.at(index) as FormGroup;
      travelerGroup.get("nationality")?.setValue(countryCode);
      travelerGroup.get("nationality")?.markAsDirty();
      travelerGroup.get("nationality")?.markAsTouched();
    }
  }

  getFlightsByItinerary() {
    const user = this.flightService.getDetailsData();
    if (user && user?.ItineraryId) {
      this.getMainDetails = user;
      //fare
      const fareSubtotal: any = { ADT: 0, CHD: 0, INF: 0 };
      const surchargeSubtotal: any = { ADT: 0, CHD: 0, INF: 0 };

      user?.Fares?.forEach(
        (f: { PaxType: any; BaseFare: number; Taxes: number }) => {
          const type = f.PaxType; // ADT / CHD / INF

          fareSubtotal[type] = f.BaseFare || 0;
          surchargeSubtotal[type] = f.Taxes || 0;
        }
      );

      const result = this.calculateDiscount(fareSubtotal, surchargeSubtotal);

      this.discountAmount = result.totalDiscount; // ✅ Only assign the discount number
      this.basefareAmount = result.netFare;
      this.taxAmount = result.netSurcharge;
      this.totalAmount = result.totalAfterDiscount;

      this.getFlights = user.ValidatingCarrierName;
      this.flightDetails = this.generateFlightDetails(user);
      this.frequentFlyerAirlines = this.getMarketingAirlines(user);
      this.getMainDetails = user || "";
      this.prepareRoutes(this.getMainDetails);
      this.flightService.setRepriceData(user);
      this.baggageAllowance = user?.Fares[0]?.BaggageAllowance || "";
      const fares = user?.Fares || [];

      this.isAdultValue = fares.some((fare: any) => fare.PaxType === "ADT");
      this.isChildValue = fares.some((fare: any) => fare.PaxType === "CHD");
      this.isInfantValue = fares.some((fare: any) => fare.PaxType === "INF");
      this.flightBaggage = this.getBaggageInfo();
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

        // Merge depart + return
        this.allRoutes = [...departRoutes, ...returnRoutes];

        // Always select first route
        if (this.allRoutes.length > 0) {
          this.selectedRouteIndex = 0;
          this.selectedRoute = this.allRoutes[0];
        }
      }
      this.populateTravelers();
    } else {
      const payload = {
        SessionId: "",
        ItineraryId: this.itnearyId,
        NoOfAdults: this.selectedAdults,
        NoOfChildren: this.selectedChildren,
        // NoOfInfantSeat: 0,
        NoOfInfants: this.selectedInfants,

        tripType: this.tripType,

        source: this.getMainDetails?.Source || "mondee",
      };
      this.isSkeleton = true;
      this.flightService
        .getFlightReprice(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isSkeleton = false;
            this.cdr.markForCheck();

            const user = res?.data;
            if (user && user?.ItineraryId) {
              const tradeldata = this.flightService.getTravelData();

              if (tradeldata) {
                this.istravellershow = true;
                this.travelData = tradeldata;

                // Patch contactInfo
                this.bookingForm
                  .get("contactInfo")
                  ?.patchValue(tradeldata.contactInfo);
                this.bookingForm
                  .get("billingInfo")
                  ?.patchValue(tradeldata.billingInfo);

                // Clear existing travelers (optional, depending on use case)
                this.travelers.clear();

                // Patch travelers
                tradeldata.travelers.forEach((t: any, index: number) => {
                  this.addTraveler(); // Add new FG
                  const fg = this.travelers.at(this.travelers.length - 1);

                  // Patch simple fields first
                  fg.patchValue({
                    UserTitle: t.UserTitle,
                    PaxType: t.PaxType,
                    firstName: t.firstName,
                    middleName: t.middleName,
                    lastName: t.lastName,
                    dateOfBirth: t.dateOfBirth,
                    day: t.day,
                    month: t.month,
                    year: t.year,
                    gender: t.gender,
                    nationality: t.nationality,
                    meal: t.meal,
                    specialService: t.specialService,
                    redressNumber: t.redressNumber,
                    knownTraveler: t.knownTraveler,
                  });

                  // ------------ PATCH PASSPORT DETAILS ------------
                  if (t.passportDetails) {
                    fg.get("passportDetails")?.patchValue({
                      passportNumber: t.passportDetails.passportNumber,
                      issuingDate: t.passportDetails.issuingDate || null,

                      expiryDate: t.passportDetails.expiryDate || null,
                    });
                  }
                  // ------------ PATCH FREQUENT FLYER ARRAY ------------
                  const ffArray = fg.get("frequentFlayer") as FormArray;
                  ffArray.clear();

                  // Loop through your master list
                  this.frequentFlyerAirlines.forEach((airline: any) => {
                    const existing = t.frequentFlayer?.find(
                      (ff: any) => ff.airline === airline.name
                    );

                    ffArray.push(
                      this.fb.group({
                        airline: [airline.name],
                        number: [existing ? existing.number : ""],
                      })
                    );
                    // this.isOptionRequestOpen[index] = true;
                  });

                  // Run DOB validator after patch
                });
              } else {
                this.istravellershow = false;
              }
              //fare
              const fareSubtotal: any = { ADT: 0, CHD: 0, INF: 0 };
              const surchargeSubtotal: any = { ADT: 0, CHD: 0, INF: 0 };

              user?.Fares?.forEach(
                (f: { PaxType: any; BaseFare: number; Taxes: number }) => {
                  const type = f.PaxType; // ADT / CHD / INF

                  fareSubtotal[type] = f.BaseFare || 0;
                  surchargeSubtotal[type] = f.Taxes || 0;
                }
              );

              const result = this.calculateDiscount(
                fareSubtotal,
                surchargeSubtotal
              );

              this.discountAmount = result.totalDiscount; // ✅ Only assign the discount number
              this.basefareAmount = result.netFare;
              this.taxAmount = result.netSurcharge;
              this.totalAmount = result.totalAfterDiscount;
              this.flightService.setDetailsData(user);
              this.frequentFlyerAirlines = this.getMarketingAirlines(user);
              this.getMainDetails = user;
              this.getFlights = user.ValidatingCarrierName;
              this.flightDetails = this.generateFlightDetails(user);

              this.getMainDetails = user || "";
              this.prepareRoutes(this.getMainDetails);

              this.flightService.setRepriceData(user);
              this.baggageAllowance = user?.Fares[0]?.BaggageAllowance || "";
              this.flightBaggage = this.getBaggageInfo();

              const fares = user?.Fares || [];

              this.isAdultValue = fares.some(
                (fare: any) => fare.PaxType === "ADT"
              );
              this.isChildValue = fares.some(
                (fare: any) => fare.PaxType === "CHD"
              );
              this.isInfantValue = fares.some(
                (fare: any) => fare.PaxType === "INF"
              );
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

                // Merge depart + return
                this.allRoutes = [...departRoutes, ...returnRoutes];

                // Always select first route
                if (this.allRoutes.length > 0) {
                  this.selectedRouteIndex = 0;
                  this.selectedRoute = this.allRoutes[0];
                }
              }
              this.populateTravelers();
              this.cd.detectChanges();
            }
          },
          error: (err) => {
            this.isSkeleton = false;
            this.cdr.markForCheck();
            // this.toasterService.showError(
            //   err.error.message || 'Something went wrong while fetching data!'
            // );
          },
        });
    }
  }
  getMarketingAirlines(flightInfo: any): { name: string; logo: string }[] {
    if (!flightInfo?.Citypairs) return [];

    const airlineMap = new Map<string, string>(); // name → logo

    flightInfo.Citypairs.forEach((pair: any) => {
      pair.FlightSegment?.forEach((seg: any) => {
        const name = seg?.MarketingAirlineName?.trim();
        const logo = seg?.FlightLogoName?.trim(); // assuming this exists

        if (name) {
          airlineMap.set(name, logo || "");
        }
      });
    });

    return Array.from(airlineMap.entries()).map(([name, logo]) => ({
      name,
      logo,
    }));
  }

  getAirlineLogo(airlineName: string): string {
    const airline = this.frequentFlyerAirlines.find(
      (a: any) => a.name === airlineName
    );
    return airline?.logo || "assets/images/airline-logo/default.png";
  }

  getCountry(): void {
    this.sharedService
      .countryList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.country = res?.data;
        },
        error: (err) => {
          // this.toasterService.showError(err.error.message || 'Something went wrong while fetching data!')
        },
      });
  }
  onCountryState(selectedCountryCode: string) {
    const billing = this.bookingForm.get('billingInfo') as FormGroup;
    const stateCtrl = billing.get('State');
    const zipCtrl = billing.get('ZipCode');
    console.log('Selected Country Code:', selectedCountryCode);
    /* ---------------- ZIP CODE LOGIC ---------------- */
    if (this.NO_ZIP_COUNTRIES.includes(selectedCountryCode)) {
      this.hasZipCode = false;
      zipCtrl?.clearValidators();
      zipCtrl?.setValue('');
    } else {
      this.hasZipCode = true;
      zipCtrl?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s-]{4,11}$/)
      ]);
    }
    zipCtrl?.updateValueAndValidity();

    /* ---------------- STATE API CALL ---------------- */
    this.sharedService
      .stateList(selectedCountryCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.state = res?.data?.[0]?.states || [];

          if (this.state.length > 0) {
            // ✅ Dropdown + required
            this.hasStates = true;
            stateCtrl?.setValidators([Validators.required]);
          } else {
            // ✅ Input field + NOT required
            this.hasStates = false;
            stateCtrl?.clearValidators();
            stateCtrl?.setValue('');
          }

          stateCtrl?.updateValueAndValidity();
        },
        error: () => {
          // fallback: input field, not required
          this.hasStates = false;
          stateCtrl?.clearValidators();
          stateCtrl?.setValue('');
          stateCtrl?.updateValueAndValidity();
        },
      });
  }


  get f() {
    return this.bookingForm.controls;
  }

  get contactInfo(): FormGroup {
    return this.bookingForm.get("contactInfo") as FormGroup;
  }

  get travelers(): FormArray {
    return this.bookingForm.get("travelers") as FormArray;
  }
  get billingInfo(): FormGroup {
    return this.bookingForm.get("billingInfo") as FormGroup;
  }
  get passengers(): FormGroup {
    return this.bookingForm.get("passengers") as FormGroup;
  }
  // ✅ Custom validator for date of birth
  dateNotInFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate > today ? { futureDate: true } : null;
    };
  }
  dateNotInPast(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return inputDate < today ? { pastDate: true } : null;
    };
  }
  passportMinimumExpiry(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const issuing = group.get('issuingDate')?.value;
      const expiry = group.get('expiryDate')?.value;

      if (!issuing || !expiry) return null;

      // Parse MM/DD/YYYY
      const [im, id, iy] = issuing.split('/').map(Number);
      const [em, ed, ey] = expiry.split('/').map(Number);

      if (!im || !id || !iy || !em || !ed || !ey) return null;

      const issuingDate = new Date(iy, im - 1, id);
      const expiryDate = new Date(ey, em - 1, ed);

      // 👉 Minimum expiry = issuing + 10 years - 1 day
      const minExpiry = new Date(issuingDate);
      minExpiry.setFullYear(minExpiry.getFullYear() + 10);
      minExpiry.setDate(minExpiry.getDate() - 1);
      if (expiryDate < minExpiry) {
        return { expiryBeforeMinimum: true };
      }

      return null;
    };
  }



  issuingBeforeExpiry(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const issuingDate = group.get("issuingDate")?.value;
      const expiryDate = group.get("expiryDate")?.value;

      if (!issuingDate || !expiryDate) return null;

      const issue = new Date(issuingDate);
      const expiry = new Date(expiryDate);

      if (isNaN(issue.getTime()) || isNaN(expiry.getTime())) {
        return null;
      }

      return issue >= expiry ? { issuingAfterExpiry: true } : null;
    };
  }
  invalidDateFormat() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null; // required handles empty

      // Must match MM/DD/YYYY
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!regex.test(value)) {
        return { invalidDate: true };
      }

      // Validate actual calendar date
      const [mm, dd, yyyy] = value.split("/").map(Number);
      const date = new Date(yyyy, mm - 1, dd);

      if (
        date.getFullYear() !== yyyy ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd
      ) {
        return { invalidDate: true };
      }

      return null;
    };
  }

  newTraveler(): FormGroup {
    const passportGroup = this.fb.group(
      {
        passportNumber: [""],
        issuingDate: [""],
        expiryDate: [""],
      },
      { validators: this.issuingBeforeExpiry() }
    );

    if (!this.isDomestic) {
      // passportGroup.get("passportNumber")?.setValidators([Validators.required]);
      passportGroup
        .get("issuingDate")
        ?.setValidators([
          
          this.invalidDateFormat(),
          this.dateNotInFuture(),
        ]);
      passportGroup
        .get("expiryDate")
        ?.setValidators([
          
          this.invalidDateFormat(),
          this.dateNotInPast(),
        ]);
      // ✅ Cross-field passport rule
      passportGroup.setValidators([
        this.passportMinimumExpiry()
      ]);

    }

    Object.values(passportGroup.controls).forEach((control) =>
      control.updateValueAndValidity()
    );

    const travelerGroup = this.fb.group(
      {
        UserTitle: ["", Validators.required],
        PaxType: ["", Validators.required],
        firstName: ["", Validators.required],
        middleName: [""],
        lastName: ["", Validators.required],
        dateOfBirth: ["", [Validators.required, this.dateNotInFuture()]],
        day: [null, Validators.required],
        month: [null, Validators.required],
        year: [null, Validators.required],
        gender: ["", Validators.required],
        nationality: ["", Validators.required],
        passportDetails: passportGroup,
        meal: [""],
        specialService: [""],
        redressNumber: [""],
        knownTraveler: [""],
        frequentFlayer: this.fb.array([]),
      },
      { validators: this.dateValidator }
    );

    travelerGroup.get("PaxType")?.valueChanges.subscribe(() => {
      this.applyDobValidator(travelerGroup);
    });

    const index = this.travelers.length;
    setTimeout(() => this.setupFrequentFlyerFields(index), 0);
    return travelerGroup;
  }
  validateDOB(group: AbstractControl) {
    const day = group.get("day")?.value;
    const month = group.get("month")?.value;
    const year = group.get("year")?.value;

    if (!day || !month || !year) return null;

    // Build date
    const dob = new Date(year, month - 1, day);

    // Check if valid date (JS autocorrects 31 Feb → Mar 3)
    if (
      dob.getFullYear() != year ||
      dob.getMonth() != month - 1 ||
      dob.getDate() != day
    ) {
      return { invalidDate: true };
    }

    // Must be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dob.setHours(0, 0, 0, 0);

    if (dob >= today) return { futureDate: true };

    return null;
  }

  getFrequentFlayer(travelerIndex: number): FormArray {
    return this.travelers.at(travelerIndex).get("frequentFlayer") as FormArray;
  }

  setupFrequentFlyerFields(travelerIndex: number) {
    const ffArray = this.travelers
      .at(travelerIndex)
      .get("frequentFlayer") as FormArray;
    ffArray.clear(); // avoid duplicates

    this.frequentFlyerAirlines.forEach((airline: any) => {
      ffArray.push(
        this.fb.group({
          airline: [airline.name], // FIXED VALUE - not editable
          number: [""], // user inputs this
        })
      );
    });
  }

  ageRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dob = control.value;
      if (!dob) return null;

      const birthDate = new Date(dob);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < min || age > max) {
        return {
          ageRange: { requiredMin: min, requiredMax: max, actualAge: age },
        };
      }

      return null;
    };
  }
  populateTravelers() {
    this.travelers.clear();

    const tradeldata = this.flightService.getTravelData();
    if (tradeldata) {
      this.istravellershow = true;
      this.bookingForm.get("contactInfo")?.patchValue(tradeldata.contactInfo);
      this.bookingForm.get("billingInfo")?.patchValue(tradeldata.billingInfo);
    }
    let savedTravelers = tradeldata?.travelers || [];

    // 1️⃣ PATCH EXISTING SAVED TRAVELERS
    savedTravelers.forEach((t: any, index: number) => {
      this.addTraveler();
      const fg = this.travelers.at(this.travelers.length - 1);

      // Patch basic traveler fields
      fg.patchValue({
        UserTitle: t.UserTitle,
        PaxType: t.PaxType,
        firstName: t.firstName,
        middleName: t.middleName,
        lastName: t.lastName,
        dateOfBirth: t.dateOfBirth,
        day: t.day,
        month: t.month,
        year: t.year,
        gender: t.gender,
        nationality: t.nationality,
        meal: t.meal,
        specialService: t.specialService,
        redressNumber: t.redressNumber,
        knownTraveler: t.knownTraveler,
      });

      // 1B️⃣ Patch Passport
      if (t.passportDetails) {
        fg.get("passportDetails")?.patchValue({
          passportNumber: t.passportDetails.passportNumber,
          issuingDate: t.passportDetails.issuingDate || null,

          expiryDate: t.passportDetails.expiryDate || null,
        });
      }

      // 1C️⃣ Patch Frequent Flyer
      const ffArray = fg.get("frequentFlayer") as FormArray;
      ffArray.clear();

      this.frequentFlyerAirlines.forEach((airline: any) => {
        const existing = t.frequentFlayer?.find(
          (ff: any) => ff.airline === airline.name
        );

        ffArray.push(
          this.fb.group({
            airline: [airline.name],
            number: [existing ? existing.number : ""],
          })
        );
        // this.isOptionRequestOpen[index] = true;
      });
    });

    // 2️⃣ AUTO-ADD MISSING TRAVELERS BASED ON SELECTED COUNTS

    const countByType = {
      ADT: savedTravelers.filter((t: any) => t.PaxType === "ADT").length,
      CHD: savedTravelers.filter((t: any) => t.PaxType === "CHD").length,
      INF: savedTravelers.filter((t: any) => t.PaxType === "INF").length,
    };

    const addMissingTravelers = (
      selectedCount: number,
      existingCount: number,
      type: string
    ) => {
      const toAdd = selectedCount - existingCount;
      for (let i = 0; i < toAdd; i++) {
        const newTrav = this.newTraveler();
        newTrav.patchValue({ PaxType: type });
        this.travelers.push(newTrav);
      }
    };

    addMissingTravelers(this.selectedAdults, countByType.ADT, "ADT");
    addMissingTravelers(this.selectedChildren, countByType.CHD, "CHD");
    addMissingTravelers(this.selectedInfants, countByType.INF, "INF");

    // 3️⃣ Apply seat preference only after all travelers exist
    this.populateSeatPreferences();
  }

  updateTravelerPassportValidators(): void {
    const travelers = this.bookingForm.get("travelers") as FormArray;

    travelers.controls.forEach((traveler: AbstractControl) => {
      const passportGroup = traveler.get("passportDetails") as FormGroup;

      ["passportNumber", "issuingDate", "expiryDate"].forEach((field) => {
        const control = passportGroup.get(field);
        if (control) {
          if (this.isDomestic) {
            control.clearValidators();
          } else {
            control.setValidators([Validators.required]);
          }
          control.updateValueAndValidity();
        }
      });
    });
  }
  get seatPreference(): FormArray {
    return this.bookingForm.get("seatPreference") as FormArray;
  }

  createSeatDirection(pair: any, travelers: any[]): FormGroup {
    const from = pair?.FlightSegment?.[0]?.DepartureLocationCode;
    const to =
      pair?.FlightSegment?.[pair.FlightSegment.length - 1]?.ArrivalLocationCode;

    const direction = `${from}-${to}`;

    return this.fb.group({
      direction: [direction],
      travellers: this.fb.array(
        travelers.map((t) =>
          this.fb.group({
            name: [`${t.firstName} ${t.lastName}`],
            type: [t.PaxType],
            seatPreference: [""], // Window / Middle / Aisle
          })
        )
      ),
    });
  }
  private seatSelectionCache: {
    [directionIndex: number]: {
      [travellerIndex: number]: string | null;
    };
  } = {};
  saveSeatSelections() {
    this.seatSelectionCache = {};

    this.seatPreference.controls.forEach((dirCtrl, dirIndex) => {
      const travellers = (dirCtrl.get("travellers") as FormArray)?.controls;

      this.seatSelectionCache[dirIndex] = {};

      travellers?.forEach((travellerCtrl, travellerIndex) => {
        this.seatSelectionCache[dirIndex][travellerIndex] =
          travellerCtrl.get("seatPreference")?.value ?? null;
      });
    });
  }

  populateSeatPreferences() {
    // ✅ 1. Save before clear
    this.saveSeatSelections();

    // ✅ 2. Clear form
    this.seatPreference.clear();

    if (this.getMainDetails?.Citypairs?.length) {
      const travellers = this.travelers.value;

      this.getMainDetails.Citypairs.forEach((pair: any, dirIndex: number) => {
        const seatGroup = this.createSeatDirection(pair, travellers);

        // ✅ 3. Restore selections
        const cachedDir = this.seatSelectionCache[dirIndex];

        if (cachedDir) {
          const travellerArray = seatGroup.get("travellers") as FormArray;

          travellerArray.controls.forEach((travellerCtrl, travellerIndex) => {
            const cachedValue = cachedDir[travellerIndex];
            if (cachedValue) {
              travellerCtrl
                .get("seatPreference")
                ?.setValue(cachedValue, { emitEvent: false });
            }
          });
        }

        this.seatPreference.push(seatGroup);
      });
    }
  }

  activeDirectionIndex = 0; // default active direction (first)

  selectDirection(direction: "depart" | "return") {
    const index = direction === "depart" ? 0 : 1;

    // Toggle off if same direction is clicked again
    if (this.activeDirectionIndex === index) {
      this.activeDirectionIndex = -1; // collapse
    } else {
      this.activeDirectionIndex = index; // activate new tab
    }

    this.cd.detectChanges(); // update view
  }

  toggleSeatPreference(traveller: FormGroup, value: string) {
    const current = traveller.get("seatPreference")?.value;
    // If clicked again on same seat, unselect; otherwise set new seat
    traveller.get("seatPreference")?.setValue(current === value ? null : value);
    this.cd.detectChanges();
  }

  getTravellers(dir: AbstractControl): FormGroup[] {
    const travellers = dir.get("travellers") as FormArray;
    return travellers?.controls as FormGroup[];
  }
  getSeatDirectionGroup(index: number): FormGroup {
    return this.seatPreference.at(index) as FormGroup;
  }
  get travellersForActive(): FormGroup[] {
    if (this.activeDirectionIndex === -1) return [];

    const dir = this.seatPreference.at(this.activeDirectionIndex) as FormGroup;

    return this.getTravellers(dir).filter(
      (traveller) => traveller.get('type')?.value !== 'INF'
    );
  }
  // get travellersForActive(): FormGroup[] {
  //   const dir = this.seatPreference.at(this.activeDirectionIndex);
  //   return this.getTravellers(dir);
  // }

  getPassportControl(
    traveler: AbstractControl,
    controlName: string
  ): AbstractControl | null {
    return traveler.get("passportDetails." + controlName);
  }

  addTraveler(): void {
    this.travelers.push(this.newTraveler());
  }

  removeTraveler(i: number): void {
    if (this.travelers.length > 1) {
      this.travelers.removeAt(i);
    } else {
      alert("You must have at least one traveler.");
    }
  }
  scrollToFirstError() {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const firstErrorElement = this.errorElements?.find((el) => {
        return el.nativeElement?.querySelector(".ng-invalid");
      });
      if (firstErrorElement) {
        firstErrorElement.nativeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
    // this.populateSeatPreferences();
  }

  getControl(
    formGroup: AbstractControl,
    controlName: string
  ): AbstractControl | null {
    return formGroup.get(controlName);
  }

  getFareSubtotal(paxType: string, count: number): number {
    const fare = this.getMainDetails?.Fares?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );

    if (!fare) return 0;

    const baseFareWithMarkup = fare.CCMax;

    // ✅ ADD THIS PART (upgrade logic)
    let upgradeAmount = 0;

    const upgradePrice = this.farefamily?.fare?.price || 0;

    if (upgradePrice && upgradePrice > 0) {
      const totalBase = this.getMainDetails?.Fares?.reduce(
        (sum: number, f: any) => sum + f.CCMax,
        0
      );

      if (totalBase > 0) {
        const percentage = fare.CCMax / totalBase;

        upgradeAmount = upgradePrice * percentage;
      }
    }

    // ✅ FINAL RETURN (base + upgrade) * count
    return (baseFareWithMarkup + upgradeAmount) * count;
  }
//   getFareSubtotal(paxType: string, count: number): number {
//   const fare = this.getMainDetails?.Fares?.find(
//     (f: { PaxType: string }) => f.PaxType === paxType
//   );

//   if (!fare) return 0;

//   // Base fare + markup
//   const baseFareWithMarkup = fare.CCMax * (1 + this.markup / 100);

//   // Upgrade logic
//   let upgradeAmount = 0;

//   const upgradePrice = this.farefamily?.fare?.price || 0;

//   if (upgradePrice > 0) {
//     const totalBase = this.getMainDetails?.Fares?.reduce(
//       (sum: number, f: any) => sum + f.CCMax,
//       0
//     );

//     if (totalBase > 0) {
//       const percentage = fare.CCMax / totalBase;
//       upgradeAmount = upgradePrice * percentage;
//     }
//   }

//   // Final total
//   return (baseFareWithMarkup + upgradeAmount) * count;
// }
  getPassportDetails(traveler: AbstractControl): AbstractControl {
    return traveler.get("passportDetails") as AbstractControl;
  }
  getSurchargeSubtotal(paxType: string, count: number): number {
    const fare = this.getMainDetails?.Fares?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );
    if (!fare) return 0;
    const taxesWithMarkup = fare.Taxes;
    // fare.Taxes + (fare.Taxes * this.markupPercentage) / 100;

    return taxesWithMarkup * count;
  }
  onTravelProtectionChange(value: boolean): void {
    this.travelProtectionAdded = value;
  }
  onRemoveTravelProtection(){
    this.travelProtectionAdded =false;
  }
  getTravelProtectionTotal(): number {
    const totalPax =
      this.selectedAdults +
      this.selectedChildren +
      this.selectedInfants;

    return this.travelProtectionAdded
      ? this.travelProtectionAmount
      : 0;
    //  return this.travelProtectionAdded
    // ? this.travelProtectionAmount * totalPax
    // : 0;
  }
  // getsubTotal(): number {
  //   const totalFare =
  //     this.getFareSubtotal("ADT", this.selectedAdults) +
  //     this.getFareSubtotal("CHD", this.selectedChildren) +
  //     this.getFareSubtotal("INF", this.selectedInfants);

  //   const subtotal = totalFare;
  //   this.travelProtectionAmount =
  //     (subtotal * this.travelProtectionPercent) / 100;
  //  this.discountAmount = (totalFare * this.markup) / 100;
  //   return subtotal;
  // }
  getsubTotal(): number {
    const totalFare =
      this.getFareSubtotal("ADT", this.selectedAdults) +
      this.getFareSubtotal("CHD", this.selectedChildren) +
      this.getFareSubtotal("INF", this.selectedInfants);

    const totalSurcharge =
      this.getSurchargeSubtotal("ADT", this.selectedAdults) +
      this.getSurchargeSubtotal("CHD", this.selectedChildren) +
      this.getSurchargeSubtotal("INF", this.selectedInfants);

    // const subtotal = totalFare + totalSurcharge;
    const subtotal = totalFare;


    // ✅ Travel Protection Amount = % of subtotal
    this.travelProtectionAmount =
      (subtotal * this.travelProtectionPercent) / 100;

    return subtotal;
  }

getTotal(): number {
  const adultFare =
    Number(this.getFareSubtotal("ADT", this.selectedAdults)) || 0;

  const childFare =
    Number(this.getFareSubtotal("CHD", this.selectedChildren)) || 0;

  const infantFare =
    Number(this.getFareSubtotal("INF", this.selectedInfants)) || 0;

  const travelProtection =
    Number(this.getTravelProtectionTotal()) || 0;

  const hotelRate =
    Number(this.getTotalPriceRate(this.rateDetails)) || 0;

  return Number(
    (
      adultFare +
      childFare +
      infantFare +
      travelProtection +
      hotelRate
    ).toFixed(2)
  );
}
  getFirstSegmentBaggage(baggageAllowance: any): any[] {
    if (!baggageAllowance) return [];

    const firstKey = Object.keys(baggageAllowance)[0];
    const baggageList = baggageAllowance[firstKey];

    return (
      baggageList?.map((bag: any) => ({
        ...bag,
        chargeAmount: bag.chargeAmount ?? 0,
      })) || []
    );
  }
  getLastSegmentBaggage(baggageAllowance: any): any[] {
    if (!baggageAllowance) return [];

    const keys = Object.keys(baggageAllowance);
    if (keys.length === 0) return [];

    const lastKey = keys[keys.length - 1];
    const baggageList = baggageAllowance[lastKey];

    return (
      baggageList?.map((bag: any) => ({
        ...bag,
        chargeAmount: bag.chargeAmount ?? 0,
      })) || []
    );
  }
  getSegmentMealKeys(meals: { [key: string]: string } | undefined): string[] {
    return meals ? Object.keys(meals) : [];
  }

  showDropdown = false;

  toggleDropdownItinerary() {
    this.showDropdown = !this.showDropdown;
  }
  isDropUpOpen = false;

  toggleDropUp() {
    this.isDropUpOpen = !this.isDropUpOpen;
    this.setBodyScroll(this.isDropUpOpen);
  }

  closeDropUp() {
    this.isDropUpOpen = false;
    this.setBodyScroll(false);
  }
  private setBodyScroll(disable: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (disable) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
  @HostListener("document:keydown.escape")
  onEscape() {
this.closeAllTips();

    if (this.isDropUpOpen) this.closeDropUp();
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

  getBaggageInfo() {
    if (!this.baggageAllowance || !this.getMainDetails?.Citypairs) {
      return { depart: {}, return: {} };
    }
    const flightBaggage: any = { depart: {}, return: {} };
    const cityPairs = this.getMainDetails?.Citypairs;
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
      const direction =
        cityPairs.length > 1 ? (index === 0 ? "depart" : "return") : "depart";
      const pairSegmentKeys = flightSegments.map(
        (seg: any) => `${seg.DepartureLocationCode}-${seg.ArrivalLocationCode}`
      );

      for (const segmentKey in this.baggageAllowance) {
        if (!this.baggageAllowance.hasOwnProperty(segmentKey)) continue;
        const normalizedKey = segmentKey.toUpperCase();
        if (
          !pairSegmentKeys.some(
            (k: string) => k.toUpperCase() === normalizedKey
          )
        )
          continue;
        const validBags = (this.baggageAllowance[segmentKey] || [])
          .filter((bag: any) => {
            const pieces = String(bag.noOfPieces || "")
              .toUpperCase()
              .trim();
            const zeroValues = ["0P", "0PCS", "0", "0PIECES", "0PIECES"];

            // remove only zero-piece rows
            return !zeroValues.includes(pieces);
          })
          .map((bag: any) => {
            const pieces = String(bag.noOfPieces || "")
              .toUpperCase()
              .trim();
            const weight = Number(bag.weight ?? bag.Weight ?? 0);

            const isOnePieceNoInfo =
              pieces === "1P" &&
              !bag.description1 &&
              !bag.Description1 &&
              !bag.description2 &&
              !bag.Description2 &&
              weight === 0;

            return {
              noOfPieces: bag.noOfPieces || "",
              description1: isOnePieceNoInfo
                ? ""
                : bag.description1 || bag.Description1 || "",
              description2: bag.description2 || bag.Description2 || "",
              type: bag.type || "",
              weight,
              measuringType: bag.measuringType || bag.MeasuringType || "KG",
               count:bag.count||0
            };
          });

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

  goBack() {
    this.location.back();
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
  if (
    target.closest(".pkgrev__info-trigger") ||
    target.closest(".pkgrev__link--relative")
  ) {
    return;
  }

  this.closeAllTips();
}
  

  onSegmentClick(
    layoverSegments: any[],
    index: number,
    cityIndex: number,
    itineraryId: string
  ) {
    // Ensure structure exists
    if (!this.activeSegments[itineraryId]) {
      this.activeSegments[itineraryId] = {};
    }

    const currentActive = this.activeSegments[itineraryId][cityIndex] ?? null;

    // ✅ Step 1: If the same one is clicked again → deactivate and close tooltip
    if (currentActive === index) {
      this.clearAllActive();
      this.tooltipVisible = false;
      return;
    }

    // ✅ Step 2: Clear all previous actives (only one active globally)
    this.clearAllActive();

    // ✅ Step 3: Activate the clicked one
    this.activeSegments[itineraryId][cityIndex] = index;
    this.tooltipVisible = true;

    // ✅ Step 4: Update tooltip data
    this.tooltipRefreshKey++;
    this.layoverList = layoverSegments;
    this.currentTooltipIndex = index;

    const totalStops = layoverSegments.length;
    const currentSegment = layoverSegments[index];
    this.currentTooltipClass = this.computeTooltipClass(layoverSegments, index);

    if (totalStops >= 3) {
      this.layoverList = layoverSegments;
    } else if (currentSegment) {
      this.currentLayover = {
        OriginAirportName: currentSegment.OriginAirportName,
        LayoverTime: currentSegment.LayoverTime,
      };
    }

    this.totaltool = totalStops;
  }

  // ✅ Tooltip hide event handler
  onTooltipHide() {
    this.tooltipVisible = false;
    this.clearAllActive();
  }

  // ✅ Reusable helper to deactivate all
  clearAllActive() {
    Object.keys(this.activeSegments).forEach((id) => {
      Object.keys(this.activeSegments[id]).forEach((city: any) => {
        this.activeSegments[id][city] = null;
      });
    });
  }

  // Compute tooltip class
  computeTooltipClass(layoverSegments: any[], index: number | string): string {
    const total = layoverSegments.length;
    if (total === 1) return "single-tool-tip";
    if (total === 2) return index === 0 ? "single-tool-tip" : "single-tool-tip";
    if (total >= 3) {
      if (index === 0 || index === total - 1) return "single-tool-tip";
      return "multiple-tool-tip";
    }
    return "single-tool-tip";
  }
  public continueToBooking() {
    this.router.navigate(["/flight/booking"], {
      queryParams: {
        id: this.itnearyId,
      },
    });
  }
  phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Ensure value is an object and has nationalNumber
    if (value && typeof value === "object" && value.number) {
      const digits = value.number.replace(/\D/g, ""); // remove non-digits
      const length = digits.length;

      if (length < 6 || length > 15) {
        return { invalidPhoneLength: true };
      }
    }

    return null;
  }

  generateFlightDetails(data: any): any[] {
    const baseImageUrl =
      "https://images.trippro.com/AirlineImages/AirLine/GDS/images/";
    const cityPairs = data?.Citypairs || [];
    const flightDetails: any[] = [];

    cityPairs.forEach((pair: any, index: number) => {
      const flightType = index === 0 ? 1 : 2; // 1 for onward, 2 for return
      pair.FlightSegment.forEach((segment: any) => {
        flightDetails.push({
          dep_airportname: segment.OriginAirportName || "",
          dep_cityname: segment.DepartureDisplayName || "",
          dep_countryname: "", // Not present in response
          dep_airportcode: segment.DepartureLocationCode || "",
          dep_latitude: "",
          dep_longitude: "",
          dep_timezone: segment.DepartureTimeZone || "",
          dep_timezoneshort: "",
          arr_airportcode: segment.ArrivalLocationCode || "",
          arr_airportname: segment.DestinationAirportName || "",
          arr_cityname: segment.DisplayName || "",
          arr_countryname: "", // Not present in response
          arr_latitude: "",
          arr_longitude: "",
          arr_timezone: segment.ArrivalTimeZone || "",
          arr_timezoneshort: "",
          flightNo: segment.FlightNumber,
          iatacode: segment.MarketingAirline,
          name: segment.MarketingAirlineName || "",
          cabin: segment.CabinClass === "E" ? "Economy" : segment.CabinClass,
          class: segment.CabinClass === "E" ? "Economy" : segment.CabinClass,
          dep_date: segment.DepartureDateTime,
          dep_day: new Date(segment.DepartureDateTime).toLocaleDateString(
            "en-US",
            { weekday: "long" }
          ),
          arr_date: segment.ArrivalDateTime,
          arr_day: new Date(segment.ArrivalDateTime).toLocaleDateString(
            "en-US",
            { weekday: "long" }
          ),
          duration: segment.Duration,
          distance_miles: "",
          distance_km: "",
          flightLogo: this.imageUrl + segment.FlightLogoName,
          transit_time: "",
          flight_type: flightType,
        });
      });
    });

    return flightDetails;
  }
private generateHotelPayload(hotelData: any): any {
  const selectedRoom = hotelData?.selectedRoom || {};
  const selectedRate = hotelData?.selectedRate || {};
  const hotelDetails = hotelData?.hotelDetails || {};

  const hotelFare = hotelDetails?.fare || {};

  const checkIn =
 
    this.searchHotelData?.checkIn ||
    hotelData?.stayDates?.checkIn ||
    "";

  const checkOut =

    this.searchHotelData?.checkOut ||
    hotelData?.stayDates?.checkOut ||
    "";

  const rooms =
    hotelData?.stayDates?.rooms ||
    this.searchHotelData?.rooms ||
    [];

  const firstRoom = rooms?.[0] || {};

  return {
    reference_id: selectedRate?.rateType || "Onhold",
    booking_source: "Mondee",

    name: hotelDetails?.hotelName || "",
    hotel_image:
      hotelDetails?.images?.[0]?.href ||
      selectedRoom?.roomImages?.[0]?.imageUrl ||
      "",

    rating: hotelDetails?.starRating || "",
    address: hotelDetails?.address?.line1 || "",
    phone: hotelDetails?.phoneNumber || "",
    email: hotelDetails?.email || "",

    room_type:
      selectedRoom?.roomName ||
      selectedRoom?.description ||
      "",

    no_of_adult: String(firstRoom?.adults || 0),
    no_of_child: String(firstRoom?.childAges?.length || 0),

    no_of_bed: selectedRoom?.bedCount || 0,
    no_of_bedroom: this.getBedroomCount(selectedRoom),

    checkin_date: checkIn,
    checkin_time: hotelDetails?.checkin || "",

    checkout_date: checkOut,
    checkout_time: hotelDetails?.checkout || "",

    addtional_policies:
      hotelDetails?.hotelPolicies?.know_before_you_go || "",

    hotel_confirmation_number: "",

    booking_status: "Flight Hotel Booking",

    hotel_info: JSON.stringify({
      selectedRoom: selectedRoom,
      selectedRate: selectedRate,
      hotelDetails: hotelDetails,
      stayDates: hotelData?.stayDates || {
        checkIn,
        checkOut,
        rooms,
      },
    }),
  };
}
private getBedroomCount(room: any): number {
  const roomName = (
    room?.roomName ||
    room?.description ||
    ""
  ).toLowerCase();

  const match = roomName.match(/(\d+)\s*bedroom/);

  return match ? Number(match[1]) : 1;
}
  calculateDiscount(
    fareSubtotal: { [key: string]: number },
    surchargeSubtotal: { [key: string]: number }
  ): {
    totalDiscount: number;
    actualFare: number;
    actualSurcharge: number;
    totalBeforeDiscount: number;
    netFare: number;
    netSurcharge: number;
    totalAfterDiscount: number;
  } {
    let totalDiscount = 0;
    let actualFare = 0;
    let actualSurcharge = 0;

    const types: Array<"ADT" | "CHD" | "INF"> = ["ADT", "CHD", "INF"];
    const discountRate = this.markup / 100;
    types.forEach((type) => {
      const fare = fareSubtotal?.[type] || 0;
      const surcharge = surchargeSubtotal?.[type] || 0;

      actualFare += fare;
      actualSurcharge += surcharge;
    });

    const totalBeforeDiscount = actualFare + actualSurcharge;

    // Since markup removed, net values = actual values
    const netFare = actualFare;
    const netSurcharge = actualSurcharge;
    const totalAfterDiscount = totalBeforeDiscount;

    return {
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      actualFare: parseFloat(actualFare.toFixed(2)),
      actualSurcharge: parseFloat(actualSurcharge.toFixed(2)),
      totalBeforeDiscount: parseFloat(totalBeforeDiscount.toFixed(2)),
      netFare: parseFloat(netFare.toFixed(2)),
      netSurcharge: parseFloat(netSurcharge.toFixed(2)),
      totalAfterDiscount: parseFloat(totalAfterDiscount.toFixed(2)),
    };
  }

  getCardBrand(pan: string, includeSubTypes = false): string {
    const visaRegex = /^4[0-9]{0,}$/;
    const vprecaRegex = /^428485[0-9]{0,}$/;
    const postepayRegex = /^(402360|402361|403035|417631|529948)[0-9]{0,}$/;
    const cartasiRegex = /^(432917|432930|453998)[0-9]{0,}$/;
    const entropayRegex =
      /^(406742|410162|431380|459061|533844|522093)[0-9]{0,}$/;
    const o2moneyRegex = /^(422793|475743)[0-9]{0,}$/;

    const mastercardRegex =
      /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/;
    const maestroRegex = /^(5[06789]|6)[0-9]{0,}$/;
    const kukuruzaRegex = /^525477[0-9]{0,}$/;
    const yunacardRegex = /^541275[0-9]{0,}$/;

    const amexRegex = /^3[47][0-9]{0,}$/;
    const dinersRegex = /^3(?:0[0-5]|[689])[0-9]{0,}$/;
    const discoverRegex =
      /^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/;
    const jcbRegex = /^(?:2131|1800|35)[0-9]{0,}$/;

    if (jcbRegex.test(pan)) {
      return "Jcb";
    }

    if (amexRegex.test(pan)) {
      return "AX";
    }

    if (dinersRegex.test(pan)) {
      return "Diners Club";
    }

    if (includeSubTypes) {
      if (vprecaRegex.test(pan)) return "v-preca";
      if (postepayRegex.test(pan)) return "postepay";
      if (cartasiRegex.test(pan)) return "cartasi";
      if (entropayRegex.test(pan)) return "entropay";
      if (o2moneyRegex.test(pan)) return "o2money";
      if (kukuruzaRegex.test(pan)) return "kukuruza";
      if (yunacardRegex.test(pan)) return "yunacard";
    }

    if (visaRegex.test(pan)) {
      return "VI";
    }

    if (mastercardRegex.test(pan)) {
      return "CA";
    }

    if (discoverRegex.test(pan)) {
      return "DS";
    }

    if (maestroRegex.test(pan)) {
      return pan.startsWith("5") ? "CA" : "Maestro";
    }

    return "unknown";
  }
  maxCardLength: number = 19;
  cardLogo: string = "default.svg";

  onCardNumberInput() {
    const control = this.billingInfo.get("CardNumber");
    let rawValue = control?.value || "";

    // Remove all spaces
    let digits = rawValue.replace(/\s+/g, "");

    // Detect brand
    const cardBrand = this.getCardBrand(digits);
    this.cardLogo = this.getCardLogo(cardBrand);

    // Apply dynamic rules
    const maxLength = this.getCardMaxLength(cardBrand);
    const minLength = this.getCardMinLength(cardBrand);

    // Trim extra digits
    digits = digits.substring(0, maxLength);

    // Add spacing for user readability: 4-4-4-4
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();

    // Update form
    control?.setValue(formatted, { emitEvent: false });

    // Update validators dynamically (digits only)
    control?.setValidators([
      Validators.required,
      this.invalidCardTypeValidator,
      this.cardLengthValidator,
    ]);

    control?.updateValueAndValidity();

    // Update CVV length logic
    this.updateCvvValidator(cardBrand);
  }

  updateCvvValidator(cardBrand: string) {
    const cvvControl = this.billingInfo.get("CVV");

    const cvvLength = cardBrand === "AX" ? 4 : 3;

    cvvControl?.setValidators([
      Validators.required,
      Validators.minLength(cvvLength),
      Validators.maxLength(cvvLength),
    ]);

    cvvControl?.updateValueAndValidity();
  }
  getCardLogo(brand: string) {
    switch (brand) {
      case "VI":
        return "visa.svg";
      case "CA":
        return "mastercard.svg";
      case "AX":
        return "amex.svg";
      case "DS":
        return "discover.svg";
      case "Jcb":
        return "jcb.svg";
      case "Maestro":
        return "maestro.svg";
      case "Diners Club":
        return "dinersclub.svg";
      default:
        return "default.svg";
    }
  }
  getCardMaxLength(brand: string) {
    switch (brand) {
      case "AX":
        return 15;
      case "Diners Club":
        return 14;
      case "Maestro":
        return 19;
      default:
        return 16;
    }
  }

  getCardMinLength(brand: string) {
    switch (brand) {
      case "AX":
        return 15;
      case "Diners Club":
        return 14;
      default:
        return 15;
    }
  }

  invalidCardTypeValidator = (control: any) => {
    const value = (control.value || "").replace(/\s+/g, "");
    if (!value) return null;

    const brand = this.getCardBrand(value);

    if (brand === "unknown") {
      return { invalidCardType: true };
    }

    return null;
  };

  cardLengthValidator = (control: any) => {
    const digits = (control.value || "").replace(/\s+/g, "");

    if (!digits) return null;

    const brand = this.getCardBrand(digits);
    const min = this.getCardMinLength(brand);
    const max = this.getCardMaxLength(brand);

    if (digits.length < min || digits.length > max) {
      return { invalidLength: true };
    }

    return null;
  };

  getTravelerTotal(type: "ADT" | "CHD" | "INF"): number {
    const fare = this.fareSummary?.fareSubtotal?.[type] || 0;
    return fare;
  }
  getTotalServiceCharges(): number {
    const s = this.fareSummary?.surchargeSubtotal || {};
    return (s.ADT || 0) + (s.CHD || 0) + (s.INF || 0);
  }
  updateTotalWithSeatAndServiceTax(): void {
    const baseFare = this.fareSummary?.totalAmount || 0;
    const travelProtection = this.travelProtectionAdded
      ? this.travelProtectionAmount
      : 0;

    const preTax = baseFare + this.selectedSeatTotal + travelProtection;
    this.finalTotal = preTax;
  }
  toggleTravelProtection(): void {
    this.travelProtectionAdded = !this.travelProtectionAdded;

    this.updateTotalWithSeatAndServiceTax();
  }
  onFullAddressselected(place: any) {
    if (place && place.formatted_address) {
      const formattedAddress = `${place.name}`;
      this.checkoutForm.get("street")?.setValue(formattedAddress);
      this.checkoutForm.get("street")?.markAsDirty();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
      }

      // Extract address components
      const addressComponents = place.address_components;
      let city = "";
      let state = "";
      let country = "";
      let zipCode = "";

      addressComponents.forEach((component: any) => {
        const types = component.types;

        if (types.includes("locality")) {
          city = component.long_name;
        }

        if (types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }

        if (types.includes("country")) {
          country = component.short_name;
        }

        if (types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      });

      // Patch form fields
      this.checkoutForm.patchValue({
        City: city,
        State: state,
        Country: country,
        ZipCode: zipCode,
      });
    }
  }
  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }
  formatDateforCRM(dateStr: string): string {
    const d = new Date(dateStr);
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  formatDateforCRMPassport(dateStr: string): string {
    if (!dateStr) return "";

    const parts = dateStr.split("/"); // MM/DD/YYYY
    if (parts.length !== 3) return "";

    const [mm, dd, yyyy] = parts;

    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }

  convertExpiryToAPI(exp: string): string {
    if (!exp) return "";

    const [mm, yy] = exp.split("/");

    const currentYear = new Date().getFullYear();
    const centuryPrefix = Math.floor(currentYear / 100); // 20 for 2000s, 21 for 2100s

    const fullYear = `${centuryPrefix}${yy}`;

    return `${mm}/${fullYear}`;
  }
  buildItineraryDetails(data: any): any[] {

    if (!data?.Citypairs?.length) return [];

    return data.Citypairs.map((cp: any) => {
        
      const firstSegment = cp?.FlightSegment?.[0];
      const lastSegment = cp?.FlightSegment?.[cp.FlightSegment.length - 1];

      return {
        Departure: firstSegment?.DepartureLocationCode || "",
        Arrival: lastSegment?.ArrivalLocationCode || "",
        DepartureDateTime: firstSegment?.DepartureDateTime || "",

        BasicFare: data?.Fares?.[0]?.TravellerBaseFare || 0,
        GrossFare: data?.Fares?.[0]?.CCMax || 0,

        Segments: (cp?.FlightSegment || []).map((seg: any) => ({
          Departure: seg?.DepartureLocationCode || "",
          Arrival: seg?.ArrivalLocationCode || "",
          DepartureDateTime: seg?.DepartureDateTime || "",
          ArrivalDateTime: seg?.ArrivalDateTime || "",
          FlightNumber: seg?.FlightNumber || "",
          RBD: seg?.BookingClass || null
        }))
      };

    });

  }
  onComplete(event: Event) {
  event.preventDefault();
  this.submitForm();
}
  submitForm() {
    // this._route.navigate(["/flight-booking-confirmation"], {
    //           queryParams: {
    //             id: 'A1771921550',
    //           },replaceUrl: true
    //         });
    // this.capture();
    // this.captureFullPageScreenshot();

    if (this.bookingForm.valid) {
      this.loading = true;
      this.cdr.markForCheck();
      this.flightService.setTravelData(this.bookingForm.value);
   this.createBooking();

      //  this.createBooking();
      // this._route.navigate(['/flight-booking-confirmation']);
      // Process the payment here
    } else {
      this.loading = false;

      this.submitted = true;

      this.istravellershow = true;

      this.isPriceshow = true;

      this.isPaymentshow = true;

      this.isBillingshow = true;
      // ✅ 2. Mark all controls touched
      this.bookingForm.markAllAsTouched();

      // ✅ 3. Force Angular to update DOM
      this.cdr.detectChanges();

      // ✅ 4. Scroll AFTER DOM is ready
      setTimeout(() => {
        this.scrollToFirstInvalidControl();
        this.scrollToFirstError();
        this.logInvalidControls(this.bookingForm);
      }, 0);

      return;
    }
  }

  logInvalidControls(
    formGroup: FormGroup | FormArray,
    path: string = ""
  ): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      const controlPath = path ? `${path}.${key}` : key;

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control, controlPath);
      } else if (control?.invalid) {
        // console.error(`❌ Invalid control: ${controlPath}`, control.errors);
      }
    });
  }
  scrollToFirstInvalidControl(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      const firstInvalidControl = document.querySelector(
        "input.ng-invalid, select.ng-invalid, textarea.ng-invalid"
      );

      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Optional: focus for accessibility
        (firstInvalidControl as HTMLElement).focus();
      }
    }, 0);
  }

  /**
   * Optional helper: scroll to the first invalid form control on screen
   */

  generatePassword(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  getCurrentDateTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = this.padZero(now.getMonth() + 1); // Months are 0-indexed
    const day = this.padZero(now.getDate());

    const hours = this.padZero(now.getHours());
    const minutes = this.padZero(now.getMinutes());
    const seconds = this.padZero(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  padZero(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }

  mainbookingTest() {
    const fares = this.getMainDetails?.Fares || [];

    const travelerPricings: any = {};

    fares.forEach((fare: any) => {
      const paxType = fare.PaxType;

      // Pull included checked bags (if present)
      const includedCheckedBags: any[] = [];
      if (fare?.baggageAllowance) {
        Object.values(fare.baggageAllowance).forEach((segments: any) => {
          includedCheckedBags.push(
            ...segments.filter((bag: any) => bag.type === "CHECKIN")
          );
        });
      }

      travelerPricings[paxType] = {
        orgeachtotal: fare?.marketFare + fare?.MarketTaxes,
        eachtotal: fare?.TravellerBaseFare + fare?.TravellerTaxes,
        orgeachbase: fare?.marketFare,
        eachbase: fare?.TravellerBaseFare,
        orgeachtaxes: fare?.MarketTaxes,
        eachtaxes: fare?.TravellerTaxes,
        passengercount: 1, // Default to 1 unless you have actual count elsewhere
        basefare: fare?.TravellerBaseFare,
        total: fare?.TravellerBaseFare + fare?.TravellerTaxes,
        totalbase: fare?.TravellerBaseFare,
        totaltaxes: fare?.TravellerTaxes,
        type: paxType,
        cabin: this.selectedCabin, // Example: You can get from FlightSegment[0]?.CabinClass
        class: fare?.bookingClasses?.split(",")[0] || "",
        includedCheckedBags: includedCheckedBags,
      };
    });

    const cityPairs = this.getMainDetails?.Citypairs || [];

    const itineraries = cityPairs.map((itin: any) => {
      const firstSegment = itin?.FlightSegment?.[0];
      const lastSegment = itin?.FlightSegment?.[itin.FlightSegment.length - 1];

      return {
        duration: itin?.Duration,
        origin_iatacode: firstSegment?.DepartureLocationCode,
        origin_iataname: firstSegment?.DepartureDisplayName,
        origin_departure_terminal: firstSegment?.DepartureTerminalId,
        origin_departure_time: firstSegment?.DepartureDateTime,
        carrierCode: firstSegment?.MarketingAirline,
        aircraft_name: firstSegment?.AirEquipmentType,
        aircraft_code: firstSegment?.MarketingAirline,
        aircraft_number: firstSegment?.FlightNumber,
        origin_city: firstSegment?.OriginAirportName,
        origin_country: "", // if needed, extract from mapping or not available
        origin_country_Code: "",

        destination_iatacode: lastSegment?.ArrivalLocationCode,
        destination_iataname: lastSegment?.DisplayName,
        destination_departure_terminal: lastSegment?.ArrivalTerminalId,
        destination_departure_time: lastSegment?.ArrivalDateTime,
        destination_city: lastSegment?.DestinationAirportName,
        destination_country: "", // not provided
        destination_country_Code: "",

        stopage: itin?.NoOfStops,

        segments: itin?.FlightSegment?.map((seg: any) => ({
          baggageAllowance: seg?.baggageAllowance,
          baggageDesc1: seg?.baggageDesc1,
          baggageDesc2: seg?.baggageDesc2,
          baggageInfoUrl: seg?.baggageInfoUrl,
          departure_iatacode: seg?.DepartureLocationCode,
          departure_terminal: seg?.DepartureTerminalId,
          departure_time: seg?.DepartureDateTime,
          flightlogo: seg?.FlightLogoName,
          arrival_iataCode: seg?.ArrivalLocationCode,
          arrival_terminal: seg?.ArrivalTerminalId,
          arrival_time: seg?.ArrivalDateTime,
          carrierCode: seg?.MarketingAirline,
          carrierName: seg?.MarketingAirlineName,
          duration: seg?.Duration,
          layover: seg?.LayoverTime,
          aircraft_name: seg?.AirEquipmentType,
          aircraft_code: "", // not provided
          aircraft_number: seg?.FlightNumber,
          origin_iataname: seg?.OriginAirportName,
          origin_city: seg?.DepartureDisplayName,
          origin_country: "", // not provided
          origin_country_Code: "",
          destination_iataname: seg?.DestinationAirportName,
          destination_city: seg?.DisplayName,
          destination_country: "", // not provided
          destination_country_code: "",
        })),
      };
    });

    const payload = {
      offerdetails: JSON.stringify(this.getMainDetails),
      type: this.getMainDetails?.type || "",
      id: this.getMainDetails?.ItineraryId,
      source: this.getMainDetails?.Source || "mondee",
      instantTicketingRequired:
        this.getMainDetails?.instantTicketingRequired || "",
      nonHomogeneous: this.getMainDetails?.nonHomogeneous || "",
      oneWay: this.getMainDetails?.oneWay || "",
      lastTicketingDate: this.getMainDetails?.lastTicketingDate || "",
      numberOfBookableSeats: this.getMainDetails?.numberOfBookableSeats || "",
      isInternational: this.getMainDetails?.isInternational || 0,
      NearLocationItinerary:
        this.getMainDetails?.NearLocationItinerary?.length > 0 ? "YES" : "No",

      price: {
        currency: this.getMainDetails?.Fares[0]?.CurrencyCode,
        currency_symbol:
          this.getMainDetails?.Fares[0]?.CurrencyCode === "USD" ? "$" : "€",
        base: this.basefareAmount,
        cabin: this.selectedCabin,
        total: this.basefareAmount,
        grandTotal: this.finalTotal,
        markupgrandTotal: this.discountAmount,
      },
      travelerPricings: travelerPricings,

      itineraries: itineraries,
    };
    const mainpayload = {
      flight_info: JSON.stringify(payload),
    };
    this.flightService
      .createFlightbookings(mainpayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.States === 1) {
            // this.toasterService.showSuccess(res?.message);

            this._route.navigate(["/flight-booking-confirmation"], {
              queryParams: {
                id: res?.booking?.booking_details?.bookingId,
              }, replaceUrl: true
            });
          }
        },
        error: (err) => {
          // this.toasterService.showError(
          //   err.error.message || 'Something went wrong while fetching data!'
          // );
        },
      });
  }

createBooking() {

  if (!this.bookingForm.valid) {
    return;
  }
   this.isSkeleton = true;
  const formValue = this.bookingForm.value;

  // ============================================================
  // TRAVELERS
  // ============================================================

  const BookItineraryPaxDetail = (formValue.travelers || []).map(
    (traveler: any) => {
      return {
        passengerId: 0,
        type: traveler.PaxType,
        gender: traveler.gender,
        title: traveler.UserTitle,
        firstname: traveler.firstName,
        middlename: traveler.middleName,
        lastname: traveler.lastName,

        dob: this.formatDateforCRM(
          traveler.dateOfBirth
        ),

        PassportNumber:
          traveler?.passportDetails?.passportNumber || "",

        CountryOfIssue:
          traveler?.nationality || "",

        Nationality:
          traveler?.nationality || "",

        PassportIssueDate:
          traveler?.passportDetails?.issuingDate != ""
            ? this.formatDateforCRMPassport(
                traveler?.passportDetails?.issuingDate
              )
            : traveler?.passportDetails?.issuingDate || "",

        PassportExpiryDate:
          traveler?.passportDetails?.expiryDate != ""
            ? this.formatDateforCRMPassport(
                traveler?.passportDetails?.expiryDate
              )
            : traveler?.passportDetails?.expiryDate || "",

        meal: traveler.meal || "",

        specialService:
          traveler.specialService || "",

        redressNumber:
          traveler.redressNumber || "",

        knownTraveler:
          traveler.knownTraveler || "",

        frequentFlayer:
          traveler.frequentFlayer || "",
      };
    }
  );

  // ============================================================
  // BASIC BOOKING INFORMATION
  // ============================================================

  const password = this.generatePassword(8);

  const timestamp = Date.now()
    .toString()
    .slice(0, 10);

  const bookingId = "AH" + timestamp;

  const customerId = parseInt(
    bookingId.slice(1),
    10
  );

  const contactInfo =
    formValue.contactInfo || {};

  const billingInfo =
    formValue.billingInfo || {};

  const seatPreference =
    formValue.seatPreference || "";

  // ============================================================
  // CARD EXPIRY
  // ============================================================

  const expiry = this.convertExpiryToAPI(
    billingInfo.ExpiryDate
  );

  const [exp_month, exp_year] =
    expiry.split("/");

  // ============================================================
  // FLIGHT FARES
  // ============================================================

  const fares =
    this.getMainDetails?.Fares || [];

  const travelerPricings: any = {};

  fares.forEach((fare: any) => {

    const paxType =
      fare?.PaxType || "ADT";

    // ----------------------------------------------------------
    // INCLUDED CHECKED BAGGAGE
    // ----------------------------------------------------------

    const includedCheckedBags: any[] = [];

    if (fare?.BaggageAllowance) {

      Object.values(
        fare.BaggageAllowance
      ).forEach((segments: any) => {

        if (Array.isArray(segments)) {

          includedCheckedBags.push(
            ...segments.filter(
              (bag: any) =>
                bag?.type === "CHECKIN"
            )
          );

        }

      });

    }

    // Some responses may use lowercase baggageAllowance
    if (fare?.baggageAllowance) {

      Object.values(
        fare.baggageAllowance
      ).forEach((segments: any) => {

        if (Array.isArray(segments)) {

          includedCheckedBags.push(
            ...segments.filter(
              (bag: any) =>
                bag?.type === "CHECKIN"
            )
          );

        }

      });

    }

    // ----------------------------------------------------------
    // TRAVELER PRICING
    // ----------------------------------------------------------

    travelerPricings[paxType] = {

      orgeachtotal:
        Number(fare?.MarketFare || fare?.marketFare || 0) +
        Number(fare?.MarketTaxes || fare?.marketTaxes || 0),

      eachtotal:
        Number(fare?.TravellerBaseFare || 0) +
        Number(fare?.TravellerTaxes || 0),

      orgeachbase:
        Number(
          fare?.MarketFare ||
          fare?.marketFare ||
          0
        ),

      eachbase:
        Number(
          fare?.TravellerBaseFare || 0
        ),

      orgeachtaxes:
        Number(
          fare?.MarketTaxes ||
          fare?.marketTaxes ||
          0
        ),

      eachtaxes:
        Number(
          fare?.TravellerTaxes || 0
        ),

      passengercount: 1,

      basefare:
        Number(
          fare?.TravellerBaseFare || 0
        ),

      total:
        Number(
          fare?.TravellerBaseFare || 0
        ) +
        Number(
          fare?.TravellerTaxes || 0
        ),

      totalbase:
        Number(
          fare?.TravellerBaseFare || 0
        ),

      totaltaxes:
        Number(
          fare?.TravellerTaxes || 0
        ),

      type: paxType,

      cabin:
        this.selectedCabin ||
        this.getMainDetails
          ?.Citypairs?.[0]
          ?.FlightSegment?.[0]
          ?.CabinClass ||
        "E",

      class:
        fare?.BookingClasses ||
        fare?.bookingClasses?.split(",")?.[0] ||
        "",

      includedCheckedBags:
        includedCheckedBags,
    };

  });

  // ============================================================
  // FLIGHT ITINERARIES
  // ============================================================

  const cityPairs =
    this.getMainDetails?.Citypairs || [];

  const itineraries = cityPairs.map(
    (itin: any) => {

      const segments =
        itin?.FlightSegment || [];

      const firstSegment =
        segments?.[0];

      const lastSegment =
        segments?.[segments.length - 1];

      return {

        duration:
          itin?.Duration || "",

        origin_iatacode:
          firstSegment?.DepartureLocationCode || "",

        origin_iataname:
          firstSegment?.DepartureDisplayName || "",

        origin_departure_terminal:
          firstSegment?.DepartureTerminalId || "",

        origin_departure_time:
          firstSegment?.DepartureDateTime || "",

        carrierCode:
          firstSegment?.MarketingAirline || "",

        aircraft_name:
          firstSegment?.AirEquipmentType || "",

        aircraft_code:
          firstSegment?.MarketingAirline || "",

        aircraft_number:
          firstSegment?.FlightNumber || "",

        origin_city:
          firstSegment?.OriginAirportName || "",

        origin_country: "",

        origin_country_Code: "",

        destination_iatacode:
          lastSegment?.ArrivalLocationCode || "",

        destination_iataname:
          lastSegment?.DisplayName || "",

        destination_departure_terminal:
          lastSegment?.ArrivalTerminalId || "",

        destination_departure_time:
          lastSegment?.ArrivalDateTime || "",

        destination_city:
          lastSegment?.DestinationAirportName || "",

        destination_country: "",

        destination_country_Code: "",

        stopage:
          itin?.NoOfStops || 0,

        segments:
          segments.map((seg: any) => {

            return {

              baggageAllowance:
                seg?.BaggageAllowance ||
                seg?.baggageAllowance ||
                null,

              baggageDesc1:
                seg?.BaggageDesc1 ||
                seg?.baggageDesc1 ||
                "",

              baggageDesc2:
                seg?.BaggageDesc2 ||
                seg?.baggageDesc2 ||
                "",

              baggageInfoUrl:
                seg?.BaggageInfoUrl ||
                seg?.baggageInfoUrl ||
                "",

              departure_iatacode:
                seg?.DepartureLocationCode || "",

              departure_terminal:
                seg?.DepartureTerminalId || "",

              departure_time:
                seg?.DepartureDateTime || "",

              flightlogo:
                seg?.FlightLogoName || "",

              arrival_iataCode:
                seg?.ArrivalLocationCode || "",

              arrival_terminal:
                seg?.ArrivalTerminalId || "",

              arrival_time:
                seg?.ArrivalDateTime || "",

              carrierCode:
                seg?.MarketingAirline || "",

              carrierName:
                seg?.MarketingAirlineName || "",

              duration:
                seg?.Duration || "",

              layover:
                seg?.LayoverTime || "",

              aircraft_name:
                seg?.AirEquipmentType || "",

              aircraft_code: "",

              aircraft_number:
                seg?.FlightNumber || "",

              origin_iataname:
                seg?.OriginAirportName || "",

              origin_city:
                seg?.DepartureDisplayName || "",

              origin_country: "",

              origin_country_Code: "",

              destination_iataname:
                seg?.DestinationAirportName || "",

              destination_city:
                seg?.DisplayName || "",

              destination_country: "",

              destination_country_code: "",
            };

          }),
      };

    }
  );

  // ============================================================
  // FLIGHT INFO
  // ============================================================

  const mainPayload = {

    offerdetails:
      JSON.stringify(
        this.getMainDetails || {}
      ),

    type:
      this.getMainDetails?.type || "",

    id:
      this.getMainDetails?.ItineraryId || "",

    source:
      this.getMainDetails?.Source ||
      "mondee",

    instantTicketingRequired:
      this.getMainDetails
        ?.instantTicketingRequired || "",

    nonHomogeneous:
      this.getMainDetails
        ?.nonHomogeneous || "",

    oneWay:
      this.getMainDetails
        ?.oneWay || "",

    lastTicketingDate:
      this.getMainDetails
        ?.lastTicketingDate || "",

    numberOfBookableSeats:
      this.getMainDetails
        ?.numberOfBookableSeats || "",

    isInternational:
      this.getMainDetails
        ?.isInternational || 0,

    NearLocationItinerary:
      this.getMainDetails
        ?.NearLocationItinerary?.length > 0
        ? "YES"
        : "No",

    price: {

      currency:
        this.getMainDetails
          ?.Fares?.[0]
          ?.CurrencyCode || "USD",

      currency_symbol:
        this.getMainDetails
          ?.Fares?.[0]
          ?.CurrencyCode === "USD"
          ? "$"
          : "€",

      base:
        Number(this.basefareAmount || 0),

      cabin:
        this.selectedCabin || "E",

      total:
        Number(this.basefareAmount || 0),

      grandTotal:
        Number(this.finalTotal || 0),

      markupgrandTotal:
        Number(this.discountAmount || 0),
    },

    travelerPricings:
      travelerPricings,

    itineraries:
      itineraries,
  };

  // ============================================================
  // HOTEL DATA
  // ============================================================

  /*
   * IMPORTANT:
   * Replace this.hotelBookingData with the actual variable
   * where your selected hotel object is stored.
   *
   * Expected:
   * {
   *   selectedRoom: {},
   *   selectedRate: {},
   *   hotelDetails: {},
   *   stayDates: {}
   * }
   */



  const selectedRoom =
     this.roomDetails || {};

  const selectedRate =
   this.rateDetails || {};

  const hotelDetails =
   this.hotelDetails || {};

  const hotelStayDates =
    {};

  const hotelRooms =
 
    this.searchHotelData?.rooms ||
    [];
    console.log("hotelRooms",hotelRooms)
  const firstHotelRoom =
    hotelRooms?.[0] || {};
  
  // ============================================================
  // HOTEL CHECK-IN / CHECK-OUT
  // ============================================================

  const hotelCheckIn =

    this.searchHotelData?.checkIn ||
    "";

  const hotelCheckOut =
  
    this.searchHotelData?.checkOut ||
    "";

  // ============================================================
  // HOTEL BEDROOM COUNT
  // ============================================================

  const roomName = (
    selectedRoom?.roomName ||
    selectedRoom?.description ||
    ""
  ).toLowerCase();

  const bedroomMatch =
    roomName.match(
      /(\d+)\s*bedroom/
    );

  const noOfBedroom =
    bedroomMatch
      ? Number(bedroomMatch[1])
      : 1;

  // ============================================================
  // HOTEL PRICE
  // ============================================================

  const hotelCost = Number(
    hotelDetails?.fare?.total ||
    selectedRate?.totalFare ||
    selectedRate?.perNightTotalFare ||
    0
  );

  // ============================================================
  // HOTEL PAYLOAD
  // ============================================================

  const hotelPayload = {

    reference_id:
      selectedRate?.rateType ||
      selectedRate?.rateId ||
      "Onhold",

    booking_source:
      this.hotelDetails?.booking_source ||
      "etg",

    name:
      hotelDetails?.hotelName || "",

    hotel_image:
      hotelDetails?.images?.[0]?.href ||
      selectedRoom?.roomImages?.[0]?.imageUrl ||
      "",

    rating:
      hotelDetails?.starRating || "",

    address:
      hotelDetails?.address?.line1 || "",

    phone:
      hotelDetails?.phoneNumber || "",

    email:
      hotelDetails?.email || "",

    room_type:
      selectedRoom?.roomName ||
      selectedRoom?.description ||
      "",

    no_of_adult:
      String(
        firstHotelRoom?.adults || 0
      ),

    no_of_child:
      String(
        firstHotelRoom?.childAges?.length || 0
      ),

    no_of_bed:
      selectedRoom?.bedCount || 0,

    no_of_bedroom:
      noOfBedroom,

    checkin_date:
      hotelCheckIn,

    checkin_time:
      hotelDetails?.checkin || "",

    checkout_date:
      hotelCheckOut,

    checkout_time:
      hotelDetails?.checkout || "",

    addtional_policies:
      hotelDetails
        ?.hotelPolicies
        ?.know_before_you_go || "",

    hotel_confirmation_number:
      this.hotelDetails?.hotelConfirmationNumber ||
      "",

    booking_status:
      "Flight Hotel Booking",

    hotel_info:
      JSON.stringify({
        selectedRoom:
          selectedRoom,

        selectedRate:
          selectedRate,

        hotelDetails:
          hotelDetails,

        stayDates:
          hotelStayDates,
      }),
  };

  // ============================================================
  // CARD DETAILS
  // ============================================================

  const cardNumber =
    billingInfo?.CardNumber
      ?.replace(/\s/g, "") || "";

  const cardType =
    this.getCardBrand(cardNumber);

  // ============================================================
  // FINAL TOTALS
  // ============================================================

  const flightCost =
    Number(this.basefareAmount || 0);

  const flightTax =
    Number(this.taxAmount || 0);

  const markup =
    Number(this.markup || 0);

  const totalCharged =
    Number(
      this.totalAmount ||
      flightCost +
      hotelCost +
      flightTax +
      markup
    );

  // ============================================================
  // FINAL FLIGHT + HOTEL PAYLOAD
  // ============================================================

  const payload = {

    // ----------------------------------------------------------
    // BOOKING
    // ----------------------------------------------------------

    booking_id:
      bookingId,
booking_status
: 
"Flight Hotel Booking",
vendor
: 
"farefinder24.com",
    // ----------------------------------------------------------
    // CUSTOMER
    // ----------------------------------------------------------

    customer_details: {

      name:
        `${contactInfo?.firstName || ""} ${
          contactInfo?.lastName || ""
        }`.trim(),

      email:
        contactInfo?.email || "",

      phone:
        contactInfo?.phoneNumber || "",

      alt_phone:
        contactInfo?.alternatePhone ||
        contactInfo?.altPhone ||
        "",

      country_code:
        contactInfo?.countryCode ||
        billingInfo?.countryCode ||
        "+1",

      billing_address:
        billingInfo?.street || "",

      street_number:
        billingInfo?.streetNumber || "",

      locality:
        billingInfo?.locality || "",

      billing_city:
        billingInfo?.city || "",

      billing_state:
        billingInfo?.State || "",

      billing_zip:
        billingInfo?.ZipCode || "",

      country:
        billingInfo?.Country || "",
    },

    // ----------------------------------------------------------
    // FLIGHT
    // ----------------------------------------------------------

    flight: {

      gds_pnr:
        this.flightBookingResponse?.PNR ||
        "",

      booking_source:
        this.getMainDetails?.Source ||
        "mondee",

      miles_pnr:
        "",

      airline1:
        this.getFlights ||
        this.getMainDetails
          ?.ValidatingCarrierName ||
        "",

      airline1pnr:
        this.flightBookingResponse?.PNR ||
        "",

      airline2:
        "",

      airline2pnr:
        "",

      airline3:
        "",

      airline3pnr:
        "",

      booking_status:
        "Flight Hotel Booking",

      flight_details:
        this.generateFlightDetails(
          this.getMainDetails
        ),

      passengers:
        BookItineraryPaxDetail,

      flight_info:
        JSON.stringify(mainPayload),
    },

    // ----------------------------------------------------------
    // HOTEL
    // ----------------------------------------------------------

    hotel:
      hotelPayload,

    // ----------------------------------------------------------
    // CAR
    // ----------------------------------------------------------

    car:
      null,

    // ----------------------------------------------------------
    // PAYMENT
    // ----------------------------------------------------------

    payment_info: {

      invoice: {

        currency:
          this.getMainDetails
            ?.Fares?.[0]
            ?.CurrencyCode ||
          "USD",

        flight_cost:
          flightCost,

        hotel_cost:
          hotelCost,

        car_cost:
          0,

        tax:
          flightTax,

        grand_total:
          totalCharged,

        actual_cost:
          flightCost +
          hotelCost,

        actual_mco:
          markup,
      },

      card_details: {

        nameon_card:
          billingInfo?.cardHolder || "",

        card_no:
          cardNumber,

        exp_month:
          exp_month || "",

        exp_year:
          exp_year || "",

        cvv:
          billingInfo?.CVV
            ?.toString() || "",

        card_type:
          cardType || "",
      },
    },
  };

  // ============================================================
  // API CALL
  // ============================================================

  console.log(
    "Flight + Hotel Booking Payload:",
    payload
  );

  this.flightService
    .createFlightbookings(payload)
    .pipe(
      takeUntilDestroyed(
        this.destroyRef
      )
    )
    .subscribe({

      next: (res) => {
        if (res.status === 1) {
   this.isSkeleton = false;
          // this.flightService.clearTravelData();

          this._route.navigate(
            ["/package-confirmation"],
            {
              queryParams: {
                id:
                  res?.booking_id,
              }

            
            }
          );

          if (
            !isPlatformBrowser(
              this.platformId
            )
          ) {
            return;
          }

          localStorage.setItem(
            "pnr",
            this.flightBookingResponse?.PNR || ""
          );

        } else {
   this.isSkeleton = false;
          this.iscommonSkeleton = false;

          this.cdr.markForCheck();
        }
      },

      error: (err) => {
   this.isSkeleton = false;
        console.error(
          "Flight + Hotel booking error:",
          err
        );

        this.iscommonSkeleton = false;

        this.cdr.markForCheck();
      },

    });
}
  onExpiryInput(event: any): void {
    const input = event.target as HTMLInputElement;

    let raw = input.value.replace(/\D/g, ""); // only numbers

    // Limit to 4 digits → MMYY
    raw = raw.substring(0, 4);

    let formatted = "";

    if (raw.length >= 3) {
      formatted = raw.substring(0, 2) + "/" + raw.substring(2); // MM/YY
    } else {
      formatted = raw;
    }

    // Only update if needed
    if (input.value !== formatted) {
      input.value = formatted;
      this.billingInfo
        .get("ExpiryDate")
        ?.setValue(formatted, { emitEvent: false });
    }
  }
  expiryRangeValidator() {
    return (control: any) => {
      const value = control.value;
      if (!value) return null;

      const [mm, yy] = value.split("/");

      const month = Number(mm);
      const year = 2000 + Number(yy); // YY → YYYY

      const now = new Date();
      const currentYear = now.getFullYear();
      const maxYear = currentYear + 30;

      if (year < currentYear || year > maxYear) {
        return { yearRange: true };
      }

      return null;
    };
  }

  passengerErrors: { [key: string]: string } = {};

  increment(control: string) {
    const current = this.passengers.get(control)?.value ?? 0;
    this.updatePassenger(control, current + 1);
  }

  decrement(control: string) {
    const current = this.passengers.get(control)?.value ?? 0;
    if (current > 0) {
      this.updatePassenger(control, current - 1);
    }
  }

  private updatePassenger(control: string, newValue: number) {
    const adults = this.passengers.get("adults")?.value ?? 0;
    const children = this.passengers.get("children")?.value ?? 0;
    // const infantsSeat = this.passengers.get("infants_seat")?.value ?? 0;
    const infantsLap = this.passengers.get("infants")?.value ?? 0;

    let futureAdults = control === "adults" ? newValue : adults;
    let futureChildren = control === "children" ? newValue : children;
    // let futureInfantsSeat = control === "infants_seat" ? newValue : infantsSeat;
    let futureInfantsLap = control === "infants" ? newValue : infantsLap;

    const totalInfants = futureInfantsLap;
    // const totalInfants = futureInfantsSeat + futureInfantsLap;
    const totalPassengers = futureAdults + futureChildren + totalInfants;

    // Clear previous error
    this.passengerErrors = {};

    // Rule 1: Must have at least 1 adult
    if (futureAdults < 1) {
      this.passengerErrors["adults"] = "At least 1 adult is required";
      return;
    }

    // Rule 2: Infant restrictions
    if (futureAdults === 1) {
      if (futureInfantsLap > 2) {
        this.passengerErrors["infants"] =
          "With 1 adult, maximum 2 infant is allowed";
        return;
      }
      // if (futureInfantsSeat > 2) {
      //   this.passengerErrors["infants_seat"] =
      //     "With 1 adult, maximum 2 infants on seat are allowed";
      //   return;
      // }
      if (totalInfants > 2) {
        this.passengerErrors["infants_total"] =
          "With 1 adult, total infants cannot exceed 2";
        return;
      }
    } else {
      if (totalInfants > futureAdults * 2) {
        this.passengerErrors["infants_total"] =
          "Each adult can accompany up to 2 infants";
        return;
      }
    }

    // Rule 3: Max passengers = 9
    if (totalPassengers > 9) {
      this.passengerErrors["total"] = "Total passengers cannot exceed 9";
      return;
    }

    // ✅ Passed validation → update form
    this.passengers.get(control)?.setValue(newValue);
  }
  apply() {
    this.passengers.updateValueAndValidity();
    this.flightService.setTravelData(this.bookingForm.value);
    this.isSeatPreferenceOpen = false;
    const formValue = this.bookingForm.value;
    const passengers = formValue.passengers;
    this.selectedAdults = passengers.adults;
    this.selectedChildren = passengers.children;
    this.selectedInfants_lap = passengers.infants;
    // this.selectedInfants_seat = passengers.infants_seat;
    this.selectedInfants = passengers.infants;
    this.searchService.setSearchParamsData({
      NoOfAdults: this.selectedAdults,
      NoOfChildren: this.selectedChildren,
      NoOfInfants: this.selectedInfants_lap,
      // NoOfInfantSeat: this.selectedInfants_seat,
    });
    const shouldCallAPI =
      (!this.isAdultValue && this.selectedAdults > 0) ||
      (!this.isChildValue && this.selectedChildren > 0) ||
      (!this.isInfantValue &&
        (this.selectedInfants_lap > 0));
    // (!this.isInfantValue &&
    //   (this.selectedInfants_lap > 0 || this.selectedInfants_seat > 0));

    if (shouldCallAPI) {
      this.flightService.clearDetailsData();
      this.getFlightsByItinerary();
    } else {
      this.populateTravelers();
    }

    this.closeFlightPaymentPopup();
  }
  onCvvInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // keep only digits + limit to 4
    const clean = input.value.replace(/\D/g, "").slice(0, 4);

    input.value = clean;

    this.billingInfo.get("CVV")?.setValue(clean, { emitEvent: false });
  }

  async captureFullPageScreenshot() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      await (document as any).fonts.ready;
    } catch { }

    await new Promise((res) => requestAnimationFrame(res));

    // Scroll to top (iOS requires delay)
    window.scrollTo(0, 0);
    await new Promise((res) => setTimeout(res, 200));

    html2canvas(document.body, {
      scale: 1,
      useCORS: false, // ⭐ iOS FIX
      backgroundColor: "#ffffff",
      allowTaint: true,
      foreignObjectRendering: false, // ⭐ Required on iOS
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.scrollHeight,

      onclone: (doc) => {
        doc.body.querySelectorAll("*").forEach((node: any) => {
          const style = getComputedStyle(node);

          // Convert fixed/sticky → absolute (iOS safe)
          if (style.position === "fixed" || style.position === "sticky") {
            node.style.position = "absolute";
          }

          // Fix PrimeNG dropdown overlay disappearance
          if (node.classList.contains("p-dropdown-panel")) {
            node.style.display = "block";
          }

          // Fix intlTelInput dropdown arrow breaking
          if (node.classList.contains("iti__flag-container")) {
            node.style.overflow = "visible";
          }
        });
      },
    })
      .then((canvas: any) => {
        this.bs64Image = canvas.toDataURL("image/png");
        this.createBooking(); // ⭐ Always hit
      })
      .catch((err: any) => {
        // this.toas.error("iOS Safari html2canvas failed:", err);
        // this.toasterService.showSuccess("iOS Safari html2canvas failed"
        //         );
        this.createBooking(); // ⭐ Continue booking even if screenshot fails
      });
  }

  onshowsteps(type: string) {
    if (type === "traveler") {
      this.istravellershow = true;
    }
    if (type === "price") {
      this.isPriceshow = true;
    }
    if (type === "Payment") {
      this.isPaymentshow = true;
    }
    if (type === "Billing") {
      this.isBillingshow = true;
    }
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (!isPlatformBrowser(this.platformId)) return;

    const html = document.documentElement;
    const body = document.body;
    html.classList.remove("sesion-page-overflow");
    body.classList.remove("sesion-page-overflow");
  }
  imgBase64 = "";

  @ViewChild("screen", { static: false }) screen!: ElementRef;
  @ViewChild("screen1", { static: false }) screen1!: ElementRef;


  private restoreHidden(el: HTMLElement | null) {
    if (!el) return;
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  }
  downloadJson() {
    if (!isPlatformBrowser(this.platformId)) return;

    var element = document.createElement("a");
    element.setAttribute("href", this.imgBase64);
    element.setAttribute("download", "test.png");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }
  // Title select dropdown

  onTitleDropdownShow() {
    const overlay = document.querySelector("body .p-overlay");
    overlay?.classList.add("selectTitleOverlay");
  }

  onTitleDropdownHide() {
    const overlay = document.querySelector("body .p-overlay");
    overlay?.classList.remove("selectTitleOverlay");
  }
  onrouteBagage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/baggage'])
    );

    window.open(url, '_blank');
  }
  toTitleCase(text: string): string {
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }

  //Inteliinput
  addActiveClass() {
    this.renderer.addClass(this.phoneGroup.nativeElement, "inteli-active");
    this.listenForDropdownClose();
  }

  listenForDropdownClose() {
    // Use a one-time click listener on the document to detect outside click
    const removeListener = this.renderer.listen(
      "document",
      "click",
      (event) => {
        if (!this.phoneGroup.nativeElement.contains(event.target)) {
          this.renderer.removeClass(
            this.phoneGroup.nativeElement,
            "inteli-active"
          );
          removeListener(); // remove the listener after dropdown closes
        }
      }
    );
  }
  private redirectToSearchIfMissing(): void {
    this.searchService.searchParamsData$.pipe(take(1)).subscribe((params) => {
      console.log("Search Params:", params); // Debug log
      if (!params) {
        this.router.navigate(["/"]);
        return;
      }

      this.router.navigate(["/flights-list"], {
        queryParams: params,
      });
    });
  }

  gotoSearch() {
    this.redirectToSearchIfMissing();
  }
  onrouteTax() {
    console.log("Origin Country:", this.originCountry); // Debug log
    if (!isPlatformBrowser(this.platformId)) return;
    const route =
      this.originCountry?.toLowerCase() === 'canada'
        ? '/taxes-and-fees-canada'
        : '/taxes-and-fees-us';

    const url = this.router.serializeUrl(
      this.router.createUrlTree([route])
    );

    window.open(url, '_blank');
  }
  onrouterTerms() {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = 'https://refundablebooking.com/refundable-terms';

    window.open(url, '_blank');
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
  hasCheckinBag(bags: any[]) {
  return bags?.some(b => b.type?.toUpperCase() === 'CHECKIN');
}

hasCarryOnBag(bags: any[]) {
  return bags?.some(b => b.type?.toUpperCase() === 'CARRYON');
}

getBag(type: string, bags: any[]) {
  return bags?.find(b => b.type?.toUpperCase() === type);
}
prepareFormForCapture(container: HTMLElement) {
  const inputs = container.querySelectorAll('input, textarea, select');

  inputs.forEach((input: any) => {
    let value = '';

    if (input.tagName === 'SELECT') {
      value = input.options[input.selectedIndex]?.text || '';
    } else if (input.type === 'checkbox') {
      value = input.checked ? '✔' : '';
    } else {
      value = input.value;
    }

    const span = document.createElement('span');
    span.textContent = value || '—';

    span.style.display = 'inline-block';
    span.style.minHeight = '16px';

    input.parentNode?.replaceChild(span, input);
  });
}
async capture1() {
  if (!this.screen1?.nativeElement) return;

  const clone = this.screen1.nativeElement.cloneNode(true) as HTMLElement;

  // 🔥 convert form fields → text
  this.prepareFormForCapture(clone);

  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '1024px';

  document.body.appendChild(clone);

  const img = await firstValueFrom(
    this.captureService.getImage(clone, true)
  );

  this.imgBase64 = img;

  document.body.removeChild(clone);

  this.downloadImage();
}
dataURIToBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([intArray], { type: mimeString });
}
downloadImage() {
  if (!this.imgBase64) {
    console.error('No image to download');
    return;
  }

  const blob = this.dataURIToBlob(this.imgBase64);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `booking_${Date.now()}.png`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


// ========================================
// Flight Details Tab Click
// ========================================

onFlightTabClick(event: Event): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const btn = event.currentTarget as HTMLElement;

  // Active tab
  document
    .querySelectorAll('.fd-scroll-tabs button')
    .forEach((b) => b.classList.remove('active'));

  btn.classList.add('active');

  // Remove previous highlights
  document
    .querySelectorAll('.fd-section')
    .forEach((section) => section.classList.remove('fd-highlight'));

  // Get target
  const targetSelector = btn.getAttribute('data-target');

  if (!targetSelector) return;

  const target = document.querySelector<HTMLElement>(targetSelector);

  if (!target) return;

  // Smooth scroll
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Highlight
  setTimeout(() => {
    target.classList.add('fd-highlight');

    setTimeout(() => {
      target.classList.remove('fd-highlight');
    }, 2000);
  }, 300);
}

// ===============================
// Payment Summary
// ===============================
pscPanelOpen = false;

togglePscPanel(event?: Event): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const target = event?.target as HTMLElement | null;

  if (target?.closest('#pscCompleteBtn')) {
    return;
  }

  this.pscPanelOpen = !this.pscPanelOpen;

  if (this.pscPanelOpen) {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  } else {
    this.renderer.removeStyle(document.body, 'overflow');
  }
}

closePscPanel(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  this.pscPanelOpen = false;
  this.renderer.removeStyle(document.body, 'overflow');
}

onCompleteBooking(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  this.submitForm();
}


// ===============================
// Booking Steps
// ===============================
currentBookingStep = 0;

updateBookingSteps(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const steps = document.querySelectorAll<HTMLElement>('.bk-step');
  const contents =
    document.querySelectorAll<HTMLElement>('.bk-step-content');

  steps.forEach((step, index) => {
    step.classList.toggle(
      'active',
      index <= this.currentBookingStep
    );
  });

  contents.forEach((content, index) => {
    content.classList.toggle(
      'active',
      index === this.currentBookingStep
    );
  });
}

nextBookingStep(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const contents =
    document.querySelectorAll('.bk-step-content');

  if (this.currentBookingStep < contents.length - 1) {
    this.currentBookingStep++;
  }

  this.updateBookingSteps();
}

previousBookingStep(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  if (this.currentBookingStep > 0) {
    this.currentBookingStep--;
  }

  this.updateBookingSteps();
}
openIndex = false;

toggleFlightDetails(event: MouseEvent): void {
  event.stopPropagation();
  this.openIndex = !this.openIndex;
}
closeFlightDetails(event: Event): void {
  event.stopPropagation();

  const button = event.currentTarget as HTMLElement;

  const details = button.closest('.fr-details');
  this.openIndex = false;
  if (details) {
    details.classList.remove('fr-open');
  }
}
   formatTime(time: string): string {
        if (!time) return '';

        const [hours, minutes] = time.split(':');
        const date = new Date();

        date.setHours(+hours, +minutes);

        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

        getPricePerNightRate(fare: any): any {

        const baseAmount = Number(fare?.perNightBaseFare || 0);
        return baseAmount.toFixed(2);
    }
      getTotalPriceRate(fare: any): any {

        const nights = Number(this.noOfNights || 1);

        const baseAmount = Number(fare?.perNightBaseFare || 0);
        const taxAmount = Number(fare?.perNightTaxesAndFees || 0);

        const total = fare?.includesTaxes
            ? baseAmount * nights
            : (baseAmount + taxAmount) * nights;

        return total.toFixed(2);
    }

      onChangeHotel(): void {
    this.router.navigate(['/package-hotels-list'], { queryParams: { source: 'etg' } });
  }
  onChangeFlight(): void {
  
            const queryParams=this.searchService.getCurrentParamsData();
            this.router.navigate(['/package-flights-list'], { queryParams });
        
  }
}
