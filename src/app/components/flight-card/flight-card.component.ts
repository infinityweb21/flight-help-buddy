import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
} from "@angular/core";
import { NgIf, isPlatformBrowser } from "@angular/common";

import {
  FlightQuickSearchService,
  QuickSearchRequest,
} from "../../services/flight/flight-quick-search.service";

/*
 * ============================================
 * ONE FLIGHT CARD
 * --------------------------------------------
 * Usage (inside your carousel):
 *   <div class="flight-slider owl-carousel">
 *     <app-flight-card *ngFor="let f of flightCards" [flight]="f"></app-flight-card>
 *   </div>
 * ============================================
 */
export interface FlightCard {
  tag: string;
  rating: number;
  image: string;
  alt: string;
  from: string;
  to: string;
  fromCodes: string[]; // airports, main one first
  toCodes: string[];
  departInDays?: number; // departure = today + N days
  nights?: number; // return = departure + N days
  title: string;
  airlineLogo: string;
  airline: string;
  stop: string;
}

// Ready-made list any page can use: flightCards = DEFAULT_FLIGHT_CARDS;
export const DEFAULT_FLIGHT_CARDS: FlightCard[] = [
  { tag: "Cheapest", rating: 4.5, image: "assets/images/flight/flight-01.jpg", alt: "Delta Air Lines flight from Miami to Tokyo",
    from: "Miami", to: "Tokyo", fromCodes: ["MIA", "FLL"], toCodes: ["HND", "NRT"], departInDays: 21, nights: 7,
    title: "Delta Express 901", airlineLogo: "assets/images/flight/delta-logo.png", airline: "Delta Air Lines", stop: "1-stop at Seoul" },
  { tag: "Best Value", rating: 4.4, image: "assets/images/flight/flight-02.jpg", alt: "Alaska Airlines flight from Los Angeles to New York",
    from: "Los Angeles", to: "New York", fromCodes: ["LAX"], toCodes: ["JFK", "EWR"], departInDays: 14, nights: 3,
    title: "Alaska Airlines 245", airlineLogo: "assets/images/flight/alaska-airlines-logo.png", airline: "Alaska Airlines", stop: "Non-stop" },
  { tag: "Popular", rating: 4.3, image: "assets/images/flight/flight-03.jpg", alt: "JetBlue Airways flight from Boston to Orlando",
    from: "Boston", to: "Orlando", fromCodes: ["BOS"], toCodes: ["MCO"], departInDays: 18, nights: 3,
    title: "JetBlue Airways 672", airlineLogo: "assets/images/flight/jetblue-logo.png", airline: "JetBlue Airways", stop: "1-stop at New York" },
  { tag: "Cheapest", rating: 4.2, image: "assets/images/flight/flight-04.jpg", alt: "Frontier Airlines flight from Chicago to Las Vegas",
    from: "Chicago", to: "Las Vegas", fromCodes: ["ORD", "MDW"], toCodes: ["LAS"], departInDays: 10, nights: 3,
    title: "Frontier Airlines 318", airlineLogo: "assets/images/flight/frontier-airlines-logo.png", airline: "Frontier Airlines", stop: "Non-stop" },
  { tag: "Best Deal", rating: 4.1, image: "assets/images/flight/flight-05.jpg", alt: "Allegiant Air flight from Los Angeles to Honolulu",
    from: "Los Angeles", to: "Honolulu", fromCodes: ["LAX"], toCodes: ["HNL"], departInDays: 25, nights: 4,
    title: "Allegiant Air 524", airlineLogo: "assets/images/flight/allegiant-air-logo.png", airline: "Allegiant Air", stop: "1-stop at Phoenix" },
  { tag: "Popular", rating: 4.5, image: "assets/images/flight/flight-06.jpg", alt: "Air Canada flight from Toronto to Vancouver",
    from: "Toronto", to: "Vancouver", fromCodes: ["YYZ"], toCodes: ["YVR"], departInDays: 30, nights: 3,
    title: "Air Canada 781", airlineLogo: "assets/images/flight/air-canada-logo.png", airline: "Air Canada", stop: "Non-stop" },
];

@Component({
  selector: "app-flight-card",
  imports: [NgIf],
  templateUrl: "./flight-card.component.html",
  styleUrl: "./flight-card.component.scss",
  // Styles not scoped, so your existing .flight-card-* CSS works as-is
  encapsulation: ViewEncapsulation.None,
})
export class FlightCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) flight!: FlightCard;

  // Show "Oct 30 - Nov 6" on the card
  @Input() showDates = true;

  // Search info stored ON the card element (see listener below)
  searchData = "";
  dateLabel = "";

  private quickSearch = inject(FlightQuickSearchService);
  private platformId = inject(PLATFORM_ID);

  /*
   * Owl Carousel (loop: true) copies cards, and copies lose Angular
   * (click). So ONE listener on the document handles every card -
   * original or copy - by reading data-flight-search from the card.
   */
  private static instances = 0;
  private static service: FlightQuickSearchService | null = null;

  private static readonly listener = (event: Event): void => {
    if (event.type === "keydown" && (event as KeyboardEvent).key !== "Enter") {
      return;
    }

    const card = (event.target as HTMLElement | null)?.closest?.(
      ".flight-card-link[data-flight-search]",
    ) as HTMLElement | null;

    if (!card || card.classList.contains("is-loading")) return;

    event.preventDefault();

    let request: QuickSearchRequest;

    try {
      request = JSON.parse(card.getAttribute("data-flight-search") || "");
    } catch {
      return;
    }

    card.classList.add("is-loading");

    FlightCardComponent.service
      ?.searchCityToCity(request)
      .finally(() => card.classList.remove("is-loading"));
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    FlightCardComponent.service = this.quickSearch;

    if (FlightCardComponent.instances++ === 0) {
      document.addEventListener("click", FlightCardComponent.listener);
      document.addEventListener("keydown", FlightCardComponent.listener);
    }
  }

  ngOnChanges(): void {
    if (!this.flight) return;

    const request: QuickSearchRequest = {
      fromCodes: this.flight.fromCodes,
      toCodes: this.flight.toCodes,
      fromLabel: this.flight.from,
      toLabel: this.flight.to,
      departInDays: this.flight.departInDays,
      nights: this.flight.nights,
    };

    this.searchData = JSON.stringify(request);
    this.dateLabel = this.quickSearch.getDateLabel(
      this.flight.departInDays,
      this.flight.nights,
    );
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (--FlightCardComponent.instances <= 0) {
      FlightCardComponent.instances = 0;
      document.removeEventListener("click", FlightCardComponent.listener);
      document.removeEventListener("keydown", FlightCardComponent.listener);
    }
  }
}