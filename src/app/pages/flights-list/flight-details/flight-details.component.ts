import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
  HostListener,
  PLATFORM_ID,
  Inject,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlightFilterService } from '../../../services/flight/flight-filter.service';
import { TosterService } from '../../../services/common/toaster.service';
import { FlightService } from '../../../services/flight/flight.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SearchService } from '../../../services/search.service';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { GooglePlacesAutocompleteDirective } from '../../../directives/google-places-autocomplete.directive';
import { SharedService } from '../../../services/shared/shared.service';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputComponent,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { TooltipModule } from 'primeng/tooltip';
import { Location } from '@angular/common';
import { BackDirective } from '../../../directives/back.directive';
import { DurationToHoursPipe } from '../../../pipes/duration-to-hours.pipe';
import { environment } from '../../../../environments/environment';
import { DeviceService } from '../../../services/shared/device.service';
import { PaymentLoaderComponent } from '../skeleton/payment-loader/payment-loader.component';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    TooltipModule,
    BackDirective,
    DurationToHoursPipe,
    PaymentLoaderComponent
  ],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss',
})
export class FlightDetailsComponent {
  private location: Location = inject(Location);
  @ViewChild("stepsList") stepsList!: ElementRef;
  @ViewChildren("stepItem") stepItems!: QueryList<ElementRef>;
  @ViewChild('viewDetailsSection')
viewDetailsSection!: ElementRef
  iscommonSkeleton: boolean = false;

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  loading: boolean = true;
  private destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChildren('error') errorElements!: QueryList<ElementRef>;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  spinloading = false;
  showTooltip: boolean[] = [];

  flights = [
    {
      id: 1,
      route: 'New Delhi IGI to Kolkata',
      date: 'Mon, May 26',
      duration: '2h 35m',
      stops: 'Non stop',
      airline: 'Air India',
      departure: { time: '12:00PM', city: 'New Delhi (C), DEL', code: 'DEL' },
      arrival: { time: '02:40PM', city: 'Kolkata, CCU', code: 'CCU' },
      number: 'Flight 2727',
      aircraftCode: '32N',
      class: 'Economy(H)',
      aircraft: 'Airbus A350-900',
    },
    {
      id: 2,
      route: 'Kolkata to New Delhi IGI',
      date: 'Mon, Jun 02',
      duration: '2h 35m',
      stops: 'Non stop',
      airline: 'Air India',
      departure: { time: '12:00PM', city: 'Kolkata, CCU', code: 'CCU' },
      arrival: { time: '02:40PM', city: 'New Delhi IGI, DEL', code: 'DEL' },
      number: 'Flight 2727',
      aircraftCode: '32N',
      class: 'Economy(H)',
      aircraft: 'Airbus A350-900',
    },
  ];

  upgradeOptions: any = [];
  itnearyId: string = '';
  getMainDetails: any = '';
  imageUrl: string = environment.imageUrl;
  classMap: { [key: string]: string } = {
    E: "Economy",
    Econom:"Economy",
    F: "First",
    B: "Business",
    P: "Premium Economy",
    PE: "Premium Economy",
  };
  selectedAdults: number = 0;
  selectedChildren: number = 0;
  selectedInfants: number = 0;
  selectedCabin = 'E';
  bookingForm!: FormGroup;
  submitted = false;
  travelData: any = '';
  segmentSeatMaps: any = '';
  isSeatAvailable: boolean = false;
  isDomestic: boolean = false;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private shareService: SharedService = inject(SharedService);
  getData: any = '';
  totalPassengers: number = 0;
  baggageAllowance: any = [];

  flightBaggage: any = {}; // your full JSON response
  departRoutes: any[] = [];
  selectedRouteIndex: number = 0;
  selectedRoute: any;
  returnRoutes: any[] = [];
  allRoutes: any[] = []; // <-- declare allRoutes
  allCityPairs: any[] = []; // <-- declare allCityPairs

