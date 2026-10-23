import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from "@angular/core";

import { CommonModule, isPlatformBrowser } from "@angular/common";

import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";

@Component({
  selector: "app-packages",
  imports: [CommonModule, MainFilterComponent],
  templateUrl: "./packages.component.html",
  styleUrl: "./packages.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PackagesComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  private sharedService = inject(SharedService);
  getData = this.sharedService.getcompanyName();

  // =====================================================
  // Dynamic Flight + Hotel Package Data
  // =====================================================
  // Dynamic date range
  dealDateRange = this.getDynamicDateRange(20, 24);

  private getDynamicDateRange(startDay: number, endDay: number): string {
    const now = new Date();

    // Next month
    const targetYear = now.getFullYear() + (now.getMonth() === 11 ? 1 : 0);
    const targetMonth = (now.getMonth() + 1) % 12;

    const startDate = new Date(targetYear, targetMonth, startDay);
    const endDate = new Date(targetYear, targetMonth, endDay);

    const dateFormat: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };

    const start = startDate.toLocaleDateString("en-GB", dateFormat);
    const end = endDate.toLocaleDateString("en-GB", dateFormat);

    return `${start} · ${end}`;
  }
  packageList = [
    {
      image: "assets/images/hotel/The-Tower-Hotel.jpg",
      badge: "Flight + Hotel",
      location: "London",
      title: "The Tower Hotel + Flight",
      rating: "8.5",
      ratingLabel: "Very Good",
      refundable: true,
      from: "New York (JFK)",
      to: "London (LHR)",
      price: "1,295",
      priceUnit: "/ person",
      priceNote: "Round trip Flight + Hotel · Taxes & fees included",
    },

    {
      image: "assets/images/hotel/Novotel-Paris.jpg",
      badge: "Flight + Hotel",
      location: "Paris",
      title: "Novotel Paris Centre Tour Eiffel + Flight",
      rating: "8.2",
      ratingLabel: "Very Good",
      refundable: false,
      from: "Los Angeles (LAX)",
      to: "Paris (CDG)",
      price: "1,495",
      priceUnit: "/ person",
      priceNote: "Round trip Flight + Hotel · Taxes & fees included",
    },

    {
      image: "assets/images/hotel/Shinjuku-Hotel.jpg",
      badge: "Flight + Hotel",
      location: "Tokyo",
      title: "Shinjuku Washington Hotel + Flight",
      rating: "8.3",
      ratingLabel: "Very Good",
      refundable: true,
      from: "San Francisco (SFO)",
      to: "Tokyo (HND)",
      price: "1,695",
      priceUnit: "/ person",
      priceNote: "Round trip Flight + Hotel · Taxes & fees included",
    },

    {
      image: "assets/images/hotel/Artemide-Hotel.jpg",
      badge: "Flight + Hotel",
      location: "Rome",
      title: "Hotel Artemide + Flight",
      rating: "9.2",
      ratingLabel: "Wonderful",
      refundable: true,
      from: "Chicago (ORD)",
      to: "Rome (FCO)",
      price: "1,595",
      priceUnit: "/ person",
      priceNote: "Round trip Flight + Hotel · Taxes & fees included",
    },

    {
      image: "assets/images/hotel/Hyatt-Ziva.jpg",
      badge: "Flight + Hotel",
      location: "Cancun",
      title: "Hyatt Ziva Cancun + Flight",
      rating: "9.0",
      ratingLabel: "Wonderful",
      refundable: true,
      from: "Dallas (DFW)",
      to: "Cancun (CUN)",
      price: "1,195",
      priceUnit: "/ person",
      priceNote: "Round trip Flight + Hotel · Taxes & fees included",
    },
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
      console.warn("jQuery is not loaded.");
      return;
    }

    // Check Owl Carousel
    if (!$.fn?.owlCarousel) {
      console.warn("Owl Carousel is not loaded.");
      return;
    }

    // IMPORTANT:
    // Your HTML slider class
    this.slider = $(".flightandhotel-slider");

    if (!this.slider.length) {
      console.warn(".flightandhotel-slider not found.");
      return;
    }

    // Prevent duplicate initialization
    if (this.slider.hasClass("owl-loaded")) {
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
          margin: 8,
        },

        // Small tablet
        575: {
          items: 2,
          margin: 12,
        },

        // Tablet
        768: {
          items: 2,
          margin: 16,
        },

        // Desktop
        992: {
          items: 3,
          margin: 16,
        },

        // Large desktop
        1200: {
          items: 4,
          margin: 20,
        },
      },
    });

    // ===================================================
    // Previous Button
    // ===================================================

    $(".flightandhotel-ai-prev")
      .off("click.flightHotel")
      .on("click.flightHotel", (event: Event) => {
        event.preventDefault();

        this.slider.trigger("prev.owl.carousel");
      });

    // ===================================================
    // Next Button
    // ===================================================

    $(".flightandhotel-ai-next")
      .off("click.flightHotel")
      .on("click.flightHotel", (event: Event) => {
        event.preventDefault();

        this.slider.trigger("next.owl.carousel");
      });
  }

  // =====================================================
  // Package Click
  // =====================================================

  selectPackage(pkg: any): void {
    console.log("Selected Package:", pkg);

    // Add your navigation / booking logic here
  }

  // =====================================================
  // Wishlist
  // =====================================================

  toggleWishlist(pkg: any, event: Event): void {
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

    $(".flightandhotel-ai-prev").off("click.flightHotel");

    $(".flightandhotel-ai-next").off("click.flightHotel");

    // Destroy Owl Carousel

    const slider = $(".flightandhotel-slider");

    if (slider.length && slider.hasClass("owl-loaded")) {
      slider.trigger("destroy.owl.carousel");
    }

    this.slider = null;
  }
}
