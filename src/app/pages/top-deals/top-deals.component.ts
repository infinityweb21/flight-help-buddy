



import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { FlightsTabComponent } from '../../components/main-filter/flights-tab/flights-tab.component';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SvgIcons } from '../../shared/svg-icons';
import { SharedService } from '../../services/shared/shared.service';
import { CardModule } from 'primeng/card';


import { SearchService } from "../../services/search.service";
import { FlightService } from "../../services/flight/flight.service";
import { FlightFilterService } from "../../services/flight/flight-filter.service";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ✅ Declare outside class (Trustpilot)
declare global {
  interface Window {
    Trustpilot: any;
  }
}
@Component({
  selector: 'app-top-deals',
  imports: [
    FlightsTabComponent,
    CommonModule,
    CardModule,
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

   templateUrl: './top-deals.component.html',
  styleUrl: './top-deals.component.scss'
})
export class TopDealsComponent implements OnInit, AfterViewInit {
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected icons = inject(SvgIcons);
  private shareService: SharedService = inject(SharedService);
   private searchService: SearchService = inject(SearchService);
   private flightService: FlightService = inject(FlightService);
   private flightFilter: FlightFilterService = inject(FlightFilterService);
  private router = inject(Router);

  companyName: string = '';
  phoneNumber: string = '';
  flightContactNumber: string = '';
  hotelContactNumber: string = '';
  cruiseContactNumber: string = '';
  getData: any = '';
      isBrowser = false;
          private destroyRef: DestroyRef = inject(DestroyRef);
    trustPilotReviews: any[] = [];
    reviewSlides: any[][] = [];
allDealsMap: any = {

  /* ================= AMERICAN AIRLINES ================= */
'top-deals-flight': [
  { from: 'MIA', to: 'CLT', fromCity: 'Miami', toCity: 'Charlotte', ob: '2026-07-22', ib: '2026-07-28', price: 239.21 },
  { from: 'IAD', to: 'MIA', fromCity: 'Washington', toCity: 'Miami', ob: '2026-07-24', ib: '2026-08-02', price: 271.09 },
  { from: 'DFW', to: 'ORD', fromCity: 'Dallas', toCity: 'Chicago', ob: '2026-07-26', ib: '2026-08-03', price: 218.42 },
  { from: 'DFW', to: 'LAX', fromCity: 'Dallas', toCity: 'Los Angeles', ob: '2026-07-28', ib: '2026-08-04', price: 434.76 },
  { from: 'DFW', to: 'PHX', fromCity: 'Dallas', toCity: 'Phoenix', ob: '2026-07-30', ib: '2026-08-07', price: 389.25 },
  { from: 'ORD', to: 'LGA', fromCity: 'Chicago', toCity: 'New York', ob: '2026-08-01', ib: '2026-08-09', price: 192.66 },
  { from: 'CLT', to: 'ORL', fromCity: 'Charlotte', toCity: 'Orlando', ob: '2026-08-03', ib: '2026-08-11', price: 455.47 },
  { from: 'ORD', to: 'HNL', fromCity: 'Chicago', toCity: 'Honolulu', ob: '2026-08-06', ib: '2026-08-14', price: 874.24 }
],
}
nextDay: any;

constructor(  @Inject(PLATFORM_ID) private platformId: Object,private sharedService: SharedService) {
     this.isBrowser = isPlatformBrowser(this.platformId);
}
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
        this.nextDay = this.getPreviousDayFormatted();
          if (!this.isBrowser) return;
        if (!window.Trustpilot) {
      const script = document.createElement("script");
      script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      script.async = true;
      document.head.appendChild(script);
      this.getTrustpilot();
    }
    this.companyName = this.getData.companyName;
    this.phoneNumber = this.getData.phoneNumber;
    this.flightContactNumber = this.getData.flightContactNumber;
    this.hotelContactNumber = this.getData.hotelContactNumber;
    this.cruiseContactNumber = this.getData.cruiseContactNumber;
this.setDealsBySlug();
this.getTrustPilotReview();

  }
  dealsList: any[] = [];


setDealsBySlug() {
  const routes = this.allDealsMap['top-deals-flight'] || [];

  this.dealsList = routes.map((route: any) => ({
    ...route,
    departureDate: route.ob,   // ✅ direct use
    returnDate: route.ib       // ✅ direct use
  }));
}

  formatToYYYYMMDD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }




  searchFromDeal(deal: any) {

    const formatDate = (date: string) => {
      const [y, m, d] = date.split("-");
      return `${d}/${m}/${y}`;
    };

    const payload = {
      originDestination: [
        {
          DepartureTime: formatDate(deal.departureDate),
          DepartureLocationCode: deal.from,
          ArrivalLocationCode: deal.to
        },
        {
          DepartureTime: formatDate(deal.returnDate),
          DepartureLocationCode: deal.to,
          ArrivalLocationCode: deal.from
        }
      ]
    };

    this.searchService.setSearchData(payload);

    const queryParams = {
      CabinClass: 'E',
      NoOfAdults: 1,
      NoOfChildren: 0,
      NoOfInfants: 0,
      tripType: 'roundtrip',
      source: 'all',
      providers: '',
      CurrencyCode: 'USD',
      maxResultsPerProvider: 40,
      limit: 120,
      tag: ''
    };

    this.flightFilter.resetFilters();
    this.flightService.clearFlights();
    this.searchService.setSearchParamsData(queryParams);

 if (isPlatformBrowser(this.platformId)) {
    const currentUrl = this.router.url.toLowerCase();

  // =========================
  // ✅ CHECK ROUTES
  // =========================
  const isBestFlightRoute =
    currentUrl.includes('/flights/') &&
    currentUrl.includes('-best-flight');


  const shouldOpenInNewTab = isBestFlightRoute ;

if (shouldOpenInNewTab) {

  const queryString = new URLSearchParams(
    Object.entries(queryParams).reduce((acc: any, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {})
  ).toString();

  const fullUrl = `${window.location.origin}/flights-list?${queryString}`;

  window.open(fullUrl, '_blank');

} else {

  this.router.navigate(['/flights-list'], { queryParams });

}   
 }else{
  this.router.navigate(['/flights-list'], { queryParams });

 } 

  
    // this.router.navigate(['/flights-list'], { queryParams });
  }
  formatDisplayDate(dateStr: string): string {

    if (!dateStr) return '';

    const date = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {

      weekday: 'short',   // Tue

      month: 'short',     // May

      day: 'numeric'      // 15

    };

    return date.toLocaleDateString('en-US', options);

  }
getPreviousDayFormatted() {
  const date = new Date();

  // ✅ subtract 1 day
  date.setDate(date.getDate() - 1);

  const day = date.toLocaleDateString('en-US', { weekday: 'long' });

  const mm = String(date.getMonth() + 1).padStart(2, '0'); // ✅ correct month
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();

  return {
    day,
    fullDate: `${mm}/${dd}/${yyyy}`
  };
}

  ngAfterViewInit(): void {
   this.getTrustpilot();
  }
    getTrustpilot(){
 if (!this.isBrowser) return;
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
    
    this.cdr.detectChanges();

   

  }

  // Trust Pilot
getTrustPilotReview(): void {
  this.sharedService.getTrustPilotReview()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res: any) => {

        this.trustPilotReviews = (res?.reviews || []).map((review: any) => ({
          ...review,
          showFullText: false
        }));

        this.reviewSlides = [];

        for (let i = 0; i < this.trustPilotReviews.length; i += 3) {
          this.reviewSlides.push(
            this.trustPilotReviews.slice(i, i + 3)
          );
        }

        console.log(this.reviewSlides);
      },
      error: (err) => {
        console.error(err);
      }
    });
}
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

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;

  const months = Math.floor(diffDays / 30);
  if (months === 1) return '1 month ago';

  return `${months} months ago`;
}


  
}
