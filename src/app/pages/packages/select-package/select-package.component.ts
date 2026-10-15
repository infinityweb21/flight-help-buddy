import { Component, DestroyRef, Inject, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Router, RouterLink } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { MapModule } from '../../../core/map/map.module';
import { SearchService } from '../../../services/search.service';
import { CruiseService } from '../../../services/cruise/cruise.service';
import { TosterService } from '../../../services/common/toaster.service';
import { SharedService } from '../../../services/shared/shared.service';
import { PackageService } from '../../../services/package/package.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-select-package',
  imports: [DrawerModule,
    FormsModule,
    ReactiveFormsModule,
    SliderModule,
    AutoCompleteModule,
    CommonModule, MapModule, SliderModule, RouterLink, ButtonModule],
  templateUrl: './select-package.component.html',
  styleUrl: './select-package.component.scss'
})
export class SelectPackageComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  private router: Router = inject(Router);
  private searchService = inject(SearchService);
  private cruiseService = inject(CruiseService);
    private packageService = inject(PackageService);
  imageUrl: string =
    'https://images.trippro.com/AirlineImages/AirLine/GDS/images/';
 private destroyRef: DestroyRef = inject(DestroyRef);
  private toasterService: TosterService = inject(TosterService);
  cruisesForm!: FormGroup;
  cruiseList: any[] = [];
  submitted:boolean=false;
  filterForm!: FormGroup;
  filtervisible: boolean = false;
  showGuestDropdown: boolean = false;
  selectedTab: string = 'recommended';
  rangeValues: number[] = [500, 20000];
    sliderValue: number[] = [0, 1000000];
      lowestPrice: number = 0;
  highestPrice: number = 1000000;
  defaultLat:number=0;
  defaultLng:number =0;
    classMap: { [key: string]: string } = {
    E: 'Economy',
    F: 'First',
    B: 'Business',
    P: 'Premium Economy',
  };

cruiseDetailsList:any[]=[];
 properties:any[]=[]
getsearchdata:any='';
geFlightDetails:any[]=[];
 private shareService: SharedService = inject(SharedService);
    getData:any='';
  markupPercentage:number=10;
  constructor(private fb:FormBuilder,@Inject(PLATFORM_ID) private platformId: Object,) {

  }
 
  ngOnInit(): void {
    this.getData=this.shareService.getcompanyName();
     this.searchService.packageSearchData$.subscribe((searchData) => {
      console.log('Received package Data:', searchData);
      if (searchData) {
         this.getsearchdata=searchData;
      
        this.getCruise(searchData?.payload)
        // Use searchData to fetch or filter flights
      } else {
        // Optionally handle empty state (e.g., redirect back or show message)
      }
    });
  }

filteredCruiseDetailsList: any[] = [];
getCruise(payload: any) {
  this.packageService.packageList(payload)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        console.log("res", res);
        // use processedData in UI
        this.getCruisedata(res);
this.getHotelData(res);
this.getFlightData(res);
      },
      error: (err) => {
        this.cruiseDetailsList=[];
        this.toasterService.showError(
          err.error.message ||
            "Something went wrong while fetching cruise list!"
        );
      },
    });
}

