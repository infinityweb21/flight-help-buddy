import {
    Component,
    DestroyRef,
    inject,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    Inject,
    PLATFORM_ID
} from '@angular/core';
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
import { FlatpickrDirective } from '../../directives/flatpickr.directive';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SliderModule } from 'primeng/slider';
import { SharedService } from '../../services/shared/shared.service';
import { CruiseService } from '../../services/cruise/cruise.service';
import { TosterService } from '../../services/common/toaster.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MapModule } from '../../core/map/map.module';
import { QueryFormComponent } from '../query-form/query-form.component';
import { CruisesTabComponent } from "../../components/main-filter/cruises-tab/cruises-tab.component";
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';

declare var $: any;

@Component({
    selector: 'app-cruises-list',
    imports: [
        DrawerModule,
        FormsModule,
        ReactiveFormsModule,
        FlatpickrDirective,
        SliderModule,
        AutoCompleteModule,
        CommonModule,
        MapModule,
        SliderModule,
        QueryFormComponent,
        CruisesTabComponent,
        PaginatorModule,
        SelectModule
    ],
    templateUrl: './cruises-list.component.html',
    styleUrl: './cruises-list.component.scss',
})

export class CruisesListComponent implements AfterViewInit, OnDestroy {
    @ViewChild('drawerRef') drawerRef!: Drawer;
    @ViewChild(AutoComplete) autoComplete!: AutoComplete;
    private router: Router = inject(Router);
    private searchService = inject(SearchService);
    private cruiseService = inject(CruiseService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);

    public cruisesForm!: FormGroup;
    public cruiseList: any[] = [];
    public submitted: boolean = false;
    public filterForm!: FormGroup;
    public filtervisible: boolean = false;
    public showGuestDropdown: boolean = false;
    lowestPrice: number = 0;
    highestPrice: number = 1000000;
    defaultLat: number = 0;
    defaultLng: number = 0;
    cruiseDetailsList: any[] = [];
    filteredCruiseDetailsList: any[] = [];
    filteredResults: any[] = [];
    uniqueCruiseLines: string[] = [];
    uniqueDeparturePorts: string[] = [];
    uniqueDestinations: string[] = [];
    uniqueDurations: number[] = [];
    public cruiseSearchData: any;
    public first: number = 0;
    public rows: number = 20;
    public totalRecords: number = 0;
    public currentPage: number = 1;
    public isBrowser: boolean = false;
    private shareService: SharedService = inject(SharedService);
    getData: any = '';
    markupPercentage: number = 10;
    isMobileSearchVisible: any;
    isdialogopen: any;
    public sortByFilterOption: any[] = [
        { name: 'Price Low-High', value: 'low-high' },
        { name: 'Price High-Low', value: 'high-low' },
    ];
    public selectedSortbyOption: any | undefined;
currentYear: number = new Date().getFullYear();
    constructor(
        private fb: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.cruisesForm = this.fb.group({
            departureCruises: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
        }, {
            validators: this.checkDates
        });
        this.filterForm = new FormGroup({
            durations: new FormControl<number[]>([]),
            departurePorts: new FormControl<string[]>([]),
        });
    }

    ngOnInit(): void {
        this.getData = this.shareService.getcompanyName();
        this.searchService.cruiseSearchData$.subscribe((searchData) => {
            if (searchData) {
                this.cruisesForm.patchValue({
                    departureCruises: searchData?.departureCruises,
                    startDate: searchData?.startDate,
                    endDate: searchData?.endDate
                });
                const payload = this.sendPayload();
                this.getCruise(payload);
                this.cruiseSearchData = searchData;
            }
        });
    }

    ngOnDestroy(): void {
        if (typeof window === 'undefined') {
            return;
        }
        const $ = (window as any).$;
        if (!$ || !$.fn?.owlCarousel) {
            return;
        }
        const slider = $('.cruise-carousel-unique');
        if (
            slider.length &&
            slider.hasClass('owl-loaded')
        ) {
            slider.trigger('destroy.owl.carousel');
        }
    }

    ngAfterViewInit(): void {
        if (typeof window === 'undefined') {
            return;
        }
        this.initCruiseSlider();
    }

