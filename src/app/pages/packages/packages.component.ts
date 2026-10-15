import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import { MainFilterComponent } from '../../components/main-filter/main-filter.component';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-packages',
  imports: [
    CommonModule,
    MainFilterComponent
  ],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PackagesComponent implements AfterViewInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);

   private sharedService = inject(SharedService);
  getData = this.sharedService.getcompanyName();



  // =====================================================
  // Dynamic Flight + Hotel Package Data
  // =====================================================

  packageList = [
    {
      image: 'assets/images/hotel/hotel5.jpg',
      badge: 'Flight + Hotel',
      location: 'San Juan',
      title: 'The Royal Sonesta San Juan',
      rating: '8.9',
      ratingLabel: 'Very Good',
      refundable: true,
      from: 'Philadelphia (PHL)',
      to: 'San Juan (SJU)',
      price: '1,195',
      priceUnit: '/ person',
      priceNote: 'Round trip Flight + Hotel · Taxes & fees included'
    },

    {
      image: 'assets/images/hotel/hotel1.png',
      badge: 'Flight + Hotel',
      location: 'San Juan',
      title: 'The Royal Sonesta San Juan',
      rating: '8.9',
      ratingLabel: 'Very Good',
      refundable: false,
      from: 'Philadelphia (PHL)',
      to: 'San Juan (SJU)',
      price: '1,195',
      priceUnit: '/ person',
      priceNote: 'Round trip Flight + Hotel · Taxes & fees included'
    },

    {
      image: 'assets/images/hotel/hotel4.jpg',
      badge: 'Flight + Hotel',
      location: 'San Juan',
      title: 'The Royal Sonesta San Juan',
      rating: '8.9',
      ratingLabel: 'Very Good',
      refundable: true,
      from: 'Philadelphia (PHL)',
      to: 'San Juan (SJU)',
      price: '1,195',
      priceUnit: '/ person',
      priceNote: 'Round trip Flight + Hotel · Taxes & fees included'
    },

    {
      image: 'assets/images/hotel/hotel3.png',
      badge: 'Flight + Hotel',
      location: 'San Juan',
      title: 'The Royal Sonesta San Juan',
      rating: '8.9',
      ratingLabel: 'Very Good',
      refundable: true,
      from: 'Philadelphia (PHL)',
      to: 'San Juan (SJU)',
      price: '1,195',
      priceUnit: '/ person',
      priceNote: 'Round trip Flight + Hotel · Taxes & fees included'
    },

    {
      image: 'assets/images/hotel/hotel2.jpeg',
      badge: 'Flight + Hotel',
      location: 'San Juan',
      title: 'The Royal Sonesta San Juan',
      rating: '8.9',
      ratingLabel: 'Very Good',
      refundable: true,
      from: 'Philadelphia (PHL)',
      to: 'San Juan (SJU)',
      price: '1,195',
      priceUnit: '/ person',
      priceNote: 'Round trip Flight + Hotel · Taxes & fees included'
    }
  ];


  // =====================================================
  // Owl Carousel
  // =====================================================

  private slider: any = null;


  // =====================================================
  // Initialize Slider
  // =====================================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Wait for *ngFor DOM rendering
    setTimeout(() => {
      this.initFlightHotelSlider();
    }, 100);

  }


  // =====================================================
  // Flight + Hotel Slider
  // =====================================================

  private initFlightHotelSlider(): void {

    const $ = (window as any).$;

    // Check jQuery
    if (!$) {
      console.warn('jQuery is not loaded.');
      return;
    }

    // Check Owl Carousel
    if (!$.fn?.owlCarousel) {
      console.warn('Owl Carousel is not loaded.');
      return;
    }


    // IMPORTANT:
    // Your HTML slider class
    this.slider = $('.flightandhotel-slider');

    if (!this.slider.length) {
      console.warn('.flightandhotel-slider not found.');
      return;
    }


    // Prevent duplicate initialization
    if (this.slider.hasClass('owl-loaded')) {
      return;
    }


    // ===================================================
    // Owl Carousel Settings
    // ===================================================

    this.slider.owlCarousel({

      loop: true,

      margin: 16,

      nav: false,

      dots: false,

      autoplay: false,

      smartSpeed: 600,

      responsive: {

        // Mobile
        0: {
          items: 1.15,
          margin: 8
        },

        // Small tablet
        575: {
          items: 2,
          margin: 12
        },

        // Tablet
        768: {
          items: 2,
          margin: 16
        },

        // Desktop
        992: {
          items: 3,
          margin: 16
        },

        // Large desktop
        1200: {
          items: 4,
          margin: 20
        }

      }

    });


    // ===================================================
    // Previous Button
    // ===================================================

    $('.flightandhotel-ai-prev')
      .off('click.flightHotel')
      .on('click.flightHotel', (event: Event) => {

        event.preventDefault();

        this.slider.trigger(
          'prev.owl.carousel'
        );

      });


    // ===================================================
    // Next Button
    // ===================================================

    $('.flightandhotel-ai-next')
      .off('click.flightHotel')
      .on('click.flightHotel', (event: Event) => {

        event.preventDefault();

        this.slider.trigger(
          'next.owl.carousel'
        );

      });

  }


  // =====================================================
  // Package Click
  // =====================================================

  selectPackage(pkg: any): void {

    console.log('Selected Package:', pkg);

    // Add your navigation / booking logic here

  }


  // =====================================================
  // Wishlist
  // =====================================================

  toggleWishlist(
    pkg: any,
    event: Event
  ): void {

    event.preventDefault();

    event.stopPropagation();

    pkg.wishlisted = !pkg.wishlisted;

  }


  // =====================================================
  // Destroy
  // =====================================================

  ngOnDestroy(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const $ = (window as any).$;

    if (!$) {
      return;
    }


    // Remove button events

    $('.flightandhotel-ai-prev')
      .off('click.flightHotel');

    $('.flightandhotel-ai-next')
      .off('click.flightHotel');


    // Destroy Owl Carousel

    const slider = $('.flightandhotel-slider');

    if (
      slider.length &&
      slider.hasClass('owl-loaded')
    ) {

      slider.trigger(
        'destroy.owl.carousel'
      );

    }

    this.slider = null;

  }

}