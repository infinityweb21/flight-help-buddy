import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
  HostListener,
  ChangeDetectorRef,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Location } from '@angular/common';
import { SharedService } from '../../../../../services/shared/shared.service';
import { FlightService } from '../../../../../services/flight/flight.service';
import { FlightCommonSkeletonComponent } from '../../../../flights-list/skeleton/flight-common-skeleton/flight-common-skeleton.component';
import { DurationToHoursPipe } from '../../../../../pipes/duration-to-hours.pipe';
import { environment } from '../../../../../../environments/environment';
import { PaymentLoaderComponent } from '../../../skeleton/payment-loader/payment-loader.component';
import { SearchService } from '../../../../../services/search.service';
import { NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-flight-download-ticket',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
    DurationToHoursPipe,
    PaymentLoaderComponent

  ],
  templateUrl: './flight-download-ticket.component.html',
  styleUrl: './flight-download-ticket.component.scss',
})
export class FlightDownloadTicketComponent {
  private location: Location = inject(Location);
  private routerSub: any;

  isOpen = false;
  iscommonSkeleton: boolean = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  loading: boolean = true;
  destroyRef: DestroyRef = inject(DestroyRef);
  @ViewChildren('error') errorElements!: QueryList<ElementRef>;
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
  travelData: any = '';
  cnfirmData: any = '';
  segmentSeatMaps: any = '';
  isSeatAvailable: boolean = false;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  shareService: SharedService = inject(SharedService);
  getData: any = '';
  totalPassengers: number = 0;
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
  currentTooltipClass: string = 'single-tool-tip';
  currentTooltipIndex: any;
  currenttooltip: any;
  tooltipRefreshKey = 0;
  totaltool: number = 0;
  bookingId: any = '';
  getTickets: any = '';
  travelProtectionAmount = 0;
  travelProtectionAdded = false;
  markupPercentage: number = 10;
  travelProtectionTotal: any = 0;
  formattedTravelers: any[] = [];
  pnrCode = ""; // common for all (you can dynamically set)
  isBrowser: boolean = false;
  private originCountry: string = "";
    markup: number = 10;

  constructor(
    private flightService: FlightService, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object, private searchService: SearchService,

  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.route.queryParams.subscribe(({ id }) => {
      if (id) {
        this.bookingId = id;
      }
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.routerSub = this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe((event: any) => {

          // Only act if current page is confirmation
          if (
            event.navigationTrigger === 'popstate' &&
            this.router.url.includes('flight-booking-confirmation')
          ) {
            this.router.navigate(['/home'], { replaceUrl: true });
          }

        });

    }
    this.cnfirmData = '';
    this.getData = this.shareService.getcompanyName();
    if (this.bookingId != '') {
      this.getTicket();
    }
    const searchData = this.searchService.getCurrentParamsData();
    if (searchData) {
      this.originCountry = searchData.OC || "United States";
    }
  }

  getFlightsByItinerary(user: any) {
    if (user && user?.ItineraryId) {
      this.getMainDetails = user || '';
if (this.isBrowser) {
  const purchasePayload = {
    event: 'flight_booking_confirmation', // Standard GA4 purchase event name
    ecommerce: {
      transaction_id: this.bookingId || '',
      value: this.getTotal() || 0,
      tax: this.tax || 0.00,
      currency: 'USD',
      items: [{
        item_id: this.getMainDetails?.ItineraryId || 'FL-101',
        item_name: this.getMainDetails?.ValidatingCarrierName || 'Flight 101',
        item_brand: this.getMainDetails?.ValidatingCarrierCode || 'Airline A',
        item_category: 'Flight',
        item_category2: this.getMainDetails?.Citypairs?.[0]?.FlightSegment?.[0]?.CabinClass || 'Economy',
        price: this.getTotal() || 0,
        passengers_count: this.totalPassengers || 1
      }]
    }
  };

  console.log('[DataLayer] Pushing purchase event:', purchasePayload);

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(purchasePayload);
}
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
      // this.router.navigate(['/flights-list']);
      return;
    }
  }

  getFirstDepartureBag() {
    const firstDep = this.allRoutes?.find(x => x.routeType === "Departure");
    if (!firstDep) return null;

    return {
      carryOn: firstDep.bags.find((b: { type: string; }) => b.type === "CARRYON") || null,
      checkIn: firstDep.bags.find((b: { type: string; }) => b.type === "CHECKIN") || null
    };
  }


  getFirstReturnBag() {

    const firstDep = this.allRoutes?.find(x => x.routeType === "Return");
    if (!firstDep) return null;

    return {
      carryOn: firstDep.bags.find((b: { type: string; }) => b.type === "CARRYON") || null,
      checkIn: firstDep.bags.find((b: { type: string; }) => b.type === "CHECKIN") || null
    };
  }

  scrollToFirstError() {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      const firstErrorElement = this.errorElements?.find((el) => {
        return el.nativeElement?.querySelector('.ng-invalid');
      });
      if (firstErrorElement) {
        firstErrorElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    });
  }
// getFareSubtotal(paxType: string, count: number): number {
//   const fare = this.getMainDetails?.Fares?.find(
//     (f: { PaxType: string }) => f.PaxType === paxType
//   );

//   if (!fare) return 0;

//   // Base fare + markup
//   const baseFareWithMarkup = fare.CCMax * (1 + this.markup / 100);
//   // Final total
//   return (baseFareWithMarkup ) * count;
// }

