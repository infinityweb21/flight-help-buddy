import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Output,
    ViewChild,
    OnInit,
    ElementRef,
    Inject,
    PLATFORM_ID
} from '@angular/core';

import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { TosterService } from '../../../services/common/toaster.service';
import { AutoComplete, AutoCompleteModule } from "primeng/autocomplete";
import { CarService } from '../../../services/car/car.service';
import { API_PROVIDERS } from './searchdata';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { isPlatformBrowser } from '@angular/common';
import { DeviceService } from '../../../services/shared/device.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-car-tab',
    standalone: true,
    imports: [ReactiveFormsModule, AutoCompleteModule, FlatpickrDirective],
    templateUrl: './car-tab.component.html',
    styleUrl: './car-tab.component.scss'
})

export class CarTabComponent implements OnInit {

    @Output() carSubmittedForm = new EventEmitter<any>();

    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    private searchService = inject(SearchService);
    private toasterService = inject(TosterService);
    private destroyRef = inject(DestroyRef);
    private carService = inject(CarService);

    @ViewChild('arrivalAC') arrivalAutoComplete!: AutoComplete;
    @ViewChild('departureAC') DepartAutoComplete!: AutoComplete;

    carForm!: FormGroup;
    locationList: any[] = [];
    submitted = false;
    staticdata: any = '';
    isBrowser: boolean = false;
    @ViewChild('scrollContainer')
    scrollContainer!: ElementRef;
    deviceReady = false;
    private deviceService = inject(DeviceService);
    isMobile: boolean = false;

