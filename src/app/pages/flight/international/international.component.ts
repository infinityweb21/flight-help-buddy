import { Component, DestroyRef, inject } from '@angular/core';
import { SvgIcons } from '../../../shared/svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TosterService } from '../../../services/common/toaster.service';
import { FlightService } from '../../../services/flight/flight.service';
import { SearchService } from '../../../services/search.service';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { NgFor, NgIf } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { Meta, Title } from '@angular/platform-browser';
import { SharedService } from '../../../services/shared/shared.service';
import { AppCurrencyPipe } from '../../../pipes/app-currency.pipe';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';

@Component({
  selector: 'app-international',
  imports: [
    ReactiveFormsModule,
MainFilterComponent,
    AutoCompleteModule,
  ],
  templateUrl: './international.component.html',
  styleUrl: './international.component.scss',
})
export class InternationalComponent {
  protected icons = inject(SvgIcons);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private shareService: SharedService = inject(SharedService);
  getData: any = '';

  inputValue: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;

  selectedAdults: number = 1;
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
    this.getData = this.shareService.getcompanyName();
    // Replace this with real data from an API if needed
    this.allAirports = [
      { name: 'Los Angeles International Airport (LAX)' },
      { name: 'John F. Kennedy International Airport (JFK)' },
      { name: 'Heathrow Airport (LHR)' },
      { name: 'Dubai International Airport (DXB)' },
      { name: 'Tokyo Haneda Airport (HND)' },
    ];
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
  }

  flightDestinations = {
    asia: [
      {
        displayName: 'Los Angeles (LAX) → Tokyo (NRT/HND)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/seoul-(ICN).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Seoul (ICN)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SEOUL - KOREA REPUBLIC OF',
          code: 'ICN',
          city: 'SEOUL',
          airport_name: 'INCHEON INTERNATIONAL - SEOUL',
          country: 'KOREA REPUBLIC OF',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/seoul3-(ICN).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
      },
      {
        displayName: 'San Francisco (SFO) → Seoul (ICN)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SEOUL - KOREA REPUBLIC OF',
          code: 'ICN',
          city: 'SEOUL',
          airport_name: 'INCHEON INTERNATIONAL - SEOUL',
          country: 'KOREA REPUBLIC OF',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Beijing-(PEK).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
      },
      {
        displayName: 'San Francisco (SFO) → Beijing (PEK)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BEIJING - CHINA',
          code: 'PEK',
          city: 'BEIJING',
          airport_name: 'CAPITAL INTL - BEIJING',
          country: 'CHINA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Shanghai-(PVG).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
      },
      {
        displayName: 'San Francisco (SFO) → Shanghai (PVG)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SHANGHAI - CHINA',
          code: 'PVG',
          city: 'SHANGHAI',
          airport_name: 'PUDONG INTL - SHANGHAI',
          country: 'CHINA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
      },
      {
        displayName: 'New York (JFK/EWR) → Tokyo (NRT/HND)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
      },
      {
        displayName: 'New York (JFK/EWR) → Seoul (ICN)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SEOUL - KOREA REPUBLIC OF',
          code: 'ICN',
          city: 'SEOUL',
          airport_name: 'INCHEON INTERNATIONAL - SEOUL',
          country: 'KOREA REPUBLIC OF',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/seoul-(ICN).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
      },
      {
        displayName: 'New York (JFK/EWR) → Singapore (SIN)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SINGAPORE - SINGAPORE',
          code: 'SIN',
          city: 'SINGAPORE',
          airport_name: 'CHANGI - SINGAPORE',
          country: 'SINGAPORE',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/Singapore-(SIN).webp',
      },
      {
        displayName: 'New York (JFK/EWR) → Hong Kong (HKG)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'HONG KONG - HONG KONG -SAR OF CHINA-',
          code: 'HKG',
          city: 'HONG KONG',
          airport_name: 'INTERNATIONAL - HONG KONG',
          country: 'HONG KONG -SAR OF CHINA-',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Hong-Kong-(HKG).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
      },
      {
        displayName: 'Chicago (ORD) → Tokyo (NRT/HND)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
      },
      {
        displayName: 'Chicago (ORD) → Seoul (ICN)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SEOUL - KOREA REPUBLIC OF',
          code: 'ICN',
          city: 'SEOUL',
          airport_name: 'INCHEON INTERNATIONAL - SEOUL',
          country: 'KOREA REPUBLIC OF',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/seoul-(ICN).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
      },
      {
        displayName: 'Chicago (ORD) → Beijing (PEK)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BEIJING - CHINA',
          code: 'PEK',
          city: 'BEIJING',
          airport_name: 'CAPITAL INTL - BEIJING',
          country: 'CHINA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Beijing-(PEK).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
      },
      {
        displayName: 'Chicago (ORD) → Shanghai (PVG)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SHANGHAI - CHINA',
          code: 'PVG',
          city: 'SHANGHAI',
          airport_name: 'PUDONG INTL - SHANGHAI',
          country: 'CHINA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Shanghai(PVG).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
      },
    ],
    europe: [
      {
        displayName: 'New York (JFK) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
      },
      {
        displayName: 'Newark (EWR) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'EWR',
          city: 'NEW YORK',
          airport_name: 'NEWARK LIBERTY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },

        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
      },
      {
        displayName: 'Chicago (ORD) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Chicago-(ORD).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'Boston (BOS) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'BOSTON - UNITED STATES OF AMERICA',
          code: 'BOS',
          city: 'BOSTON',
          airport_name: 'EDWARD L LOGAN INTL - BOSTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Boston-(BOS).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'Los Angeles (LAX) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'Miami (MIA) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Miami-(MIA).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'Dallas/Fort Worth (DFW) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'DALLAS - UNITED STATES OF AMERICA',
          code: 'DFW',
          city: 'DALLAS',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Dallas-Fort-Worth-(DFW).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Washington.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'San Francisco (SFO) → London Heathrow (LHR)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/SanFrancisco.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/London-Heathrow(LHR).webp',
      },
      {
        displayName: 'New York (JFK) → Paris Charles de Gaulle (CDG)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'PARIS - UNITED STATES OF AMERICA',
          code: 'CDG',
          city: 'PARIS',
          airport_name: 'CHARLES DE GAULLE - PARIS',
          country: 'FRANCE',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/New-York-(JFK).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Paris.webp',
      },
      {
        displayName: 'New York (JFK) → Frankfurt (FRA)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'FRANKFURT - GERMANY',
          code: 'FRA',
          city: 'FRANKFURT',
          airport_name: 'FRANKFURT INTL',
          country: 'GERMANY',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/New-York-(JFK).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Frankfurt.webp',
      },
      {
        displayName: 'Chicago (ORD) → Frankfurt (FRA)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'FRANKFURT - GERMANY',
          code: 'FRA',
          city: 'FRANKFURT',
          airport_name: 'FRANKFURT INTL',
          country: 'GERMANY',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Chicago-(ORD).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Frankfurt.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Frankfurt (FRA)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'FRANKFURT - GERMANY',
          code: 'FRA',
          city: 'FRANKFURT',
          airport_name: 'FRANKFURT INTL',
          country: 'GERMANY',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Washington.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Frankfurt.webp',
      },
      {
        displayName: 'Newark (EWR) → Paris Charles de Gaulle (CDG)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'PARIS - UNITED STATES OF AMERICA',
          code: 'CDG',
          city: 'PARIS',
          airport_name: 'CHARLES DE GAULLE - PARIS',
          country: 'FRANCE',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Paris.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Paris Charles de Gaulle (CDG)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'PARIS - UNITED STATES OF AMERICA',
          code: 'CDG',
          city: 'PARIS',
          airport_name: 'CHARLES DE GAULLE - PARIS',
          country: 'FRANCE',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/europe/Paris.webp',
      },
    ],
    africa: [
      {
        displayName: 'New York (JFK) →  Johannesburg (JNB)',
        detpartureAirport: {
          displayName: 'JOHANNESBURG - SOUTH AFRICA',
          code: 'JNB',
          city: 'JOHANNESBURG',
          airport_name: 'O.R. TAMBO INTL - JOHANNESBURG',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/new-york1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/johannesburg1.webp',
      },
      {
        displayName: 'New York (JFK) → Cape Town (CPT)',
        detpartureAirport: {
          displayName: 'CAPE TOWN - SOUTH AFRICA',
          code: 'CPT',
          city: 'CAPE TOWN',
          airport_name: 'CAPE TOWN INTL',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/cape-town1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/new-york1.webp',
      },
      {
        displayName: 'Atlanta (ATL)  → Johannesburg (JNB)',
        detpartureAirport: {
          displayName: 'JOHANNESBURG - SOUTH AFRICA',
          code: 'JNB',
          city: 'JOHANNESBURG',
          airport_name: 'O.R. TAMBO INTL - JOHANNESBURG',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'ATLANTA - UNITED STATES OF AMERICA',
          code: 'ATL',
          city: 'ATLANTA',
          airport_name: 'HARTSFIELD-JACKSON INT - ATLANTA',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/africa/johannesburg2.webp',
        departImage:
          'assets/images/international-flights-from-us/africa/atlanta1.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Johannesburg (JNB)',
        detpartureAirport: {
          displayName: 'JOHANNESBURG - SOUTH AFRICA',
          code: 'JNB',
          city: 'JOHANNESBURG',
          airport_name: 'O.R. TAMBO INTL - JOHANNESBURG',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/africa/washington4.webp',
        departImage:
          'assets/images/international-flights-from-us/africa/johannesburg3.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Cape Town (CPT)',
        detpartureAirport: {
          displayName: 'CAPE TOWN - SOUTH AFRICA',
          code: 'CPT',
          city: 'CAPE TOWN',
          airport_name: 'CAPE TOWN INTL',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/africa/washington4.webp',
        departImage:
          'assets/images/international-flights-from-us/africa/cape-town2.webp',
      },
      {
        displayName: 'Newark (EWR) → Johannesburg (JNB)',
        detpartureAirport: {
          displayName: 'JOHANNESBURG - SOUTH AFRICA',
          code: 'JNB',
          city: 'JOHANNESBURG',
          airport_name: 'O.R. TAMBO INTL - JOHANNESBURG',
          country: 'SOUTH AFRICA',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        departImage:
          'assets/images/international-flights-from-us/africa/johannesburg4.webp',
      },
      {
        displayName: 'New York (JFK) → Lagos (LOS)',
        detpartureAirport: {
          displayName: 'LAGOS - NIGERIA',
          code: 'LOS',
          city: 'LAGOS',
          airport_name: 'MURTALA MUHAMMED INTL - LAGOS',
          country: 'NIGERIA',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        departImage:
          'assets/images/international-flights-from-us/africa/lagos1.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Lagos (LOS)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LAGOS - NIGERIA',
          code: 'LOS',
          city: 'LAGOS',
          airport_name: 'MURTALA MUHAMMED INTL - LAGOS',
          country: 'NIGERIA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/washington4.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/lagos1.webp',
      },
      {
        displayName: 'Newark (EWR) → Lagos (LOS)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'LAGOS - NIGERIA',
          code: 'LOS',
          city: 'LAGOS',
          airport_name: 'MURTALA MUHAMMED INTL - LAGOS',
          country: 'NIGERIA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/lagos1.webp',
      },
      {
        displayName: 'New York (JFK) → Accra (ACC)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ACCRA - GHANA',
          code: 'LOS',
          city: 'ACCRA',
          airport_name: 'KOTOKA INTL - ACCRA',
          country: 'GHANA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/accra1.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Accra (ACC)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ACCRA - GHANA',
          code: 'LOS',
          city: 'ACCRA',
          airport_name: 'KOTOKA INTL - ACCRA',
          country: 'GHANA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/washington4.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/accra1.webp',
      },
      {
        displayName: 'Newark (EWR) → Accra (ACC)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ACCRA - GHANA',
          code: 'LOS',
          city: 'ACCRA',
          airport_name: 'KOTOKA INTL - ACCRA',
          country: 'GHANA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/accra1.webp',
      },
      {
        displayName: 'New York (JFK) → Casablanca (CMN)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'CASABLANCA - MOROCCO',
          code: 'CMN',
          city: 'CASABLANCA',
          airport_name: 'MOHAMMED V - CASABLANCA',
          country: 'MOROCCO',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/newark1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/casablanca.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Addis Ababa (ADD)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ADDIS ABABA - ETHIOPIA',
          code: 'ADD',
          city: 'ADDIS ABABA',
          airport_name: 'BOLE INTL - ADDIS ABABA',
          country: 'ETHIOPIA',
        },
        departImage:
          'assets/images/international-flights-from-us/africa/washington2.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/africa/addis-ababa.webp',
      },
    ],
    middleeast: [
      {
        displayName: 'New York (JFK) → Dubai (DXB)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/new-york3.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/dubai3.webp',
      },
      {
        displayName: 'New York (JFK) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/new-york3.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/doha2.webp',
      },
      {
        displayName: 'New York (JFK) → Abu Dhabi (AUH)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ABU DHABI - UNITED ARAB EMIRATES',
          code: 'AUH',
          city: 'ABU DHABI',
          airport_name: 'ZAYED INTERNATIONAL AIRPORT - ABU DHABI',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/new-york1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/abu-dhabi2.webp',
      },
      {
        displayName: 'Newark (EWR) → Dubai (DXB)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/newark1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/dubai2.webp',
      },
      {
        displayName: 'Newark (EWR) → Tel Aviv (TLV)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TEL AVIV YAFO - ISRAEL',
          code: 'TLV',
          city: 'TEL AVIV YAFO',
          airport_name: 'BEN GURION INTL - TEL AVIV YAFO',
          country: 'ISRAEL',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/newark2.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/tel-aviv2.webp',
      },
      {
        displayName: 'Boston (BOS) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'BOSTON - UNITED STATES OF AMERICA',
          code: 'BOS',
          city: 'BOSTON',
          airport_name: 'EDWARD L LOGAN INTL - BOSTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/boston.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/doha6.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/washington2.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/doha1.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Dubai (DXB)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/washington3.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/dubai1.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → Abu Dhabi (AUH)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ABU DHABI - UNITED ARAB EMIRATES',
          code: 'AUH',
          city: 'ABU DHABI',
          airport_name: 'ZAYED INTERNATIONAL AIRPORT - ABU DHABI',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/washington1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/abu-dhabi1.webp',
      },
      {
        displayName: 'Chicago (ORD) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/chicago2.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/doha5.webp',
      },
      {
        displayName: 'Chicago (ORD) → Abu Dhabi (AUH)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'ABU DHABI - UNITED ARAB EMIRATES',
          code: 'AUH',
          city: 'ABU DHABI',
          airport_name: 'ZAYED INTERNATIONAL AIRPORT - ABU DHABI',
          country: 'UNITED ARAB EMIRATES',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/chicago1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/abu-dhabi3.webp',
      },
      {
        displayName: 'Dallas/Fort Worth (DFW) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'DALLAS - UNITED STATES OF AMERICA',
          code: 'DFW',
          city: 'DALLAS',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/dallas-fort-worth.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/doha4.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Doha (DOH)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/doha3.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/los-angeles1.webp',
      },
    ],

    latin: [
      {
        displayName: 'San Francisco (SFO) – Taipei (TPE)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TAIPEI - TAIWAN',
          code: 'TPE',
          city: 'TAIPEI',
          airport_name: 'TAIWAN TAOYUAN INTL - TAIPEI',
          country: 'TAIWAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/TAIWAN-(TPE).webp',
      },
      {
        displayName: 'Los Angeles (LAX) – Seoul Incheon (ICN)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SEOUL - KOREA REPUBLIC OF',
          code: 'ICN',
          city: 'SEOUL',
          airport_name: 'INCHEON INTERNATIONAL - SEOUL',
          country: 'KOREA REPUBLIC OF',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/seoul-(ICN).webp',
      },
      {
        displayName: 'Los Angeles (LAX) – Tokyo Narita (NRT)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'NRT',
          city: 'TOKYO',
          airport_name: 'NARITA INTL - TOKYO',
          country: 'JAPAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
      },
      {
        displayName: 'Los Angeles (LAX) – Taipei (TPE)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TAIPEI - TAIWAN',
          code: 'TPE',
          city: 'TAIPEI',
          airport_name: 'TAIWAN TAOYUAN INTL - TAIPEI',
          country: 'TAIWAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/TAIWAN-(TPE).webp',
      },
      {
        displayName: 'Los Angeles (LAX) – Tokyo Haneda (HND)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
      },
      {
        displayName: 'New York (JFK) – Tokyo Haneda (HND)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
      },
      {
        displayName: 'Honolulu (HNL) – Tokyo Haneda (HND)',
        detpartureAirport: {
          displayName: 'HONOLULU - UNITED STATES OF AMERICA',
          code: 'HNL',
          city: 'HONOLULU',
          airport_name: 'DANIEL K INOUYE INTL - HONOLULU',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'HND',
          city: 'TOKYO',
          airport_name: 'TOKYO INTL HANEDA',
          country: 'JAPAN',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
      },
      {
        displayName: 'Tokyo Narita (NRT) – Honolulu (HNL)',
        detpartureAirport: {
          displayName: 'TOKYO - JAPAN',
          code: 'NRT',
          city: 'TOKYO',
          airport_name: 'NARITA INTL - TOKYO',
          country: 'JAPAN',
        },
        arrivalAirport: {
          displayName: 'HONOLULU - UNITED STATES OF AMERICA',
          code: 'HNL',
          city: 'HONOLULU',
          airport_name: 'DANIEL K INOUYE INTL - HONOLULU',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
      },
    ],

    india: [
      {
        displayName: 'New York (JFK) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'New York (EWR) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'EWR',
          city: 'NEW YORK',
          airport_name: 'NEWARK LIBERTY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Newark (EWR) → Mumbai (BOM)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'EWR',
          city: 'NEW YORK',
          airport_name: 'NEWARK LIBERTY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'Newark (JFK) → Mumbai (BOM)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'San Francisco (SFO) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Mumbai (BOM)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Bengaluru (BLR)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BENGALURU - INDIA',
          code: 'BLR',
          city: 'BENGALURU',
          airport_name: 'KEMPEGOWDA INTL - BENGALURU',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/bengaluru1.webp',
      },
      {
        displayName: 'Chicago (ORD) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/chicago1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Chicago (ORD) →  Mumbai (BOM)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/chicago1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'Washington D.C. (IAD) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'WASHINGTON - UNITED STATES OF AMERICA',
          code: 'IAD',
          city: 'WASHINGTON',
          airport_name: 'DULLES INTL - WASHINGTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/washington1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Dallas/Fort Worth (DFW) → Bengaluru (BLR)',
        detpartureAirport: {
          displayName: 'DALLAS - UNITED STATES OF AMERICA',
          code: 'DFW',
          city: 'DALLAS',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BENGALURU - INDIA',
          code: 'BLR',
          city: 'BENGALURU',
          airport_name: 'KEMPEGOWDA INTL - BENGALURU',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/dallas-fort-worth.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/bengaluru1.webp',
      },
      {
        displayName: 'Boston (BOS) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'BOSTON - UNITED STATES OF AMERICA',
          code: 'BOS',
          city: 'BOSTON',
          airport_name: 'EDWARD L LOGAN INTL - BOSTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Boston-(BOS).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → New Delhi (DEL)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Seattle (SEA) → Bengaluru (BLR)',
        detpartureAirport: {
          displayName: 'SEATTLE - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'SEATTLE',
          airport_name: '"SEATTLE TACOMA INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BENGALURU - INDIA',
          code: 'BLR',
          city: 'BENGALURU',
          airport_name: 'KEMPEGOWDA INTL - BENGALURU',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/india/seattle1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/bengaluru1.webp',
      },
      {
        displayName: 'Miami (MIA) → Mumbai (BOM)',
        detpartureAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Miami-(MIA).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
    ],
    oceania: [
      {
        displayName: 'Los Angeles (LAX) → Sydney (SYD)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SYDNEY - AUSTRALIA',
          code: 'SYD',
          city: 'SYDNEY',
          airport_name: 'KINGSFORD SMITH - SYDNEY',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/sydney1.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Melbourne (MEL)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MELBOURNE - AUSTRALIA',
          code: 'MEL',
          city: 'MELBOURNE',
          airport_name: 'MELBOURNE AIRPORT',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/melbourne1.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Brisbane (BNE)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BRISBANE - AUSTRALIA',
          code: 'BNE',
          city: 'BRISBANE',
          airport_name: 'BRISBANE',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/melbourne1.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Auckland (AKL)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'AUCKLAND - NEW ZEALAND',
          code: 'AKL',
          city: 'AUCKLAND',
          airport_name: 'AUCKLAND INTERNATIONAL',
          country: 'NEW ZEALAND',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/auckland1.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Sydney (SYD)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SYDNEY - AUSTRALIA',
          code: 'SYD',
          city: 'SYDNEY',
          airport_name: 'KINGSFORD SMITH - SYDNEY',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/sydney1.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Melbourne (MEL)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MELBOURNE - AUSTRALIA',
          code: 'MEL',
          city: 'MELBOURNE',
          airport_name: 'MELBOURNE AIRPORT',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/melbourne1.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Brisbane (BNE)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'BRISBANE - AUSTRALIA',
          code: 'BNE',
          city: 'BRISBANE',
          airport_name: 'BRISBANE',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/brisbane2.webp',
      },
      {
        displayName: 'San Francisco (SFO) → Auckland (AKL)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'AUCKLAND - NEW ZEALAND',
          code: 'AKL',
          city: 'AUCKLAND',
          airport_name: 'AUCKLAND INTERNATIONAL',
          country: 'NEW ZEALAND',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/auckland2.webp',
      },
      {
        displayName: 'Dallas/Fort Worth (DFW) → Sydney (SYD)',
        detpartureAirport: {
          displayName: 'DALLAS - UNITED STATES OF AMERICA',
          code: 'DFW',
          city: 'DALLAS',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SYDNEY - AUSTRALIA',
          code: 'SYD',
          city: 'SYDNEY',
          airport_name: 'KINGSFORD SMITH - SYDNEY',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/middle-east/dallas-fort-worth.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/sydney1.webp',
      },
      {
        displayName: 'Houston (IAH) → Sydney (SYD)',
        detpartureAirport: {
          displayName: 'HOUSTON - UNITED STATES OF AMERICA',
          code: 'IAH',
          city: 'HOUSTON',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SYDNEY - AUSTRALIA',
          code: 'SYD',
          city: 'SYDNEY',
          airport_name: 'KINGSFORD SMITH - SYDNEY',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/oceania/houston1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/sydney1.webp',
      },
      {
        displayName: 'Chicago (ORD) → Auckland (AKL)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'AUCKLAND - NEW ZEALAND',
          code: 'AKL',
          city: 'AUCKLAND',
          airport_name: 'AUCKLAND INTERNATIONAL',
          country: 'NEW ZEALAND',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/auckland2.webp',
      },
      {
        displayName: 'New York (JFK) → Auckland (AKL)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'AUCKLAND - NEW ZEALAND',
          code: 'AKL',
          city: 'AUCKLAND',
          airport_name: 'AUCKLAND INTERNATIONAL',
          country: 'NEW ZEALAND',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/auckland2.webp',
      },
      {
        displayName: 'Honolulu (HNL) → Sydney (SYD)',
        detpartureAirport: {
          displayName: 'HONOLULU - UNITED STATES OF AMERICA',
          code: 'HNL',
          city: 'HONOLULU',
          airport_name: 'DANIEL K INOUYE INTL - HONOLULU',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SYDNEY - AUSTRALIA',
          code: 'SYD',
          city: 'SYDNEY',
          airport_name: 'KINGSFORD SMITH - SYDNEY',
          country: 'AUSTRALIA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/sydney1.webp',
      },
      {
        displayName: 'Honolulu (HNL) → Auckland (AKL)',
        detpartureAirport: {
          displayName: 'HONOLULU - UNITED STATES OF AMERICA',
          code: 'HNL',
          city: 'HONOLULU',
          airport_name: 'DANIEL K INOUYE INTL - HONOLULU',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'AUCKLAND - NEW ZEALAND',
          code: 'AKL',
          city: 'AUCKLAND',
          airport_name: 'AUCKLAND INTERNATIONAL',
          country: 'NEW ZEALAND',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/auckland2.webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Nadi, Fiji (NAN)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'NADI - Fiji',
          code: 'NAN',
          city: 'NADI',
          airport_name: 'NADI INTL',
          country: 'Fiji',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/oceania/nadi_fiji.webp',
      },
    ],
    na: [
      {
        displayName: 'New York (JFK/LGA/EWR) → Toronto (YYZ)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TORONTO - CANADA',
          code: 'YYZ',
          city: 'TORONTO',
          airport_name: 'LESTER B. PEARSON INTL - TORONTO',
          country: 'CANADA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Toronto.webp',
      },
      {
        displayName: 'Chicago (ORD) → Toronto (YYZ)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TORONTO - CANADA',
          code: 'YYZ',
          city: 'TORONTO',
          airport_name: 'LESTER B. PEARSON INTL - TORONTO',
          country: 'CANADA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Toronto.webp',
      },
      {
        displayName: 'Newark (EWR) → Montreal (YUL)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'EWR',
          city: 'NEW YORK',
          airport_name: 'NEWARK LIBERTY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MONTREAL - CANADA',
          code: 'YUL',
          city: 'MONTREAL',
          airport_name: 'PIERRE E. TRUDEAU INTL - MONTREAL',
          country: 'CANADA',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Toronto.webp',
      },
      {
        displayName: 'Boston (BOS) → Toronto (YYZ)',
        detpartureAirport: {
          displayName: 'BOSTON - UNITED STATES OF AMERICA',
          code: 'BOS',
          city: 'BOSTON',
          airport_name: 'EDWARD L LOGAN INTL - BOSTON',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'TORONTO - CANADA',
          code: 'YYZ',
          city: 'TORONTO',
          airport_name: 'LESTER B. PEARSON INTL - TORONTO',
          country: 'CANADA',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Boston-(BOS).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Toronto.webp',
      },
      {
        displayName: 'New York (JFK) → Vancouver (YVR)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'VANCOUVER - CANADA',
          code: 'YVR',
          city: 'VANCOUVER',
          airport_name: 'INTERNATIONAL - VANCOUVER',
          country: 'CANADA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Vancouver-(YVR).webp',
      },
      {
        displayName: 'Los Angeles (LAX) → Mexico City (MEX)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MEXICO CITY - MEXICO',
          code: 'MEX',
          city: 'MEXICO CITY',
          airport_name: 'BENITO JUAREZ INTL - MEXICO CITY',
          country: 'MEXICO',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles3-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/MexicoCity.webp',
      },
      {
        displayName: 'Houston (IAH) → Mexico City (MEX)',
        detpartureAirport: {
          displayName: 'HOUSTON - UNITED STATES OF AMERICA',
          code: 'IAH',
          city: 'HOUSTON',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MEXICO CITY - MEXICO',
          code: 'MEX',
          city: 'MEXICO CITY',
          airport_name: 'BENITO JUAREZ INTL - MEXICO CITY',
          country: 'MEXICO',
        },
        departImage:
          'assets/images/international-flights-from-us/oceania/houston1.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/MexicoCity.webp',
      },
      {
        displayName: 'Dallas/Fort Worth (DFW) → Mexico City (MEX)',
        detpartureAirport: {
          displayName: 'DALLAS - UNITED STATES OF AMERICA',
          code: 'DFW',
          city: 'DALLAS',
          airport_name: 'DALLAS FT WORTH INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MEXICO CITY - MEXICO',
          code: 'MEX',
          city: 'MEXICO CITY',
          airport_name: 'BENITO JUAREZ INTL - MEXICO CITY',
          country: 'MEXICO',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Dallas-Fort-Worth-(DFW).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/MexicoCity.webp',
      },
      {
        displayName: 'Chicago (ORD) → Mexico City (MEX)',
        detpartureAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'MEXICO CITY - MEXICO',
          code: 'MEX',
          city: 'MEXICO CITY',
          airport_name: 'BENITO JUAREZ INTL - MEXICO CITY',
          country: 'MEXICO',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/Chicago-(ORD).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/MexicoCity.webp',
      },
      {
        displayName: 'New York (JFK) → Cancun (CUN)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'CANCUN - MEXICO',
          code: 'MEX',
          city: 'CANCUN',
          airport_name: 'INTERNATIONAL - CANCUN,',
          country: 'MEXICO',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/MexicoCity.webp',
      },
      {
        displayName: 'Miami (MIA) → Havana (HAV)',
        detpartureAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'HAVANA - CUBA',
          code: 'MEX',
          city: 'HAVANA',
          airport_name: 'JOSE MARTI INTL - HAVANA',
          country: 'CUBA',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Miami-(MIA).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Havana-(HAV).webp',
      },
      {
        displayName: 'Miami (MIA) → Santo Domingo (SDQ)',
        detpartureAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SANTO DOMINGO - DOMINICAN REPUBLIC',
          code: 'SDQ',
          city: 'SANTO DOMINGO',
          airport_name: 'LAS AMERICAS INTL - SANTO DOMINGO',
          country: 'DOMINICAN REPUBLIC',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Miami-(MIA).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/SantoDomingo(SDQ).webp',
      },
      {
        displayName: 'New York (JFK) → Santo Domingo (SDQ)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'SANTO DOMINGO - DOMINICAN REPUBLIC',
          code: 'SDQ',
          city: 'SANTO DOMINGO',
          airport_name: 'LAS AMERICAS INTL - SANTO DOMINGO',
          country: 'DOMINICAN REPUBLIC',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/SantoDomingo(SDQ).webp',
      },
      {
        displayName: 'Miami (MIA) → Nassau, Bahamas (NAS)',
        detpartureAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'NASSAU - BAHAMAS',
          code: 'NAS',
          city: 'NASSAU',
          airport_name: 'LYNDEN PINDLING INTL - NASSAU',
          country: 'BAHAMAS',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Miami-(MIA).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/Nassau-Bahamas.webp',
      },
      {
        displayName: 'New York (JFK) → San Juan, Puerto Rico (SJU)',
        detpartureAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'NASSAU - BAHAMAS',
          code: 'NAS',
          city: 'NASSAU',
          airport_name: 'LYNDEN PINDLING INTL - NASSAU',
          country: 'BAHAMAS',
        },
        departImage:
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/northamerica/San-Juan-Puerto-Rico-(SJU).webp',
      },
    ],
  };

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
    // console.log('passengers', passengers);
    console.log('formValue==================', formValue);

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
    //  console.log('payload==================', payload);
    return payload;
  }

  onDestinationClick(destination: any) {
    console.log('destination clicked:', destination);

    // Get date 2 days from today
    const today = new Date();
    const departureDate = new Date(today);
    departureDate.setDate(today.getDate() + 15);

    // Format date as YYYY-MM-DD for form input
    const formattedDate = departureDate.toISOString().split('T')[0];

    // Set form values
    this.flightForm.patchValue({
      tripType: 'oneway',
      departureAirport: destination.detpartureAirport, // Los Angeles International Airport as default USA departure
      arrivalAirport: destination.arrivalAirport,
      departureDate: formattedDate,
      arrivalDate: '', // Clear arrival date for one-way trip
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
        cabin: 'E',
      },
    });

    // Update passenger selection variables
    this.selectedAdults = 1;
    this.selectedChildren = 0;
    this.selectedInfants = 0;
    // console.log("flightForm--------",this.flightForm.value);

    this.updateInput();

    // // // Trigger search
    this.searchFlights();
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
