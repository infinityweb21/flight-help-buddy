import { HotelsTabComponent } from '../../../components/main-filter/hotels-tab/hotels-tab.component';
import { CarouselModule } from 'primeng/carousel';
import { Location } from '@angular/common';
import { Component, DestroyRef, ElementRef, Inject, inject, PLATFORM_ID, ViewChild, HostListener, OnInit, Renderer2, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../services/hotel/hotel.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RatingModule } from 'primeng/rating';
import { CommonModule, CurrencyPipe, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { MapModule } from '../../../core/map/map.module';
import { SharedService } from '../../../services/shared/shared.service';
import { SearchService } from '../../../services/search.service';
import { DeviceService } from '../../../services/shared/device.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Tooltip } from 'primeng/tooltip';
import { HotelDetailsSkeletonComponent } from '../skeleton/hotel-details-skeleton/hotel-details-skeleton.component'
import { FlightService } from '../../../services/flight/flight.service';

declare var $: any;
@Component({
    selector: 'app-hotel-details',
    imports: [
        HotelsTabComponent,
        CommonModule,
        CarouselModule,
        RatingModule,
        CurrencyPipe,
        GalleriaModule,
        FormsModule,
        DialogModule,
        TitleCasePipe,
        AccordionModule,
        MapModule,
        Tooltip,
        HotelDetailsSkeletonComponent
    ],
    templateUrl: './hotel-details.component.html',
    styleUrl: './hotel-details.component.scss',
})

export class HotelDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    private router: Router = inject(Router);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private hotelService: HotelService = inject(HotelService);
    private toasterService: ToastrService = inject(ToastrService);
    private searchService: SearchService = inject(SearchService);
    private destroyRef: DestroyRef = inject(DestroyRef);
        private flightService: FlightService = inject(FlightService);

    public hotelDetails: any = null;
    public rooms: any[] = [];
    public selectedRoom: any = null;
    public hotelId: string = '';
    public source: string = '';
    public selectedRateId: string = '';
    public searchRequestId: string = '';
    public mainsource: string = '';
    public listData: any = null;
    public searchData: any = null;
    public noOfNights: number = 0;
    public room: number = 0;
    public isBrowser: boolean = false;
    public isSkeleton: boolean = false;
    public fallbackImage: string = 'assets/fallback.jpg';
    public showFullDescription: boolean = false;
    public showAllAmenities: boolean = false;
    public amenitiesPreviewCount: number = 12;
    public mapUrl!: SafeResourceUrl;
    public policyStates: { [key: string]: boolean } = {};
    public maxLength: number = 150;
    public activeHotelTab: string = 'hotelOverview';
    public hotelNavTabs: string[] = [
        'hotelOverview',
        'hotelAmenities',
        'hotelRooms',
        'hotelReviews',
        'hotelPolicies',
        'hotelLocation'
    ];
    public pscPanelOpen: boolean = false;
packageTabActive = false;
visibleSegments: any = '';
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private location: Location,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
 const url = this.router.url;

  this.packageTabActive = url.includes('package');
        this.searchService.hotelSearchData$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.searchData = data;

                const checkIn = new Date(data?.checkIn);
                const checkOut = new Date(data?.checkOut);
                const diffTime = checkOut.getTime() - checkIn.getTime();

                this.noOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                this.room = data?.rooms?.length || 0;
            });
    }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
         if(this.packageTabActive){
            this.visibleSegments= this.flightService.getDetailsData()||'';
         }
        const stored = localStorage.getItem('hoteldata');
        if (stored) {
            this.listData = JSON.parse(stored);
        }

        this.activatedRoute.queryParams.subscribe(params => {
            this.selectedRateId = params['rateId'];
            this.searchRequestId = params['requestId'];
            this.hotelId = params['hotelId'];
            this.source = params['source'];

            if (this.hotelId) {
                this.fetchHotelAndRoomDetails();
            }
        });
    }

    ngAfterViewInit(): void {
        this.initRoomCarousel();
    }

    ngOnDestroy(): void {
        const carousel = $('.room-owl-carousel');
        if (carousel.length && carousel.hasClass('owl-loaded')) {
            carousel.trigger('destroy.owl.carousel');
        }
    }

    public goBack() {
        if(this.isBrowser){
 this.location.back();
        }
       
    }

    private buildGuestsPayload(): any[] {
        if (!this.searchData?.rooms) return [];

        return this.searchData.rooms.map((room: any) => ({
            adults: room.adults || 0,
            children: room.childAges || 0
        }));
    }

    private fetchHotelAndRoomDetails() {
        this.isSkeleton = true;
        this.hotelDetails = null;
        this.rooms = [];
        this.selectedRoom = null;

        const payload = {
            hotelId: this.listData?.id,
            checkin: this.searchData?.checkIn,
            checkout: this.searchData?.checkOut,
            guests: this.buildGuestsPayload(),
            source: this.source
        };

        const html = document.documentElement;
        const body = document.body;
        html.classList.add('overflow-hidden');
        body.classList.add('overflow-hidden');

        this.hotelService.hotelDetails(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    html.classList.remove('overflow-hidden');
                    body.classList.remove('overflow-hidden');

                    this.hotelDetails = res?.data;
                    this.mainsource = res?.data?.source || 'Mondee';
                    this.rooms = res?.data?.rooms || [];

                    const matchedRoom = this.rooms.find(r => r.rateList?.some((rl: any) => rl.rateId === this.selectedRateId));
                    this.selectedRoom = matchedRoom || this.rooms[0] || null;

                    this.setGoogleMapUrl();
                    this.isSkeleton = false;
                    this.cdr.markForCheck();

                    setTimeout(() => this.initRoomCarousel(), 0);
                },
                error: (err) => {
                    html.classList.remove('overflow-hidden');
                    body.classList.remove('overflow-hidden');

                    this.isSkeleton = false;
                    this.toasterService.error(
                        err?.error?.message || 'Something went wrong while fetching hotel details'
                    );
                    this.cdr.markForCheck();
                }
            });
    }

    private setGoogleMapUrl() {
        const hotelName = this.hotelDetails?.hotelName || '';
        const lat = this.hotelDetails?.geo?.latitude;
        const lng = this.hotelDetails?.geo?.longitude;

        if (!lat || !lng) return;

        const url = `https://www.google.com/maps?q=${encodeURIComponent(hotelName)}@${lat},${lng}&z=15&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    get uniqueRooms(): any[] {
        return this.rooms.filter(
            (room, index, self) => index === self.findIndex(r => r.roomName === room.roomName)
        );
    }

    getAllImages(images: any[]): string[] {
        if (images && images.length > 0) {
            return images.map(img => img?.href).slice(0, 12);
        }
        return [this.fallbackImage];
    }

    getStarArray(rating: any): number[] {
        const totalStars = Math.max(0, Math.floor(Number(rating) || 0));
        return Array.from({ length: totalStars });
    }

    getRating(rating: any): number {
        return parseFloat(rating) || 0;
    }

  getFacilitiesSlice(facilities: any[], limit: number): any[] {
  return (facilities || []).slice(0, limit);
}

    public formatTime(time: string): string {
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

    formatLabel(value: string): string {
        return (value || '').replace(/-/g, ' ');
    }

    getHotelDescription(): string {
        const description = this.hotelDetails?.description || '';
        if (this.showFullDescription || description.length <= 500) {
            return description;
        }
        return description.slice(0, 500) + '...';
    }

    toggleDescription(): void {
        this.showFullDescription = !this.showFullDescription;
    }




get visibleFacilities(): any[] {
  const facilities = this.hotelDetails?.facilities || [];

  if (this.showAllAmenities) {
    return facilities;
  }

  return facilities.slice(0, this.amenitiesPreviewCount);
}

toggleAmenities(): void {
  this.showAllAmenities = !this.showAllAmenities;

  console.log('showAllAmenities:', this.showAllAmenities);
  console.log('visibleFacilities:', this.visibleFacilities.length);
}

    getAmenityIcon(amenity: string): string {
        const iconMap: { keywords: string[]; icon: string }[] = [
            { keywords: ['wifi', 'wi-fi', 'wi fi', 'wireless', 'internet'], icon: 'fa-solid fa-wifi' },
            { keywords: ['tv', 'television'], icon: 'fa-solid fa-tv' },
            { keywords: ['phone', 'telephone'], icon: 'fa-solid fa-phone' },
            { keywords: ['restaurant', 'dining'], icon: 'fa-solid fa-utensils' },
            { keywords: ['breakfast'], icon: 'fa-solid fa-mug-hot' },
            { keywords: ['bar', 'cocktail'], icon: 'fa-solid fa-martini-glass' },
            { keywords: ['coffee', 'tea'], icon: 'fa-solid fa-mug-saucer' },
            { keywords: ['kitchen'], icon: 'fa-solid fa-kitchen-set' },
            { keywords: ['parking', 'car park'], icon: 'fa-solid fa-square-parking' },
            { keywords: ['pool', 'swimming'], icon: 'fa-solid fa-person-swimming' },
            { keywords: ['gym', 'fitness'], icon: 'fa-solid fa-dumbbell' },
            { keywords: ['spa'], icon: 'fa-solid fa-spa' },
            { keywords: ['laundry', 'launderette', 'dry-cleaning', 'dry cleaning'], icon: 'fa-solid fa-shirt' },
            { keywords: ['elevator', 'lift'], icon: 'fa-solid fa-elevator' },
            { keywords: ['garden'], icon: 'fa-solid fa-tree' },
            { keywords: ['terrace'], icon: 'fa-solid fa-building' },
            { keywords: ['balcony'], icon: 'fa-solid fa-building-user' },
            { keywords: ['wheelchair', 'accessib'], icon: 'fa-solid fa-wheelchair' },
            { keywords: ['air conditioning', 'air-conditioning'], icon: 'fa-solid fa-snowflake' },
            { keywords: ['heating'], icon: 'fa-solid fa-fire' },
            { keywords: ['safe'], icon: 'fa-solid fa-vault' },
            { keywords: ['bathroom'], icon: 'fa-solid fa-bath' },
            { keywords: ['shower'], icon: 'fa-solid fa-shower' },
            { keywords: ['hairdryer'], icon: 'fa-solid fa-wind' },
            { keywords: ['minibar'], icon: 'fa-solid fa-bottle-water' },
            { keywords: ['fridge', 'refrigerator'], icon: 'fa-solid fa-box-open' },
            { keywords: ['bed'], icon: 'fa-solid fa-bed' },
            { keywords: ['airport'], icon: 'fa-solid fa-plane' },
            { keywords: ['taxi'], icon: 'fa-solid fa-taxi' },
            { keywords: ['shuttle', 'transfer'], icon: 'fa-solid fa-bus' },
            { keywords: ['pet', 'dog', 'cat'], icon: 'fa-solid fa-paw' },
            { keywords: ['security'], icon: 'fa-solid fa-shield-halved' },
            { keywords: ['smoke detector', 'fire extinguisher'], icon: 'fa-solid fa-fire-extinguisher' },
            { keywords: ['cctv'], icon: 'fa-solid fa-video' },
            { keywords: ['beach'], icon: 'fa-solid fa-umbrella-beach' },
            { keywords: ['mountain'], icon: 'fa-solid fa-mountain' },
            { keywords: ['meeting', 'conference', 'business'], icon: 'fa-solid fa-briefcase' },
            { keywords: ['family'], icon: 'fa-solid fa-people-roof' },
            { keywords: ['kids', 'children', 'playroom'], icon: 'fa-solid fa-child' },
            { keywords: ['non-smoking'], icon: 'fa-solid fa-ban-smoking' },
            { keywords: ['smoking'], icon: 'fa-solid fa-smoking' },
            { keywords: ['concierge'], icon: 'fa-solid fa-concierge-bell' },
            { keywords: ['luggage'], icon: 'fa-solid fa-suitcase-rolling' },
            { keywords: ['multi-language', 'multilingual', 'spanish', 'english'], icon: 'fa-solid fa-language' },
            { keywords: ['sun deck', 'sun terrace', 'sun loungers'], icon: 'fa-solid fa-sun' },
            { keywords: ['atm', 'currency exchange'], icon: 'fa-solid fa-vault' },
            { keywords: ['24-hour reception', '24 hour reception', 'front desk', 'reception'], icon: 'fa-solid fa-headset' },
            { keywords: ['room service'], icon: 'fa-solid fa-concierge-bell' }
        ];

        const lowerAmenity = (amenity || '').toLowerCase().trim();
        const matched = iconMap.find(item => item.keywords.some(keyword => lowerAmenity.includes(keyword)));

        return matched?.icon || 'fa-solid fa-circle-check';
    }

    getTruncatedPolicy(policy: string, key: string): string {
        const showFull = this.policyStates[key];
        if (showFull || !policy) {
            return policy;
        }
        return policy.length > this.maxLength ? policy.substring(0, this.maxLength) + '...' : policy;
    }

    togglePolicy(key: string): void {
        this.policyStates[key] = !this.policyStates[key];
    }

    hasChargeableFacilities(room: any): boolean {
        return !!room?.roomFacilities?.some((f: any) => f.indFee === true);
    }

    hasNonChargeableFacilities(room: any): boolean {
        return !!room?.roomFacilities?.some((f: any) => f.indFee === false);
    }

    openRoomFacilities(room: any): void {
        this.selectedRoom = room;
    }

    getFormattedPrice(value: number | undefined | null): { integer: string; decimal: string } {
        const num = value ?? 0;
        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);

        const [integer, decimal] = formatted.split('.');
        return { integer, decimal: decimal || '00' };
    }

    private getOfferDiscount(fare: any): number {
        return (fare?.offers || []).reduce((sum: number, offer: any) => {
            const discount = Number(offer?.amount ?? offer?.discountAmount ?? offer?.value ?? 0);
            return sum + Math.abs(isNaN(discount) ? 0 : discount);
        }, 0);
    }

    getChargedTotal(fare: any): number {
         const ccMax = this.packageTabActive
  ? Number(this.visibleSegments?.Fares?.[0]?.CCMax || 0)
  : 0;
        return Number(fare?.total || 0) - this.getOfferDiscount(fare)+ccMax;
    }

    getDueAtPropertyAmount(fare: any): number {
        return (fare?.taxes || [])
            .filter((tax: any) => !tax.included)
            .reduce((sum: number, tax: any) => sum + Number(tax?.amount || 0), 0);
    }

    getRatePerNightTotal(rate: any): number {
        const base = Number(rate?.perNightBaseFare || 0);
        const taxes = Number(rate?.perNightTaxesAndFees || 0);
        const ccMax = this.packageTabActive
  ? Number(this.visibleSegments?.Fares?.[0]?.CCMax || 0)
  : 0;
        return rate?.includesTaxes ? base+ccMax : base + taxes + ccMax;
    }

    private getFareRoomAndRate(): { room: any; rate: any } | null {
        if (!this.hotelDetails?.fare || !this.rooms?.length) return null;

        for (const room of this.rooms) {
            const rate = room.rateList?.find((r: any) => r.rateId === this.hotelDetails.fare.rateId);
            if (rate) return { room, rate };
        }
        return null;
    }

    getFareRoomImage(fare: any): string {
        const match = this.getFareRoomAndRate();
        return match?.room?.roomImages?.[0]?.imageUrl || this.hotelDetails?.images?.[0]?.href || this.fallbackImage;
    }

    reserveRecommendedDeal(): void {
        const match = this.getFareRoomAndRate();
        if (match) {
            this.navigateToBooking(match.rate, match.room);
        }
    }

    getReviewStatusLabel(score: any): string {
        const value = Number(score) || 0;
        if (value >= 9) return 'Excellent';
        if (value >= 8) return 'Very Good';
        if (value >= 7) return 'Good';
        if (value >= 6) return 'Pleasant';
        return 'Poor';
    }

    isRecommendedRate(rate: any, room: any): boolean {
        if (!room?.rateList?.length) {
            return false;
        }

        const lowestPrice = Math.min(...room.rateList.map((r: any) => Number(r.perNightBaseFare || 0)));

        const scoredRates = room.rateList.map((r: any) => {
            let score = 0;
            if (r.freeCancellation) score += 50;
            if (r.breakfastIncluded) score += 30;
            if (r.payLater) score += 20;
            if (Number(r.perNightBaseFare || 0) === lowestPrice) score += 40;
            return { ...r, score };
        });

        const recommended = scoredRates.reduce((best: any, current: any) => {
            if (current.score > best.score) return current;
            if (current.score === best.score && Number(current.perNightBaseFare) < Number(best.perNightBaseFare)) return current;
            return best;
        });

        return recommended.rateId === rate.rateId;
    }

    public navigateToBooking(rate: any, room: any) {
        this.hotelService.setSearchData({
            selectedRoom: room,
            selectedRate: rate,
            hotelDetails: this.hotelDetails
        });

        if (room?.rateList?.[0]?.rateType === 'BOOKABLE') {
            this.redirectToBookingWithoutPriceCheck(rate, room);
            return;
        }

        const payload = {
            hash: rate?.book_hash || '',
            price_increase_percent: 0,
            source: this.source || 'Mondee'
        };

        this.hotelService.hotelPreRate(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const priceChanged = res?.data?.data?.changes?.price_changed === true;

                    if (priceChanged) {
                        this.showPriceChangePopup(rate, room, res);
                    } else {
                        this.redirectToBooking(rate, room, res);
                    }
                },
                error: (err) => {
                    this.toasterService.error(
                        err?.error?.message || 'Something went wrong while fetching hotel details'
                    );
                }
            });
    }

    private redirectToBooking(rate: any, room: any, prerate: any): void {
        if(this.packageTabActive){
            const queryParams=this.searchService.getCurrentParamsData();
            this.router.navigate(['/package-flights-list'], { queryParams });
        }else{
                this.router.navigate(['/hotel-booking'], {
            queryParams: {
                hotelId: this.hotelId || '',
                requestId: prerate?.data?.data?.hotels?.[0]?.rates?.[0]?.match_hash || this.searchRequestId || '',
                rateId: rate.rateId || '',
                roomId: room.roomId || '',
                source: this.mainsource || 'Mondee',
                book_hash: prerate?.data?.data?.hotels?.[0]?.rates?.[0]?.book_hash || ''
            }
        });
        }
    
    }

    private redirectToBookingWithoutPriceCheck(rate: any, room: any): void {
   
           if(this.packageTabActive){
            const queryParams=this.searchService.getCurrentParamsData();
            this.router.navigate(['/package-flights-list'], { queryParams });
        }else{
                    this.router.navigate(['/hotel-booking'], {
            queryParams: {
                hotelId: this.hotelId || '',
                requestId: rate?.id || this.searchRequestId || '',
                rateId: rate.rateId || '',
                roomId: room.roomId || '',
                source: this.mainsource || 'Mondee',
                book_hash: rate?.book_hash || ''
            }
        });
        }
    }

    private showPriceChangePopup(rate: any, room: any, prerate: any): void {
        this.toasterService.info('Room price has changed, please review before booking');
        this.redirectToBooking(rate, room, prerate);
    }

    onrouteTax(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const url = this.router.serializeUrl(this.router.createUrlTree(['/taxes-and-fees-us']));
        window.open(url, '_blank');
    }

    selectHotelTab(event: Event, targetId: string): void {
        event.preventDefault();

        const targetSection = document.getElementById(targetId);
        const navWrap = document.querySelector('.o-hotel-nav-list-wrap') as HTMLElement;

        if (!targetSection || !navWrap) return;

        this.activeHotelTab = targetId;

        const navHeight = navWrap.offsetHeight;
        const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - 10;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }

    updateActiveHotelTab(): void {
        const navWrap = document.querySelector('.o-hotel-nav-list-wrap') as HTMLElement;
        if (!navWrap) return;

        const sections = this.hotelNavTabs
            .map(id => document.getElementById(id))
            .filter((section): section is HTMLElement => !!section);

        if (!sections.length) return;

        const navHeight = navWrap.offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 30;

        let activeSection = sections[0];

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= sectionTop) {
                activeSection = section;
            }
        });

        this.activeHotelTab = activeSection.id;
    }

    @HostListener('window:scroll')
    onHotelWindowScroll(): void {
        this.updateActiveHotelTab();
    }

    @HostListener('window:resize')
    onHotelWindowResize(): void {
        this.updateActiveHotelTab();
    }

    togglePscPanel(event?: Event): void {
        event?.stopPropagation();
        this.pscPanelOpen = !this.pscPanelOpen;
        this.updateBodyOverflow();
    }

    closePscPanel(): void {
        this.pscPanelOpen = false;
        this.updateBodyOverflow();
    }

    completeBooking(event: Event): void {
        event.stopPropagation();
        this.reserveRecommendedDeal();
    }

    private updateBodyOverflow(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        document.body.style.overflow = this.pscPanelOpen ? 'hidden' : '';
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.pscPanelOpen) this.closePscPanel();
    }

    private initRoomCarousel(): void {
        setTimeout(() => {
            const carousel = $('.room-owl-carousel');
            if (!carousel.length) return;

            if (carousel.hasClass('owl-loaded')) {
                carousel.trigger('destroy.owl.carousel');
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
                    '<span class="room-nav-btn next">&#10095;</span>'
                ]
            });
        }, 0);
    }
}