getCruisedata(res:any){
      if(res.data?.cruises?.length!=0){
       this.markupPercentage = 10; 
this.defaultLat=res?.data?.cruises[0]?.ports?.departurePortInfo
?.Latitude;
this.defaultLng=res.data?.cruises[0]?.ports?.departurePortInfo
?.Longitude;

        this.cruiseDetailsList = res.data?.cruises.map((cruise: any) => {
          const duration = parseInt(cruise.Duration) || 1; // avoid division by 0

          // Find the lowest adult fare
          const lowestPriceEntry = cruise.sailing_prices.reduce(
            (prev: any, current: any) =>
              parseFloat(prev.AdultFare) < parseFloat(current.AdultFare) ? prev : current
          );

          const lowestPrice = parseFloat(lowestPriceEntry.AdultFare);
          const priceWithMarkup = lowestPrice * (1 + this.markupPercentage / 100);

          // ✅ Divide by duration
          const lowestPricePerNight = lowestPrice / duration;
          const priceWithMarkupPerNight = priceWithMarkup / duration;

          // Get prices by cabin category with markup
          const cabinPrices: any = {};
          cruise.sailing_prices.forEach((price: any) => {
            const fare = parseFloat(price.AdultFare);
            if (
              !cabinPrices[price.CabinCategory] ||
              fare < cabinPrices[price.CabinCategory].basePrice
            ) {
              const basePrice = fare;
              const basePricePerNight = basePrice / duration;

              const priceWithMarkup = basePrice * (1 + this.markupPercentage / 100);
              const priceWithMarkupPerNight = priceWithMarkup / duration;

              cabinPrices[price.CabinCategory] = {
                basePrice,
                basePricePerNight,
                priceWithMarkup,
                priceWithMarkupPerNight,
                categoryCode: price.CategoryCode,
              };
            }
          });

          // Process itinerary details
          const itineraryDetails = cruise.Itinerary_DayNumber.split(",").map(
            (day: string, index: number) => ({
              dayNumber: day,
              portId: cruise.Itinerary_PortID.split(",")[index],
              description: cruise.Itinerary_Description[index],
              arrivalTime: cruise.Itinerary_ArrivalTime.split(",")[index],
              departureTime: cruise.Itinerary_DepartureTime.split(",")[index],
            })
          );
 const arrivalTimes = cruise.Itinerary_ArrivalTime.split(",");
          const returnDate = arrivalTimes[arrivalTimes.length - 1]; // last arrival
          return {
            id:cruise.id,
            session_id:cruise.session_id,
            departureDate: cruise.DepartureDate,
            departurePortCode: cruise.DeparturePortCode,
            departurePortID: cruise.DeparturePortID,
            duration: duration,
            returnPortCode: cruise.ReturnPortCode,
            returnPortID: cruise.ReturnPortID,
            sailingID: cruise.SailingID,
            sailingPlanCode: cruise.SailingPlanCode,
            shipName: cruise.ShipName,
            cruiseSailingName: cruise.cruise_sailing_name,
            image:cruise.shipData.shipInfo.ImagePath,
            // ✅ Add both total and per-night prices
            lowestPrice,
            priceWithMarkup,
            lowestPricePerNight,
            priceWithMarkupPerNight,

            cabinPrices,

            ports: {
              departurePortInfo: cruise.ports.DeparturePortInfo,
              returnPortInfo: cruise.ports.ReturnPortInfo,
            },
            itinerary: itineraryDetails,
            returnDate:returnDate
          };
        });
         
        // console.log("cruiseDetailsList data:", this.cruiseDetailsList);
      }else{
        // this.toasterService.showError("No cruise found");
        this.cruiseDetailsList=[];
        
      }
}
getFlightData(res:any){
  this.geFlightDetails = res?.data?.flights;
}

getHotelData(res:any){
   const map = new Map<string, any>();
   console.log("res?.data?.hotels",res?.data?.hotels)
   this.properties=res?.data?.hotels
 this.properties.forEach((hotel:any) => {
        hotel?.fare?.amenities?.forEach((amenity: any) => {
        if (amenity?.name && !map.has(amenity.name)) {
          map.set(amenity.name, amenity);
         }
        });
      });
      console.log( this.properties," this.properties")
}

getTotalPrice(ccMax: number, markup: number = 10): number {
  return ccMax + (ccMax * markup / 100);
}
// getPortList(cruise: any): string {
//   if (!cruise?.itinerary) return '';
//   return cruise.itinerary
//     .map((item: any) => `${item.portId} - ${item.description}`)
//     .join(', ');
// }
  clearFilters() {
    this.filterForm.reset({
      priceRange: [500, 20000],
      starRating: 0,
      cancellationPolicy: {
        refundable: false,
        bookNow: false
      },
      amenities: {
        breakfast: false,
        parking: false,
        gym: false,
        wifi: false,
        pets: false,
        pool: false,
        bar: false
      }
    });
  }

  submitForm() {
        this.submitted=true;
     if (this.cruisesForm.valid) {
        const formValue = this.cruisesForm.value;
  } else {
    this.cruisesForm.markAllAsTouched();
  }
  }

  navigateToDetails(cruise:any) {
    console.log("cruise",cruise)
    this.router.navigate(['/cruise-details'],
      {
        queryParams:{
          id:cruise?.id,
          session_id:cruise?.session_id
        }
      }
    );
  }

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
   selectedCruise: any = null;  // store the selected cruise