  getFareSubtotal(paxType: string, count: number): number {
    const fare = this.getMainDetails?.Fares?.find(
      (f: { PaxType: string }) => f.PaxType === paxType
    );
    if (!fare) return 0;
    const baseFareWithMarkup =
      fare.CCMax;
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
  getsubTotal(): number {
    const totalFare =
      this.getFareSubtotal("ADT", this.selectedAdults) +
      this.getFareSubtotal("CHD", this.selectedChildren) +
      this.getFareSubtotal("INF", this.selectedInfants);

    // const subtotal = totalFare + totalSurcharge;
    const subtotal = totalFare;
    return subtotal;
  }
  tax:number=0;
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
      this.tax=totalSurcharge;
    return totalFare + this.travelProtectionAmount;
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
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
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
    if (total === 1) return 'single-tool-tip';
    if (total === 2) return index === 0 ? 'single-tool-tip' : 'single-tool-tip';
    if (total >= 3) {
      if (index === 0 || index === total - 1) return 'single-tool-tip';
      return 'multiple-tool-tip';
    }
    return 'single-tool-tip';
  }
  getTicket() {
    this.iscommonSkeleton = true;
    this.flightService.getFlightTicket(this.bookingId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.iscommonSkeleton = false;
        this.cdr.markForCheck();
        this.getTickets = res?.pdfurl;
        this.cnfirmData = res?.booking_info;
        this.travelProtectionAmount = Number(res?.booking_info?.refund_shield?.refund_shield) || 0;
        const tradeldata = res?.booking_info?.passengers;
        if (tradeldata) {
   this.selectedAdults = tradeldata.filter((p: { type: string; }) => p.type === 'Adult').length;
this.selectedChildren = tradeldata.filter((p: { type: string; }) => p.type === 'Children').length;
this.selectedInfants = tradeldata.filter((p: { type: string; }) => p.type === 'Infant').length;
 
          this.totalPassengers =
            this.selectedAdults + this.selectedChildren + this.selectedInfants;
          this.travelData = tradeldata;


        } else {
        }
        const cnfirmData = this.flightService.getconfirmData();
        if (cnfirmData) {
          this.cnfirmData = res?.booking_info;
          this.bookingId = res?.booking_info?.booking_details?.bookingId;
          this.pnrCode = res?.booking_info?.mondee_booking_info?.PNR

        } else {
        }
        const flightInfo = JSON.parse(res?.booking_info?.mondee_booking_info?.flight_info);
        const offerDetails = JSON.parse(flightInfo.offerdetails);
        this.getFlightsByItinerary(offerDetails);
        this.transformTravelData();
      },
      error: (err) => {
        this.iscommonSkeleton = false;
        this.cdr.markForCheck();
        // this.toasterService.showError(err.error.message || 'Something went wrong while fetching data!')
      }
    })

  }
  downloadTicket() {
    if (!isPlatformBrowser(this.platformId)) return;

    const pdfUrl = this.getTickets // Replace with your actual PDF URL
    const fileName = 'ticket.pdf';

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank'; // optional: opens in new tab if supported
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  transformTravelData() {

    const travelers = this.travelData || [];     // passengers[]
    this.formattedTravelers = [];
    travelers.forEach((trav: any) => {

      // Full Name
      const fullName = `${trav.firstname} ${trav.middlename || ""} ${trav.lastname}`.trim();

      // Convert PaxType
      const paxType =
        trav.type === "ADT" ? "Adult" :
          trav.type === "CHD" ? "Child" :
            trav.type === "INF" ? "Infant" : trav.type;

      // Format DOB
      const dob = trav.dob ? new Date(trav.dob).toLocaleDateString() : "-";

      // Extract Seat Preferences (inside each passenger)
      const seatPrefs = (trav.seatPreferences || []).map((s: any) => ({
        route: s.direction,
        seat: s.seatPreference || "NA"
      }));

      // Push final formatted traveler
      this.formattedTravelers.push({
        title: trav.title,
        fullName,
        paxType,
        dob,
        gender: trav.gender,
        pnr: this.pnrCode || "-",

        // Seat preferences array
        seatPreferences: seatPrefs,

        // Additional info
        ktn: trav.additionalInfo?.knownTraveler || "-",
        redress: trav.additionalInfo?.redressNumber || "-",
      });
    });

  }

  shareOnWhatsApp() {
    if (!isPlatformBrowser(this.platformId)) return; // SSR-SAFE

    const bookingId = this.bookingId || 'N/A';
    const pnr = this.pnrCode || 'N/A';
    const customerName = this.cnfirmData?.name || '';
    // const ticketUrl = this.getTickets || window.location.href;
    const ticketUrl = window.location.href;

    const message = `🛫 *Your Flight Ticket Details*

👤 Customer: ${customerName}
🆔 Booking ID: ${bookingId}
🎫 PNR: ${pnr}

🔗 View / Download PDF:
${ticketUrl}

Sent via infinity travel`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }

  copySuccess = false;
  activeShare: string = 'copy';
  showShareMenu: boolean = false;
  activeShare1: string = 'copy';
  showShareMenu1: boolean = false;
  toggleShareDropdown() {
    this.copySuccess = false;
    this.showShareMenu = !this.showShareMenu;
  }

  toggleShareDropdown1() {
    this.copySuccess = false;
    this.showShareMenu1 = !this.showShareMenu1;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // If click is outside the container => close dropdown
    if (!target.closest('.trip-share')) {
      this.showShareMenu = false;
    }
    if (!target.closest('.closetrip1')) {
      this.showShareMenu1 = false;
    }
  }

  copyLink() {
    if (!isPlatformBrowser(this.platformId)) return;

    const link = window.location.href;

    navigator.clipboard.writeText(link).then(() => {
      this.copySuccess = true;

      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    });
  }
  toTitleCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }
  onrouteBagage() {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/baggage'])
    );

    window.open(url, '_blank');
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
  removeCountryCode(phone: string, countryCode: string): string {
    if (!phone || !countryCode) return phone;

    return phone.startsWith(countryCode)
      ? phone.slice(countryCode.length)
      : phone;
  }
  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
