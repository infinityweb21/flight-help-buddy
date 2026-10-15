import { Component, DestroyRef, ElementRef, Inject, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchService } from '../../../../services/search.service';
import { CruiseService } from '../../../../services/cruise/cruise.service';
import { TosterService } from '../../../../services/common/toaster.service';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { SharedService } from '../../../../services/shared/shared.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GooglePlacesAutocompleteDirective } from '../../../../directives/google-places-autocomplete.directive';
import { CountryISO, NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { FlatpickrDirective } from '../../../../directives/flatpickr.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FlightPaymentSkeletonComponent } from '../../../flights-list/skeleton/flight-payment-skeleton/flight-payment-skeleton.component';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-cruise-booking-payment',
    imports: [ReactiveFormsModule, RouterLink, Tooltip, NgxIntlTelInputModule, FlightPaymentSkeletonComponent, FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './cruise-booking-payment.component.html',
    styleUrl: './cruise-booking-payment.component.scss',
})
export class CruiseBookingPaymentComponent {
    @ViewChild('itineraryTop', { static: false }) itineraryTop!: ElementRef;

    private router: Router = inject(Router);
    private searchService = inject(SearchService);
    private cruiseService = inject(CruiseService);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private toasterService: TosterService = inject(TosterService);

    cruisesForm!: FormGroup;
    cruiseList: any[] = [];
    submitted: boolean = false;
    private shareService: SharedService = inject(SharedService);
    getData: any = '';
    markupPercentage: number = 10;

