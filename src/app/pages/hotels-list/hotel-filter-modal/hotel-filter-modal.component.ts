import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { DeviceService } from '../../../services/shared/device.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hotel-filter-modal',
  imports: [CommonModule],
  templateUrl: './hotel-filter-modal.component.html',
  styleUrl: './hotel-filter-modal.component.scss'
})
export class HotelFilterModalComponent implements OnInit {

  private deviceService = inject(DeviceService);

  @Input() filtersData: any = {};

  @Input() selectedHotelName: number[] = [];
  @Input() selectedStarRatings: number[] = [];
  @Input() selectedGuestRatings: number[] = [];
  @Input() selectedMealPlans: string[] = [];
  @Input() selectedAmenities: string[] = [];
  @Input() selectedPropertyTypes: string[] = [];
  @Input() selectedLocations: string[] = [];
  @Input() selectedLandmarks: string[] = [];

  @Input() min: number = 0;
  @Input() max: number = 1000;
  @Input() minValue: number = 0;
  @Input() maxValue: number = 1000;
  @Input() averagePrice: number = 0;

  @Input() data: number[] = [];

  @Output() apply = new EventEmitter<any>();

  isAndroid = false;
  isBrowser = false;
  isMobile = false;
  isDesktop = false;

  constructor(
    private eRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);

    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });

  }

  ngOnInit(): void {

    this.checkScreen();

    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }

  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreen();
  }

  private checkScreen(): void {
    this.isDesktop = window.innerWidth >= 992;
  }

  // =========================
  // PRICE
  // =========================

  get minPercent() {
    return (
      ((this.minValue - this.min) /
        (this.max - this.min)) * 100
    );
  }

  get maxPercent() {
    return (
      ((this.maxValue - this.min) /
        (this.max - this.min)) * 100
    );
  }

  onMinChange(value: number) {

    const newValue = Number(value);

    if (newValue >= this.maxValue) return;

    this.minValue = newValue;


  }

  onMaxChange(value: number) {

    const newValue = Number(value);

    if (newValue <= this.minValue) return;

    this.maxValue = newValue;


  }

  isActiveBar(index: number): boolean {

    const totalBars = this.data.length;

    const barMinPrice =
      this.min +
      ((this.max - this.min) / totalBars) * index;

    const barMaxPrice =
      this.min +
      ((this.max - this.min) / totalBars) * (index + 1);

    return (
      barMaxPrice >= this.minValue &&
      barMinPrice <= this.maxValue
    );

  }

  // =========================
  // TOGGLES
  // =========================

  toggleSelection(
    array: any[],
    value: any,
    checked: boolean
  ) {

    if (checked) {

      if (!array.includes(value)) {
        array.push(value);
      }

    } else {

      const index = array.indexOf(value);

      if (index > -1) {
        array.splice(index, 1);
      }

    }


  }
  resetHotelRating() {
    this.selectedStarRatings = [];
    this.cdr.detectChanges();
  }

  resetGuestRating() {
    this.selectedGuestRatings = [];
    this.cdr.detectChanges();
  }

  resetMealPlan() {
    this.selectedMealPlans = [];
    this.cdr.detectChanges();
  }

  resetAmenities() {
    this.selectedAmenities = [];
    this.cdr.detectChanges();
  }

  resetPropertyType() {
    this.selectedPropertyTypes = [];
    this.cdr.detectChanges();
  }

  resetLocation() {
    this.selectedLocations = [];
    this.cdr.detectChanges();
  }

  resetLandmark() {
    this.selectedLandmarks = [];
    this.cdr.detectChanges();
  }

  resetPrice() {
    this.minValue = this.min;
    this.maxValue = this.max;
    this.cdr.detectChanges();
  }
  resetHotelName() {
   this.selectedHotelName = [];
    this.cdr.detectChanges();
  }
  // =========================
  // APPLY
  // =========================

  applyFilters() {

    this.apply.emit({

      selectedHotelName:
        this.selectedHotelName,
      selectedStarRatings:
        this.selectedStarRatings,

      selectedGuestRatings:
        this.selectedGuestRatings,

      selectedMealPlans:
        this.selectedMealPlans,

      selectedAmenities:
        this.selectedAmenities,

      selectedPropertyTypes:
        this.selectedPropertyTypes,

      selectedLocations:
        this.selectedLocations,

      selectedLandmarks:
        this.selectedLandmarks,

      minPrice: this.minValue,
      maxPrice: this.maxValue

    });

  }

  // =========================
  // RESET
  // =========================

  resetAll() {

    this.selectedHotelName = [];
    this.selectedStarRatings = [];
    this.selectedGuestRatings = [];
    this.selectedMealPlans = [];
    this.selectedAmenities = [];
    this.selectedPropertyTypes = [];
    this.selectedLocations = [];
    this.selectedLandmarks = [];

    this.minValue = this.min;
    this.maxValue = this.max;


  }
  hasHotelNameFilter(): boolean {
    return this.selectedHotelName.length > 0;
  }

  hasPriceFilter(): boolean {
    return this.minValue !== this.min || this.maxValue !== this.max;
  }

  hasStarFilter(): boolean {
    return this.selectedStarRatings.length > 0;
  }

  hasGuestFilter(): boolean {
    return this.selectedGuestRatings.length > 0;
  }

  hasAmenitiesFilter(): boolean {
    return this.selectedAmenities.length > 0;
  }

  hasMealFilter(): boolean {
    return this.selectedMealPlans.length > 0;
  }

  hasPropertyFilter(): boolean {
    return this.selectedPropertyTypes.length > 0;
  }

  hasLocationFilter(): boolean {
    return this.selectedLocations.length > 0;
  }

  hasLandmarkFilter(): boolean {
    return this.selectedLandmarks.length > 0;
  }
}