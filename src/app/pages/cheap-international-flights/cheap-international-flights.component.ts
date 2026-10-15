import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute,Router, RouterLink } from '@angular/router';
import { TosterService } from '../../services/common/toaster.service';
import { FlightService } from '../../services/flight/flight.service';
import { SearchService } from '../../services/search.service';
import { SharedService } from '../../services/shared/shared.service';
import { SvgIcons } from '../../shared/svg-icons';
import { NgFor, NgIf } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FlatpickrDirective } from '../../directives/flatpickr.directive';
import { FlightsTabComponent } from "../../components/main-filter/flights-tab/flights-tab.component";

@Component({
  selector: 'app-cheap-international-flights',
  imports: [ReactiveFormsModule,
    FlatpickrDirective,
    ClickOutsideDirective,
    NgFor,
    NgIf,
    AutoCompleteModule, RouterLink, FlightsTabComponent],
  templateUrl: './cheap-international-flights.component.html',
  styleUrl: './cheap-international-flights.component.scss'
})
export class CheapInternationalFlightsComponent {
protected icons = inject(SvgIcons);
  private destroyRef: DestroyRef = inject(DestroyRef);
   private shareService: SharedService = inject(SharedService);
    getData:any='';

  inputValue: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;
  phoneNumber= this.shareService.getcompanyName().phoneNumber;
  selectedAdults: number = 0;
  selectedChildren: number = 0;
  selectedInfants: number = 0;

  private router = inject(Router);
  private searchService = inject(SearchService);

  selectedCabin = { name: 'Economy', value: 'E' };
  departureAirports: any[] = [];
  arrivalAirports: any[] = [];
  allAirports: any[] = [];
  submitted: boolean = false;
  cabinOptions = [
    { name: 'Economy', value: 'E' },
    { name: 'First', value: 'F' },
    { name: 'Business', value: 'B' },
    { name: 'Premium Economy', value: 'P' },
  ];

  adultsList = Array.from({ length: 9 }, (_, i) => i + 1);
  childrenList = Array.from({ length: 8 }, (_, i) => i + 1);
  infantsList = Array.from({ length: 5 }, (_, i) => i);

  flightForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private toasterService: TosterService,
    private meta: Meta,
    private title: Title,
    private route: ActivatedRoute
  ) {
    this.flightForm = this.fb.group({
      tripType: ['roundtrip'],
      departureAirport: [''],
      arrivalAirport: [''],
      departureDate: [''],
      arrivalDate: [''],
      directFlightsOnly: [false],
      passengers: this.fb.group({
        adults: [this.selectedAdults],
        children: [this.selectedChildren],
        infants: [this.selectedInfants],
        cabin: ['E'],
      }),
      multiCitySegments: this.fb.array([]),
    });
    this.handleTripTypeValidation();
    this.updateInput();
  }

  ngOnInit(): void {
          this.getData=this.shareService.getcompanyName();

    // Set meta tags
    const metaTitle = this.route.snapshot.data['metaTitle'];
    const metaDescription = this.route.snapshot.data['metaDescription'];

    // Set title
    if (metaTitle) {
      this.title.setTitle(metaTitle);
    }

    // Set meta description
    if (metaDescription) {
      this.meta.updateTag({ name: 'description', content: metaDescription });
    }

    // Set additional meta tags for better SEO
    this.meta.updateTag({ name: 'keywords', content: 'business class flights, discounted business class, premium travel, international flights, luxury flights' });
    this.meta.updateTag({ property: 'og:title', content: metaTitle || 'Business Class Flights' });
    this.meta.updateTag({ property: 'og:description', content: metaDescription || 'Find discounted business class flights with premium comfort and service.' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: metaTitle || 'Business Class Flights' });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription || 'Find discounted business class flights with premium comfort and service.' });

    // Replace this with real data from an API if needed
    this.allAirports = [
      { name: 'Los Angeles International Airport (LAX)' },
      { name: 'John F. Kennedy International Airport (JFK)' },
      { name: 'Heathrow Airport (LHR)' },
      { name: 'Dubai International Airport (DXB)' },
      { name: 'Tokyo Haneda Airport (HND)' },
    ];
  }
  private handleTripTypeValidation() {
    const controls = this.flightForm.controls;

    this.flightForm
      .get('tripType')
      ?.valueChanges.subscribe((tripType: string) => {
        this.clearValidators();

        if (tripType === 'oneway') {
          controls['departureAirport'].setValidators(Validators.required);
          controls['arrivalAirport'].setValidators(Validators.required);
          controls['departureDate'].setValidators(Validators.required);
          this.passengersGroup.setValidators(Validators.required);
          this.clearSegments();
        } else if (tripType === 'roundtrip') {
          controls['departureAirport'].setValidators(Validators.required);
          controls['arrivalAirport'].setValidators(Validators.required);
          controls['departureDate'].setValidators(Validators.required);
          controls['arrivalDate'].setValidators(Validators.required);
          this.passengersGroup.setValidators(Validators.required);
          this.clearSegments();
        } else if (tripType === 'multicity') {
          // Set required initially
          this.multiCitySegments.setValidators(Validators.required);

          // Add 1 segment if empty
          if (this.multiCitySegments.length === 0) {
          }

          // Watch for changes and remove validation after at least one is added
          this.multiCitySegments.clearValidators();
          this.multiCitySegments.updateValueAndValidity({ emitEvent: false });
        }

        // Refresh form control validation
        Object.values(controls).forEach((ctrl) => {
          ctrl.updateValueAndValidity({ emitEvent: false });
        });

        this.passengersGroup.updateValueAndValidity();
        this.multiCitySegments.updateValueAndValidity();
      });

    // ✅ Force emit to trigger logic initially
    const tripType = this.flightForm.get('tripType')?.value;
    if (tripType) {
      this.flightForm.get('tripType')?.setValue(tripType);
    }
  }

  private clearValidators() {
    const controls = this.flightForm.controls;

    controls['departureAirport'].clearValidators();
    controls['arrivalAirport'].clearValidators();
    controls['departureDate'].clearValidators();
    controls['arrivalDate'].clearValidators();
    this.passengersGroup.clearValidators();
    this.multiCitySegments.clearValidators();
  }
  filterCountry(event: any): void {
    const query = event.query.toLowerCase();

    this.flightService
      .airportlList(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.departureAirports = res.data.map((airport: any) => ({
            displayName: `${airport.city} - ${airport.country}`,
            code: airport.airport_code,
            city: airport.city,
            airport_name: airport.airport_name,
            country: airport.country, // keep full object if needed later
          }));
        },
        error: (err) => {
          this.toasterService.showError(
            err.error.message ||
              'Something went wrong while fetching data!'
          );
        },
      });
  }
  onDepartureSelect(selected: any) {
    this.flightForm.get('departureAirport')?.setValue(selected.code); // store only 'CCU'
  }
  compareCabins = (c1: any, c2: any) => c1?.value === c2?.value;

  get multiCitySegments(): FormArray {
    return this.flightForm.get('multiCitySegments') as FormArray;
  }

  get passengersGroup(): FormGroup {
    return this.flightForm.get('passengers') as FormGroup;
  }
  onDatesSelected(event: { departure: string; arrival?: string }) {
    this.flightForm.get('departureDate')?.setValue(event.departure);
    this.flightForm.get('arrivalDate')?.setValue(event.arrival || '');
  }

  onMultiCityDateSelected(event: { departure: string }, index: number): void {
    const segmentGroup = this.multiCitySegments.at(index) as FormGroup;
    segmentGroup.get('departureDate')?.setValue(event.departure);
  }

  addSegment(): void {
    const segmentGroup = new FormGroup({
      departure: new FormControl(''),
      arrival: new FormControl(''),
      departureDate: new FormControl(''),
    });

    this.multiCitySegments.push(segmentGroup);

    // Optional: force validation re-evaluation
    this.multiCitySegments.updateValueAndValidity({ emitEvent: true });
  }

  removeSegment(index: number): void {
    this.multiCitySegments.removeAt(index);
  }

  clearSegments(): void {
    this.multiCitySegments.clear();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  selectPassenger(
    type: 'adult' | 'child' | 'infant',
    count: number,
    event: Event
  ) {
    event.stopPropagation();
          // Prevent infants > adults
  if (type === 'infant' && count > this.selectedAdults) {
    this.toasterService.showError('Infant count cannot be greater than adult count');
    return; // ❌ stop execution
  }
    // Rule 2: Prevent total (adults + children) > 9
  let futureAdults = this.selectedAdults;
  let futureChildren = this.selectedChildren;

  if (type === 'adult') {
    futureAdults = count;
  } else if (type === 'child') {
    futureChildren = count;
  }

  if (futureAdults + futureChildren > 9) {
    this.toasterService.showError('Total passengers (Adults + Children) cannot exceed 9');
    return; // ❌ stop execution
  }
    if (type === 'adult') {
      this.selectedAdults = count;
      this.passengersGroup.get('adults')?.setValue(count);
    } else if (type === 'child') {
      this.selectedChildren = count;
      this.passengersGroup.get('children')?.setValue(count);
    } else if (type === 'infant') {
      this.selectedInfants = count;
      this.passengersGroup.get('infants')?.setValue(count);
    }
    this.updateInput();
  }

  updateInput() {
    const total =
      this.selectedAdults + this.selectedChildren + this.selectedInfants;

    const selectedCabin = this.passengersGroup.get('cabin')?.value;
    this.selectedCabin = selectedCabin;

    // Find the cabin name from the cabinOptions
    const cabinName =
      this.cabinOptions.find((option) => option.value === selectedCabin)
        ?.name || '';

    this.inputValue = `${total} Passenger${
      total !== 1 ? 's' : ''
    } ${cabinName}`;
  }

  closeDropdown() {
    this.showDropdown = false;
  }
  switchAirports() {
    const departure = this.flightForm.get('departureAirport')?.value;
    const arrival = this.flightForm.get('arrivalAirport')?.value;

    this.flightForm.patchValue({
      departureAirport: arrival,
      arrivalAirport: departure,
    });
  }
  get f() {
    return this.flightForm.controls;
  }
  buildFlightPayload(): any {
    const formValue = this.flightForm.value;
    const passengers = formValue.passengers;
    console.log('passengers', passengers);

    const tripType = formValue.tripType;
    console.log('tripType', tripType);
    const payload: any = {
      CurrencyCode: 'USD',
      NoOfAdults: passengers.adults,
      NoOfInfants: passengers.infants,
      NoOfChildren: passengers.children,
      tripType: tripType,
      source: 'mondee',
      returnDate: '',
      OriginDestination: [],
    };

    const formatDate = (date: string) => {
      if (!date) return '';
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}/${String(
        d.getMonth() + 1
      ).padStart(2, '0')}/${d.getFullYear()}`;
    };

    if (tripType === 'oneway') {
      payload.OriginDestination.push({
        DepartureTime: formValue.departureDate,
        DepartureLocationCode: formValue.departureAirport,
        ArrivalLocationCode: formValue.arrivalAirport,
        CabinClass: passengers.cabin,
      });
    } else if (tripType === 'roundtrip') {
      payload.OriginDestination.push(
        {
          DepartureTime: formValue.departureDate,
          DepartureLocationCode: formValue.departureAirport,
          ArrivalLocationCode: formValue.arrivalAirport,
          CabinClass: passengers.cabin,
        },
        {
          DepartureTime: formValue.arrivalDate,
          DepartureLocationCode: formValue.arrivalAirport,
          ArrivalLocationCode: formValue.departureAirport,
          CabinClass: passengers.cabin,
        }
      );
      payload.returnDate = formValue.arrivalDate;
    } else if (tripType === 'multicity') {
      // 🥇 First Segment from main form fields
      payload.OriginDestination.push({
        DepartureTime: formValue.departureDate,
        DepartureLocationCode: formValue.departureAirport,
        ArrivalLocationCode: formValue.arrivalAirport,
        CabinClass: passengers.cabin,
      });

      // ➕ Remaining Segments from multiCitySegments
      this.multiCitySegments.controls.forEach((segment: any) => {
        const segValue = segment.value;

        payload.OriginDestination.push({
          DepartureTime: segValue.departureDate,
          DepartureLocationCode: segValue.departure,
          ArrivalLocationCode: segValue.arrival,
          CabinClass: passengers.cabin,
        });
      });
    }

    return payload;
  }

  searchFlights() {
    this.submitted = true;
    if (this.flightForm.valid) {
      const payload = this.buildFlightPayload();
      console.warn('Final Payload:', payload);
      this.searchService.setSearchData(payload);
      console.log('this.flightForm.value', this.flightForm.value);
      this.router.navigate(['/flights-list']);
      // send to API
    } else {
      this.flightForm.markAllAsTouched();
    }
  }
}