    loading = false;
    separateDialCode = false;

    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;

    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.UnitedKingdom
    ];

    selectedCountryISO: CountryISO = CountryISO.UnitedStates;
    billingFields = [
        {
            name: 'street',
            label: 'Street',
            placeholder: 'Local Address',
            type: 'input',
        },
        { name: 'City', label: 'City', placeholder: 'City', type: 'input' },
        { name: 'ZipCode', label: 'Zip', placeholder: 'Zip Code', type: 'input' },
        {
            name: 'State',
            label: 'State',
            type: 'input',
            placeholder: 'State',
        },
        {
            name: 'Country',
            label: 'Country',
            type: 'input',
            placeholder: 'Country',
        },
        {
            name: 'BillingPhoneNum',
            label: 'Contact Number',
            placeholder: 'Contact Number',
            type: 'input',
        },
        {
            name: 'billingemail',
            label: 'Email',
            placeholder: 'Email',
            type: 'input',
        }
    ];
    cruiseDetails: any = '';
    selectedCabin: any = '';
    getholedata: any = '';
    searchData: any = '';

    constructor(
        private fb: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.cruiseDetails = this.cruiseService.getTravelData();
        console.log("this.cruiseDetails", this.cruiseDetails)
        this.selectedCabin = this.cruiseService.getFareSummary();
        this.getholedata = this.cruiseService.getRepriceData();
        this.searchService.cruiseSearchData$.subscribe((searchData) => {
            console.log('Received cruise Data:', searchData);
            if (searchData) {
                this.searchData = searchData;
            } else {

            }
        });
        this.cruisesForm = this.fb.group({
            primaryInfo: this.fb.group({
                title: ['', Validators.required],
                first_name: ['', Validators.required],
                last_name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                phoneNumber: [undefined, Validators.required],
                address: ['', Validators.required]
            }),

            billingInfo: this.fb.group({
                CardNumber: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(15),
                        Validators.maxLength(16)
                    ]
                ],
                cardHolder: ['', Validators.required],
                ExpiryDate: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/)
                    ]
                ],
                CVV: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(4)
                    ]
                ],
                street: ['', Validators.required],
                City: ['', Validators.required],
                ZipCode: ['', Validators.required],
                State: ['', Validators.required],
                Country: ['', Validators.required],
                BillingPhoneNum: [undefined, Validators.required],
                billingemail: ['', [Validators.required, Validators.email]]
            }),

            travelers: this.fb.array([
                this.createTraveler()
            ])
        });
    }

    ngOnInit(): void {
        this.getData = this.shareService.getcompanyName();
    }


    get billingInfoGroup() {
        return this.cruisesForm.get('billingInfo') as FormGroup;
    }
    get primaryInfoGroup() {
        return this.cruisesForm.get('primaryInfo') as FormGroup;
    }

    get travelers(): FormArray {
        return this.cruisesForm.get('travelers') as FormArray;
    }

    private createTraveler(): FormGroup {
        return this.fb.group({
            type: ['', Validators.required],
            title: ['', Validators.required],
            fullName: ['', Validators.required],
            gender: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            citizenship: ['', Validators.required],
        });
    }

    addTraveler(): void {
        this.travelers.push(this.createTraveler());
    }

    removeTraveler(index: number): void {
        if (this.travelers.length > 1 && index !== 0) {
            this.travelers.removeAt(index);
        }
    }
    getControl(formGroup: AbstractControl, controlName: string): AbstractControl | null {
        return formGroup.get(controlName);
    }

    phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // Ensure value is an object and has nationalNumber
        if (value && typeof value === 'object' && value.number) {
            const digits = value.number.replace(/\D/g, ''); // remove non-digits
            const length = digits.length;

            if (length < 6 || length > 15) {
                return { invalidPhoneLength: true };
            }
        }

        return null;
    }

    getCardBrand(pan: string, includeSubTypes = false): string {
        const visaRegex = /^4[0-9]{0,}$/;
        const vprecaRegex = /^428485[0-9]{0,}$/;
        const postepayRegex = /^(402360|402361|403035|417631|529948)[0-9]{0,}$/;
        const cartasiRegex = /^(432917|432930|453998)[0-9]{0,}$/;
        const entropayRegex = /^(406742|410162|431380|459061|533844|522093)[0-9]{0,}$/;
        const o2moneyRegex = /^(422793|475743)[0-9]{0,}$/;

        const mastercardRegex = /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/;
        const maestroRegex = /^(5[06789]|6)[0-9]{0,}$/;
        const kukuruzaRegex = /^525477[0-9]{0,}$/;
        const yunacardRegex = /^541275[0-9]{0,}$/;

        const amexRegex = /^3[47][0-9]{0,}$/;
        const dinersRegex = /^3(?:0[0-5]|[689])[0-9]{0,}$/;
        const discoverRegex = /^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/;
        const jcbRegex = /^(?:2131|1800|35)[0-9]{0,}$/;

        if (jcbRegex.test(pan)) {
            return 'Jcb';
        }

        if (amexRegex.test(pan)) {
            return 'AX';
        }

        if (dinersRegex.test(pan)) {
            return 'Diners Club';
        }

        if (includeSubTypes) {
            if (vprecaRegex.test(pan)) return 'v-preca';
            if (postepayRegex.test(pan)) return 'postepay';
            if (cartasiRegex.test(pan)) return 'cartasi';
            if (entropayRegex.test(pan)) return 'entropay';
            if (o2moneyRegex.test(pan)) return 'o2money';
            if (kukuruzaRegex.test(pan)) return 'kukuruza';
            if (yunacardRegex.test(pan)) return 'yunacard';
        }

        if (visaRegex.test(pan)) {
            return 'VI';
        }

        if (mastercardRegex.test(pan)) {
            return 'CA';
        }

        if (discoverRegex.test(pan)) {
            return 'DS';
        }

        if (maestroRegex.test(pan)) {
            return pan.startsWith('5') ? 'CA' : 'Maestro';
        }

        return 'unknown';
    }

    onPlaceSelected(place: any) {
        console.log('Selected place:', place);

        if (place && place.formatted_address) {
            const formattedAddress = `${place.name}`;
            this.billingInfoGroup.get('street')?.setValue(formattedAddress);
            this.billingInfoGroup.get('street')?.markAsDirty();

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                console.log('Location coordinates:', { lat, lng });
            }

            // Extract address components
            const addressComponents = place.address_components;
            let city = '';
            let state = '';
            let country = '';
            let zipCode = '';

            addressComponents.forEach((component: any) => {
                const types = component.types;

                if (types.includes('locality')) {
                    city = component.long_name;
                }

                if (types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                }

                if (types.includes('country')) {
                    country = component.short_name;
                }

                if (types.includes('postal_code')) {
                    zipCode = component.long_name;
                }
            });

            // Patch form fields
            this.billingInfoGroup.patchValue({
                City: city,
                State: state,
                Country: country,
                ZipCode: zipCode
            });

            console.log({ city, state, country, zipCode });
        }
    }

    showAllItinerary: boolean = false;  // toggle state

    get visibleItinerary() {
        if (!this.cruiseDetails?.itinerary) return [];
        return this.showAllItinerary
            ? this.cruiseDetails.itinerary
            : this.cruiseDetails.itinerary.slice(0, 5); // only 5 items
    }
    showAllItinerarylist: boolean = false;

    get visibleItinerarylist() {
        if (!this.cruiseDetails?.itinerary) return [];
        return this.showAllItinerarylist
            ? this.cruiseDetails.itinerary
            : this.cruiseDetails.itinerary.slice(0, 2); // ✅ first 2 only
    }
    toggleItinerary() {
        if (!isPlatformBrowser(this.platformId)) {

            return;
        }
        this.showAllItinerarylist = !this.showAllItinerarylist;

        // ✅ Scroll up when collapsing
        if (!this.showAllItinerarylist && this.itineraryTop) {
            setTimeout(() => {
                this.itineraryTop.nativeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 10);
        }
    }

    onPlaceSelectedNation(place: any, index: number) {
        if (place?.address_components && Array.isArray(place.address_components)) {
            let countryCode = '';

            place.address_components.forEach((component: any) => {
                if (component.types.includes('country')) {
                    countryCode = component.short_name; // e.g., 'IN'
                }
            });

            console.log('Selected Country Code:', countryCode);

            const travelersArray = this.cruisesForm.get('travelers') as FormArray;
            const travelerGroup = travelersArray.at(index) as FormGroup;
            travelerGroup.get('citizenship')?.setValue(countryCode);
            travelerGroup.get('citizenship')?.markAsDirty();
            travelerGroup.get('citizenship')?.markAsTouched();
        }
    }

    save() {
        this.submitted = true;
        if (this.cruisesForm.valid) {
            const formValue = this.cruisesForm.value;
            const timestamp = Date.now().toString().slice(0, 10); // First 10 digits only
            const bookingId = 'CR' + timestamp;
            const travelersArray = this.travelers.value; // or formValue.travelers
            console.log("this.travelers.value", this.travelers.value)
            // Length of travelers
            const travelersLength = travelersArray.length;
            const payload = {
                paxDetails: travelersArray.map((traveler: { type: any; fullName: any; citizenship: any; }) => ({
                    paxType: traveler.type,
                    fullName: traveler.fullName,
                    residency: traveler.citizenship, // or use 'residency' if different
                })),
                // add other form data here if needed
            };
            const primary = this.primaryInfoGroup.value; // get primaryInfo values


            const finalpayload = {
                "session_id": this.cruiseDetails?.session_id,
                "cruise_id": this.cruiseDetails?.id,
                "booking_id": bookingId,
                "pax_count": travelersLength.toString(),
                "paxDetails": payload.paxDetails,
                "leadFirstname": primary.first_name,
                "leadLastname": primary.last_name,
                "email": primary.email,
                "mobile": primary.phoneNumber.number,
                "address": primary.address,
                "cabinCategory": [
                    this.selectedCabin?.cabinCategory
                ],
                "cabins": [
                    {
                        "category": this.selectedCabin?.cabinCategory,
                        "categoryCode": this.selectedCabin?.categoryCode,
                        "rateCode": this.selectedCabin?.rateCode,
                        "price": this.selectedCabin?.basePrice.toString()
                    }
                ]
            }
            console.log("payload", finalpayload);

            this.cruiseService.cruiseBook(finalpayload)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (res) => {
                        console.log("res", res);
                        this.savemain();
                    },
                    error: (err) => {
                        this.cruiseDetails = null;
                        this.toasterService.showError(
                            err.error.message || "Something went wrong while fetching cruise list!"
                        );
                    },
                });
        } else {
            this.cruisesForm.markAllAsTouched();
        }
    }

    savemain() {
        const timestamp = Date.now().toString().slice(0, 10); // First 10 digits only
        const bookingId = 'CR' + timestamp;
        const travelersArray = this.travelers.value; // or formValue.travelers
        console.log("this.travelers.value", this.travelers.value)
        // Length of travelers
        const travelersLength = travelersArray.length;
        const primary = this.primaryInfoGroup.value;
        const billing = this.billingInfoGroup.value;
        const passengers = {
            paxDetails: travelersArray.map((traveler: any) => ({
                type: traveler.type || '',
                title: traveler.title || '',
                name: traveler.fullName || '',
                gender: traveler.gender || '',
                dob: traveler.dateOfBirth || '',
                citizenship: traveler.citizenship || '',
            })),
            // add other form data here if needed
        };
        const customerinfo = {
            title: primary?.title || '',
            name: `${primary.first_name} ${primary.last_name}` || '',
            email: primary.email || '',
            phone: primary.phoneNumber.number || '',
            dob: '',
            customer_citizenship: '',
            gender: ''
        }
        const [expmonth, expyear] = billing?.ExpiryDate
            ? billing.ExpiryDate.split('/')
            : ['', ''];
        const cardinfo = {
            name_on_card: billing.cardHolder || '',
            card_no: billing.cardHolder || '',
            expmonth: expmonth || '',
            expyear: expyear || '',
            cvv: billing.CVV || '',
        }

        const billinginfo = {
            address: billing.street || '',
            address1: '',
            city: billing.City || '',
            state: billing.State || '',
            country: billing.Country || '',
            postal_code: billing.ZipCode || '',
        }
        const mainPayload = {
            lead_id: bookingId,
            cruisedata: this.getholedata,
            cruise_sailing_price_id: this.selectedCabin?.SailingPriceID,
            passengers: passengers?.paxDetails || [],
            customerinfo: customerinfo || '',
            cardinfo: cardinfo || '',
            billinginfo: billinginfo || ''
        }
        const cityzip = {
            destination: `${this.searchData?.departureCruises?.name}`,
            fromdate: this.searchData?.startDate,
            todate: this.searchData?.endDate,
            duration: `${this.cruiseDetails.duration} Days` || 0,
            no_of_adults: 0,
            no_of_child: 0,
            no_of_rooms: 0

        }

        const payload = {
            name: `${primary.first_name} ${primary.last_name}`,
            email: primary.email,
            phone: primary.phoneNumber.number,
            website: 'The infinity travel',
            city_zip: JSON.stringify(cityzip),
            booking_details: JSON.stringify(mainPayload),
            "paymentinfo": []
        }
        console.log("payloadeee", payload)
        this.cruiseService.cruiseBookLead(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    console.log("res", res);
                    this.toasterService.showSuccess("Booking cruise successful ");
                    this.router.navigate(['/thankyou'])

                },
                error: (err) => {
                    this.cruiseDetails = null;
                    this.toasterService.showError(
                        err.error.message || "Something went wrong while fetching cruise list!"
                    );
                },
            });
    }
}