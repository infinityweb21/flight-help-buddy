import { ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, Inject, inject, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { CruiseService } from '../../../services/cruise/cruise.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TosterService } from '../../../services/common/toaster.service';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { isPlatformBrowser } from '@angular/common';
import { DeviceService } from '../../../services/shared/device.service';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
    selector: 'app-cruises-tab',
    imports: [FlatpickrDirective, ReactiveFormsModule, AutoCompleteModule],
    templateUrl: './cruises-tab.component.html',
    styleUrl: './cruises-tab.component.scss',
})
export class CruisesTabComponent {
    @Output() cruiseSubmittedForm = new EventEmitter<any>();
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private shareService: SharedService = inject(SharedService);
    @ViewChild(AutoComplete) autoComplete!: AutoComplete;
    @ViewChild('scrollContainer')
    scrollContainer!: ElementRef;
    private router = inject(Router);
    private searchService = inject(SearchService);
    private cruiseService = inject(CruiseService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);
    cruisesForm!: FormGroup;
    cruiseList: any[] = [];
    submitted: boolean = false;
    isBrowser: boolean = false;
    deviceReady = false;
    private deviceService = inject(DeviceService);
    isMobile: boolean = false;
    getData: any = "";

    constructor(
        private fb: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        if (this.isBrowser) {
            this.isMobile = window.innerWidth < 992
        }
        this.cruisesForm = this.fb.group(
            {
                departureCruises: ['', Validators.required],
                startDate: ['', Validators.required],
                endDate: ['', Validators.required]
            },
            {
                validators: this.checkDates.bind(this)
            }
        );

        this.searchService.cruiseSearchData$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(data => {
                if (!data) return;
                this.patchFromValue(data);
            });
    }

    ngOnInit(): void {
        if (this.isBrowser) {
            this.deviceService.isMobile$
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((status) => {
                    this.isMobile = status;
                    this.deviceReady = true;
                    this.cdr.markForCheck(); // only if OnPush
                });
            this.getData = this.shareService.getcompanyName();
        }
    }

    get f() { return this.cruisesForm.controls; }

    checkDates(formGroup: FormGroup) {
        const startDate = formGroup.get('startDate')?.value;
        const endDate = formGroup.get('endDate')?.value;
        if (!startDate || !endDate) {
            return null;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            return {
                dateInvalid: true
            };
        }
        return null;
    }

    loadAllCruises() {
        this.filtercruise('')
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
                                image: 'assets/images/cruise/port.png'
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
                                image: 'assets/images/port.png'
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
                        err.error.message || 'Something went wrong while fetching cruise list!'
                    );
                }
            });
    }

    submitForm() {
        this.submitted = true;
        if (this.cruisesForm.valid) {
            const formValue = this.cruisesForm.value;


            // const payload = this.buildFlightPayload();

            this.searchService.setSearchCruiseData(formValue);
            this.router.navigate(['/cruises-list']);
            // send to API
        } else {
            this.cruisesForm.markAllAsTouched();
        }

    }

    public scrollToSection(section: HTMLElement | any) {
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

    public patchFromValue(params: any) {
        if (!params || !this.cruisesForm) {
            return;
        }

        const departureCruiseName = params?.departureCruises;
        const startDate = params?.startDate;
        const endDate = params?.endDate;

        this.cruisesForm.patchValue({
            departureCruises: departureCruiseName,
            startDate: startDate,
            endDate: endDate
        });

        setTimeout(() => {
            const startInput = document.getElementById(
                'cruiseStartDate'
            ) as HTMLInputElement;

            const endInput = document.getElementById(
                'cruiseEndDate'
            ) as HTMLInputElement;

            if (startInput) {
                startInput.value = startDate;
            }

            if (endInput) {
                endInput.value = endDate;
            }
        }, 100);
    }
}