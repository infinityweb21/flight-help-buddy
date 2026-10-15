import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TosterService } from '../../../services/common/toaster.service';
import { CruiseService } from '../../../services/cruise/cruise.service';

declare var $: any;

@Component({
    selector: 'app-cruise-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cruise-details.component.html',
    styleUrl: './cruise-details.component.scss'
})
export class CruiseDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cruiseService = inject(CruiseService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);

    shipId: string = '';
    session_id: string = '';

    markupPercentage: number = 10;
    cruiseDetails: any = null;

    selectedCabin: any = null;

    showAllItinerary: boolean = false;

    showFullDescriptioncard: { [key: number]: boolean } = {};
    showFullDeckDescription: { [key: number]: boolean } = {};
    showFullDescriptionenrichment: { [key: number]: boolean } = {};
    showFullDescriptionhealth: { [key: number]: boolean } = {};

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cdr: ChangeDetectorRef
    ) {
        this.route.queryParams.subscribe((data: any) => {
            if (data) {
                this.shipId = data.id;
                this.session_id = data.session_id;
            }
        });
    }

    ngOnInit(): void {
        this.getCruiseDetails();
    }

    ngAfterViewInit(): void {
        this.initRoomCarousel();
    }

    ngOnDestroy(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        $('.room-owl-carousel').each((_index: number, element: HTMLElement) => {
            const carousel = $(element);
            if (carousel.hasClass('owl-loaded')) {
                carousel.trigger('destroy.owl.carousel');
            }
        });
    }

    private initRoomCarousel(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        setTimeout(() => {
            $('.room-owl-carousel').each((_index: number, element: HTMLElement) => {
                const carousel = $(element);
                if (carousel.hasClass('owl-loaded')) {
                    carousel.trigger('destroy.owl.carousel');
                }
                carousel.owlCarousel({
                    items: 1,
                    loop: true,
                    dots: true,
                    nav: true,
                    autoplay: true,
                    autoplayTimeout: 1500,
                    autoplayHoverPause: true,
                    margin: 0,
                    smartSpeed: 300,
                    navText: [
                        '<span class="room-nav-btn prev">&#10094;</span>',
                        '<span class="room-nav-btn next">&#10095;</span>',
                    ],
                });
            });
        }, 0);
    }

    getCruiseDetails() {
        const payload = {
            session_id: this.session_id,
            id: this.shipId
        };

        this.cruiseService.getcruiseDetails(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    if (res.data.length !== 0) {

                        this.cruiseService.setRepriceData(res?.data);

                        const cruise = res.data[0];
                        const duration = parseInt(cruise.Duration) || 1;

                        const lowestPriceEntry = cruise.sailing_prices.reduce(
                            (prev: any, current: any) =>
                                parseFloat(prev.AdultFare) < parseFloat(current.AdultFare) ? prev : current
                        );

                        const lowestPrice = parseFloat(lowestPriceEntry.AdultFare);
                        const priceWithMarkup = lowestPrice * (1 + this.markupPercentage / 100);
                        const lowestPricePerNight = lowestPrice / duration;
                        const priceWithMarkupPerNight = priceWithMarkup / duration;

                        const cabinPrices: any[] = [];

                        cruise.sailing_prices.forEach((price: any) => {
                            const fare = parseFloat(price.AdultFare);
                            const tax = parseFloat(price.Tax) || 0;
                            const existing = cabinPrices.find((p) => p.cabinCategory === price.CabinCategory);

                            if (!existing || fare < existing.basePrice) {
                                const basePrice = fare;
                                const basePricePerNight = basePrice / duration;
                                const markupPrice = basePrice * (1 + this.markupPercentage / 100);
                                const markupPricePerNight = markupPrice / duration;

                                const data = {
                                    basePrice,
                                    basePricePerNight,
                                    priceWithMarkup: markupPrice,
                                    priceWithMarkupPerNight: markupPricePerNight,
                                    tax,
                                    cabinCategory: price.CabinCategory,
                                    categoryCode: price.CategoryCode,
                                    rateCode: price.RateCode,
                                    SailingPriceID: price.SailingPriceID
                                };

                                if (existing) {
                                    Object.assign(existing, data);
                                } else {
                                    cabinPrices.push(data);
                                }
                            }
                        });

                        const itineraryDetails = cruise.Itinerary_DayNumber
                            .split(",")
                            .map((day: string, index: number) => ({
                                dayNumber: day,
                                portId: cruise.Itinerary_PortID.split(",")[index],
                                description: cruise.Itinerary_Description[index],
                                arrivalTime: cruise.Itinerary_ArrivalTime.split(",")[index],
                                departureTime: cruise.Itinerary_DepartureTime.split(",")[index],
                            }));

                        const arrivalTimes = cruise.Itinerary_ArrivalTime.split(",");
                        const returnDate = arrivalTimes[arrivalTimes.length - 1];

                        let cabinDetails: any[] = [];
                        const rawCabins: any = cruise?.shipData?.shipInfo;

                        if (rawCabins?.DisplayCabins && rawCabins.DisplayCabins.trim().length) {
                            const displayNames = rawCabins.DisplayCabins.split(',');
                            const codes = rawCabins.cat_Code.split(',');
                            const cabinTypes = rawCabins.CabinType.split(',');
                            const colors = rawCabins.cat_Color.split(',');
                            const images = rawCabins.cat_ImagePath.split(',');
                            const descriptions = rawCabins.cat_Description
                                ? rawCabins.cat_Description.split(/,(?=<p>)/)
                                : [];

                            cabinDetails = displayNames.map((name: string, index: number) => ({
                                displayName: name.trim(),
                                categoryCode: codes[index]?.trim() || '',
                                cabinType: cabinTypes[index]?.trim() || '',
                                color: colors[index]?.trim() || '',
                                image: images[index]?.trim() || '',
                                description: descriptions[index]?.trim() || '',
                                startDate: rawCabins.cat_StartDate?.trim() || '',
                                endDate: rawCabins.cat_EndDate?.trim() || '',
                            }));
                        }

                        let deckDetails: any[] = [];
                        const rawDecks: any = cruise?.shipData?.shipInfo;

                        if (rawDecks?.DeckID && rawDecks.DeckID.trim().length) {
                            const deckIDs = rawDecks.DeckID.split(',');
                            const deckNumbers = rawDecks.DeckNumber.split(',');
                            const deckNames = rawDecks.Deck_Name.split(',');
                            const deckUrls = rawDecks.Deck_URL.split(',');
                            const deckDescriptions = rawDecks.Deck_Description
                                ? rawDecks.Deck_Description.split(/,(?=<p>)/)
                                : [];

                            deckDetails = deckIDs.map((id: string, index: number) => ({
                                deckID: id.trim(),
                                deckNumber: deckNumbers[index]?.trim() || '',
                                deckName: deckNames[index]?.trim() || '',
                                deckUrl: deckUrls[index]?.trim() || '',
                                deckDescription: deckDescriptions[index]?.trim() || '',
                            }));
                        }

                        this.cruiseDetails = {
                            id: cruise.id,
                            session_id: cruise.session_id,
                            departureDate: cruise.DepartureDate,
                            departurePortCode: cruise.DeparturePortCode,
                            departurePortID: cruise.DeparturePortID,
                            duration: duration,
                            returnPortCode: cruise.ReturnPortCode,
                            returnPortID: cruise.ReturnPortID,
                            sailingID: cruise.SailingID,
                            sailingPlanCode: cruise.SailingPlanCode,
                            shipName: cruise?.shipData?.shipInfo?.Name || cruise.ShipName,
                            cruiseSailingName: cruise.cruise_sailing_name,
                            image: cruise.shipData.shipInfo.ImagePath,
                            logo: cruise.shipData.vendor[0].ImagePath,
                            returnDate: returnDate,
                            lowestPrice,
                            priceWithMarkup,
                            lowestPricePerNight,
                            priceWithMarkupPerNight,
                            cabinPrices,
                            cabinDetails,
                            deckDetails,
                            ports: {
                                departurePortInfo: cruise.ports.DeparturePortInfo,
                                returnPortInfo: cruise.ports.ReturnPortInfo,
                            },
                            itinerary: itineraryDetails,
                            enrichments: cruise?.shipData?.shipInfo?.enrichment_types,
                            health: cruise?.shipData?.shipInfo?.health_fitness_types,
                            accommodation: cruise?.shipData?.shipInfo?.accommodation,
                        };

                        this.cdr.detectChanges();
                        this.initRoomCarousel();

                    } else {
                        this.toasterService.showError("No cruise found");
                        this.cruiseDetails = null;
                    }
                },
                error: (err) => {
                    this.cruiseDetails = null;
                    this.toasterService.showError(
                        err.error?.message || "Something went wrong while fetching cruise list!"
                    );
                },
            });
    }

    get visibleItinerary() {
        if (!this.cruiseDetails?.itinerary) return [];
        return this.showAllItinerary
            ? this.cruiseDetails.itinerary
            : this.cruiseDetails.itinerary.slice(0, 5);
    }

    toggleShowAllItinerary() {
        this.showAllItinerary = !this.showAllItinerary;
    }

    get cheapestCabin(): any {
        if (!this.cruiseDetails?.cabinPrices?.length) return null;
        return this.cruiseDetails.cabinPrices.reduce((a: any, b: any) =>
            a.basePrice < b.basePrice ? a : b
        );
    }

    get refundShield(): number {
        const base = this.cheapestCabin?.priceWithMarkup || 0;
        return base * 0.1;
    }

    get totalPrice(): number {
        const base = this.cheapestCabin?.priceWithMarkup || 0;
        return base + this.refundShield;
    }

    selectCabinAndBook(cabin: any) {
        if (!cabin) {
            this.toasterService.showError('Please select a cabin before proceeding.');
            return;
        }
        this.selectedCabin = cabin;
        this.navigateToPayment();
    }

    navigateToPayment() {
        if (!this.selectedCabin) {
            this.toasterService.showError('Please select a cabin before proceeding.');
            return;
        }
        this.cruiseService.setTravelData(this.cruiseDetails);
        this.cruiseService.setFareSummary(this.selectedCabin);
        this.router.navigate(['/cruise-booking']);
    }

    getSanitizedHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html || '');
    }

    getMapSrc(lat?: string, lng?: string): SafeResourceUrl {
        const latitude = lat || '0';
        const longitude = lng || '0';
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.google.com/maps?q=${latitude},${longitude}&z=12&output=embed`
        );
    }

    private truncate(html: string, limit = 300): string {
        if (!html) return '';
        let text = '';
        if (isPlatformBrowser(this.platformId)) {
            const div = document.createElement('div');
            div.innerHTML = html;
            text = div.textContent || div.innerText || '';
        } else {
            text = html.replace(/<[^>]*>/g, '');
        }
        if (text.length > limit) {
            text = text.substring(0, limit) + '...';
        }
        return text;
    }

    toggleDescriptioncard(index: number) {
        this.showFullDescriptioncard[index] = !this.showFullDescriptioncard[index];
    }

    getTruncatedHtmlcard(html: string, index: number, limit = 300): SafeHtml {
        if (this.showFullDescriptioncard[index]) return this.getSanitizedHtml(html);
        return this.getSanitizedHtml(this.truncate(html, limit));
    }

    toggleDeckDescription(index: number) {
        this.showFullDeckDescription[index] = !this.showFullDeckDescription[index];
    }

    getTruncatedHtmlDeck(html: string, index: number, limit = 300): SafeHtml {
        if (this.showFullDeckDescription[index]) return this.getSanitizedHtml(html);
        return this.getSanitizedHtml(this.truncate(html, limit));
    }

    toggleDescriptionenrichment(index: number) {
        this.showFullDescriptionenrichment[index] = !this.showFullDescriptionenrichment[index];
    }

    getTruncatedHtmlEnrichment(html: string, index: number, limit = 300): SafeHtml {
        if (this.showFullDescriptionenrichment[index]) return this.getSanitizedHtml(html);
        return this.getSanitizedHtml(this.truncate(html, limit));
    }

    toggleDescriptionhealth(index: number) {
        this.showFullDescriptionhealth[index] = !this.showFullDescriptionhealth[index];
    }

    getTruncatedHtmlhealth(html: string, index: number, limit = 300): SafeHtml {
        if (this.showFullDescriptionhealth[index]) return this.getSanitizedHtml(html);
        return this.getSanitizedHtml(this.truncate(html, limit));
    }

    priceWhole(value: number | undefined | null): string {
        const v = value || 0;
        return Math.floor(v).toLocaleString('en-US');
    }

    priceDecimal(value: number | undefined | null): string {
        const v = value || 0;
        return (v % 1).toFixed(2).substring(2);
    }

    public goBack() {
        history.back();
    }
}