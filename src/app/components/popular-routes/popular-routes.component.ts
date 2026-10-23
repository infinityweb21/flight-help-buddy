import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { NgFor, isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { firstValueFrom, timeout } from "rxjs";

import { FlightService } from "../../services/flight/flight.service";
import { FlightFilterService } from "../../services/flight/flight-filter.service";
import { SearchService } from "../../services/search.service";
import { TosterService } from "../../services/common/toaster.service";

export interface PopularRoute {
  fromLabel: string;      // text shown on the card
  toLabel: string;
  fromCodes: string[];    // airports, main one first
  toCodes: string[];
  departInDays?: number;  // departure = today + N days
  nights?: number;        // return = departure + N days
}

interface RouteAirport {
  code: string;
  city: string;
  country: string;
  airport_name: string;
}

const DEFAULT_ROUTES: PopularRoute[] = [
  { fromLabel: "New York", toLabel: "London, United Kingdom", fromCodes: ["JFK", "EWR"], toCodes: ["LHR", "LGW"], departInDays: 21, nights: 7 },
  { fromLabel: "Los Angeles", toLabel: "Tokyo, Japan", fromCodes: ["LAX"], toCodes: ["HND", "NRT"], departInDays: 28, nights: 10 },
  { fromLabel: "Chicago", toLabel: "Paris, France", fromCodes: ["ORD"], toCodes: ["CDG", "ORY"], departInDays: 24, nights: 7 },
  { fromLabel: "San Francisco", toLabel: "Hong Kong, China", fromCodes: ["SFO"], toCodes: ["HKG"], departInDays: 30, nights: 8 },
  { fromLabel: "Boston", toLabel: "Dublin, Ireland", fromCodes: ["BOS"], toCodes: ["DUB"], departInDays: 20, nights: 6 },
  { fromLabel: "Los Angeles", toLabel: "Seoul, South Korea", fromCodes: ["LAX"], toCodes: ["ICN"], departInDays: 26, nights: 9 },
];

@Component({
  selector: "app-popular-routes",
  imports: [NgFor],
  templateUrl: "./popular-routes.component.html",
  styleUrl: "./popular-routes.component.scss",
})
export class PopularRoutesComponent {
  // Optional: <app-popular-routes [routes]="myRoutes"></app-popular-routes>
  @Input() routes: PopularRoute[] = DEFAULT_ROUTES;

  loadingRoute: PopularRoute | null = null;

  private flightService = inject(FlightService);
  private flightFilter = inject(FlightFilterService);
  private searchService = inject(SearchService);
  private toasterService = inject(TosterService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Card click → flight search (same as FlightsTabComponent.searchFlights)
  async searchRoute(route: PopularRoute): Promise<void> {
    if (!route || this.loadingRoute) return;

    this.loadingRoute = route;
    this.cdr.markForCheck();
    console.log(`[Popular routes] clicked: ${route.fromLabel} → ${route.toLabel}`);

    try {
      const departure = await this.findFirstAirport(route.fromCodes, route.fromLabel);
      const arrival = await this.findFirstAirport(route.toCodes, route.toLabel);

      if (!departure || !arrival) {
        this.toasterService.showError(`Unable to find airports for ${route.fromLabel} to ${route.toLabel}`);
        return;
      }

      const { ob, ib } = this.getDates(route);

      const payload = {
        originDestination: [
          { DepartureTime: this.toDDMMYYYY(ob), DepartureLocationCode: departure.code, ArrivalLocationCode: arrival.code },
          { DepartureTime: this.toDDMMYYYY(ib), DepartureLocationCode: arrival.code, ArrivalLocationCode: departure.code },
        ],
      };

      const queryParams = {
        CabinClass: "E",
        NoOfAdults: 1,
        NoOfInfants: 0,
        NoOfChildren: 0,
        tripType: "roundtrip",
        source: "all",
        MarketingAirlineName: "",
        providers: "",
        CurrencyCode: "USD",
        OC: departure.country,
        maxResultsPerProvider: 60,
        limit: 180,
        tag: "",
      };

      const storedParams = {
        ...queryParams,
        departureCity: departure.city,
        arrivalCity: arrival.city,
        departureCountry: departure.country,
        arrivalCountry: arrival.country,
      };

      const isDomestic = !!departure.country && departure.country === arrival.country;

      if (isPlatformBrowser(this.platformId)) {
        try {
          localStorage.setItem("isDomestic", JSON.stringify(isDomestic));
        } catch {}
      }

      console.log(`[Popular routes] ${departure.code} (${departure.city}) → ${arrival.code} (${arrival.city}) | domestic: ${isDomestic}`, { payload, storedParams });

      this.searchService.setSearchData(payload);
      this.flightFilter.resetFilters();
      this.flightService.clearFlights();
      this.searchService.setSearchParamsData(storedParams);

      this.router.navigate(["/flights-list"], { queryParams });
    } catch (err) {
      console.error("[Popular routes] search failed:", err);
      this.toasterService.showError("Unable to search flights. Please try again.");
    } finally {
      this.loadingRoute = null;
      this.cdr.markForCheck();
    }
  }

  // First code your airport API knows; if none, still use the first code
  private async findFirstAirport(codes: string[], label: string): Promise<RouteAirport | null> {
    for (const code of codes || []) {
      const airport = await this.lookupAirport(code);
      if (airport) return airport;
      console.warn(`[Popular routes] ${code} not found in airport API, trying next`);
    }

    const first = codes?.[0];
    return first
      ? { code: first.toUpperCase(), city: label.split(",")[0].trim(), country: "", airport_name: "" }
      : null;
  }

  // Same match as flights-tab fetchAirportAndSetCountry()
  private async lookupAirport(code: string): Promise<RouteAirport | null> {
    if (!code) return null;

    try {
      const res: any = await firstValueFrom(this.flightService.airportlList(code).pipe(timeout(10000)));
      if (!res?.success || !res.data?.length) return null;

      const upper = code.toUpperCase();
      const airport =
        res.data.find((a: any) => String(a.airport_code).toUpperCase() === upper) ||
        res.data.flatMap((a: any) => a.groupData || []).find((a: any) => String(a.airport_code).toUpperCase() === upper);

      if (!airport) return null;

      return {
        code: upper,
        city: airport.city || airport.state || "",
        country: airport.country || "",
        airport_name: airport.airport_name || "",
      };
    } catch (err) {
      console.warn(`[Popular routes] airport lookup ${code} failed:`, err);
      return null;
    }
  }

  private getDates(route: PopularRoute): { ob: Date; ib: Date } {
    const ob = new Date();
    ob.setHours(0, 0, 0, 0);
    ob.setDate(ob.getDate() + (route.departInDays ?? 21));

    const ib = new Date(ob);
    ib.setDate(ib.getDate() + (route.nights ?? 7));

    return { ob, ib };
  }

  private toDDMMYYYY(date: Date): string {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${date.getFullYear()}`;
  }
}