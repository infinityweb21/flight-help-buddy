import { CommonModule, NgIf } from '@angular/common';
import {
    Component,
    DestroyRef,
    Inject,
    inject,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../../../../services/car/car.service';
import { TosterService } from '../../../../services/common/toaster.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-car-booking',
    imports: [DrawerModule, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './car-booking.component.html',
    styleUrl: './car-booking.component.scss'
})
export class CarBookingComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private carService = inject(CarService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);
    private shareService: SharedService = inject(SharedService);

    public webUrl: any = environment.WEB_URL;
    public bookingForm!: FormGroup;
    public isSubmitting: boolean = false;
    public getdetailsdata: any = '';

    public reference_id: string = '';
    public session_id: string = '';
    public fareSummary: any = '';
    public selectedCoverages: any[] = [];
    public selectedEquipments: any[] = [];

    public rentalDays: number = 1;
    public baseFarePerDay: number = 0;
    public baseFareTotal: number = 0;
    public grandTotal: number = 0;
    public finalPaymentAmount: any;

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
        this.fareSummary = this.carService.getFareSummary();
        this.finalPaymentAmount = this.carService.getFinalCarAmount();
        console.log('getdetailsdata', this.getdetailsdata);
        console.log('this.fareSummary', this.fareSummary);
    }

    ngOnInit() {
        this.initBookingForm();
        this.initializePricing();
    }

    public initBookingForm() {
        this.bookingForm = this.fb.group({
            cxname: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            altphone: [''],
            name_on_card: ['', Validators.required],
            card_number: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
            card_exp_month: ['', [Validators.required, Validators.maxLength(2)]],
            card_exp_year: ['', [Validators.required, Validators.maxLength(4)]],
            card_cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: [''],
            country: ['', Validators.required],
            postcode: ['', Validators.required]
        });
    }

    get f() { return this.bookingForm.controls; }

    public truncateAmount(value: any, decimals: number = 2): string {
        if (value == null) return '';
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        const factor = Math.pow(10, decimals);
        const truncated = Math.floor(num * factor) / factor;

        return truncated.toFixed(decimals);
    }

    public getPerDayPrice(car: any): number {
        const total = parseFloat(car?.fees?.rateTotalAmount || 0);
        const days = parseInt(car?.duration || 1, 10);
        if (!days || days <= 0) return total;
        return total / days;
    }

    getGrandTotal(getdetailsdataParam: any): number {
        let price = this.getPerDayPrice(getdetailsdataParam)
        const duration = Number(this.getdetailsdata?.duartion) || 0;
        const base = price * duration;
        // return base + (this.additionalPaymentsTotal || 0);
        return 0;
    }

    public calculateRentalDays(): number {
        const pickup = new Date(this.getdetailsdata?.pickup?.date + ' ' + this.getdetailsdata?.pickup?.time);
        const dropoff = new Date(this.getdetailsdata?.dropoff?.date + ' ' + this.getdetailsdata?.dropoff?.time);
        const diff = dropoff.getTime() - pickup.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 1;
    }

    public initializePricing() {
        const fees = this.getdetailsdata?.fees;
        const rateTotal = parseFloat(fees?.rateTotalAmount || 0);
        this.rentalDays = parseInt(this.getdetailsdata?.duration || '1', 10);
        this.baseFareTotal = rateTotal;
        this.baseFarePerDay = rateTotal / this.rentalDays;
        this.grandTotal = this.baseFareTotal;
    }

    public getDuration(): string {
        const pickup = this.getdetailsdata?.pickup;
        const dropoff = this.getdetailsdata?.dropoff;
        if (!pickup?.date || !pickup?.time || !dropoff?.date || !dropoff?.time) {
            return '';
        }
        const pickupDate = new Date(`${pickup.date} ${pickup.time}`);
        const dropoffDate = new Date(`${dropoff.date} ${dropoff.time}`);
        if (
            isNaN(pickupDate.getTime()) ||
            isNaN(dropoffDate.getTime())
        ) {
            return '';
        }
        const diffMs = dropoffDate.getTime() - pickupDate.getTime();
        if (diffMs < 0) {
            return '';
        }
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes = totalMinutes % 60;
        const result: string[] = [];
        if (days > 0) {
            result.push(`${days}days`);
        }
        if (hours > 0) {
            result.push(`${hours}hrs`);
        }
        if (minutes > 0) {
            result.push(`${minutes}mins`);
        }
        return result.join(' ');
    }

    public toggleItem(item: any, type: 'coverage' | 'equipment', event: any) {

        const amount = parseFloat(item.amount || 0);

        if (event.target.checked) {
            this.grandTotal += amount;

            if (type === 'coverage') {
                this.selectedCoverages.push(item);
            } else {
                this.selectedEquipments.push(item);
            }

        } else {
            this.grandTotal -= amount;

            if (type === 'coverage') {
                this.selectedCoverages =
                    this.selectedCoverages.filter(i => i !== item);
            } else {
                this.selectedEquipments =
                    this.selectedEquipments.filter(i => i !== item);
            }
        }
    }

    public onSubmit() {
        if (this.bookingForm.invalid) {
            this.bookingForm.markAllAsTouched();
            return;
        }
        this.isSubmitting = true;

        let payload = {
            type: "car",
            origin: this.getdetailsdata?.pickup?.locationName || "",
            destination: this.getdetailsdata?.dropoff?.locationName || "",
            fly_date: `${this.getdetailsdata?.pickup?.date} ${this.getdetailsdata?.pickup?.time}:00`,
            return_date: `${this.getdetailsdata?.dropoff?.date} ${this.getdetailsdata?.dropoff?.time}:00`,
            website_url: this.webUrl || '',
            website: "theinfinitytravel",
            cardata: JSON.stringify(this.getdetailsdata),
            ...this.bookingForm.value
        };
        this.carService.carBookLead(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ((res: any) => {
                    this.isSubmitting = false;
                    this.toasterService.showSuccess("Booking Car successful ");
                    this.router.navigate(['/thankyou'])
                }),
                error: ((err: any) => {
                    this.isSubmitting = false;
                    this.toasterService.showError(
                        err?.error?.message ||
                        'Something went wrong while fetching car details!'
                    );
                })
            });
    }
}