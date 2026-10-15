import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TosterService } from '../../../services/common/toaster.service';
import { FlightService } from '../../../services/flight/flight.service';
import { SearchService } from '../../../services/search.service';
import { SvgIcons } from '../../../shared/svg-icons';
import { NgFor, NgIf } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { SharedService } from '../../../services/shared/shared.service';
import { FlightsTabComponent } from "../../../components/main-filter/flights-tab/flights-tab.component";

@Component({
  selector: 'app-top-airlines-deals',
  imports: [
    ReactiveFormsModule,
    FlatpickrDirective,
    ClickOutsideDirective,
    NgFor,
    NgIf,
    AutoCompleteModule,
    FlightsTabComponent
],
  templateUrl: './top-airlines-deals.component.html',
  styleUrl: './top-airlines-deals.component.scss',
})
export class TopAirlinesDealsComponent implements OnInit {
  protected icons = inject(SvgIcons);
  private destroyRef: DestroyRef = inject(DestroyRef);

  inputValue: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;

  selectedAdults: number = 0;
  selectedChildren: number = 0;
  selectedInfants: number = 0;

  private router = inject(Router);
  private searchService = inject(SearchService);
 private shareService: SharedService = inject(SharedService);
    getData:any='';
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
  initialVisibleCount = 12;
  visibleCount = this.initialVisibleCount;

  flightForm: FormGroup;
  deals = [
    {
      name: 'Delta Air Lines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Award-Winning Global Service <br> Discounts to: Europe, Asia, and more',
    },
    {
      name: 'American Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'AAdvantage® Member Exclusives<br>Discounts to: Caribbean, Canada, Europe, and more',
    },
    {
      name: 'United Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Fly the Friendly Skies<br>Discounts to: Asia, Australia, Europe, and more',
    },
    {
      name: 'Alaska Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "West Coast's Favorite Airline<br>Discounts to: Hawaii, Mexico, Canada, and more",
    },
    {
      name: 'JetBlue Airways',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'More Legroom, More Comfort<br>Discounts to: Caribbean, Central America, U.S. Cities, and more',
    },
    {
      name: 'Southwest Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Bags Fly Free® <br>Discounts to: U.S. Cities, Mexico, Caribbean, and more',
    },
    {
      name: 'Hawaiian Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Authentic Hawaiian Hospitality <br>Discounts to: Hawaii, Asia, South Pacific, and more',
    },
    {
      name: 'Spirit Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Bare Fare™ Travel Deals <br>Discounts to: U.S. Cities, Latin America, Caribbean, and more',
    },
    {
      name: 'Allegiant Air',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Nonstop Flights. Budget Prices. <br>Discounts to Las Vegas, Florida, and Popular U.S. Cities',
    },
    {
      name: 'Frontier Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Low Fares Done Right <br>Discounts to: Major U.S. Cities and Vacation Hotspots',
    },
    {
      name: 'Avelo Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        'Affordable Nonstop Flights <br>Discounts to: West Coast, Florida, and More',
    },
    {
      name: 'Philippine Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "World's Best 4-star airline <br>Discounts to: Asia, Oceania and more",
    },
    {
      name: 'Philippine Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "World's Best 4-star airline <br>Discounts to: Asia, Oceania and more",
    },
    {
      name: 'Philippine Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "World's Best 4-star airline <br>Discounts to: Asia, Oceania and more",
    },
    {
      name: 'Philippine Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "World's Best 4-star airline <br>Discounts to: Asia, Oceania and more",
    },
    {
      name: 'Philippine Airlines',
      logo: 'assets/images/airline-list-icon/pr.svg',
      description:
        "World's Best 4-star airline <br>Discounts to: Asia, Oceania and more",
    },
  ];

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
    this.meta.updateTag({
      name: 'keywords',
      content:
        'airline deals 2025, flight discounts, best airline offers, cheap flights, airline promotions, flight savings',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: metaTitle || 'Best Airline Deals 2025 - Infinity Travel',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        metaDescription ||
        'Discover the best airline deals for 2025 and save on domestic and international flights.',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({
      name: 'twitter:title',
      content: metaTitle || 'Best Airline Deals 2025 - Infinity Travel',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        metaDescription ||
        'Discover the best airline deals for 2025 and save on domestic and international flights.',
    });

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

  showMore() {
    this.visibleCount += 4; // load 4 more each click (adjust as needed)
  }

  toggleShow() {
    if (this.visibleCount < this.deals.length) {
      this.visibleCount = this.deals.length; // Show all
    } else {
      this.visibleCount = this.initialVisibleCount; // Show less
    }
  }
}