    private initCruiseSlider(): void {
        if (typeof window === 'undefined') {
            return;
        }
        const initialize = () => {
            const $ = (window as any).$;
            if (!$ || !$.fn) {
                requestAnimationFrame(initialize);
                return;
            }
            if (!$.fn.owlCarousel) {
                requestAnimationFrame(initialize);
                return;
            }
            const slider = $('.cruise-carousel-unique');
            if (!slider.length) {
                requestAnimationFrame(initialize);
                return;
            }
            if (slider.hasClass('owl-loaded')) {
                return;
            }
            slider.owlCarousel({
                items: 1,
                loop: true,
                margin: 5,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 1500,
                autoplayHoverPause: true,
                smartSpeed: 150,
                slideTransition: 'linear',
                mouseDrag: true,
                touchDrag: true,
                pullDrag: false,
                freeDrag: false,
                checkVisibility: false
            });
        };
        requestAnimationFrame(() => {
            requestAnimationFrame(initialize);
        });
    }

    get f() {
        return this.cruisesForm.controls;
    }

    checkDates(group: AbstractControl): ValidationErrors | null {
        const checkIn = group.get('startDate')?.value;
        const checkOut = group.get('endDate')?.value;
        if (checkIn && checkOut) {
            const startDate = new Date(checkIn);
            const endDate = new Date(checkOut);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            if (endDate < startDate) {
                return {
                    checkOutBeforeCheckIn: true
                };
            }
        }
        return null;
    }

    loadAllCruises() {
        this.filtercruise('');
    }

