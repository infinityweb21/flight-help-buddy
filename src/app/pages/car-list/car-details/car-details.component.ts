import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    Inject,
    inject,
    PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CarService } from '../../../services/car/car.service';
import { TosterService } from '../../../services/common/toaster.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SharedService } from '../../../services/shared/shared.service';
import { FormsModule } from '@angular/forms';
import { MapModule } from '../../../core/map/map.module';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-car-details',
    standalone: true,
    imports: [
        DrawerModule,
        CommonModule,
        FormsModule,
        MapModule,
        SkeletonModule
    ],
    templateUrl: './car-details.component.html',
    styleUrl: './car-details.component.scss'
})
export class CarDetailsComponent {

    getdetailsdata: any = '';

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private carService = inject(CarService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);
    private shareService: SharedService = inject(SharedService);

    public fareSummary: any = '';

    reference_id: string = '';
    session_id: string = '';

    // ==========================================
    // TAB VARIABLES
    // ==========================================

    selectedTab: string = 'Overview';

    tabs: string[] = ['Overview'];

    selectedTabIndex: number = 0;

    // ==========================================
    // CAR DATA
    // ==========================================

    carDetails: any = {};
    carRate: any = {};
    carFleet: any = {};

    vehicleCharge: any[] = [];
    includedCharges: any[] = [];

    conditionKeys: string[] = [];

    isLoading: boolean = true;
    errorMessage: string = '';

    selectedCabin: any = null;

    selectedEquipments: {
        [key: string]: boolean
    } = {};

