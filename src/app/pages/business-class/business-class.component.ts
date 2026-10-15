import {
  AfterViewInit,
  Component,
  OnDestroy,
  inject
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { MainFilterComponent } from "../../components/main-filter/main-filter.component";
import { SharedService } from "../../services/shared/shared.service";

declare var $: any;

@Component({
  selector: "app-business-class",
  imports: [CommonModule, MainFilterComponent],
  templateUrl: "./business-class.component.html",
  styleUrl: "./business-class.component.scss"
})
export class BusinessClassComponent implements AfterViewInit, OnDestroy {

  getData: any;
  companyname: any;

  private shareService: SharedService = inject(SharedService);

  private owlRetryTimer: any = null;
  private owlWatchTimer: any = null;
  private destroyed = false;

  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    this.companyname = this.getData.companyName;
  }

  // =========================
  // PREVIOUS BUTTON
  // =========================
  domesticRoutePrevious(): void {
    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".destcard-slider");

    if (
      slider.length &&
      typeof slider.owlCarousel === "function" &&
      slider.hasClass("owl-loaded")
    ) {
      slider.trigger("prev.owl.carousel");
    }
  }

  // =========================
  // NEXT BUTTON
  // =========================
  domesticRouteNext(): void {
    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".destcard-slider");

    if (
      slider.length &&
      typeof slider.owlCarousel === "function" &&
      slider.hasClass("owl-loaded")
    ) {
      slider.trigger("next.owl.carousel");
    }
  }

  // =========================
  // OWL INIT
  // =========================
  ngAfterViewInit(): void {
    this.initializeDestCardSlider();

    this.owlRetryTimer = setTimeout(() => {
      this.initializeDestCardSlider();
    }, 100);

    this.owlWatchTimer = setInterval(() => {
      if (!this.destroyed) {
        this.initializeDestCardSlider();
      }
    }, 500);
  }

  private initializeDestCardSlider(): void {
    if (this.destroyed) {
      return;
    }

    if (typeof $ === "undefined") {
      return;
    }

    const slider = $(".destcard-slider");

    if (!slider.length) {
      return;
    }

    if (typeof slider.owlCarousel !== "function") {
      return;
    }

    // Already initialized correctly
    if (
      slider.hasClass("owl-loaded") &&
      slider.find(".owl-stage").length
    ) {
      return;
    }

    // Clean incomplete Owl instance
    if (slider.hasClass("owl-loaded")) {
      try {
        slider.trigger("destroy.owl.carousel");
      } catch (error) {
        console.warn("Owl destroy error:", error);
      }
    }

    slider.owlCarousel({
      loop: true,
      rewind: false,

      margin: 0,

      nav: false,
      dots: false,

      autoplay: false,

      // Keep this exactly as requested
      smartSpeed: 600,

      lazyLoad: false,
      autoHeight: false,

      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,

      slideBy: 1,

      responsive: {
        0: {
          items: 1
        },

        576: {
          items: 2
        },

        768: {
          items: 3
        },

        992: {
          items: 4
        },

        1200: {
          items: 4
        }
      }
    });
  }

  // =========================
  // DESTROY
  // =========================
  ngOnDestroy(): void {
    this.destroyed = true;

    if (this.owlRetryTimer) {
      clearTimeout(this.owlRetryTimer);
      this.owlRetryTimer = null;
    }

    if (this.owlWatchTimer) {
      clearInterval(this.owlWatchTimer);
      this.owlWatchTimer = null;
    }

    if (typeof $ !== "undefined") {
      const slider = $(".destcard-slider");

      if (
        slider.length &&
        typeof slider.owlCarousel === "function"
      ) {
        try {
          if (slider.hasClass("owl-loaded")) {
            slider.trigger("destroy.owl.carousel");
          }
        } catch (error) {
          console.warn("Owl destroy error:", error);
        }
      }
    }
  }
}