  currentTooltipSegment: any = null;
  currentLayover: any = null;
  layoverList: any[] = [];
  currentTooltipClass: string = 'single-tool-tip';
  currentTooltipIndex: any;
  currenttooltip: any;
  tooltipRefreshKey = 0;
  totaltool: number = 0;
  activeTab: string = "flight-route";
  private sectionOffsets: { id: string; offset: number }[] = [];
  isMobile: boolean = false;
  private deviceService = inject(DeviceService);
  lastScrollTop = 0;
  isHidden = false;
  isBrowser = false;
  sectionIds = [
    "flight-fares",
    "flight-baggage",
    "flight-route"
  ];
  routedetails: any = '';
  selectedFare: any = null;
markup:number=10;
  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private toasterService: TosterService,
    private filterService: FlightFilterService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.route.queryParams.subscribe(({ id }) => {
      if (id) {
        this.itnearyId = id;
      }
    });
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
    const isDomestic = localStorage.getItem('isDomestic');
    if (isDomestic == 'true') {
      this.isDomestic = true;
    } else {
      this.isDomestic = false;
    }
  }

  ngOnInit() {
    this.getData = this.shareService.getcompanyName();
    this.flightService.clearFareFamilyData();
    this.upgradeOptions = this.flightService.getFullFareFamilyData() || [];
    const searchData = this.searchService.getCurrentParamsData();
    if (searchData) {
      this.selectedAdults = searchData?.NoOfAdults ?? 0;
      this.selectedChildren = (searchData?.NoOfChildren ?? 0);
      // this.selectedChildren =(searchData?.NoOfChildren ?? 0) + (searchData?.NoOfInfantSeat ?? 0);
      this.selectedInfants = searchData?.NoOfInfants ?? 0;
      this.selectedCabin = searchData?.CabinClass || {
        name: 'Economy',
        value: 'E',
      };
      this.totalPassengers =
        this.selectedAdults + this.selectedChildren + this.selectedInfants;
    } else {
    }
    this.routedetails = this.flightService.getDetailsData();
    this.getFlightsByItinerary(this.routedetails);
    if (this.routedetails && this.routedetails?.ItineraryId) {
      if (this.routedetails?.Source === "agency-flight") {
        this.setDefaultFare();
      }

    }


  }


  getFlightsByItinerary(routedetails: any) {



    const user = routedetails;
    if (user && user?.ItineraryId) {
      this.getMainDetails = user || '';
      console.log("getMainDetails",this.getMainDetails)
      this.prepareRoutes(this.getMainDetails);
      this.flightService.setRepriceData(user);
      this.baggageAllowance = user?.Fares[0]?.BaggageAllowance || '';
      this.flightBaggage = this.getBaggageInfo();
      if (this.flightBaggage) {
        const departRoutes = this.flightBaggage.depart
          ? Object.keys(this.flightBaggage.depart).map((key) => ({
            ...this.flightBaggage.depart[key],
            departure: key.split('-')[0],
            arrival: key.split('-')[1],
            routeType: 'Departure',
          }))
          : [];

        const returnRoutes = this.flightBaggage.return
          ? Object.keys(this.flightBaggage.return).map((key) => ({
            ...this.flightBaggage.return[key],
            departure: key.split('-')[0],
            arrival: key.split('-')[1],
            routeType: 'Return',
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

    } else {
      this.router.navigate(['/flights-list']);
      return;
    }

  }
  hasUpgradeFares(): boolean {

    console.log("upgradeOptions:", this.upgradeOptions);

    if (!this.upgradeOptions?.length) {
      console.log("❌ No upgradeOptions");
      return false;
    }

    const result = this.upgradeOptions.some((airline: any, index: number) => {

      console.log(`➡️ Airline ${index}:`, airline);
      console.log(`➡️ fares:`, airline?.fares);

      const hasFares = Array.isArray(airline?.fares) && airline.fares.length > 0;

      console.log(`✅ hasFares:`, hasFares);

      return hasFares;
    });

    console.log("🎯 Final hasUpgradeFares:", result);

    return result;
  }
  travelProtectionAdded = false;
  travelProtectionAmount = 1106.19;
  markupPercentage: number = 10;
  travelProtectionTotal: any = 0;
  getFareSubtotal(paxType: string, count: number): number {
    const fare = this.getMainDetails?.Fares?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );
    if (!fare) return 0;
    const baseFareWithMarkup =
      fare.CCMax
      // const baseFareWithMarkup = fare.CCMax * (1 + this.markup / 100);

    return baseFareWithMarkup * count;
  }
  getPassportDetails(traveler: AbstractControl): AbstractControl {
    return traveler.get('passportDetails') as AbstractControl;
  }
  getSurchargeSubtotal(paxType: string, count: number): number {
    const fare = this.getMainDetails?.Fares?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );
    if (!fare) return 0;
    const taxesWithMarkup =
      // fare.Taxes + (fare.Taxes * this.markupPercentage) / 100;
      fare.Taxes;
    return taxesWithMarkup * count;
  }

  getTravelProtectionTotal(): number {
    const totalPax =
      this.selectedAdults + this.selectedChildren + this.selectedInfants;
    return this.travelProtectionAdded
      ? this.travelProtectionAmount * totalPax
      : 0;
  }

  getTotal(): number {
    this.updateTravelProtectionTotal();
    const totalFare =
      this.getFareSubtotal('ADT', this.selectedAdults) +
      this.getFareSubtotal('CHD', this.selectedChildren) +
      this.getFareSubtotal('INF', this.selectedInfants);

    const totalSurcharge =
      this.getSurchargeSubtotal('ADT', this.selectedAdults) +
      this.getSurchargeSubtotal('CHD', this.selectedChildren) +
      this.getSurchargeSubtotal('INF', this.selectedInfants);
    return totalFare;
    //  return totalFare + totalSurcharge + this.getTravelProtectionTotal();
  }
  updateTravelProtectionTotal(): void {
    this.travelProtectionTotal = this.getTravelProtectionTotal();
  }
  toggleTravelProtection() {
    this.travelProtectionAdded = !this.travelProtectionAdded;
  }

  getFirstSegmentBaggage(baggageAllowance: any): any[] {
    if (!baggageAllowance) return [];

    const firstKey = Object.keys(baggageAllowance)[0]; // e.g., "CCU-DXB"
    const baggageList = baggageAllowance[firstKey];

    return (
      baggageList?.map((bag: any) => ({
        ...bag,
        chargeAmount: bag.chargeAmount ?? 0, // default to 0 if undefined
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
        chargeAmount: bag.chargeAmount ?? 0, // fallback if not defined
      })) || []
    );
  }
  getSegmentMealKeys(meals: { [key: string]: string } | undefined): string[] {
    return meals ? Object.keys(meals) : [];
  }

  getUniqueCabinClass(cabinClass: string | undefined): string {
    if (!cabinClass) return '';
    const unique = [...new Set(cabinClass.split(','))];
    return unique[0]; // first unique only
  }



  // Dropdown itinerary

  showDropdown = true;

  toggleDropdownItinerary() {
    this.showDropdown = !this.showDropdown;
  }
  // End Dropdown itinerary

  // Price dropUp
  isDropUpOpen = false;

  toggleDropUp() {
    this.isDropUpOpen = !this.isDropUpOpen;
    this.setBodyScroll(this.isDropUpOpen);
  }

  closeDropUp() {
    this.isDropUpOpen = false;
    this.setBodyScroll(false);
  }

  // Prevent/allow background scrolling
  private setBodyScroll(disable: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;

    if (disable) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Close drop-up if ESC is pressed
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isDropUpOpen) this.closeDropUp();
  }
  // End Price dropUp

  // getDurationParts(duration: string): { days: number; time: string } {
  //   if (!duration) return { days: 0, time: '' };

  //   const dayMatch = duration.match(/(\d+)D/);
  //   const hourMinMatch = duration.match(/(?:\d+D\s*)?(\d+H\s*\d+M)/);

  //   const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  //   const time = hourMinMatch ? hourMinMatch[1] : '';

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

    // Pre-build a lookup from segmentKey -> flightSegment object(s)
    // (segmentKey = "CCU-AUH")
    const flightLookup: Record<string, any[]> = {};
    cityPairs.forEach((pair: any) => {
      const flightSegments = pair?.FlightSegment || [];
      flightSegments.forEach((seg: any) => {
        const key = `${(seg.DepartureLocationCode || '').toUpperCase()}-${(
          seg.ArrivalLocationCode || ''
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
        cityPairs.length > 1 ? (index === 0 ? 'depart' : 'return') : 'depart';

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
          .filter((bag: any) => {
            const pieces = String(bag.noOfPieces || '').toUpperCase().trim();

            const zeroValues = ['0P', '0PCS', '0', '0PIECES', '0Pieces'];

            return !zeroValues.includes(pieces);
          })
          .map((bag: any) => ({
            noOfPieces: bag.noOfPieces || '',
            description1: bag.description1 || bag.Description1 || '',
            description2: bag.description2 || bag.Description2 || '',
            type: bag.type || '',
            weight: bag.weight ?? bag.Weight ?? 0,
            measuringType: bag.measuringType || bag.MeasuringType || 'KG',
            count:bag.count||0
          }));

        if (validBags.length === 0) {
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

  ;

  selectRoute(index: number, routeItem: HTMLElement) {
    this.selectedRouteIndex = index;
    this.selectedRoute = this.allRoutes[index];


    // Smoothly scroll to the clicked item
    routeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
  getFormattedPrice(value: number | undefined | null): {
    integer: string;
    decimal: string;
  } {
    const num = value ?? 0;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

    const [integer, decimal] = formatted.split('.');
    return { integer, decimal: decimal || '00' };
  }

  goBack() {
    this.location.back();
  }

  // ✅ Return only segments that have LayoverTime
  getLayoverSegments(segments: any[]): any[] {
    if (!segments || !Array.isArray(segments)) return [];
    const layovers = segments.filter(
      (s) => s.LayoverTime && s.LayoverTime.trim() !== ''
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
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const insideTooltip = target.closest(
      '.p-tooltip, .c-flight-list-card__segment--stop'
    );
    if (!insideTooltip) {
      this.clearAllActive();
      this.tooltipVisible = false;
    }
  }

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
    event: MouseEvent
  ) {
    event.stopPropagation();

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
      cityIndex
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

  // ✅ Tooltip hide event handler
  onTooltipHide() {
    this.tooltipVisible = false;
    this.clearAllActive();
  }

  // ✅ Reusable helper to deactivate all


  // Compute tooltip class
  computeTooltipClass(layoverSegments: any[], index: number | string): string {
    const total = layoverSegments.length;
    if (total >= 1) {
      // if (index === 0 || index === total - 1) return 'single-tool-tip';
      return 'multiple-tool-tip';
    }
    return 'multiple-tool-tip';
  }
  onRouteClick(flightSegment: any[], cityIndex: number, itineraryId: string, event: MouseEvent) {
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

  continueToBooking() {
    const html = document.documentElement;
    const body = document.body;
    html.classList.remove("overflow-hidden");
    body.classList.remove("overflow-hidden");
    this.spinloading = true;

    this.router.navigate(['/flight/booking'], {
      queryParams: {
        id: this.itnearyId,
      },
    });
  }
  toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  getAirportLabel(name: string): string {
    if (!name) return '';

    return name
      .replace(/\binternational\b/gi, 'intl.')
      .replace(/\bairport\b/gi, 'apt.')
      .replace(/\s+/g, ' ')
      .trim();
  }
  onrouteBagage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/baggage'])
    );

    window.open(url, '_blank');
  }

  // Smooth scroll implementation (iOS compatible)

;

ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;

  setTimeout(() => {
    this.sectionOffsets = this.sectionIds.map((id) => {
      const el = document.getElementById(id);
      return el ? { id, offset: el.offsetTop } : { id, offset: 0 };
    });

    // Auto scroll to View Details section
const element = this.viewDetailsSection?.nativeElement;

if (element) {
  const y = element.getBoundingClientRect().top + window.pageYOffset - 82;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

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
  scrollTo(section: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const headerOffset = 50;
    const el = document.getElementById(section);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    this.smoothScrollTo(y);

    this.activeTab = section;
    this.scrollTabIntoView();

    // this.scrollTabIntoView();
  }

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
  // selectCityPairs(index: number) {
  //   this.selectedCityPairsIndex = index;
  // }

  selectCityPairs(index: number, routeItem: HTMLElement) {
    this.selectedCityPairsIndex = index;

    // Smooth horizontal scroll (same like your working example)
    routeItem.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }



  setDefaultFare() {
    if (!this.upgradeOptions?.length) return;

    const firstAirline = this.upgradeOptions.find((a: any) => a?.fares?.length);

    if (firstAirline) {
      this.selectedFare = {
        fare: firstAirline.fares[0],
        airline: firstAirline
      };
    }
  }
  selectFare(fare: any, airline: any) {
    this.selectedFare = {
      fare,
      airline
    };
    this.flightService.setFareFamilyData(this.selectedFare);

    console.log('Selected Fare:', this.selectedFare);
  }


  hasCheckinBag(bags: any[]) {
  return bags?.some(b => b.type?.toUpperCase() === 'CHECKIN');
}

hasCarryOnBag(bags: any[]) {
  return bags?.some(b => b.type?.toUpperCase() === 'CARRYON');
}

getBag(type: string, bags: any[]) {
  console.log("bags",bags)
  return bags?.find(b => b.type?.toUpperCase() === type);
}
}
