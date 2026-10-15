
import { SearchService } from './../../../services/search.service';
import { isPlatformBrowser, NgFor } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  AfterViewInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestroyRef, inject } from '@angular/core';
// import { CarouselModule } from 'primeng/carousel';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,

} from '@angular/forms';
import { SharedService } from '../../../services/shared/shared.service';
import { LocationService } from '../../../services/shared/location.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-package-offer',
  imports: [NgFor, RouterLink,CarouselModule],
  templateUrl: './package-offer.component.html',
  styleUrl: './package-offer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PackageOfferComponent implements OnInit, AfterViewInit {
  @ViewChild('recoendSwiperRef', { static: true })
  recoendSwiperRef!: ElementRef;
  @ViewChild('recoendSwiperRef1', { static: false })
  recoendSwiperRef1!: ElementRef;
  @ViewChild('offerSwiperRef', { static: true }) offerSwiperRef!: ElementRef;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router = inject(Router);
  private searchService = inject(SearchService);
      private locationService:LocationService=inject(LocationService)

  private shareService: SharedService = inject(SharedService);
  getData: any = '';
 oferResponsiveOptions:any[]|undefined;
productResponsiveOptions: any[] | undefined;
popularResponsiveOptions: any[] | undefined;
  flightForm: FormGroup;
  selectedAdults: number = 0;
  selectedChildren: number = 0;
  selectedInfants: number = 0;
  selectedCabin = { name: 'Economy', value: 'E' };
  inputValue: string = '';
 contactNumber: any;


  cabinOptions = [
    { name: 'Economy', value: 'E' },
    { name: 'First', value: 'F' },
    { name: 'Business', value: 'B' },
    { name: 'Premium Economy', value: 'P' },
  ];

  constructor(
    private fb: FormBuilder,
     @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.contactNumber = this.shareService?.getcompanyName().phoneNumber;

    this.flightForm = this.fb.group({
      tripType: ['oneway'],
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

    this.updateInput();

     this.oferResponsiveOptions =[
       {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ]
    this.popularResponsiveOptions =[
       {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ]
     this.productResponsiveOptions = [
       {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1
    }
    ];
  }

  recommendedProducts = [
    {
      image: 'assets/images/home/swiss_alps_escape.webp',
      title: 'Swiss Alps Escape',
      duration: '4 Days | 3 Nights',
      rating: 4.7,
      details: {
        flights: '2 Flights',
        hotels: '1 Hotel',
        transfers: '2 Transfers',
        activities: '4 Activities',
      },
      description: [
        'Scenic train ride',
        'Local village walk',
        'Glacier excursion',
      ],
      link: '/top-destinations/swis-alps',
    },
    {
      image: 'assets/images/home/paries_getaway.webp',
      title: 'Paris Getaway',
      duration: '5 Days | 4 Nights',
      rating: 4.8,
      details: {
        flights: '2 Flights',
        hotels: '1 Hotel',
        transfers: '2 Transfers',
        activities: '4 Activities',
      },
      description: ['Seine River Cruise', 'Guided city walk', 'Louvre access'],

      link: '/top-destinations/paris',
    },
    {
      image: 'assets/images/home/california_dreaming.webp',
      title: 'California Dreaming',
      duration: '6 Days | 5 Nights',
      rating: 4.7,
      details: {
        flights: '2 Flights',
        hotels: '1 Hotel',
        transfers: '2 Transfers',
        activities: '4 Activities',
      },
      description: [
        'Hollywood City Tour',
        'Santa Monica Beach Day',
        'Universal Studios Entry',
      ],
      link: '/top-destinations/california',
    },
    {
      image: 'assets/images/home/florida_escape.webp',
      title: 'Florida Escape',
      duration: '6 Days | 5 Nights',
      rating: 4.6,
      details: {
        flights: '2 Flights',
        hotels: '1 Hotel',
        transfers: '2 Transfers',
        activities: '4 Activities',
      },
      description: [
        'Walt Disney World Pass',
        'Everglades Airboat Tour',
        'Miami Beach Day Trip',
      ],
      link: '/top-destinations/florida',
    },
    {
      image: 'assets/images/home/tokyo_tour.webp',
      title: 'Tokyo Tour',
      duration: '5 Days | 4 Nights',
      rating: 4.9,
      details: {
        flights: '2 Flights',
        hotels: '1 Hotel',
        transfers: '2 Transfers',
        activities: '4 Activities',
      },
      description: [
        'Mt. Fuji day trip',
        'Sushi-making class',
        'City walking tour',
      ],
      link: '/top-destinations/tokyo',
    },
    // {
    //   image: 'assets/images/home/rome_journey.webp',
    //   title: 'Rome Journey',
    //   duration: '4 Days | 3 Nights',
    //   rating: 4.7,
    //   details: {
    //     flights: '2 Flights',
    //     hotels: '1 Hotel',
    //     transfers: '2 Transfers',
    //     activities: '4 Activities',
    //   },
    //   description: [
    //     'Colosseum guided tour',
    //     'Vatican City visit',
    //     'Trevi Fountain stop',
    //   ],
    //   link: '/top-destinations/rome',
    // },
    // {
    //   image: 'assets/images/home/singapore_city_fun.webp',
    //   title: 'Singapore City Fun',
    //   duration: '4 Days | 3 Nights',
    //   rating: 4.8,
    //   details: {
    //     flights: '2 Flights',
    //     hotels: '1 Hotel',
    //     transfers: '2 Transfers',
    //     activities: '4 Activities',
    //   },
    //   description: [
    //     'Gardens by the Bay',
    //     'Sentosa Island Entry',
    //     'Night Safari Ride',
    //   ],
    //   link: '/top-destinations/singapore',
    // },
    // {
    //   image: 'assets/images/home/london_getaway.webp',
    //   title: 'London Getaway',
    //   duration: '4 Days | 3 Nights ',
    //   rating: 4.9,
    //   details: {
    //     flights: '2 Flights',
    //     hotels: '1 Hotel',
    //     transfers: '2 Transfers',
    //     activities: '4 Activities',
    //   },
    //   description: [
    //     'London Eye ride',
    //     'Tower of London entry',
    //     'Thames River cruise',
    //   ],
    //   // price: 90952,
    //   // originalPrice: 88952,
    //   link: '/top-destinations/london',
    // },
  ];

  private getDynamicDateRange(): string {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 15); // 15 days from today

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 28); // 28 days after start date for return

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    const startFormatted = startDate.toLocaleDateString('en-US', options);
    const endFormatted = endDate.toLocaleDateString('en-US', options);

    return `${startFormatted}`;
  }

  flights:any[]= []

  offers = [
    {
      image: 'assets/images/home/offer-img-1.webp',
      category: 'Flight Deals',
      title: 'Travel Far, Save More on Domestic and International Routes',
      description: 'Snag the Best Offer Today',
      link: '#',
    },
    {
      image: 'assets/images/home/cruise_server.webp',
      category: 'Cruise Special ',
      title: 'Relax in Style with Exclusive Deals on Luxury Cruise Tours',
      description: 'Secure Your Discounted Cruise',
      link: '#',
    },
    {
      image: 'assets/images/home/hotel_deals.webp',
      category: 'Hotel Offers',
      title: 'Enjoy Quality Stays at Unbeatable Prices',
      description: 'Find Great Hotel Deals',
      link: '#',
    },
    {
      image: 'assets/images/home/customizable_deals.webp',
      category: 'Your Trip, Your Way ',
      title: 'Design a Custom Offer with Flexible Travel Options ',
      description: 'Craft the Ideal Travel Package',
      link: '#',
    },
    // Add more offer objects here as needed
  ];

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
     if (!isPlatformBrowser(this.platformId)) {
    // 🔥 STOP SSR FROM CALLING LOCATIONS
    return;
  }
    this.locationService.getNearestAirport().subscribe((res:any) => {
      console.log("airports",res)
           const origin = {
  code: res.airport_code,
  airport_name:res?.airport_name,
  city: res?.city,
  country: res?.country_code,
  displayName: `${res?.city} - ${res?.country}`,
}
const allFlights= [
    {
      image: 'assets/images/home/paris.webp',
      destination: 'Paris',
      route: `${origin?.code}-ORY `,
      dateRange: this.getDynamicDateRange(),
      rating: 4.8,
      // price: 80952,
      link: '#',
      arrivalAirport: {
        displayName: 'PARIS - FRANCE',
        code: 'ORY',
        city: 'PARIS',
        airport_name: 'ORLY - PARIS',
        country: 'FRANCE',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/rome.webp',
      destination: 'Rome',
      route: `${origin?.code}-FCO`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.6,
      // price: 81952,
      link: '#',
      arrivalAirport: {
        displayName: '"ROME - ITALY',
        code: 'FCO',
        city: 'ROME',
        airport_name: 'FIUMICINO - ROME',
        country: 'ITALY',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/tokyo1.webp',
      destination: 'Tokyo',
      route: `${origin?.code}-HND`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.9,
      // price: 82952,
      link: '#',
      arrivalAirport: {
        displayName: 'TOKYO - JAPAN',
        code: 'HND',
        city: 'TOKYO',
        airport_name: 'TOKYO INTL HANEDA',
        country: 'JAPAN',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/singapore1.webp',
      destination: 'Singapore',
      route: `${origin?.code}-SIN`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.7,
      // price: 83952,
      link: '#',
      arrivalAirport: {
        displayName: 'SINGAPORE - SINGAPORE',
        code: 'SIN',
        city: 'SINGAPORE',
        airport_name: 'CHANGI - SINGAPORE',
        country: 'SINGAPORE',
      }, 
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/barcelona.webp',
      destination: 'Barcelona',
      route: `${origin?.code}-BCN`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.5,
      // price: 84952,
      link: '#',
      arrivalAirport: {
        displayName: '"BARCELONA - SPAIN',
        code: 'BCN',
        city: 'BARCELONA',
        airport_name: 'JOSEP TARRADELLAS BARCELONA',
        country: 'SPAIN',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/zurich.webp',
      destination: 'Zurich',
      route: `${origin?.code}-ZRH`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.5,
      // price: 84952,
      link: '#',
      arrivalAirport: {
        displayName: 'ZURICH - SWITZERLAND',
        code: 'ZRH',
        city: 'ZURICH',
        airport_name: 'ZURICH AIRPORT',
        country: 'SWITZERLAND',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/london.webp',
      destination: 'London',
      route: `${origin?.code}-LHR`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.9,
      // price: 84952,
      link: '#',
      arrivalAirport: {
        displayName: 'LONDON - UNITED KINGDOM',
        code: 'LHR',
        city: 'LONDON',
        airport_name: 'HEATHROW - LONDON',
        country: 'UNITED KINGDOM',
      },
      detpartureAirport: origin
    },
    {
      image: 'assets/images/home/newyork1.webp',
      destination: 'New York',
      route: `${origin?.code}-JFK`,
      dateRange: this.getDynamicDateRange(),
      rating: 4.8,
      // price: 84952,
      link: '#',
      arrivalAirport: {
        city: 'NEW YORK',
        code: 'JFK',
        price: 439.75,
        displayName: 'NEW YORK - UNITED STATES OF AMERICA',
        airport_name: 'JOHN F KENNEDY INTL - NEW YORK',
        country: 'UNITED STATES OF AMERICA',
      },
      detpartureAirport: origin
    },
    // Add more flight objects if needed
  ];
  this.flights = allFlights.filter(f => f.arrivalAirport.code !== origin.code);
  
  // Reinitialize the flights swiper after data is loaded
  setTimeout(() => {
    this.initializeFlightSwiper();
  }, 100);
})
  }

  private initializeFlightSwiper(): void {
        if (!isPlatformBrowser(this.platformId)) return;

    if (this.recoendSwiperRef1 && this.recoendSwiperRef1.nativeElement && this.flights.length > 0) {
      customElements.whenDefined('swiper-container').then(() => {
        const swiperEl1: any = this.recoendSwiperRef1.nativeElement;
        console.log("slideCount--------",this.flights.length);
        
        const getSwiperParams = (slideCount: number) => ({
          slidesPerView: 1,
          spaceBetween: 12,
          loop: slideCount > 4,
          breakpoints: {
            1024: {
              slidesPerView: Math.min(4, slideCount),
              spaceBetween: 12,
            },
            992: {
              slidesPerView: Math.min(3, slideCount),
              spaceBetween: 12,
            },
            576: {
              slidesPerView: Math.min(2, slideCount),
              spaceBetween: 12,
            },
            0: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
          },
        });

        const flightSwiperParams = getSwiperParams(this.flights.length);
        
        if (swiperEl1.swiper) {
          // Update existing swiper
          Object.assign(swiperEl1, flightSwiperParams);
          swiperEl1.swiper.update();
        } else {
          // Initialize new swiper
          Object.assign(swiperEl1, flightSwiperParams);
          if (!swiperEl1.initialized) {
            swiperEl1.initialize();
          }
        }
      });
    }
  }

  ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

    // Wait for Web Component upgrade to be ready
    customElements.whenDefined('swiper-container').then(() => {
      // Set params BEFORE initializing
      const getSwiperParams = (slideCount: number) => ({
        slidesPerView: 1,
        spaceBetween: 12,
        loop: slideCount > 4, // Only enable loop if we have more than 4 slides
        breakpoints: {
          1024: {
            slidesPerView: Math.min(4, slideCount),
            spaceBetween: 12,
          },
          992: {
            slidesPerView: Math.min(3, slideCount),
            spaceBetween: 12,
          },
          576: {
            slidesPerView: Math.min(2, slideCount),
            spaceBetween: 12,
          },
          0: {
            slidesPerView: 1,
            spaceBetween: 8,
          },
        },
      });

      const recommendedSwiperParams = getSwiperParams(this.recommendedProducts.length);
      const flightSwiperParams = getSwiperParams(this.flights.length);
      const offerSwiperParams = getSwiperParams(this.offers.length);

      // Initialize each swiper element if it's available
      if (this.recoendSwiperRef && this.recoendSwiperRef.nativeElement) {
        const swiperEl: any = this.recoendSwiperRef.nativeElement;
        Object.assign(swiperEl, recommendedSwiperParams);
        swiperEl.initialize();
      }

      // This one is conditionally rendered and has init="true", so handle carefully
      if (this.recoendSwiperRef1 && this.recoendSwiperRef1.nativeElement) {
        const swiperEl1: any = this.recoendSwiperRef1.nativeElement;
        // Since it has init="true", it may already be initialized
        if (!swiperEl1.initialized) {
          Object.assign(swiperEl1, flightSwiperParams);
          swiperEl1.initialize();
        }
      }

      if (this.offerSwiperRef && this.offerSwiperRef.nativeElement) {
        const swiperEl2: any = this.offerSwiperRef.nativeElement;
        Object.assign(swiperEl2, offerSwiperParams);
        swiperEl2.initialize();
      }
    });
  }

  get passengersGroup(): FormGroup {
    return this.flightForm.get('passengers') as FormGroup;
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
      arrivalAirport: destination.arrivalAirport, // Los Angeles International Airport as default USA departure
      departureAirport: destination.detpartureAirport,
      departureDate: formattedDate,
      arrivalDate: '', // Clear arrival date for one-way trip
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
        cabin: 'E',
      },
    });

    console.log('flightForm--------', destination);

    this.updateInput();

    // // // // Trigger search
    this.searchFlights();
  }

  searchFlights() {
    // this.submitted = true;
    // if (this.flightForm.valid) {
    const payload = this.buildFlightPayload();
    console.warn('Final Payload:', payload);
    this.searchService.setSearchData(payload);
    console.log('this.flightForm.value', this.flightForm.value);
    this.router.navigate(['/flights-list']);
    // send to API
    // } else {
    //   this.flightForm.markAllAsTouched();
    // }
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
    }

    return payload;
  }
}