    constructor(
        private fb: FormBuilder, 
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.isBrowser) {
            this.isMobile = window.innerWidth < 992
        }
        this.carForm = this.fb.group(
            {
                pickupLocation: ['', Validators.required],
                dropoffLocation: ['', Validators.required],
                pickup_datetime: ['', Validators.required],
                dropoff_datetime: ['', Validators.required],
                driver_age: ['', [Validators.required]]

            },
            { validators: this.validateDateTime }
        );
    }

    ngOnInit(): void {
        this.patchSavedSearchData();
        if (this.isBrowser) {
            this.deviceService.isMobile$
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((status) => {
                    this.isMobile = status;
                    this.deviceReady = true;
                    this.cdr.markForCheck(); // only if OnPush
                });
        }
    }

    get f() {
        return this.carForm.controls;
    }

    /* ============================= */
    /* ✅ PATCH SAVED SEARCH DATA */
    /* ============================= */

    patchSavedSearchData(): void {

        // ✅ 1. Try live BehaviorSubject
        let savedData = this.searchService.getCurrentCarData();

        // ✅ 2. Fallback to localStorage
        if (!savedData) {
            savedData = this.searchService.getCarFromStorage();
        }

        if (!savedData) return;


        const pickupDatetime =
            savedData.pickup_date && savedData.pickup_time
                ? `${savedData.pickup_date} ${savedData.pickup_time}`
                : null;

        const dropoffDatetime =
            savedData.dropoff_date && savedData.dropoff_time
                ? `${savedData.dropoff_date} ${savedData.dropoff_time}`
                : null;

        this.carForm.patchValue({
            pickupLocation: this.mapLocation(savedData.pickup_id),
            dropoffLocation: this.mapLocation(savedData.dropoff_id),
            pickup_datetime: pickupDatetime,
            dropoff_datetime: dropoffDatetime,
            driver_age: savedData.driver_age || '25'
        });

        // ✅ Important for PrimeNG + Flatpickr
        this.cdr.detectChanges();
    }

    mapLocation(id: any) {
        if (!id) return null;

        const loc = API_PROVIDERS.find(x => x.id == id);
        if (!loc) return null;

        return {
            name: loc.location_name,
            code: loc.location_code,
            address: loc.address,
            city: loc.city,
            country: loc.country_code,
            latitude: loc.latitude,
            longitude: loc.longitude,
            referenceid: loc.id,
            image: 'assets/images/location.png'
        };
    }

    /* ============================= */
    /* ✅ VALIDATION */
    /* ============================= */

    validateDateTime(group: AbstractControl): ValidationErrors | null {
        const pickup = group.get('pickup_datetime')?.value;
        const dropoff = group.get('dropoff_datetime')?.value;

        if (pickup && dropoff) {
            const start = new Date(pickup);
            const end = new Date(dropoff);

            if (end <= start) {
                return { invalidDropoffDateTime: true };
            }
        }

        return null;
    }

    /* ============================= */
    /* ✅ AUTOCOMPLETE FILTER */
    /* ============================= */

    filterLocation(event: any): void {

        const query = event.query?.toLowerCase()?.trim();
        if (query.length < 3 && query.length !== 0) {
            return;
        }
        if (!query) {
            this.locationList = [];
            return;
        }

        this.staticdata = API_PROVIDERS;

        this.locationList = this.staticdata
            .filter((loc: any) =>
                loc.location_name?.toLowerCase().includes(query) ||
                loc.city?.toLowerCase().includes(query) ||
                loc.location_code?.toLowerCase().includes(query)
            )
            .map((loc: any) => ({
                name: loc.location_name,
                code: loc.location_code,
                address: loc.address,
                city: loc.city,
                country: loc.country_code,
                latitude: loc.latitude,
                longitude: loc.longitude,
                referenceid: loc.id,
                airport_code: loc.airport_code,
                image: 'assets/images/caricon.png',
            }));
    }
    departureError: string = "";
    arrivalError: string = "";
    departSubmit: boolean = false;
    arriveSubmit: boolean = false;
    onDepartSelected(event: any) {
        const selectedDepart = event?.value;
        if (!selectedDepart) return;
        // this.processDepartSelection(selectedDepart);
    }

    processDepartSelection(selectedDepart: any) {
        const dropoffLocation = this.carForm.get("dropoffLocation")?.value;
        const control = this.carForm.get("pickupLocation");

        control?.markAsTouched();

        if (dropoffLocation && dropoffLocation.name === selectedDepart.name) {
            control?.reset();
            control?.setErrors({ sameAirport: true });
            this.departureError = "Pickup & dropoff location cannot be the same.";
            this.arriveSubmit = true;
            this.carForm.get("pickupLocation")?.markAsTouched();
            this.carForm.get("dropoffLocation")?.markAsTouched();
        } else {
            control?.setErrors(null);
            control?.setValue(selectedDepart);
            this.arrivalError = "";
            this.arriveSubmit = false;
        }

        this.cdr.detectChanges();
    }
    onArrivalSelected(event: any) {
        const selectedArrival = event?.value;
        if (!selectedArrival) return;
        // this.processArrivalSelection(selectedArrival);
    }



    processArrivalSelection(selectedArrival: any) {
        const pickupLocation = this.carForm.get("pickupLocation")?.value;
        const control = this.carForm.get("dropoffLocation");
        control?.markAsTouched();

        if (pickupLocation && pickupLocation.name === selectedArrival.name) {
            control?.reset();
            control?.setErrors({ sameAirport: true });
            this.arrivalError = "Pickup & dropoff location cannot be the same.";
            this.arriveSubmit = true;
            this.carForm.get("pickupLocation")?.markAsTouched();
            this.carForm.get("dropoffLocation")?.markAsTouched();
        } else {
            control?.setErrors(null);
            control?.setValue(selectedArrival);
            this.arrivalError = "";
            this.arriveSubmit = false;
        }

        this.cdr.detectChanges();
    }

    /* ============================= */
    /* ✅ INPUT RESTRICTIONS */
    /* ============================= */

    allowOnlyLetters(event: KeyboardEvent) {
        const char = event.key;
        const allowedPattern = /^[A-Za-z\s-]+$/;

        if (!allowedPattern.test(char)) {
            event.preventDefault();
        }
    }

    sanitizePaste(event: ClipboardEvent) {
        event.preventDefault();

        const clipboardData = event.clipboardData ?? (window as any).clipboardData;
        const pastedText = clipboardData?.getData('text') ?? '';
        const cleanedText = pastedText.replace(/[^A-Za-z\s-]/g, '');
        const target = event.target as HTMLInputElement;

        const start = target.selectionStart ?? 0;
        const end = target.selectionEnd ?? 0;

        target.value =
            target.value.substring(0, start) +
            cleanedText +
            target.value.substring(end);

        target.dispatchEvent(new Event('input', { bubbles: true }));
    }

    checkDepartOpen() {
        const control = this.carForm.get("pickupLocation")?.value;

        // Case 1 → Selected airport object
        if (control && control.displayName && control.displayName.trim() !== "") {
            this.openDepartSuggestions();
            return;
        }
    }
    openDepartSuggestions() {
        setTimeout(() => {
            if (this.DepartAutoComplete) {
                this.DepartAutoComplete.show();
                const controlValue = this.carForm.get("pickupLocation")?.value;

                if (controlValue.name != "") {
                    this.carForm.get("pickupLocation")?.setValue(controlValue);
                    this.filterLocation({
                        query: controlValue.name || "",

                    });
                } else {
                    this.filterLocation({ query: "" });
                }
            }
        }, 0);
    }
    checkArrivalOpen() {
        const control = this.carForm.get("dropoffLocation")?.value;

        // Case 1 → Selected airport object
        if (control && control.displayName && control.displayName.trim() !== "") {
            this.openArrivalSuggestions();
            return;
        }
    }

    openArrivalSuggestions() {
        setTimeout(() => {
            if (this.arrivalAutoComplete) {
                this.arrivalAutoComplete.show();
                const controlValue = this.carForm.get("dropoffLocation")?.value;

                if (controlValue.name != "") {
                    this.carForm.get("dropoffLocation")?.setValue(controlValue);
                    this.filterLocation({
                        query: controlValue.name || "",

                    });
                } else {
                    this.filterLocation({ query: "" });
                }
            }
        }, 0);
    }

    textHighlightedPickup = false;
    clickedOncePickup = false;

    highlightPickupText(event: any) {
        const input = event.target as HTMLInputElement;
        if (input && input.value) {
            setTimeout(() => {
                input.select(); // highlight full text
                this.textHighlightedPickup = true;
                this.clickedOncePickup = false; // reset click tracker
            });
        }
    }

    handlePickupClick(event: MouseEvent) {
        const input = event.target as HTMLInputElement;
        const control = this.carForm.get("pickupLocation");

        // Highlighted → clicking clears
        if (this.textHighlightedPickup) {
            control?.setValue("");
            this.textHighlightedPickup = false;
            this.clickedOncePickup = false;

            setTimeout(() => input.focus(), 0);
            return;
        }

        this.clickedOncePickup = false;
    }

    clearPickupIfHighlightedOnKey(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;
        const control = this.carForm.get("pickupLocation");
        if (!input || !control || !input.value) return;

        const isAllSelected =
            input.selectionStart === 0 && input.selectionEnd === input.value.length;

        if (isAllSelected) {
            const key = event.key;
            const isTextOnly = /^[a-zA-Z\s]$/.test(key);
            event.preventDefault();

            // Clear old value
            control.setValue("");

            // Insert typed key
            if (key.length === 1 && isTextOnly) {
                control.setValue(key);
            }

            this.textHighlightedPickup = false;
            this.clickedOncePickup = false;

            setTimeout(() => input.focus(), 0);
        }
    }

    textHighlightedArrival = false;
    clickedOnceArrival = false;

    highlightArrivalText(event: any) {
        const input = event.target as HTMLInputElement;
        if (input && input.value) {
            setTimeout(() => {
                input.select(); // highlight full text
                this.textHighlightedArrival = true;
                this.clickedOnceArrival = false; // reset click tracker
            });
        }
    }

    handleArrivalClick(event: MouseEvent) {
        const input = event.target as HTMLInputElement;
        const control = this.carForm.get("dropoffLocation");

        // Highlighted → clicking clears
        if (this.textHighlightedArrival) {
            control?.setValue("");
            this.textHighlightedArrival = false;
            this.clickedOnceArrival = false;

            setTimeout(() => input.focus(), 0);
            return;
        }

        this.clickedOnceArrival = false;
    }




    clearArrivalIfHighlightedOnKey(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;
        const control = this.carForm.get("dropoffLocation");
        if (!input || !control || !input.value) return;

        const isAllSelected =
            input.selectionStart === 0 && input.selectionEnd === input.value.length;

        if (isAllSelected) {
            const key = event.key;
            const isTextOnly = /^[a-zA-Z\s]$/.test(key);
            event.preventDefault();

            // Clear old value
            control.setValue("");

            // Insert typed key
            if (key.length === 1 && isTextOnly) {
                control.setValue(key);
            }

            this.textHighlightedArrival = false;
            this.clickedOnceArrival = false;

            setTimeout(() => input.focus(), 0);
        }
    }

    /* ============================= */
    /* ✅ SUBMIT FORM */
    /* ============================= */

    submitForm(): void {
        this.submitted = true;

        if (this.carForm.valid) {
            const v = this.carForm.value;

            const pickupDate = new Date(v.pickup_datetime);
            const dropoffDate = new Date(v.dropoff_datetime);

            const payload = {
                pickup_id: v.pickupLocation?.referenceid,
                dropoff_id: v.dropoffLocation?.referenceid,

                pickup_date: pickupDate.toISOString().split('T')[0],
                pickup_time: pickupDate.toTimeString().slice(0, 5),

                dropoff_date: dropoffDate.toISOString().split('T')[0],
                dropoff_time: dropoffDate.toTimeString().slice(0, 5),

                driver_age: v.driver_age || '25',
                country_res: v.pickupLocation?.country || 'IN',
                currency: 'USD',
                language: 'EN-US'
            };


            this.searchService.setSearchCarData(payload);
            this.carSubmittedForm.emit(payload);

            this.router.navigate(['/car-list']);
        } else {
            this.carForm.markAllAsTouched();

            if (this.carForm.errors?.['invalidDropoffDateTime']) {
                this.toasterService.showError(
                    'Dropoff date must be after pickup date'
                );
            }
        }
    }

    scrollToSection(section: HTMLElement): void {
        if (!this.isBrowser) {
            return;
        }
        if (this.isMobile) {
            return;
        }


        const topOffset = 180;

        const startPosition = window.scrollY;
        const targetPosition =
            section.getBoundingClientRect().top +
            window.scrollY -
            topOffset;

        const distance = targetPosition - startPosition;
        const duration = 300; // increase for slower scroll

        let startTime: number | null = null;

        const animation = (currentTime: number) => {
            if (!startTime) startTime = currentTime;

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            // ease-in-out effect
            const ease =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            window.scrollTo({
                top: startPosition + distance * ease
            });

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);

    }
}