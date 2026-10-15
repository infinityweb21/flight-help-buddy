import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Inject,
    inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewChild
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { FlatpickrDirective } from '../../directives/flatpickr.directive';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SliderModule } from 'primeng/slider';
import { SharedService } from '../../services/shared/shared.service';
import { CarService } from '../../services/car/car.service';
import { TosterService } from '../../services/common/toaster.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MapModule } from '../../core/map/map.module';
import { CarTabComponent } from '../../components/main-filter/car-tab/car-tab.component';
import { HotelListSkeletonComponent } from '../hotels-list/skeleton/hotel-list-skeleton/hotel-list-skeleton.component';
import { PaginatorState, Paginator } from 'primeng/paginator';

declare var $: any;
@Component({
    selector: 'app-car-list',
    imports: [
        DrawerModule,
        FormsModule,
        ReactiveFormsModule,
        SliderModule,
        HotelListSkeletonComponent,
        AutoCompleteModule,
        CommonModule,
        MapModule,
        CarTabComponent,
        Paginator,
        SelectModule],
    templateUrl: './car-list.component.html',
    styleUrl: './car-list.component.scss'
})

export class CarListComponent implements OnInit, OnDestroy {
    @ViewChild('drawerRef') drawerRef!: Drawer;
    private readonly router = inject(Router);
    private readonly searchService = inject(SearchService);
    private readonly carService = inject(CarService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly toasterService = inject(TosterService);
    private readonly shareService = inject(SharedService);
    private readonly cdr = inject(ChangeDetectorRef);
    public isSkeleton = false;
    public isdialogopen = false;
    public isMobileSearchVisible = false;
    public carList: any[] = [];
    public originalCarList: any[] = [];
    public filteredCarList: any[] = [];
    public paginatedCarList: any[] = [];
    public sessionId = '';
    public carSearchData: any;
    public selectedTab = 'recommended';
    public sortBy: 'recommended' | 'price_low' | 'price_high' = 'recommended';
    public sortOptions: { label: string; value: 'recommended' | 'price_low' | 'price_high' }[] = [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Price (Low to High)', value: 'price_low' },
        { label: 'Price (High to Low)', value: 'price_high' },
    ];
    public first = 0;
    public rows = 10;
    public rowsPerPageOptions = [10, 20, 50];
    public minPrice = 0;
    public maxPrice = 0;
    public selectedMinPrice = 0;
    public selectedMaxPrice = 0;
    public rangeLeft = 0;
    public rangeWidth = 0;
    public carNameSearch = '';
    public selectedBrands: string[] = [];
    public selectedVendors: string[] = [];
    public selectedCarTypes: string[] = [];
    public selectedFuelTypes: string[] = [];
    public selectedTransmissions: string[] = [];
    public selectedSeats: string[] = [];
    public selectedRatings: number[] = [];
    public brandOptions: string[] = [];
    public vendorOptions: string[] = [];
    public carTypeOptions: string[] = [];
    public fuelOptions: string[] = [];
    public transmissionOptions: string[] = [];
    public seatOptions: string[] = [];
    public ratingOptions: number[] = [];
    public showAllBrands = false;
    public showAllVendors = false;
    public showAllCarTypes = false;
    public showAllFuel = false;
    public showAllTransmissions = false;
    public showAllSeats = false;
    public showAllRatings = false;
    public defaultLat = 0;
    public defaultLng = 0;
    public getData: any = '';
     currentYear: number = new Date().getFullYear();
    constructor(
        @Inject(PLATFORM_ID) private readonly platformId: object
    ) {
        this.getData = this.shareService.getcompanyName();
    }

    ngOnInit() {
        this.searchService.carSearchData$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((searchData) => {
                if (!searchData) return;
                this.carSearchData = searchData;
                this.getCar(searchData);
            });
    }

    public getCar(payload: any) {
        this.isSkeleton = true;
        this.carList = [];
        this.originalCarList = [];
        this.filteredCarList = [];
        this.paginatedCarList = [];
        this.first = 0;
        this.carService
            .getcarList(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: any) => {
                    const cars: any[] = res?.data?.data ?? [];
                    this.sessionId = res?.data?.sessionId ?? '';
                    if (!cars.length) {
                        this.isSkeleton = false;
                        this.cdr.detectChanges();
                        return;
                    }
                    this.carList = cars;
                    this.originalCarList = [...cars];
                    const latlng = cars[0]?.pickup?.latlng;
                    if (latlng) {
                        const [lat, lng] = latlng.split(',').map(Number);
                        this.defaultLat = lat;
                        this.defaultLng = lng;
                    }
                    this.buildFilterOptions();
                    this.initPriceRange();
                    this.applyFilters();
                    this.isSkeleton = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.isSkeleton = false;
                    this.carList = [];
                    this.originalCarList = [];
                    this.filteredCarList = [];
                    this.paginatedCarList = [];
                    this.toasterService.showError(
                        err?.error?.message || 'Something went wrong while fetching car list!'
                    );
                    this.cdr.detectChanges();
                },
            });
    }

    private buildFilterOptions() {
        const list = this.originalCarList;
        this.brandOptions = this.uniqueValues(list.map((car) => this.getBrand(car)));
        this.vendorOptions = this.uniqueValues(list.map((car) => car?.vendor?.name));
        this.carTypeOptions = this.uniqueValues(list.map((car) => car?.carDetails?.sizeName));
        this.fuelOptions = this.uniqueValues(list.map((car) => car?.carDetails?.fuelType));
        this.transmissionOptions = this.uniqueValues(
            list.map((car) => car?.carDetails?.transmissionType)
        );
        this.seatOptions = this.uniqueValues(list.map((car) => this.getSeatLabel(car)));
        this.ratingOptions = Array.from(
            new Set(list.map((car) => this.getRating(car)).filter((rating) => rating > 0))
        ).sort((a, b) => b - a);
    }

    public onSortChange(): void {
        this.first = 0;
        this.applyFilters();
    }

    private uniqueValues(values: any[]): string[] {
        return Array.from(
            new Set(
                values
                    .filter((v) => v !== null && v !== undefined && `${v}`.trim() !== '')
                    .map((v) => `${v}`.trim())
            )
        ).sort((a, b) => a.localeCompare(b));
    }

    private getBrand(car: any): string {
        const source = car?.carDetails?.CarFleet?.CarName || car?.carDetails?.carModel || '';
        return `${source}`.trim().split(' ')[0] || '';
    }

    private getSeatLabel(car: any): string {
        const quantity = car?.carDetails?.passengerQuantity;
        return quantity ? `${quantity} Seater` : '';
    }

    private getRating(car: any): number {
        return Math.round(Number(car?.vendor?.reviewsOverall) || 0);
    }

    public getPerDayPrice(car: any): number {
        const total = parseFloat(car?.fees?.rateTotalAmount || 0);
        const days = parseInt(car?.duration || 1, 10);
        if (!days || days <= 0) return total;
        return total / days;
    }

    public getCarImages(car: any): string[] {
        const details = car?.carDetails ?? {};
        const images = [details.carImageHD, details.carImage, details.CarFleet?.PictureURL].filter(
            (image): image is string => !!image
        );
        const uniqueImages = Array.from(new Set(images));
        return uniqueImages.length ? uniqueImages : ['assets/images/car-placeholder.png'];
    }

    public hasAc(car: any): boolean {
        const ac = car?.carDetails?.ac ?? car?.carDetails?.CarFleet?.AirConditionInd;
        return ac === true || ac === 'true';
    }

    private initPriceRange() {
        const prices = this.originalCarList
            .map((car) => this.getPerDayPrice(car))
            .filter((price) => Number.isFinite(price) && price > 0);
        if (!prices.length) {
            this.minPrice = 0;
            this.maxPrice = 0;
        } else {
            this.minPrice = Math.floor(Math.min(...prices));
            this.maxPrice = Math.ceil(Math.max(...prices));
        }
        if (this.maxPrice <= this.minPrice) {
            this.maxPrice = this.minPrice + 1;
        }
        this.selectedMinPrice = this.minPrice;
        this.selectedMaxPrice = this.maxPrice;
        this.updateCarRange();
    }

    public updateCarRange() {
        if (this.selectedMinPrice > this.selectedMaxPrice) {
            this.selectedMinPrice = this.selectedMaxPrice;
        }
        const span = this.maxPrice - this.minPrice || 1;
        this.rangeLeft = ((this.selectedMinPrice - this.minPrice) / span) * 100;
        const maxPercent = ((this.selectedMaxPrice - this.minPrice) / span) * 100;
        this.rangeWidth = Math.max(maxPercent - this.rangeLeft, 0);
        this.applyFilters();
    }

    private toggleValue(target: any[], value: any, checked: boolean) {
        const index = target.indexOf(value);
        if (checked && index === -1) target.push(value);
        else if (!checked && index > -1) target.splice(index, 1);
    }

    public onBrandToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedBrands, value, checked);
        this.applyFilters();
    }

    public onVendorToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedVendors, value, checked);
        this.applyFilters();
    }

    public onCarTypeToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedCarTypes, value, checked);
        this.applyFilters();
    }

    public onFuelToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedFuelTypes, value, checked);
        this.applyFilters();
    }

    public onTransmissionToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedTransmissions, value, checked);
        this.applyFilters();
    }

    public onSeatToggle(value: string, checked: boolean) {
        this.toggleValue(this.selectedSeats, value, checked);
        this.applyFilters();
    }

    public onRatingToggle(value: number, checked: boolean) {
        this.toggleValue(this.selectedRatings, value, checked);
        this.applyFilters();
    }

    public clearAllFilters() {
        this.carNameSearch = '';
        this.selectedBrands = [];
        this.selectedVendors = [];
        this.selectedCarTypes = [];
        this.selectedFuelTypes = [];
        this.selectedTransmissions = [];
        this.selectedSeats = [];
        this.selectedRatings = [];
        this.selectedMinPrice = this.minPrice;
        this.selectedMaxPrice = this.maxPrice;
        this.sortBy = 'recommended';
        this.first = 0;
        this.updateCarRange();
    }

    private sortCars(list: any[]): any[] {
        const sorted = [...list];
        switch (this.sortBy) {
            case 'price_low':
                sorted.sort((a, b) => this.getPerDayPrice(a) - this.getPerDayPrice(b));
                break;
            case 'price_high':
                sorted.sort((a, b) => this.getPerDayPrice(b) - this.getPerDayPrice(a));
                break;
            default:
                break;
        }
        return sorted;
    }

    public applyFilters() {
        const nameQuery = this.carNameSearch.trim().toLowerCase();
        const result = this.originalCarList.filter((car) => {
            const details = car?.carDetails ?? {};
            const vendor = car?.vendor ?? {};
            if (nameQuery) {
                const model = `${details.carModel || details.CarFleet?.CarName || ''}`.toLowerCase();
                if (!model.includes(nameQuery)) return false;
            }
            if (this.selectedBrands.length && !this.selectedBrands.includes(this.getBrand(car))) {
                return false;
            }
            if (this.selectedVendors.length && !this.selectedVendors.includes(vendor.name)) {
                return false;
            }
            if (this.selectedCarTypes.length && !this.selectedCarTypes.includes(details.sizeName)) {
                return false;
            }
            if (this.selectedFuelTypes.length && !this.selectedFuelTypes.includes(details.fuelType)) {
                return false;
            }
            if (
                this.selectedTransmissions.length &&
                !this.selectedTransmissions.includes(details.transmissionType)
            ) {
                return false;
            }
            if (this.selectedSeats.length && !this.selectedSeats.includes(this.getSeatLabel(car))) {
                return false;
            }
            if (this.selectedRatings.length && !this.selectedRatings.includes(this.getRating(car))) {
                return false;
            }
            const pricePerDay = this.getPerDayPrice(car);
            if (pricePerDay < this.selectedMinPrice || pricePerDay > this.selectedMaxPrice) {
                return false;
            }
            return true;
        });
        this.filteredCarList = this.sortCars(result);
        this.first = 0;
        this.updatePaginatedList();
    }

    private updatePaginatedList() {
        const start = this.first;
        const end = start + this.rows;
        this.paginatedCarList = this.filteredCarList.slice(start, end);
        this.scheduleCarouselInit();
    }

    public onPageChange(event: PaginatorState) {
        this.first = event.first ?? 0;
        this.rows = event.rows ?? this.rows;
        this.updatePaginatedList();
    }

    private scheduleCarouselInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        requestAnimationFrame(() => this.initCarCarousel());
    }

    private initCarCarousel() {
        if (!isPlatformBrowser(this.platformId)) return;
        const carousels = $('.car-image-carousel');
        if (!carousels.length) return;
        carousels.each((index: number, element: HTMLElement) => {
            const carousel = $(element);
            if (carousel.hasClass('owl-loaded')) {
                carousel.trigger('destroy.owl.carousel');
            }
            carousel.owlCarousel({
                items: 1,
                loop: false,
                margin: 0,
                nav: true,
                dots: false,
                autoplay: false,
                smartSpeed: 200,
                navText: [
                    '<span class="room-nav-btn prev">&#10094;</span>',
                    '<span class="room-nav-btn next">&#10095;</span>',
                ],
            });
        });
    }

    public navigateToDetails(car: any) {
        this.carService.setRepriceData(car);
        this.router.navigate(['/car-details'], {
            queryParams: {
                reference_id: car?.referenceId,
                session_id: this.sessionId,
            },
        });
    }

    public closeCallback(event: any) {
        this.drawerRef.close(event);
    }

    public selectTab(tab: string) {
        this.selectedTab = tab;
    }

    public onEditClick() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.toggleDrawerScroll(true);
        this.isMobileSearchVisible = false;
        this.isdialogopen = true;
        document.body.classList.remove('dialog-open');
    }

    public onCloseClick() {
        this.isMobileSearchVisible = true;
        this.isdialogopen = false;
        this.toggleDrawerScroll(false);
    }

    public onMaskClick() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.isMobileSearchVisible = true;
        this.isdialogopen = false;
        document.body.classList.remove('dialog-open');
    }

    private toggleDrawerScroll(lock: boolean) {
        if (!isPlatformBrowser(this.platformId)) return;
        const html = document.documentElement;
        const body = document.body;
        if (lock) {
            html.classList.add('overflow-hidden');
            body.classList.add('overflow-hidden');
        } else {
            html.classList.remove('overflow-hidden');
            body.classList.remove('overflow-hidden');
        }
    }

    truncateAmount(value: any, decimals: number = 2): string {
        if (value == null) return '';
        const num = parseFloat(value);
        if (isNaN(num)) return '';
        const factor = Math.pow(10, decimals);
        const truncated = Math.floor(num * factor) / factor;
        return truncated.toFixed(decimals);
    }

    ngOnDestroy() {
        if (!isPlatformBrowser(this.platformId)) return;
        const carousels = $('.car-image-carousel');
        if (!carousels.length) return;
        carousels.each((index: number, element: HTMLElement) => {
            const carousel = $(element);
            if (carousel.hasClass('owl-loaded')) {
                carousel.trigger('destroy.owl.carousel');
            }
        });
    }
}