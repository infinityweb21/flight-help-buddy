import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { TosterService } from '../../../services/common/toaster.service';
import { FlightService } from '../../../services/flight/flight.service';
import { SearchService } from '../../../services/search.service';
import { SharedService } from '../../../services/shared/shared.service';
import { SvgIcons } from '../../../shared/svg-icons';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { NgFor, NgIf } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { AppCurrencyPipe } from '../../../pipes/app-currency.pipe';
import { MainFilterComponent } from '../../../components/main-filter/main-filter.component';

@Component({
  selector: 'app-international-to-us',
  imports: [

    ReactiveFormsModule,
 MainFilterComponent,
    AppCurrencyPipe,
    AutoCompleteModule,
  ],
  templateUrl: './international-to-us.component.html',
  styleUrl: './international-to-us.component.scss',
})
export class InternationalToUsComponent {
  protected icons = inject(SvgIcons);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private shareService: SharedService = inject(SharedService);
  getData: any = '';

  inputValue: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;

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

  flightDestinations = {
     asia: [
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
        arrivalImage:
          'assets/images/international-flights-from-us/asia/TAIWAN-(TPE).webp',
        departImage:
          'assets/images/international-flights-to-us/asia/san-francisco.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/asia/seoul-incheon.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/los-angeles.webp',
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
        arrivalImage:
          'assets/images/international-flights-from-us/asia/Beijing-(PEK).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/asia/taipei.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/los-angeles.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/asia/tokyo-haneda2.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/los-angeles2.webp',
      },
      {
        displayName: 'New York JFK – Tokyo Haneda (HND)',
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
          'assets/images/international-flights-to-us/asia/tokyo-haneda3.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/new-york.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/asia/tokyo-haneda.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/honolulu.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/asia/honolulu2.webp',
        departImage:
          'assets/images/international-flights-to-us/asia/tokyo-narita2.webp',
      },
    
    ],
    europe: [
       {
        displayName: 'London Heathrow (LHR) – New York JFK (JFK)',
        detpartureAirport: {
            displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/new-york.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london-heathrow.webp',
      },
      {
        displayName: 'Paris Charles de Gaulle (CDG) – New York JFK (JFK)',
        detpartureAirport: {
          displayName: 'PARIS - UNITED STATES OF AMERICA',
          code: 'CDG',
          city: 'PARIS',
          airport_name: 'CHARLES DE GAULLE - PARIS',
          country: 'FRANCE',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/new-york1.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/paris-charles-de-gaulle.webp',
      },
      {
        displayName: 'London Heathrow (LHR) – Los Angeles (LAX)',
        detpartureAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/los-angles.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london-heathrow1.webp',
      },
      {
        displayName: 'Rome Fiumicino (FCO) – New York JFK (JFK)',
        detpartureAirport: {
           displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'FCO',
          city: 'ROME',
          airport_name: 'FIUMICINO - ROME',
          country: 'ITALY',
        },
        arrivalAirport: {
            displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/new-york1.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/rome-fiumicino.webp',
      },
      {
        displayName: 'Frankfurt (FRA) – New York (JFK/EWR)',
        detpartureAirport: {
          displayName: 'FRANKFURT - GERMANY',
          code: 'FRA',
          city: 'FRANKFURT',
          airport_name: 'FRANKFURT INTL',
          country: 'GERMANY',
        },
        arrivalAirport: {
           displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/new-york1.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/frankfurt.webp',
      },
      {
        displayName: 'London Heathrow (LHR) – Miami (MIA)',
        detpartureAirport: {
            displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/miami.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london.webp',
      },
      {
        displayName: 'Boston (BOS) – London Heathrow (LHR)',
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
        arrivalImage:
          'assets/images/international-flights-to-us/europe/london-heathrow1.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/boston.webp',
      },
      {
        displayName: 'London Heathrow (LHR) – Chicago O’Hare (ORD)',
        detpartureAirport: {
            displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/Chicago-o-hare.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london-heathrow1.webp',
      },
      {
        displayName: 'London Heathrow (LHR) – San Francisco (SFO)',
        detpartureAirport: {
          displayName: 'LONDON - UNITED KINGDOM',
          code: 'LHR',
          city: 'LONDON',
          airport_name: 'HEATHROW - LONDON',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
       displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/san-francisco.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london-heathrow1.webp',
      },
      {
        displayName: 'Amsterdam Schiphol (AMS) – New York JFK (JFK)',
        detpartureAirport: {
            displayName: 'AMSTERDAM - NETHERLANDS',
          code: 'AMS',
          city: 'AMSTERDAM',
          airport_name: 'SCHIPHOL AIRPORT - AMSTERDAM',
          country: 'UNITED KINGDOM',
        },
        arrivalAirport: {
          displayName: 'CHICAGO - UNITED STATES OF AMERICA',
          code: 'ORD',
          city: 'CHICAGO',
          airport_name: 'O HARE INTERNATIONAL - CHICAGO',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-to-us/europe/Chicago-o-hare.webp',
        departImage:
          'assets/images/international-flights-to-us/europe/london-heathrow1.webp',
      },
    ],
    africa: [
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
          'assets/images/international-flights-to-us/europe.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/europe.webp',
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
          'assets/images/international-flights-to-us/europe.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/europe.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/europe.webp',
        departImage:
          'assets/images/international-flights-to-us/europe.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/europe.webp',
        departImage:
          'assets/images/international-flights-to-us/europe.webp',
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
        arrivalImage:
          'assets/images/international-flights-to-us/europe.webp',
        departImage:
          'assets/images/international-flights-to-us/europe.webp',
      },
      {
        displayName: 'New York JFK – Tokyo Haneda (HND)',
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
        arrivalImage:
          'assets/images/international-flights-from-us/asia/tokyo-(NRT-HND).webp',
        departImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
      },
      {
        displayName: 'Tokyo Narita (NRT) – Honolulu (HNL)',
        detpartureAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
         displayName: 'HONOLULU - UNITED STATES OF AMERICA',
          code: 'HNL',
          city: 'HONOLULU',
          airport_name: 'DANIEL K INOUYE INTL - HONOLULU',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/los-angeles-(LAX).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/HONOLULU.webp',
      },
    
    ],
   middleeast: [
      {
        displayName: 'Dubai (DXB) — New York (JFK)',
        detpartureAirport: {
         displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
         displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/New-York1.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/Dubai.webp',
      },
      {
        displayName: 'Dubai (DXB) — Los Angeles (LAX)',
        detpartureAirport: {
           displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
         displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/LosAngeles.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/Dubai2.webp',
      },
      {
        displayName: 'Dubai (DXB) — San Francisco (SFO)',
        detpartureAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
           displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/SanFrancisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/middle-east/abu-dhabi2.webp',
      },
      {
        displayName: 'Doha (DOH) — New York (JFK)',
        detpartureAirport: {
          displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/Doha.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/New-York.webp',
      },
      {
        displayName: 'Tel Aviv (TLV) — New York (JFK)',
        detpartureAirport: {
            displayName: 'TEL AVIV YAFO - ISRAEL',
          code: 'TLV',
          city: 'TEL AVIV YAFO',
          airport_name: 'BEN GURION INTL - TEL AVIV YAFO',
          country: 'ISRAEL',
        },
        arrivalAirport: {
           displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/TelAviv.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/NewYork4.webp',
      },
      {
        displayName: 'Abu Dhabi (AUH) — New York (JFK)',
        detpartureAirport: {
            displayName: 'ABU DHABI - UNITED ARAB EMIRATES',
          code: 'AUH',
          city: 'ABU DHABI',
          airport_name: 'ZAYED INTERNATIONAL AIRPORT - ABU DHABI',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
           displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/AbuDhabi.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/NewYork(JFK).webp',
      },
      {
        displayName: 'Dubai (DXB) — Miami (MIA)',
        detpartureAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
          displayName: 'MIAMI - UNITED STATES OF AMERICA',
          code: 'MIA',
          city: 'MIAMI',
          airport_name: 'MIAMI INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/Dubai5.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/Miami.webp',
      },
      {
        displayName: 'Dubai (DXB) — Boston (BOS)',
        detpartureAirport: {
          displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
          displayName: 'BOSTON - UNITED STATES OF AMERICA',
          code: 'BOS',
          city: 'BOSTON',
          airport_name: 'EDWARD L LOGAN INTL - BOSTON',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/Dubai6.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/Boston.webp',
      },
      {
        displayName: 'Dubai (DXB) — Seattle (SEA)',
        detpartureAirport: {
         displayName: 'DUBAI - UNITED ARAB EMIRATES',
          code: 'DXB',
          city: 'DUBAI',
          airport_name: 'DUBAI INTL',
          country: 'UNITED ARAB EMIRATES',
        },
        arrivalAirport: {
         displayName: 'SEATTLE - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'SEATTLE',
          airport_name: '"SEATTLE TACOMA INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/Dubai7.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/Seattle.webp',
      },
      {
        displayName: 'Doha (DOH) — Los Angeles (LAX)',
        detpartureAirport: {
           displayName: 'DOHA - QATAR',
          code: 'DOH',
          city: 'DOHA',
          airport_name: 'HAMAD INTERNATIONAL - DOHA',
          country: 'QATAR',
        },
        arrivalAirport: {
          displayName: 'LOS ANGELES - UNITED STATES OF AMERICA',
          code: 'LAX',
          city: 'LOS ANGELES',
          airport_name: 'LOS ANGELES INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/middleeast/Doha2.webp',
        arrivalImage:
          'assets/images/international-flights-to-us/middleeast/LosAngeles2.webp',
      },
     
    ],
    latin: [
      {
        city: 'Mexico City',
        code: 'MEX',
        price: 347.58,
        displayName: 'MEXICO CITY - MEXICO',
        airport_name: 'BENITO JUAREZ INTL - MEXICO CITY',
        country: 'MEXICO',
      },
      {
        city: 'São Paulo',
        code: 'GRU',
        price: 480.5,
        displayName: 'SÃO PAULO - BRAZIL',
        airport_name: 'GUARULHOS INTL - SAO PAULO',
        country: 'BRAZIL',
      },
      {
        city: 'Cancún',
        code: 'CUN',
        price: 215.58,
        displayName: 'CANCÚN - MEXICO',
        airport_name: 'INTERNATIONAL - CANCUN',
        country: 'MEXICO',
      },
      {
        city: 'Bogotá',
        code: 'BOG',
        price: 212.5,
        displayName: 'BOGOTÁ - COLOMBIA',
        airport_name: 'EL DORADO INTL - BOGOTA',
        country: 'COLOMBIA',
      },
      {
        city: 'Lima',
        code: 'LIM',
        price: 400.59,
        displayName: 'LIMA - PERU',
        airport_name: 'JORGE CHAVEZ INTL - LIMA',
        country: 'PERU',
      },
      {
        city: 'Buenos Aires',
        code: 'EZE',
        price: 577.5,
        displayName: 'BUENOS AIRES - ARGENTINA',
        airport_name: 'MINISTRO PISTARINI - BUENOS AIRES',
        country: 'ARGENTINA',
      },
      {
        city: 'Rio de Janeiro',
        code: 'GIG',
        price: 454.1,
        displayName: 'RIO DE JANEIRO - BRAZIL',
        airport_name: 'GALEAO A.C JOBIM INTL - RIO DE JANEIRO',
        country: 'BRAZIL',
      },
      {
        city: 'Santiago',
        code: 'SCL',
        price: 436.5,
        displayName: 'SANTIAGO - CHILE',
        airport_name: 'A MERINO BENITEZ - SANTIAGO',
        country: 'CHILE',
      },
      {
        city: 'Quito',
        code: 'UIO',
        price: 436.75,
        displayName: 'QUITO - ECUADOR',
        airport_name: 'MARISCAL SUCRE INTL - QUITO',
        country: 'ECUADOR',
      },
      {
        city: 'Guatemala City',
        code: 'GUA',
        price: 222.25,
        displayName: 'GUATEMALA CITY - GUATEMALA',
        airport_name: 'LA AURORA INTL - GUATEMALA CITY',
        country: 'GUATEMALA',
      },
    ],
    india: [
      {
        displayName: 'New Delhi (DEL) — New York (JFK/EWR)',
        detpartureAirport: {
          displayName: 'DELHI - INDIA',
          code: 'DEL',
          city: 'DELHI',
          airport_name: 'INDIRA GANDHI INTL - DELHI',
          country: 'INDIA',
        },
        arrivalAirport: {
           displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        departImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'Mumbai (BOM) — New York (EWR/JFK)',
        detpartureAirport: {
         displayName: 'MUMBAI - INDIA',
          code: 'BOM',
          city: 'MUMBAI',
          airport_name: 'CHHATRAPATI S MAHARAJ - MUMBAI',
          country: 'INDIA',
        },
        arrivalAirport: {
           displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'EWR',
          city: 'NEW YORK',
          airport_name: 'NEWARK LIBERTY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalImage:
          'assets/images/international-flights-from-us/asia/New-york-(JFK-EWR).webp',
        departImage:
          'assets/images/international-flights-to-us/india/Mumbai.webp',
      },
      {
        displayName: 'San Francisco (SFO) — New Delhi (DEL)',
        detpartureAirport: {
         displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
          displayName: 'NEW YORK - UNITED STATES OF AMERICA',
          code: 'JFK',
          city: 'NEW YORK',
          airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/new-delhi2.webp',
      },
      {
        displayName: 'San Francisco (SFO) — Mumbai (BOM)',
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
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'Bengaluru (BLR) — San Francisco (SFO)',
        detpartureAirport: {
          displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        arrivalAirport: {
         displayName: 'SAN FRANCISCO - UNITED STATES OF AMERICA',
          code: 'SFO',
          city: 'SAN FRANCISCO',
          airport_name: 'SAN FRANCISCO INTL',
          country: 'UNITED STATES OF AMERICA',
        },
        departImage:
          'assets/images/international-flights-to-us/india/Bengaluru.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/asia/San-Francisco-(SFO).webp',
      },
      {
        displayName: 'Newark (EWR) — Mumbai (BOM)',
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
          'assets/images/international-flights-from-us/europe/Newark-(EWR).webp',
        arrivalImage:
          'assets/images/international-flights-to-us/india/Mumbai3.webp',
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
        displayName: 'Washington D.C. (IAD) — New Delhi (DEL)',
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
        displayName: 'New York (JFK) — Mumbai (BOM)',
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
          'assets/images/international-flights-to-us/india/NewYork11.webp',
        arrivalImage:
          'assets/images/international-flights-from-us/india/mumbai3.webp',
      },
      {
        displayName: 'San Francisco (SFO) — Bengaluru (BLR)',
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
   
    ],
    oceania: [
      {
        city: 'Sydney',
        code: 'SYD',
        price: 859.31,
        displayName: 'SYDNEY - AUSTRALIA',
        airport_name: 'KINGSFORD SMITH - SYDNEY',
        country: 'AUSTRALIA',
      },
      {
        city: 'Melbourne',
        code: 'MEL',
        price: 851.5,
        displayName: 'MELBOURNE - AUSTRALIA',
        airport_name: 'MELBOURNE AIRPORT',
        country: 'AUSTRALIA',
      },
      {
        city: 'Brisbane',
        code: 'BNE',
        price: 899.6,
        displayName: 'BRISBANE - AUSTRALIA',
        airport_name: 'BRISBANE',
        country: 'AUSTRALIA',
      },
      {
        city: 'Auckland',
        code: 'AKL',
        price: 857.8,
        displayName: 'AUCKLAND - NEW ZEALAND',
        airport_name: 'AUCKLAND INTERNATIONAL',
        country: 'NEW ZEALAND',
      },
      {
        city: 'Perth',
        code: 'PER',
        price: 701.5,
        displayName: 'PERTH - AUSTRALIA',
        airport_name: 'PERTH',
        country: 'AUSTRALIA',
      },
      {
        city: 'Adelaide',
        code: 'ADL',
        price: 878.4,
        displayName: 'ADELAIDE - AUSTRALIA',
        airport_name: 'ADELAIDE INTL',
        country: 'AUSTRALIA',
      },
      {
        city: 'Christchurch',
        code: 'CHC',
        price: 1125.5,
        displayName: 'CHRISTCHURCH - NEW ZEALAND',
        airport_name: 'CHRISTCHURCH',
        country: 'NEW ZEALAND',
      },
      {
        city: 'Gold Coast',
        code: 'OOL',
        price: 1167.4,
        displayName: 'GOLD COAST - AUSTRALIA',
        airport_name: 'COOLANGATTA - GOLD COAST',
        country: 'AUSTRALIA',
      },
      {
        city: 'Nadi',
        code: 'NAN',
        price: 610.5,
        displayName: 'NADI - FIJI',
        airport_name: 'NADI INTL',
        country: 'FIJI',
      },
      {
        city: 'French Polynesia',
        code: 'PPT',
        price: 987.63,
        displayName: 'PAPEETE - FRENCH POLYNESIA',
        airport_name: 'FAAA - TAHITI',
        country: 'FRENCH POLYNESIA',
      },
    ],
    na: [
      {
        city: 'Los Angeles',
        code: 'LAX',
        price: 253.96,
        displayName: 'LOS ANGELES - UNITED STATES',
        airport_name: 'LOS ANGELES INTL',
        country: 'UNITED STATES',
      },
      {
        city: 'Chicago',
        code: 'ORD',
        price: 186.19,
        displayName: 'CHICAGO - UNITED STATES',
        airport_name: 'O HARE INTERNATIONAL - CHICAGO',
        country: 'UNITED STATES',
      },
      {
        city: 'San Francisco',
        code: 'SFO',
        price: 284.3,
        displayName: 'SAN FRANCISCO - UNITED STATES',
        airport_name: 'SAN FRANCISCO INTL - SAN FRANCISCO',
        country: 'UNITED STATES',
      },
      {
        city: 'Miami',
        code: 'MIA',
        price: 204.18,
        displayName: 'MIAMI - UNITED STATES',
        airport_name: 'MIAMI INTL',
        country: 'UNITED STATES',
      },
      {
        city: 'Seattle',
        code: 'SEA',
        price: 278.48,
        displayName: 'SEATTLE - UNITED STATES',
        airport_name: 'SEATTLE TACOMA INTL',
        country: 'UNITED STATES',
      },
      {
        city: 'Boston',
        code: 'BOS',
        price: 120.48,
        displayName: 'BOSTON - UNITED STATES',
        airport_name: 'EDWARD L LOGAN INTL - BOSTON',
        country: 'UNITED STATES',
      },
      {
        city: 'Las Vegas',
        code: 'LAS',
        price: 233,
        displayName: 'LAS VEGAS - UNITED STATES',
        airport_name: 'HARRY REID INTL - LAS VEGAS',
        country: 'UNITED STATES',
      },
      {
        city: 'Denver',
        code: 'DEN',
        price: 178.49,
        displayName: 'DENVER - UNITED STATES',
        airport_name: 'DENVER INTERNATIONAL',
        country: 'UNITED STATES',
      },
      {
        city: 'Toronto',
        code: 'YYZ',
        price: 193.75,
        displayName: 'TORONTO - CANADA',
        airport_name: 'LESTER B. PEARSON INTL - TORONTO',
        country: 'CANADA',
      },
      {
        city: 'Vancouver',
        code: 'YVR',
        price: 260.43,
        displayName: 'VANCOUVER - CANADA',
        airport_name: 'INTERNATIONAL - VANCOUVER',
        country: 'CANADA',
      },
    ],
  };

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

  onDestinationClick(destination: any) {
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