    additionalPaymentsTotal: number = 0;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    constructor(
        private sanitizer: DomSanitizer,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {

        this.route.queryParams.subscribe((params: any) => {

            if (params) {
                this.reference_id = params.reference_id;
                this.session_id = params.session_id;
            }

        });

        this.getdetailsdata = this.carService.getRepriceData();
    }


    // ==========================================
    // ON INIT
    // ==========================================

    ngOnInit(): void {
        this.getCardetails();
    }


    // ==========================================
    // GET CAR DETAILS
    // ==========================================

    public getCardetails() {

        this.isLoading = true;
        this.errorMessage = '';

        const payload = {
            session_id: this.session_id,
            reference_id: this.reference_id
        };

        this.carService.getcarDetails(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({

                next: (res: any) => {

                    this.isLoading = false;

                    if (!res || res?.success === false) {

                        this.errorMessage =
                            res?.message ||
                            'Something went wrong while fetching car details!';

                        return;
                    }


                    if (res?.data?.Errors) {

                        this.errorMessage =
                            res?.data?.Errors?.ErrorMessage ||
                            'No rental conditions available.';

                        return;
                    }


                    const data = res?.data?.data;


                    if (!data) {

                        this.errorMessage =
                            'No car details available for this selection.';

                        return;
                    }


                    this.fareSummary = data;


                    const currency =
                        data?.vehicleCharge?.[0]?.currencyCode || 'USD';


                    const basePrice = (data?.pricedCoverages || [])
                        .filter(
                            (c: any) =>
                                c?.includedInRate === 'true'
                        )
                        .reduce(
                            (sum: number, c: any) =>
                                sum + parseFloat(c.amount || 0),
                            0
                        );


                    const equipmentTotal = (data?.pricedEquipments || [])
                        .reduce(
                            (sum: number, e: any) =>
                                sum + parseFloat(e.amount || 0),
                            0
                        );


                    const totalPrice =
                        basePrice + equipmentTotal;


                    this.vehicleCharge =
                        data?.vehicleCharge || [];


                    this.includedCharges =
                        (data?.vehicleCharge || [])
                            .filter(
                                (c: any) =>
                                    c?.includedInRate === 'true'
                            );


                    this.carFleet =
                        data?.carFleet || {};


                    // ==========================================
                    // CAR DETAILS
                    // ==========================================

                    this.carDetails = {

                        vehicle: {

                            imageUrl:
                                this.getdetailsdata?.carDetails?.carImage ||
                                this.carFleet?.PictureURL ||
                                '',

                            name:
                                this.getdetailsdata?.carDetails?.carModel ||
                                this.carFleet?.CarName ||
                                '',

                            category:
                                this.getdetailsdata?.carDetails?.sizeName ||
                                this.carFleet?.CarCode ||
                                '',

                            transmission:
                                this.getdetailsdata?.carDetails?.transmissionType ||
                                this.carFleet?.TransmissionType ||
                                '',

                            airConditioning:
                                (
                                    this.getdetailsdata?.carDetails?.ac === 'true' ||
                                    this.carFleet?.AirConditionInd === 'true'
                                )
                                    ? 'Yes'
                                    : 'No',

                            passengerQuantity:
                                this.getdetailsdata?.carDetails?.passengerQuantity ||
                                this.carFleet?.PassengerQuantity ||
                                '',

                            model:
                                this.getdetailsdata?.carDetails?.carModel ||
                                this.carFleet?.CarName ||
                                '',

                            baggageQuantity:
                                this.getdetailsdata?.carDetails?.baggageQuantity ||
                                this.carFleet?.BaggageQuantity ||
                                '',

                            doorCount:
                                this.getdetailsdata?.carDetails?.vehicleDoor ||
                                '',

                            fuelType:
                                this.carFleet?.FuelType ||
                                '',

                            description:
                                this.carFleet?.Description ||
                                ''
                        },


                        pickupDate:
                            (this.getdetailsdata?.pickup?.date || '') +
                            ' ' +
                            (this.getdetailsdata?.pickup?.time || ''),


                        dropoffDate:
                            (this.getdetailsdata?.dropoff?.date || '') +
                            ' ' +
                            (this.getdetailsdata?.dropoff?.time || ''),


                        pickupLocation:
                            this.getdetailsdata?.pickup?.locationName ||
                            '',


                        dropoffLocation:
                            this.getdetailsdata?.dropoff?.locationName ||
                            '',


                        pickupAddress:
                            this.getdetailsdata?.pickup?.address ||
                            '',


                        dropoffAddress:
                            this.getdetailsdata?.dropoff?.address ||
                            '',


                        pickupTelephone:
                            this.getdetailsdata?.pickup?.telephone ||
                            '',


                        basePrice:
                            basePrice,


                        totalPrice:
                            totalPrice,


                        currency:
                            currency,


                        duartion:
                            this.getdetailsdata?.duration ||
                            '-',


                        vendorDeatis: {

                            vendorName:
                                this.getdetailsdata?.vendor?.name ||
                                '-',

                            vendorImage:
                                this.getdetailsdata?.vendor?.vendorImage ||
                                '-',

                            totalReview:
                                this.getdetailsdata?.vendor?.reviewsTotal ||
                                '0',

                            overallReview:
                                this.getdetailsdata?.vendor?.reviewsOverall ||
                                '0'
                        }
                    };


                    // ==========================================
                    // CAR RATE
                    // ==========================================

                    this.carRate = {

                        pricedCoverages:
                            data?.pricedCoverages || [],

                        pricedEquipments:
                            data?.pricedEquipments || [],

                        rentalConditions:
                            data?.rentalConditions || {}
                    };


                    this.conditionKeys =
                        Object.keys(
                            this.carRate.rentalConditions || {}
                        );


                    // ==========================================
                    // TABS
                    // ==========================================

                    this.tabs = [
                        'Overview',
                        ...this.conditionKeys,
                        'Location'
                    ];

                    this.selectedTabIndex = 0;
                    this.selectedTab = this.tabs[0];

                },


                error: (err) => {

                    this.isLoading = false;

                    this.errorMessage =
                        err?.error?.message ||
                        'Something went wrong while fetching car details!';

                    this.toasterService.showError(
                        this.errorMessage
                    );
                }

            });
    }


    // ==========================================
    // SELECT TAB
    // ==========================================

    selectTab(tab: string): void {

        this.selectedTab = tab;

        this.selectedTabIndex =
            this.tabs.indexOf(tab);

        this.scrollActiveTabIntoView();
    }


    // ==========================================
    // MOVE TAB LEFT / RIGHT
    // ==========================================

    moveTab(direction: 'left' | 'right'): void {

        if (!this.tabs.length) {
            return;
        }


        // LEFT ARROW
        if (direction === 'left') {

            if (this.selectedTabIndex > 0) {

                this.selectedTabIndex--;

            } else {

                return;
            }
        }


        // RIGHT ARROW
        if (direction === 'right') {

            if (
                this.selectedTabIndex <
                this.tabs.length - 1
            ) {

                this.selectedTabIndex++;

            } else {

                return;
            }
        }


        // UPDATE ACTIVE TAB
        this.selectedTab =
            this.tabs[this.selectedTabIndex];


        // SCROLL ACTIVE TAB INTO VIEW
        this.scrollActiveTabIntoView();
    }


    // ==========================================
    // SCROLL ACTIVE TAB INTO VIEW
    // ==========================================

    private scrollActiveTabIntoView(): void {

        setTimeout(() => {

            const activeTab =
                document.querySelector(
                    '.rg-tabs .nav-link.active'
                ) as HTMLElement;


            if (activeTab) {

                activeTab.scrollIntoView({

                    behavior: 'smooth',

                    block: 'nearest',

                    inline: 'center'
                });
            }

        }, 50);
    }


    // ==========================================
    // CONDITION LINES
    // ==========================================

    getConditionLines(condition: string): string[] {

        const value =
            this.carRate?.rentalConditions?.[condition];


        if (!value) {
            return [];
        }


        if (Array.isArray(value)) {
            return value;
        }


        return [String(value)];
    }


    // ==========================================
    // SANITIZED HTML
    // ==========================================

    getSanitizedHtml(html: string): SafeHtml {

        return this.sanitizer
            .bypassSecurityTrustHtml(html);
    }


    // ==========================================
    // GOOGLE MAP
    // ==========================================

    getMapUrl(address: string): any {

        const query =
            address &&
            address.trim().length
                ? address
                : 'Los Angeles Airport';


        return this.sanitizer
            .bypassSecurityTrustResourceUrl(
                `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
            );
    }


    // ==========================================
    // TRUNCATE AMOUNT
    // ==========================================

    truncateAmount(
        value: any,
        decimals: number = 2
    ): string {

        if (value == null) {
            return '';
        }


        const num =
            parseFloat(value);


        if (isNaN(num)) {
            return '';
        }


        const factor =
            Math.pow(10, decimals);


        const truncated =
            Math.floor(num * factor) / factor;


        return truncated.toFixed(decimals);
    }


    // ==========================================
    // PER DAY PRICE
    // ==========================================

    getPerDayPrice(car: any): number {

        const total =
            parseFloat(
                car?.fees?.rateTotalAmount || 0
            );


        const days =
            parseInt(
                car?.duration || 1,
                10
            );


        if (!days || days <= 0) {
            return total;
        }


        return total / days;
    }


    // ==========================================
    // TOGGLE EQUIPMENT
    // ==========================================

    toggleEquipment(eq: any): void {

        const key =
            (eq?.type || '') +
            '_' +
            (eq?.description || '');


        this.selectedEquipments[key] =
            !this.selectedEquipments[key];


        this.calculateAdditionalPayments();
    }


    // ==========================================
    // CHECK EQUIPMENT SELECTED
    // ==========================================

    isEquipmentSelected(eq: any): boolean {

        const key =
            (eq?.type || '') +
            '_' +
            (eq?.description || '');


        return !!this.selectedEquipments[key];
    }


    // ==========================================
    // CALCULATE ADDITIONAL PAYMENTS
    // ==========================================

    calculateAdditionalPayments(): void {

        this.additionalPaymentsTotal =
            (this.carRate?.pricedEquipments || [])

                .filter(
                    (eq: any) =>
                        this.isEquipmentSelected(eq)
                )

                .reduce(
                    (sum: number, eq: any) =>
                        sum +
                        parseFloat(eq?.amount || 0),
                    0
                );
    }


    // ==========================================
    // GRAND TOTAL
    // ==========================================

    getGrandTotal(
        getdetailsdataParam: any
    ): number {

        const pricePerDay =
            this.getPerDayPrice(
                getdetailsdataParam
            );


        const duration =
            Number(
                getdetailsdataParam?.duration
            ) || 0;


        const base =
            pricePerDay * duration;


        return base +
            (this.additionalPaymentsTotal || 0);
    }


    // ==========================================
    // NAVIGATE TO PAYMENT
    // ==========================================

    public navigateToPayment(): void {

        this.carService
            .setFareSummary(
                this.fareSummary
            );


        const basePrice =
            this.getGrandTotal(
                this.getdetailsdata
            );


        const finalData = {

            basePrice: basePrice,

            additionalPaymentsTotal:
                this.additionalPaymentsTotal,

            finalAmount:
                basePrice +
                this.additionalPaymentsTotal,

            duration:
                this.carDetails?.duartion,

            currency:
                this.carDetails?.currency ||
                'USD'
        };


        this.carService
            .setFinalCarAmount(
                finalData
            );


        this.router.navigate(
            ['/car-booking'],
            {
                queryParams: {

                    reference_id:
                        this.reference_id,

                    session_id:
                        this.session_id
                }
            }
        );
    }


    // ==========================================
    // GO BACK
    // ==========================================

    public goback(): void {

        history.back();
    }
}