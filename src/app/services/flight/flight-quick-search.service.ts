import { Injectable, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { firstValueFrom, timeout } from "rxjs";

import { FlightService } from "./flight.service";
import { FlightFilterService } from "./flight-filter.service";
import { SearchService } from "../search.service";
import { TosterService } from "../common/toaster.service";

/*
 * ============================================
 * FLIGHT QUICK SEARCH
 * --------------------------------------------
 * One place for "click a card → search flights".
 * Builds the SAME request as
 * FlightsTabComponent.searchFlights() (roundtrip).
 * Use it from any component.
 * ============================================
 */

export interface QuickRouteAirport {
  code: string;
  city: string;
  country: string;
  airport_name: string;
}

export interface QuickSearchRequest {
  fromCodes: string[]; // main airport first
  toCodes: string[];
  fromLabel?: string;
  toLabel?: string;
  departInDays?: number; // departure = today + N days
  nights?: number; // return = departure + N days
}

@Injectable({ providedIn: "root" })
export class FlightQuickSearchService {
  private flightService = inject(FlightService);
  private flightFilter = inject(FlightFilterService);
  private searchService = inject(SearchService);
  private toasterService = inject(TosterService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private busy = false;

  // City → city round trip (e.g. MIA → HND)
  async searchCityToCity(req: QuickSearchRequest): Promise<boolean> {
    if (this.busy) return false;
    this.busy = true;

    const label = `${req.fromLabel || req.fromCodes?.[0]} → ${req.toLabel || req.toCodes?.[0]}`;
    console.log(`[Quick search] clicked: ${label}`);

    try {
      const departure = await this.findFirstAirport(req.fromCodes, req.fromLabel);
      const arrival = await this.findFirstAirport(req.toCodes, req.toLabel);

      if (!departure || !arrival) {
        this.toasterService.showError(`Unable to find airports for ${label}`);
        return false;
      }

      if (departure.code === arrival.code) {
        this.toasterService.showError("Departure & Arrival cities cannot be the same.");
        return false;
      }

      const { ob, ib } = this.getDates(req.departInDays, req.nights);
      this.searchRoundTrip(departure, arrival, ob, ib, label);
      return true;
    } catch (err) {
      console.error("[Quick search] failed:", err);
      this.toasterService.showError("Unable to search flights. Please try again.");
      return false;
    } finally {
      this.busy = false;
    }
  }

  // Build request + navigate (same as flights-tab searchFlights)
  searchRoundTrip(
    departure: QuickRouteAirport,
    arrival: QuickRouteAirport,
    ob: Date,
    ib: Date,
    label = "",
  ): void {
    const payload = {
      originDestination: [
        {
          DepartureTime: this.toDDMMYYYY(ob),
          DepartureLocationCode: departure.code,
          ArrivalLocationCode: arrival.code,
        },
        {
          DepartureTime: this.toDDMMYYYY(ib),
          DepartureLocationCode: arrival.code,
          ArrivalLocationCode: departure.code,
        },
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

    const isDomestic =
      !!departure.country && departure.country === arrival.country;

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem("isDomestic", JSON.stringify(isDomestic));
      } catch {
        // storage blocked - ignore
      }
    }

    console.log(
      `[Quick search] ${label}: ${departure.code} (${departure.city}) → ${arrival.code} (${arrival.city}) | domestic: ${isDomestic}`,
      { payload, storedParams },
    );

    this.searchService.setSearchData(payload);
    this.flightFilter.resetFilters();
    this.flightService.clearFlights();
    this.searchService.setSearchParamsData(storedParams);

    this.router.navigate(["/flights-list"], { queryParams });
  }

  // First code your airport API knows; if none, still use the first code
  async findFirstAirport(
    codes: string[],
    label = "",
  ): Promise<QuickRouteAirport | null> {
    for (const code of codes || []) {
      const airport = await this.lookupAirport(code);
      if (airport) return airport;
      console.warn(`[Quick search] ${code} not found in airport API, trying next`);
    }

    const first = codes?.[0];

    return first
      ? {
          code: first.toUpperCase(),
          city: (label || first).split(",")[0].trim(),
          country: "",
          airport_name: "",
        }
      : null;
  }

  // Same match as flights-tab fetchAirportAndSetCountry()
  async lookupAirport(code: string): Promise<QuickRouteAirport | null> {
    if (!code) return null;

    try {
      const res: any = await firstValueFrom(
        this.flightService.airportlList(code).pipe(timeout(10000)),
      );

      if (!res?.success || !res.data?.length) return null;

      const upper = code.toUpperCase();

      const airport =
        res.data.find((a: any) => String(a.airport_code).toUpperCase() === upper) ||
        res.data
          .flatMap((a: any) => a.groupData || [])
          .find((a: any) => String(a.airport_code).toUpperCase() === upper);

      if (!airport) return null;

      return {
        code: upper,
        city: airport.city || airport.state || "",
        country: airport.country || "",
        airport_name: airport.airport_name || "",
      };
    } catch (err) {
      console.warn(`[Quick search] airport lookup ${code} failed:`, err);
      return null;
    }
  }

  getDates(departInDays = 21, nights = 7): { ob: Date; ib: Date } {
    const ob = new Date();
    ob.setHours(0, 0, 0, 0);
    ob.setDate(ob.getDate() + departInDays);

    const ib = new Date(ob);
    ib.setDate(ib.getDate() + nights);

    return { ob, ib };
  }

  // "Oct 30 - Nov 6"
  getDateLabel(departInDays = 21, nights = 7): string {
    const { ob, ib } = this.getDates(departInDays, nights);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return `${ob.toLocaleDateString("en-US", options)} - ${ib.toLocaleDateString("en-US", options)}`;
  }

  private toDDMMYYYY(date: Date): string {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${date.getFullYear()}`;
  }
}