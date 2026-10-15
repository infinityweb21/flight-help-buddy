import { Component, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges, inject, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightFilters, FlightFilterService } from '../../../services/flight/flight-filter.service';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: "app-flight-filter-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, SliderModule],
  templateUrl: "./flight-filter-modal.component.html",
  styleUrls: ["./flight-filter-modal.component.scss"],
})
export class FlightFilterModalComponent {
  @Input() initialFilters!: FlightFilters;
  readonly stopOptions = input<any[]>([]);
  @Input() fullStopWiseLowestFare: Record<string, number> = {};
  @Input() getAllTimedetails: any;
  @Input() getFlightAllDetails: any;
  @Input() visibleAirlines: any;
  @Input() finalLayoverFlights: any;
  @Input() getNearbyfare: any;
  @Output() apply = new EventEmitter<FlightFilters>();
  @Output() clear = new EventEmitter<void>();
  mobileFilters!: FlightFilters;
  mobileSliderValue: [number, number] = [0, 0];
  showArrivalTimeFilters: boolean = false;
  showReturnArrivalTimeFilters: boolean = false;
  private filterService: FlightFilterService = inject(FlightFilterService);
  @Input() sliderValue: number[] = [0, 0];
  @Input() lowestPrice: number = 0;
  @Input() highestPrice: number = 0;
  @Input() getrangeValues: number[] = [0, 0];
  @Input() getarrivalDurations: number = 0;
  @Input() getdepartureDurations: number = 0;
  @Input() getDurations: { [key: string]: number } = {};
  minValue: number = 0;
  maxValue: number = 0;
  minPercent: number = 0;
  maxPercent: number = 100;
  priceRange: number[] = [0, 1000];
  minGap: number = 50;
  departureDurationChanged = false;
  arrivalDurationChanged = false;
  activeThumb: "min" | "max" | null = null;
  searchAirline: string = "";
  filteredAirlines: any[] = [];
  markup:number=10;
  ngOnChanges() {
    this.filteredAirlines = this.visibleAirlines || [];
    this.filterAirlines();

    if (this.sliderValue?.length === 2) {
      this.minValue = this.lowestPrice;
      this.maxValue = this.highestPrice;
    }

    // ✅ IMPORTANT: sync filters when modal reopens
    if (this.initialFilters) {
      this.mobileFilters = {
        ...this.initialFilters,
        durations: { ...(this.initialFilters.durations || {}) }
      };
    }
  }

  updateSlider(thumb: "min" | "max"): void {
    const minGap = 50;

    if (thumb === "min") {
      // Clamp minValue
      if (this.minValue < this.lowestPrice) this.minValue = this.lowestPrice;
      if (this.minValue > this.maxValue - minGap)
        this.minValue = this.maxValue - minGap;
    } else {
      // Clamp maxValue
      if (this.maxValue > this.highestPrice) this.maxValue = this.highestPrice;
      if (this.maxValue < this.minValue + minGap)
        this.maxValue = this.minValue + minGap;
    }

    // Recalculate percentages for labels
    const range = this.highestPrice - this.lowestPrice;
    this.minPercent = ((this.minValue - this.lowestPrice) / range) * 100;
    this.maxPercent = ((this.maxValue - this.lowestPrice) / range) * 100;

    // Update mobileFilters
    if (this.mobileFilters) {
      this.mobileFilters.rangeValues = [this.minValue, this.maxValue];
    }
  }

  // Called when user starts dragging a thumb
  setActiveThumb(thumb: "min" | "max") {
    this.activeThumb = thumb;
  }

  // Called when user stops dragging a thumb
  clearActiveThumb() {
    this.activeThumb = null;
  }

  isAndroid = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit() {
    if (this.initialFilters) {
      // ✅ Deep copy (VERY IMPORTANT)
      this.mobileFilters = {
        ...this.initialFilters,
        durations: { ...(this.initialFilters.durations || {}) }
      };

      this.priceRange = [
        this.mobileFilters.rangeValues[0],
        this.mobileFilters.rangeValues[1],
      ];
    }

    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }
  }

  onPriceChange(event: any) {
    // Apply minGap manually
    if (this.priceRange[1] - this.priceRange[0] < this.minGap) {
      if (event.values[0] !== this.priceRange[0]) {
        // User changed left thumb
        this.priceRange[0] = this.priceRange[1] - this.minGap;
      } else {
        // User changed right thumb
        this.priceRange[1] = this.priceRange[0] + this.minGap;
      }
    }

    // Update mobileFilters
    if (this.mobileFilters) {
      this.mobileFilters.rangeValues = [...this.priceRange];
    }

    // Check and update getrangeValues
  }

  resetPrice() {
    this.priceRange = [this.lowestPrice, this.highestPrice];
    if (this.mobileFilters) {
      this.mobileFilters.rangeValues = [...this.priceRange];
    }
    // Check and update getrangeValues
    // this.updatePriceRange();
  }

  /**
   * Update getrangeValues if all values match
   */
  updatePriceRange() {
    const [low, high] = this.getrangeValues;

    if (
      this.lowestPrice === this.priceRange[0] &&
      this.highestPrice === this.priceRange[1] &&
      this.priceRange[0] === low &&
      this.priceRange[1] === high
    ) {
      // Values match, just update priceRange
      this.priceRange = [low, high];
    } else {
      // Values don't match, push new values
      this.priceRange = [low, high];
    }

    // Also, update mobileFilters if needed
    if (this.mobileFilters) {
      this.mobileFilters.rangeValues = [...this.priceRange];
    }
  }

  getTotalPrice(ccMax: number): number {
    return ccMax;
  }