confirmedCruise: any = null;
  selectCruise(cruise: any) {
    this.selectedCruise = cruise;
  }
  confirmCruiseChoice(cruise: any) {
          if (!isPlatformBrowser(this.platformId)) return;
  this.confirmedCruise = cruise; // Store final flight
  console.log("cruise confirmed:", this.confirmedCruise);

  // Close modal
  const modal = document.getElementById("customModalcruise");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

}

// Skip choice
skipCruiseChoice() {
        if (!isPlatformBrowser(this.platformId)) return;

  this.confirmedCruise = null; // Nothing stored
  // Close modal
  const modal = document.getElementById("customModalcruise");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

}
  selectedHotel: any = null;  // store the selected cruise
confirmedHotel: any = null;
  selectHotel(hotel: any) {
    this.selectedHotel = hotel;
    console.log('Selected hotel:', this.selectedHotel);
  }
  // Confirm choice (Choose & Continue)
confirmHotelChoice(hotel: any) {
      if (!isPlatformBrowser(this.platformId)) return;

  this.confirmedHotel = hotel; // Store final flight

  // Close modal
  const modal = document.getElementById("customModalhotel");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // Move to hotel tab
  document.querySelector<HTMLButtonElement>('#cruise-tab')?.click();
}

// Skip choice
skipHotelChoice() {
        if (!isPlatformBrowser(this.platformId)) return;

  this.confirmedHotel = null; // Nothing stored

  // Close modal
  const modal = document.getElementById("customModalhotel");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // Move to hotel tab
  document.querySelector<HTMLButtonElement>('#cruise-tab')?.click();
}
selectedFlight: any = null;  
confirmedFlight: any = null; 

// When user selects a flight card
selectFlight(flight: any) {
  this.selectedFlight = flight;
  console.log("Flight selected (pre-confirm):", flight);
}

// Confirm choice (Choose & Continue)
confirmFlightChoice(flight: any) {
        if (!isPlatformBrowser(this.platformId)) return;

  this.confirmedFlight = flight; // Store final flight

  // Close modal
  const modal = document.getElementById("customModal");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // Move to hotel tab
  document.querySelector<HTMLButtonElement>('#hotel-tab')?.click();
}

// Skip choice
skipFlightChoice() {
        if (!isPlatformBrowser(this.platformId)) return;

  this.confirmedFlight = null; // Nothing stored

  // Close modal
  const modal = document.getElementById("customModal");
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  // Move to hotel tab
  document.querySelector<HTMLButtonElement>('#hotel-tab')?.click();
}

  showDetailsMap: { [key: string]: boolean } = {};

   showFlightDetails(itineraryId: number): void {
    this.showDetailsMap[itineraryId] = !this.showDetailsMap[itineraryId];
  }

  hideFlightDetails(itineraryId: number): void {
    this.showDetailsMap[itineraryId] = !this.showDetailsMap[itineraryId];
  }
gotoCheckout() {
    console.log("gojhsdjhf")
  const payload = {
    flight: this.confirmedFlight,   // make sure you're using confirmed variables
    cruise: this.confirmedCruise,
    hotel: this.confirmedHotel
  };

  // Check if at least one has a value
  if (payload.flight || payload.cruise || payload.hotel) {
    this.packageService.setTravelData(payload);
    this.router.navigate(['/packages-book']);  // ✅ go to checkout page
  } else {
    this.toasterService.showError('Please select at least one option (Flight, Hotel, or Cruise).');
  }
}

}
