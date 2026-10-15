import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  AfterViewInit,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { MainFilterComponent } from '../../components/main-filter/main-filter.component';
import { SharedService } from '../../services/shared/shared.service';
import { DeviceService } from '../../services/shared/device.service';

declare var $: any;

@Component({
  selector: 'app-car',
  imports: [
    CommonModule,
    MainFilterComponent
  ],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent implements AfterViewInit, OnDestroy {

  

  // ============================================
  // VARIABLES
  // ============================================

  getData: any;

  private shareService = inject(SharedService);
  private deviceService = inject(DeviceService);
  private ngZone = inject(NgZone);

  isHidden = false;
  isMobile = false;


  companyname: any = this.shareService.getcompanyName();

  // ============================================
  // CAR SLIDER DATA
  // ============================================
carCards = [
  {
    image: 'assets/images/car/car3.webp',
    category: 'Sedan',
    rating: '4.5',
    title: 'BMW 3 Series',
    location: 'Ciutat Vella, Barcelona',
    fuel: 'Petrol',
    gear: 'Automatic',
    guests: '5',
    ac: 'Yes',
    price: '$700',
    pricePeriod: '/ day',
    logo: 'assets/images/car/alamo.svg'
  },

  {
    image: 'assets/images/car/car4.webp',
    category: 'SUV',
    rating: '4.6',
    title: 'Ford Explorer',
    location: 'Eixample, Barcelona',
    fuel: 'Petrol',
    gear: 'Automatic',
    guests: '7',
    ac: 'Yes',
    price: '$820',
    pricePeriod: '/ day',
    logo: 'assets/images/car/drivus.svg'
  },

  {
    image: 'assets/images/car/car2.webp',
    category: 'Hatchback',
    rating: '4.4',
    title: 'Honda Civic',
    location: 'Gràcia, Barcelona',
    fuel: 'Petrol',
    gear: 'Manual',
    guests: '5',
    ac: 'Yes',
    price: '$560',
    pricePeriod: '/ day',
    logo: 'assets/images/car/sixt.svg'
  },

  {
    image: 'assets/images/car/car1.webp',
    category: 'Sports Car',
    rating: '4.8',
    title: 'Ford Mustang',
    location: 'Barceloneta, Barcelona',
    fuel: 'Petrol',
    gear: 'Automatic',
    guests: '4',
    ac: 'Yes',
    price: '$950',
    pricePeriod: '/ day',
    logo: 'assets/images/car/budget_no_bg.svg'
  },

  {
    image: 'assets/images/car/car5.webp',
    category: 'Luxury',
    rating: '4.7',
    title: 'Mercedes-Benz C-Class',
    location: 'Sarrià, Barcelona',
    fuel: 'Petrol',
    gear: 'Automatic',
    guests: '5',
    ac: 'Yes',
    price: '$880',
    pricePeriod: '/ day',
    logo: 'assets/images/car/avis_no_bg.svg'
  }
];

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;

      if (!this.isMobile) {
        this.isHidden = false;
      }
    });
  }

  // ============================================
  // ON INIT
  // ============================================

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    
  }

  // ============================================
  // AFTER VIEW INIT
  // ============================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    /*
     * Wait for Angular rendering to become stable.
     * This is more reliable than setTimeout(0).
     */
    this.ngZone.onStable.pipe().subscribe(() => {
      this.initCarCarousel();
    });
  }

  // ============================================
  // INIT CAR CAROUSEL
  // ============================================

  private initCarCarousel(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check jQuery
    if (typeof $ === 'undefined') {
      console.error('jQuery is not loaded.');
      return;
    }

    // Check jQuery fn
    if (!$.fn) {
      console.error('jQuery fn is not available.');
      return;
    }

    // Check Owl Carousel
    if (typeof $.fn.owlCarousel !== 'function') {
      console.error('Owl Carousel is not loaded.');
      return;
    }

    const slider = $('.car-slider');

    // Slider does not exist
    if (!slider.length) {
      console.warn('.car-slider element not found.');
      return;
    }

    // Already initialized
    if (slider.hasClass('owl-loaded')) {
      return;
    }

    // ============================================
    // INITIALIZE OWL
    // ============================================

    slider.owlCarousel({
      loop: true,

      margin: 15,

      nav: false,

      dots: false,

      autoplay: false,

      /*
       * Lower value = faster slide movement
       */
      smartSpeed: 150,

      /*
       * Prevent unnecessary animations
       */
      animateIn: false,
      animateOut: false,

      /*
       * Drag settings
       */
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,

      /*
       * Responsive
       */
      responsive: {

        0: {
          items: 1.2,
          margin: 8
        },

        600: {
          items: 2.2,
          margin: 15
        },

        992: {
          items: 3,
          margin: 15
        },

        1200: {
          items: 4,
          margin: 15
        }
      }
    });

    console.log('Car carousel initialized');
  }

  // ============================================
  // NEXT
  // ============================================

  carNext(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === 'undefined' || !$.fn) {
      return;
    }

    const slider = $('.car-slider');

    if (
      slider.length &&
      slider.hasClass('owl-loaded')
    ) {
      slider.trigger('next.owl.carousel');
    }
  }

  // ============================================
  // PREVIOUS
  // ============================================

  carPrevious(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof $ === 'undefined' || !$.fn) {
      return;
    }

    const slider = $('.car-slider');

    if (
      slider.length &&
      slider.hasClass('owl-loaded')
    ) {
      slider.trigger('prev.owl.carousel');
    }
  }

  // ============================================
  // CAR CTA
  // ============================================

  handleCtaClick(
    number: string,
    event: Event
  ): void {

    if (this.isMobile) {
      return;
    }

    event.preventDefault();

    this.shareService.open(number);

    setTimeout(() => {
      this.shareService.close();
    }, 10000);
  }

  // ============================================
  // CAR CARD CLICK
  // ============================================

  selectCar(car: any): void {
    console.log('Selected car:', car);
  }

  // ============================================
  // DESTROY
  // ============================================

  ngOnDestroy(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (
      typeof $ === 'undefined' ||
      !$.fn ||
      typeof $.fn.owlCarousel !== 'function'
    ) {
      return;
    }

    const slider = $('.car-slider');

    if (
      slider.length &&
      slider.hasClass('owl-loaded')
    ) {
      slider.trigger('destroy.owl.carousel');
    }
  }
}