//     getTotalPrice(CCMax: number): number {
//   return CCMax * (1 + this.markup / 100);
// }
  onStopChange(value: string, event: any) {
    const isChecked = event.target.checked;
    // Convert the string 'value' (e.g., "0", "1", "2") to a number (0, 1, 2)
    const numericValue = parseInt(value, 10);

    if (isChecked) {
      // Add the number to the number[] array
      this.mobileFilters.stopes.push(numericValue);
    } else {
      // Filter by comparing the number
      this.mobileFilters.stopes = this.mobileFilters.stopes.filter(
        (v) => v !== numericValue
      );
    }
  }

  // --- Action Buttons ---

  onApplyClick() {
    this.apply.emit(this.mobileFilters);
  }

  onClearClick() {
    this.mobileFilters = {
      airlines: [],
      stopes: [],
      rangeValues: [0, 1000000],
      departureTime: [],
      arrivalTime: [],
      returnDepartureTime: [],
      returnArrivalTime: [],
      connectingAirports: [],
      getNearbyfaredepart: [],
      getNearbyfarereturn: [],
      durations: {},
      sortBy: "",
    };
  }
  onClearStopsClick() {
    // Clear only the stops filter in the local state
    this.mobileFilters.stopes = [];
    this.filterService.setFilters(this.mobileFilters);
  }
  resetAlltime() {
    this.mobileFilters.departureTime = [];
    this.mobileFilters.arrivalTime = [];
    this.mobileFilters.returnDepartureTime = [];
    this.mobileFilters.returnArrivalTime = [];
  }

  resetAlldepartureTime() {
    this.mobileFilters.departureTime = [];
  }
  resetAllarrivalTime() {
    this.mobileFilters.arrivalTime = [];
  }
  resetAllreturnDepartureTime() {
    this.mobileFilters.returnDepartureTime = [];
  }
  resetAllreturnArrivalTime() {
    this.mobileFilters.returnArrivalTime = [];
  }
  toggleAirlineSelection(carrierName: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.mobileFilters.airlines.includes(carrierName)) {
        this.mobileFilters.airlines.push(carrierName);
      }
    } else {
      this.mobileFilters.airlines = this.mobileFilters.airlines.filter(
        (name) => name !== carrierName
      );
    }
  }
  filterAirlines() {
    const search = this.searchAirline.trim().toLowerCase();

    if (!search) {
      this.filteredAirlines = [...this.visibleAirlines];
    } else {
      this.filteredAirlines = this.visibleAirlines.filter((carrier: any) =>
        carrier.ValidatingCarrierName.toLowerCase().includes(search)
      );
    }
  }

  onClearAirlines() {
    this.mobileFilters.airlines = [];
  }

  // Toggle function for connecting airports
  toggleConnectingAirport(airport: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.mobileFilters.connectingAirports.includes(airport)) {
        this.mobileFilters.connectingAirports.push(airport);
      }
    } else {
      this.mobileFilters.connectingAirports =
        this.mobileFilters.connectingAirports.filter((a) => a !== airport);
    }
  }
  // Select all airports
  selectAllAirports(): void {
    this.mobileFilters.connectingAirports =
      this.finalLayoverFlights.segment.map(
        (s: { DepartureLocationCode: any }) => s.DepartureLocationCode
      );
  }

  // Select none
  selectNoneAirports(): void {
    this.mobileFilters.connectingAirports = [];
  }
  // Toggle function for connecting airports
  togglegetNearbyfaredepart(airport: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.mobileFilters.getNearbyfaredepart.includes(airport)) {
        this.mobileFilters.getNearbyfaredepart.push(airport);
      }
    } else {
      this.mobileFilters.getNearbyfaredepart =
        this.mobileFilters.getNearbyfaredepart.filter((a) => a !== airport);
    }
  }
  togglegetNearbyfarereturn(airport: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.mobileFilters.getNearbyfarereturn.includes(airport)) {
        this.mobileFilters.getNearbyfarereturn.push(airport);
      }
    } else {
      this.mobileFilters.getNearbyfarereturn =
        this.mobileFilters.getNearbyfarereturn.filter((a) => a !== airport);
    }
  }

  // Convert "41H 0M" → total minutes
  getMaxMinutes(duration: string): number {
    if (!duration) return 0;
    const hours = parseInt(duration.match(/(\d+)H/)?.[1] || "0", 10);
    const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || "0", 10);
    return hours * 60 + minutes;
  }

  // Convert total minutes → readable object {hours, minutes}
  formatDuration(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }

  // Get current duration value (in minutes)
  getCurrentDuration(type: string): number {
    return this.mobileFilters.durations?.[type] ?? 0;
  }
  // Called when user changes the duration slider or inputs
  onDurationChange(type: string, event: Event): void {
    const inputValue = Number((event.target as HTMLInputElement).value);

    const dur = this.finalLayoverFlights?.duration.find(
      (d: any) => d.type === type
    );

    const max = dur ? this.getMaxMinutes(dur.highestDuration) : 0;

    if (!this.mobileFilters.durations) {
      this.mobileFilters.durations = {};
    }

    const finalValue = inputValue ?? max;

    // ✅ store value
    this.mobileFilters.durations[type] = finalValue;

    // ✅ track change (important for UI dot)
    if (type === "departure") {
      this.departureDurationChanged = finalValue !== max;
    } else {
      this.arrivalDurationChanged = finalValue !== max;
    }
  }
  // Reset single duration based on type ('departure' or 'arrival')
  resetDuration(type: string): void {
    console.log("RESET CLICKED:", type);

    const dur = this.finalLayoverFlights?.duration?.find(
      (d: any) => d.type === type
    );
    if (!dur) return;

    const max = this.getMaxMinutes(dur.highestDuration);

    if (!this.mobileFilters.durations) {
      this.mobileFilters.durations = {};
    }

    // ✅ ALWAYS reset to max
    this.mobileFilters.durations[type] = max;

    console.log("✅ Reset to MAX:", max);

    // ✅ update flags
    if (type === "departure" || type === "cp_0") {
      this.departureDurationChanged = false;
    } else {
      this.arrivalDurationChanged = false;
    }
  }

  // Reset all durations in one call
  resetAllDurations(): void {
    if (!this.mobileFilters.durations) {
      this.mobileFilters.durations = {};
    }

    this.finalLayoverFlights?.duration?.forEach((dur: any) => {
      const max = this.getMaxMinutes(dur.highestDuration);

      // ✅ always reset to max
      this.mobileFilters.durations[dur.type] = max;

      console.log(`Reset ${dur.type} →`, max);

      if (dur.type === "departure" || dur.type === "cp_0") {
        this.departureDurationChanged = false;
      } else {
        this.arrivalDurationChanged = false;
      }
    });
  }

  getFillPercent(value: number, max: number): number {
    // ✅ Both zero → fully black
    if (value === 0 && max === 0) return 0;

    // ✅ Value zero but max exists → fully black
    if (value === 0) return 0;

    // ✅ Safety
    if (max === 0) return 0;

    // ✅ Normal case
    return (value / max) * 100;
  }
  hasDurationChanges(): boolean {
    if (!this.mobileFilters?.durations || !this.finalLayoverFlights?.duration) {
      return false;
    }

    return this.finalLayoverFlights.duration.some((dur: any) => {
      const current = this.mobileFilters.durations?.[dur.type] ?? 0;
      const max = this.getMaxMinutes(dur.highestDuration);

      return current !== max; // ✅ changed from default
    });
  }


  toggleDepartureTime(time: string) {

    const index = this.mobileFilters.departureTime.indexOf(time);

    if (index > -1) {
      this.mobileFilters.departureTime.splice(index, 1);
    } else {
      this.mobileFilters.departureTime.push(time);
    }


  }
  toggleReturnDepartureTime(time: string) {

    const index = this.mobileFilters.returnDepartureTime.indexOf(time);

    if (index > -1) {
      this.mobileFilters.returnDepartureTime.splice(index, 1);
    } else {
      this.mobileFilters.returnDepartureTime.push(time);
    }


  }
  toggleArrivalTime(time: string) {

    const index = this.mobileFilters.arrivalTime.indexOf(time);

    if (index > -1) {
      this.mobileFilters.arrivalTime.splice(index, 1);
    } else {
      this.mobileFilters.arrivalTime.push(time);
    }


  }
  toggleReturnArrivalTime(time: string) {

    const index = this.mobileFilters.returnArrivalTime.indexOf(time);

    if (index > -1) {
      this.mobileFilters.returnArrivalTime.splice(index, 1);
    } else {
      this.mobileFilters.returnArrivalTime.push(time);
    }


  }
    onSeveralFlightsChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.mobileFilters.severalFlights = checked;

  }

  getTimeDetails() {
  return this.getAllTimedetails?.[1] || this.getAllTimedetails?.[0];
}
}
