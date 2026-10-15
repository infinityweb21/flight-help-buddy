import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Inject,
  NgZone,
  PLATFORM_ID,
  RendererFactory2,
} from "@angular/core";
import {
  CommonModule,
} from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { BackDirective } from "../../../../directives/back.directive";
import { TosterService } from "../../../../services/common/toaster.service";
import { FlightFilterService } from "../../../../services/flight/flight-filter.service";
import { SearchService } from "../../../../services/search.service";
import { FlightPaymentSkeletonComponent } from "../../../flights-list/skeleton/flight-payment-skeleton/flight-payment-skeleton.component";

import { PaymentLoaderComponent } from "../../../flights-list/skeleton/payment-loader/payment-loader.component";
import { DeviceService } from "../../../../services/shared/device.service";
import { ActivatedRoute } from "@angular/router";
import { HotelService } from "../../../../services/hotel/hotel.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { SharedService } from "../../../../services/shared/shared.service";
@Component({
  selector: 'app-hotel-booking-ticket',
  imports: [  CommonModule,
    TooltipModule,
    BackDirective,
    FlightPaymentSkeletonComponent,
    PaymentLoaderComponent,],
  templateUrl: './hotel-booking-ticket.component.html',
  styleUrl: './hotel-booking-ticket.component.scss'
})
export class HotelBookingTicketComponent  {
    private deviceService = inject(DeviceService);
    isMobile:boolean=false;
      private hotelService: HotelService = inject(HotelService);
        private destroyRef: DestroyRef = inject(DestroyRef);
      
      roomDetails: any;
      rateDetails: any;
      hotelDetails: any;
searchData:any='';
noOfNights:number=0;
adultCount:number=0;
childCount:number=0;
room:number=0;
source:any='';
travelData:any='';
  getData: any = '';
  booking_id:any='';
  constructor(
    rendererFactory: RendererFactory2,
    private toasterService: TosterService,
    private filterService: FlightFilterService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private route:ActivatedRoute,
    private shareService:SharedService,
    private ngZone: NgZone, private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
   
 this.route.queryParamMap.subscribe(params => {
 this.booking_id = params.get('booking_id');
 
});
  }
 

  ngOnInit() {
        this.getData = this.shareService.getcompanyName();

     this.searchService.hotelSearchData$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log('received data -- booking details', data);
    
        this.searchData = data;
    
        const checkIn = new Date(data?.checkIn);
        const checkOut = new Date(data?.checkOut);
    
        const diffTime =
          checkOut.getTime() - checkIn.getTime();
    
        this.noOfNights = Math.ceil(
          diffTime / (1000 * 60 * 60 * 24)
        );
    
        console.log('No of Nights:', this.noOfNights);
    
        // =========================
        // ROOM / ADULT / CHILD COUNT
        // =========================
    
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
       this.hotelService.selectedRoom$
         .pipe(takeUntilDestroyed(this.destroyRef))
         .subscribe((data) => {
           console.log('booking room details', data);
           this.roomDetails = data?.selectedRoom;
           this.rateDetails = data?.selectedRate;
           this.hotelDetails = data?.hotelDetails;
           console.log("data of hotel",data)
         });
             const tradeldata = this.hotelService.getTravelData();

              if (tradeldata) {
              this.travelData=tradeldata;
              }
   
  }
 
getStarArray(rating: any): number[] {

  const totalStars = Math.max(
    0,
    Math.floor(Number(rating) || 0)
  );

  return Array.from({ length: totalStars });

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
  formatPrice(price: string): string {
    return `$${Number(price).toFixed(2)}`;
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

  // goBack() {
  //   this.location.back();
  // }
getPricePerNightRate(fare: any): any {

  const baseAmount = Number(fare?.perNightBaseFare || 0);
  return baseAmount.toFixed(2);
}
getBasePrice(fare: any): any {
  const nights =
    Number(this.noOfNights || 1);
  const baseAmount = Number(fare?.perNightBaseFare || 0);
  const taxes = Number(fare?.perNightTaxesAndFees || 0);

  const price = baseAmount*nights;
  

  return price.toFixed(2);
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
get lastFourDigits(): string {
  const card = this.travelData?.billingInfo?.CardNumber || '';
  return card.replace(/\s/g, '').slice(-4);
}
get importantNotes(): string[] {
  return this.hotelDetails?.hotelPolicies?.know_before_you_go
    ? this.hotelDetails.hotelPolicies.know_before_you_go
        .split(',')
        .map((note: string) => note.trim())
    : [];
}
}