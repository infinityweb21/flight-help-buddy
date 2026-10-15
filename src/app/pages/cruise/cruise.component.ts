
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from "@angular/core";

import {
  CommonModule,
  isPlatformBrowser,
} from "@angular/common";

import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";

declare var $: any;

@Component({
  selector: "app-cruise",
  imports: [CommonModule, MainFilterComponent],
  templateUrl: "./cruise.component.html",
  styleUrl: "./cruise.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CruiseComponent implements AfterViewInit, OnDestroy {

  // =====================================================
  // SERVICES
  // =====================================================

  private platformId = inject(PLATFORM_ID);
  private shareService = inject(SharedService);
  private ngZone = inject(NgZone);

  // =====================================================
  // VARIABLES
  // =====================================================

  getData: any = "";

  private sliderWatchTimer: any = null;
  private initTimer: any = null;

  private destroyed = false;

  private mainSliderInitialized = false;
  private detailsSliderInitialized = false;

  // =====================================================
  // OLD / EXISTING DATA
  // =====================================================

  cruiseList = [
    {
      image: "assets/images/cruise/cruise1.webp",
      name: "American Cruise Lines",
      cruises: "29 Cruises",
    },
    {
      image: "assets/images/cruise/cruise2.webp",
      name: "Carnival Cruise Line",
      cruises: "24 Cruises",
    },
    {
      image: "assets/images/cruise/cruise3.webp",
      name: "Royal Caribbean International",
      cruises: "36 Cruises",
    },
    {
      image: "assets/images/cruise/cruise4.webp",
      name: "Holland America Line",
      cruises: "34 Cruises",
    },
    {
      image: "assets/images/cruise/cruise5.webp",
      name: "Norwegian Cruise Line",
      cruises: "26 Cruises",
    },
  ];

  // =====================================================
  // DETAILS DATA
  // =====================================================

  cruiseDetailsList = [
    {
      image: "assets/images/cruise/cruise1.webp",
      badge: "Top Rated",
      rating: "4.96",
      reviews: "672",
      name: "American Cruise Lines",
      location: "Boston, Massachusetts",
      year: "2022",
      width: "98.56 m",
      guests: "7",
      speed: "15 Knots",
      price: "48.25",
    },
    {
      image: "assets/images/cruise/cruise2.webp",
      badge: "Top Rated",
      rating: "4.96",
      reviews: "672",
      name: "Carnival Cruise Line",
      location: "Miami, Florida",
      year: "2022",
      width: "98.56 m",
      guests: "7",
      speed: "15 Knots",
      price: "52.50",
    },
    {
      image: "assets/images/cruise/cruise3.webp",
      badge: "Top Rated",
      rating: "4.95",
      reviews: "540",
      name: "Royal Caribbean International",
      location: "Fort Lauderdale, Florida",
      year: "2021",
      width: "97.20 m",
      guests: "6",
      speed: "18 Knots",
      price: "55.25",
    },
    {
      image: "assets/images/cruise/cruise4.webp",
      badge: "Top Rated",
      rating: "4.94",
      reviews: "610",
      name: "Holland America Line",
      location: "Seattle, Washington",
      year: "2023",
      width: "100.20 m",
      guests: "8",
      speed: "17 Knots",
      price: "62.75",
    },
  ];

  // =====================================================
  // ON INIT
  // =====================================================

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
  }

  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.destroyed = false;

    /*
     * Run Owl completely outside Angular.
     */
    this.ngZone.runOutsideAngular(() => {

      /*
       * Start immediately.
       */
      this.initializeSliders();

      /*
       * Watch the sliders.
       *
       * This is the important fix for your:
       *
       * "slider appears and after 2 seconds disappears"
       *
       * If another script removes Owl classes or
       * recreates the DOM, we initialize it again.
       */
      this.startSliderWatch();

    });
  }

  // =====================================================
  // INITIALIZE BOTH SLIDERS
  // =====================================================

  private initializeSliders(): void {

    if (this.destroyed) {
      return;
    }

    const jquery = (window as any).$;

    if (
      !jquery ||
      !jquery.fn ||
      typeof jquery.fn.owlCarousel !== "function"
    ) {
      /*
       * jQuery/Owl not ready.
       *
       * Try again very shortly.
       */
      this.scheduleInitialization();

      return;
    }

    /*
     * Initialize main slider.
     */
    this.initCruiseSlider();

    /*
     * Initialize details slider.
     */
    this.initCruiseDetailsSlider();
  }

  // =====================================================
  // RETRY INITIALIZATION
  // =====================================================

  private scheduleInitialization(): void {

    if (this.destroyed) {
      return;
    }

    if (this.initTimer) {
      return;
    }

    this.initTimer = setTimeout(() => {

      this.initTimer = null;

      if (!this.destroyed) {
        this.initializeSliders();
      }

    }, 50);
  }

  // =====================================================
  // WATCH SLIDERS
  // =====================================================

  private startSliderWatch(): void {

    if (this.destroyed) {
      return;
    }

    /*
     * Clear existing watcher.
     */
    if (this.sliderWatchTimer) {
      clearInterval(this.sliderWatchTimer);
    }

    /*
     * Check every 250ms.
     *
     * This catches the situation where another script
     * removes/rebuilds Owl after initial page load.
     */
    this.sliderWatchTimer = setInterval(() => {

      if (this.destroyed) {
        return;
      }

      const jquery = (window as any).$;

      if (
        !jquery ||
        !jquery.fn ||
        typeof jquery.fn.owlCarousel !== "function"
      ) {
        return;
      }

      // ===============================================
      // MAIN SLIDER
      // ===============================================

      const mainSlider = jquery(
        ".tabhotels-slider"
      );

      if (mainSlider.length) {

        if (
          !mainSlider.hasClass("owl-loaded")
        ) {

          this.mainSliderInitialized = false;

          this.initCruiseSlider();

        }

      } else {

        this.mainSliderInitialized = false;

      }

      // ===============================================
      // DETAILS SLIDER
      // ===============================================

      const detailsSlider = jquery(
        ".c-slider"
      );

      if (detailsSlider.length) {

        if (
          !detailsSlider.hasClass("owl-loaded")
        ) {

          this.detailsSliderInitialized = false;

          this.initCruiseDetailsSlider();

        }

      } else {

        this.detailsSliderInitialized = false;

      }

    }, 250);
  }

  // =====================================================
  // MAIN CRUISE SLIDER
  // =====================================================

  private initCruiseSlider(): void {

    if (this.destroyed) {
      return;
    }

    const jquery = (window as any).$;

    if (
      !jquery ||
      !jquery.fn ||
      typeof jquery.fn.owlCarousel !== "function"
    ) {
      return;
    }

    const slider = jquery(
      ".tabhotels-slider"
    );

    if (!slider.length) {
      return;
    }

    /*
     * Already initialized.
     */
    if (
      slider.hasClass("owl-loaded") ||
      this.mainSliderInitialized
    ) {
      return;
    }

    // ===================================================
    // OWL CONFIG
    // ===================================================

    slider.owlCarousel({

      /*
       * KEEP TRUE
       */
      loop: true,

      rewind: false,

      margin: 16,

      nav: false,

      dots: false,

      autoplay: false,

      /*
       * KEEP 600
       */
      smartSpeed: 600,

      /*
       * IMPORTANT:
       *
       * HTML is not using Owl lazy-load markup.
       *
       * Keep this false so Owl doesn't wait/process
       * lazy-load images unnecessarily.
       */
      lazyLoad: false,

      autoHeight: false,

      /*
       * Don't perform visibility calculation.
       */
      checkVisibility: false,

      /*
       * Drag.
       */
      mouseDrag: true,

      touchDrag: true,

      pullDrag: true,

      /*
       * One slide.
       */
      slideBy: 1,

      /*
       * Responsive recalculation.
       */
      responsiveRefreshRate: 200,

      responsive: {

        0: {
          items: 1.5,
          margin: 8
        },

        575: {
          items: 2.2,
          margin: 12
        },

        768: {
          items: 3,
          margin: 16
        },

        992: {
          items: 4,
          margin: 16
        },

        1200: {
          items: 5,
          margin: 16
        }

      }

    });

    /*
     * Mark initialized.
     */
    this.mainSliderInitialized = true;

    // ===================================================
    // PREVIOUS
    // ===================================================

    jquery(".tabhotels-slider-ai-prev")
      .off("click.cruise")
      .on(
        "click.cruise",
        (event: Event) => {

          event.preventDefault();

          slider.trigger(
            "prev.owl.carousel"
          );

        }
      );

    // ===================================================
    // NEXT
    // ===================================================

    jquery(".tabhotels-slider-ai-next")
      .off("click.cruise")
      .on(
        "click.cruise",
        (event: Event) => {

          event.preventDefault();

          slider.trigger(
            "next.owl.carousel"
          );

        }
      );

  }

  // =====================================================
  // DETAILS SLIDER
  // =====================================================

  private initCruiseDetailsSlider(): void {

    if (this.destroyed) {
      return;
    }

    const jquery = (window as any).$;

    if (
      !jquery ||
      !jquery.fn ||
      typeof jquery.fn.owlCarousel !== "function"
    ) {
      return;
    }

    const slider = jquery(
      ".c-slider"
    );

    if (!slider.length) {
      return;
    }

    /*
     * Already initialized.
     */
    if (
      slider.hasClass("owl-loaded") ||
      this.detailsSliderInitialized
    ) {
      return;
    }

    // ===================================================
    // OWL CONFIG
    // ===================================================

    slider.owlCarousel({

      /*
       * KEEP TRUE
       */
      loop: true,

      rewind: false,

      margin: 16,

      nav: false,

      dots: false,

      autoplay: false,

      /*
       * KEEP 600
       */
      smartSpeed: 600,

      /*
       * Do not use Owl lazy-loading.
       */
      lazyLoad: false,

      autoHeight: false,

      /*
       * Faster visibility check.
       */
      checkVisibility: false,

      /*
       * Drag.
       */
      mouseDrag: true,

      touchDrag: true,

      pullDrag: true,

      slideBy: 1,

      responsiveRefreshRate: 200,

      /*
       * No additional animation.
       */
      animateIn: false,

      animateOut: false,

      responsive: {

        0: {
          items: 1.2,
          margin: 8
        },

        575: {
          items: 2,
          margin: 12
        },

        768: {
          items: 3,
          margin: 16
        },

        992: {
          items: 4,
          margin: 16
        },

        1200: {
          items: 4,
          margin: 20
        }

      }

    });

    /*
     * Mark initialized.
     */
    this.detailsSliderInitialized = true;

    // ===================================================
    // PREVIOUS
    // ===================================================

    jquery(".c-slider-ai-prev")
      .off("click.cruiseDetails")
      .on(
        "click.cruiseDetails",
        (event: Event) => {

          event.preventDefault();

          slider.trigger(
            "prev.owl.carousel"
          );

        }
      );

    // ===================================================
    // NEXT
    // ===================================================

    jquery(".c-slider-ai-next")
      .off("click.cruiseDetails")
      .on(
        "click.cruiseDetails",
        (event: Event) => {

          event.preventDefault();

          slider.trigger(
            "next.owl.carousel"
          );

        }
      );

  }

  // =====================================================
  // BOOK CRUISE
  // =====================================================

  bookCruise(cruise: any): void {

    console.log(
      "Selected Cruise:",
      cruise
    );

  }

  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.destroyed = true;

    // ===================================================
    // CLEAR INITIALIZATION TIMER
    // ===================================================

    if (this.initTimer) {

      clearTimeout(
        this.initTimer
      );

      this.initTimer = null;

    }

    // ===================================================
    // CLEAR WATCHER
    // ===================================================

    if (this.sliderWatchTimer) {

      clearInterval(
        this.sliderWatchTimer
      );

      this.sliderWatchTimer = null;

    }

    this.mainSliderInitialized = false;
    this.detailsSliderInitialized = false;

    // ===================================================
    // BROWSER CHECK
    // ===================================================

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const jquery = (window as any).$;

    if (!jquery || !jquery.fn) {
      return;
    }

    // ===================================================
    // REMOVE MAIN BUTTON EVENTS
    // ===================================================

    jquery(".tabhotels-slider-ai-prev")
      .off("click.cruise");

    jquery(".tabhotels-slider-ai-next")
      .off("click.cruise");

    // ===================================================
    // REMOVE DETAILS BUTTON EVENTS
    // ===================================================

    jquery(".c-slider-ai-prev")
      .off("click.cruiseDetails");

    jquery(".c-slider-ai-next")
      .off("click.cruiseDetails");

    // ===================================================
    // DESTROY MAIN SLIDER
    // ===================================================

    const mainSlider = jquery(
      ".tabhotels-slider"
    );

    if (
      mainSlider.length &&
      mainSlider.hasClass("owl-loaded")
    ) {

      mainSlider.trigger(
        "destroy.owl.carousel"
      );

    }

    // ===================================================
    // DESTROY DETAILS SLIDER
    // ===================================================

    const detailsSlider = jquery(
      ".c-slider"
    );

    if (
      detailsSlider.length &&
      detailsSlider.hasClass("owl-loaded")
    ) {

      detailsSlider.trigger(
        "destroy.owl.carousel"
      );

    }

  }

}