    filtercruise(event: any): void {
        const query = event.query.toLowerCase() || '';
        this.cruiseService.cruiseLinelList(query)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    this.cruiseList = res.data.map((cruise: any) => {
                        if (cruise.flag === 'cruise_line') {
                            return {
                                type: 'Cruise Line',
                                name: cruise?.cruise_sailing_name,
                                cruise_type: cruise?.cruise_type,
                                referenceid: cruise?.referenceid,
                                flag: cruise?.flag,
                                image: 'assets/images/cruise/line.png'
                            };
                        } else if (cruise.flag === 'cruise_port') {
                            return {
                                type: 'Cruise Port',
                                portId: cruise?.portId,
                                portCode: cruise?.portCode,
                                name: cruise?.portName,
                                referenceid: cruise?.referenceid,
                                flag: cruise?.flag,
                                image: 'assets/images/cruise/port.png'
                            };
                        } else {
                            return {
                                type: 'Unknown',
                                referenceid: cruise?.referenceid,
                                flag: cruise?.flag,
                                image: 'assets/images/default-cruise.png'
                            };
                        }
                    });
                    setTimeout(() => {
                        this.autoComplete.show();
                    });
                },
                error: (err) => {
                    this.cruiseList = [];
                    this.toasterService.showError(
                        err.error.message ||
                        'Something went wrong while fetching cruise list!'
                    );
                }
            });
    }

    sendPayload() {
        const formValue = this.cruisesForm.value;
        const selectedCruise = formValue?.departureCruises;
        const formatDate = (date: any) => {
            if (!date) return '';
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };
        let destinationPortIds: string[] = [];
        let cruiseLines: string[] = [];
        if (selectedCruise?.flag === 'cruise_port') {
            destinationPortIds = [selectedCruise?.portCode];
            cruiseLines = ['ALL'];
        } else if (selectedCruise?.flag === 'cruise_line') {
            destinationPortIds = ['ALL'];
            cruiseLines = [selectedCruise?.referenceid];
        } else {
            destinationPortIds = ['ALL'];
            cruiseLines = ['ALL'];
        }
        const payload = {
            startDate: formatDate(formValue?.startDate),
            endDate: formatDate(formValue?.endDate),
            fromNights: '',
            toNights: '',
            destinationPortIds: destinationPortIds,
            cruiseLines: cruiseLines,
            cruiseShipsIds: ['ALL'],
            embarkationPortsIds: ['ALL'],
            portOfCallIds: ['ALL'],
            NumberOfCabin: '',
            marketingCode: '',
            vendorSailingIdentifier: '',
            fromPrice: 0,
            toPrice: 9999999,
            searchType: 'cruiseOnly'
        };
        return payload;
    }

    getCruise(payload: any) {
        this.cruiseDetailsList = [];

        this.cruiseService
            .getCruiseList(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    if (res?.data?.length) {
                        this.markupPercentage = 10;

                        this.cruiseDetailsList = res.data.map((cruise: any) => {
                            const duration = parseInt(cruise.Duration) || 1;

                            const sailingPrices = cruise.sailing_prices || [];

                            if (!sailingPrices.length) {
                                return null;
                            }

                            // Find lowest price
                            const lowestPriceEntry = sailingPrices.reduce(
                                (prev: any, current: any) =>
                                    parseFloat(prev.AdultFare) <
                                        parseFloat(current.AdultFare)
                                        ? prev
                                        : current
                            );

                            const lowestPrice =
                                parseFloat(lowestPriceEntry.AdultFare) || 0;

                            const priceWithMarkup =
                                lowestPrice *
                                (1 + this.markupPercentage / 100);

                            const lowestPricePerNight =
                                lowestPrice / duration;

                            const priceWithMarkupPerNight =
                                priceWithMarkup / duration;

                            // Cabin-wise lowest prices
                            const cabinPrices: any = {};

                            sailingPrices.forEach((price: any) => {
                                const fare = parseFloat(price.AdultFare) || 0;
                                const category = price.CabinCategory;

                                if (
                                    !cabinPrices[category] ||
                                    fare < cabinPrices[category].basePrice
                                ) {
                                    const basePrice = fare;

                                    const basePricePerNight =
                                        basePrice / duration;

                                    const priceWithMarkup =
                                        basePrice *
                                        (1 + this.markupPercentage / 100);

                                    const priceWithMarkupPerNight =
                                        priceWithMarkup / duration;

                                    cabinPrices[category] = {
                                        basePrice,
                                        basePricePerNight,
                                        priceWithMarkup,
                                        priceWithMarkupPerNight,
                                        categoryCode: price.CategoryCode
                                    };
                                }
                            });

                            // Itinerary
                            const itineraryDetails =
                                cruise.Itinerary_DayNumber
                                    ? cruise.Itinerary_DayNumber
                                        .split(",")
                                        .map(
                                            (
                                                day: string,
                                                index: number
                                            ) => ({
                                                dayNumber: day,
                                                portId:
                                                    cruise.Itinerary_PortID
                                                        ?.split(",")[index],
                                                description:
                                                    cruise.Itinerary_Description
                                                        ? cruise.Itinerary_Description[index]
                                                        : "",
                                                arrivalTime:
                                                    cruise.Itinerary_ArrivalTime
                                                        ?.split(",")[index],
                                                departureTime:
                                                    cruise.Itinerary_DepartureTime
                                                        ?.split(",")[index]
                                            })
                                        )
                                    : [];

                            // IMPORTANT: return the object from map()
                            return {
                                id: cruise.id,
                                session_id: cruise.session_id,

                                departureDate:
                                    cruise.DepartureDate,

                                departurePortCode:
                                    cruise.DeparturePortCode,

                                departurePortID:
                                    cruise.DeparturePortID,

                                duration,

                                returnPortCode:
                                    cruise.ReturnPortCode,

                                returnPortID:
                                    cruise.ReturnPortID,

                                sailingID:
                                    cruise.SailingID,

                                sailingPlanCode:
                                    cruise.SailingPlanCode,

                                shipName:
                                    cruise.ShipName,

                                cruiseSailingName:
                                    cruise.cruise_sailing_name,

                                image:
                                    cruise.shipData?.shipInfo?.ImagePath,

                                lowestPrice,

                                priceWithMarkup,

                                lowestPricePerNight,

                                priceWithMarkupPerNight,

                                cabinPrices,

                                ports: {
                                    departurePortInfo:
                                        cruise.ports?.DeparturePortInfo,

                                    returnPortInfo:
                                        cruise.ports?.ReturnPortInfo
                                },

                                itinerary: itineraryDetails
                            };
                        });

                        // Remove null entries from cruises without sailing prices
                        this.cruiseDetailsList =
                            this.cruiseDetailsList.filter(
                                (cruise: any) => cruise !== null
                            );

                        this.totalRecords =
                            this.cruiseDetailsList.length;

                        this.first = 0;

                        this.updatePagination();
                        this.computeFilterOptions();
                        this.applyFilters();
                    } else {
                        this.toasterService.showError(
                            "No cruise found"
                        );

                        this.cruiseDetailsList = [];
                        this.totalRecords = 0;
                        this.filteredCruiseDetailsList = [];
                        this.first = 0;
                    }
                },

                error: (err) => {
                    this.cruiseDetailsList = [];
                    this.totalRecords = 0;
                    this.filteredCruiseDetailsList = [];
                    this.first = 0;

                    this.toasterService.showError(
                        err?.error?.message ||
                        "Something went wrong while fetching cruise list!"
                    );
                }
            });
    }

    getTotalPrice(
        ccMax: number,
        markup: number = 10
    ): number {
        return ccMax + (ccMax * markup / 100);
    }

    private computeFilterOptions(): void {
        this.uniqueCruiseLines = Array.from(new Set(
            this.cruiseDetailsList.map((cruise) => cruise.cruiseSailingName).filter(Boolean)
        ));
        this.uniqueDeparturePorts = Array.from(new Set(
            this.cruiseDetailsList.map((cruise) => cruise.ports?.departurePortInfo?.Name).filter(Boolean)
        ));
        this.uniqueDestinations = Array.from(new Set(
            this.cruiseDetailsList.map((cruise) => cruise.ports?.departurePortInfo?.portInfo?.Description).filter(Boolean)
        ));
        this.uniqueDurations = Array.from(new Set(
            this.cruiseDetailsList.map((cruise) => cruise.duration)
        )).sort((a, b) => a - b);
        const prices = this.cruiseDetailsList.map((cruise) => cruise.priceWithMarkup);
        this.lowestPrice = prices.length ? Math.min(...prices) : 0;
        this.highestPrice = prices.length ? Math.max(...prices) : 1000000;
    }

    onFilterCheckboxChange(controlName: string, value: any, event: Event): void {
        const control = this.filterForm.get(controlName);
        const current: any[] = control?.value || [];
        const checked = (event.target as HTMLInputElement).checked;
        if (checked) {
            control?.setValue([...current, value]);
        } else {
            control?.setValue(current.filter((item) => item !== value));
        }
        this.applyFilters();
    }

    applyFilters() {
        const {
            durations,
            departurePorts,
        } = this.filterForm.value;

        this.filteredResults = this.cruiseDetailsList.filter((cruise) => {
            if (durations?.length && !durations.includes(cruise.duration)) return false;
            if (departurePorts?.length && !departurePorts.includes(cruise.ports?.departurePortInfo?.Name)) return false;

            return true;
        });

        this.applySort();
        this.totalRecords = this.filteredResults.length;
        this.first = 0;
        this.updatePagination();
    }

    applySort(): void {
        const sortValue = this.selectedSortbyOption?.value;
        if (sortValue === 'low-high') {
            this.filteredResults.sort((a, b) => a.priceWithMarkupPerNight - b.priceWithMarkupPerNight);
        } else if (sortValue === 'high-low') {
            this.filteredResults.sort((a, b) => b.priceWithMarkupPerNight - a.priceWithMarkupPerNight);
        }
    }

    onSortChange(): void {
        this.applySort();
        this.first = 0;
        this.updatePagination();
    }

    clearFilters() {
        this.filterForm.reset({
            durations: [],
            departurePorts: [],
        });
        this.applyFilters();
    }

    submitForm() {
        this.submitted = true;
        if (this.cruisesForm.valid) {
            const formValue = this.cruisesForm.value;
            this.searchService.setSearchCruiseData(
                formValue
            );
            const payload = this.sendPayload();
        } else {
            this.cruisesForm.markAllAsTouched();
        }
    }

    navigateToDetails(cruise: any) {
        this.router.navigate(
            ['/cruise-details'],
            {
                queryParams: {
                    id: cruise?.id,
                    session_id:
                        cruise?.session_id
                }
            }
        );
    }

    closeCallback(e: any): void {
        this.drawerRef.close(e);
    }

    get totalAvailableCruise() {
        return this.totalRecords;
    }

    private updatePagination(): void {
        this.filteredCruiseDetailsList = this.filteredResults.slice(this.first, this.first + this.rows);
    }

    public onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this.currentPage = event.page + 1;
        this.updatePagination();
        if (this.isBrowser) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}