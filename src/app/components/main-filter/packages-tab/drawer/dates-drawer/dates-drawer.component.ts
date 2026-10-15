import { isPlatformBrowser, NgFor } from "@angular/common";
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  inject,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { DeviceService } from "../../../../../services/shared/device.service";
import { NgTemplateOutlet, NgClass } from "@angular/common";

@Component({
  selector: "app-dates-drawer",
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgTemplateOutlet,],
  templateUrl: "./dates-drawer.component.html",
  styleUrls: ["./dates-drawer.component.scss"],
})
export class DatesDrawerComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() titleTemplate: TemplateRef<any> | null = null;
  @Input() mode: "single" | "range" | "multiple" = "range";
  @Input() isArrival: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() isDomestic:boolean=true;
  
  /** Linked range inputs from parent */
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Input() segmentIndex: number | null = null;
  @Input() allSegments: any[] = [];
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() datesApplied = new EventEmitter<{
    departure: string;
    arrival?: string;
    formattedDeparture: string;
    formattedArrival?: string;
    segments?: any[];
  }>();
  @Output() datesChanged = new EventEmitter<{
    departure: string;
    arrival?: string;
    formattedDeparture: string;
    formattedArrival?: string;
    segments?: any[];
  }>();

  @ViewChild("calendarWrapper", { static: true }) calendarWrapper!: ElementRef;
  private deviceService = inject(DeviceService);

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  hoverDate: Date | null = null;
  today!: Date;
  months: {
    month: number;
    year: number;
    days: Date[];
    emptyDays: number[];
  }[] = [];
  isMobile: boolean = false;
  isTouchDevice = false;
  maxYear!: number;
  maxMonth = 11; // December (0–11)
  isBrowser = false;
  isRangeWithValue = false;
  isAndroid = false;
  private isInternalClick = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      //
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }
    this.deviceService.isMobile$.subscribe((status) => {
      this.isMobile = status;
    });
  }
  ngOnInit() {
    this.selectedStartDate = this.parseLocalDate(
      this.startDate || this.formGroup.get("departureDate")?.value,
    );
    this.selectedEndDate = this.parseLocalDate(
      this.endDate || this.formGroup.get("arrivalDate")?.value,
    );
    this.today = this.normalizeDate(new Date())!;
    // this.maxYear = this.today.getFullYear() + 1;
    const maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 11, 1);

  // 2. Extract calculated end boundaries dynamically
  this.maxMonth = maxDate.getMonth();
  this.maxYear = maxDate.getFullYear();
    if (this.mode === 'multiple' && this.segmentIndex !== null) {

      const currentSegment = this.allSegments?.[this.segmentIndex];

      // ✅ 1. If segment already has date → use it
      if (currentSegment?.departureDate) {
        this.selectedStartDate = this.parseLocalDate(currentSegment.departureDate);
      }
      // ✅ 2. If FIRST INDEX → fallback to startDate (startObj)
      else if (this.segmentIndex === 0 && this.startDate) {
        this.selectedStartDate = this.parseLocalDate(this.startDate);
      }
      // ✅ 3. If not first → fallback to previous segment
      else if (this.segmentIndex > 0) {
        const prevSegment = this.allSegments?.[this.segmentIndex - 1];

        if (prevSegment?.departureDate) {
          this.selectedStartDate = this.parseLocalDate(prevSegment.departureDate);
        } else {
          this.selectedStartDate = this.parseLocalDate(this.startDate) || null;
        }
      }
      // ✅ 4. Final fallback
      else {
        this.selectedStartDate = this.parseLocalDate(this.startDate) || null;
      }

      this.selectedEndDate = null;
    } else if (this.mode === "range") {
      this.selectedStartDate = this.parseLocalDate(
        this.startDate || this.formGroup.get("departureDate")?.value,
      );
      this.selectedEndDate = this.parseLocalDate(
        this.endDate || this.formGroup.get("arrivalDate")?.value,
      );
      this.isRangeWithValue = !!(
        this.selectedStartDate || this.selectedEndDate
      );
    } else {
      this.isRangeWithValue = false;
    }
    // ✅ DESKTOP
    if (!this.isMobile) {
      this.generateMonths(2, this.selectedStartDate ?? new Date());
    }

    // ✅ MOBILE
    if (this.isMobile) {
      this.generateMobileMonths();
      this.scrollToSelectedMonth();
    } // Desktop = 2 months. Mobile = 12 scrolling months.
    this.initializeDatesFromForm();
  }
  ngOnChanges(changes: SimpleChanges) {


    if (this.isInternalClick) {
      return;
    }
    if (changes["startDate"] || changes["endDate"] || changes["formGroup"]) {
      this.selectedStartDate = this.parseLocalDate(
        this.startDate || this.formGroup.get("departureDate")?.value,
      );
      this.selectedEndDate = this.parseLocalDate(
        this.endDate || this.formGroup.get("arrivalDate")?.value,
      );
      this.today = new Date()!;
      // this.maxYear = this.today.getFullYear() + 1;
          const maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 11, 1);

  // 2. Extract calculated end boundaries dynamically
  this.maxMonth = maxDate.getMonth();
  this.maxYear = maxDate.getFullYear();
      if (this.mode === 'multiple' && this.segmentIndex !== null) {

        const currentSegment = this.allSegments?.[this.segmentIndex];

        // ✅ 1. If segment already has date → use it
        if (currentSegment?.departureDate) {
          this.selectedStartDate = this.parseLocalDate(currentSegment.departureDate);
        }
        // ✅ 2. If FIRST INDEX → fallback to startDate (startObj)
        else if (this.segmentIndex === 0 && this.startDate) {
          this.selectedStartDate = this.parseLocalDate(this.startDate);
        }
        // ✅ 3. If not first → fallback to previous segment
        else if (this.segmentIndex > 0) {
          const prevSegment = this.allSegments?.[this.segmentIndex - 1];

          if (prevSegment?.departureDate) {
            this.selectedStartDate = this.parseLocalDate(prevSegment.departureDate);
          } else {
            this.selectedStartDate = this.parseLocalDate(this.startDate) || null;
          }
        }
        // ✅ 4. Final fallback
        else {
          this.selectedStartDate = this.parseLocalDate(this.startDate) || null;
        }

        this.selectedEndDate = null;
      } else if (this.mode === "range") {
        this.selectedStartDate = this.parseLocalDate(
          this.startDate || this.formGroup.get("departureDate")?.value,
        );
        this.selectedEndDate = this.parseLocalDate(
          this.endDate || this.formGroup.get("arrivalDate")?.value,
        );
        this.isRangeWithValue = !!(
          this.selectedStartDate || this.selectedEndDate
        );
      } else {
        this.isRangeWithValue = false;
      }
      // 🔥 Re-generate months when drawer opens again
      // ✅ DESKTOP
      if (!this.isMobile) {
        this.generateMonths(2, this.selectedStartDate ?? new Date());
      }

      // ✅ MOBILE
      if (this.isMobile) {
        this.generateMobileMonths();
        this.scrollToSelectedMonth();
      }
      this.initializeDatesFromForm();
    }
  }

  private initializeDatesFromForm() {
    if (this.mode === "single" && this.formGroup.get(this.controlName)?.value) {
      this.selectedStartDate = this.parseLocalDate(
        this.formGroup.get(this.controlName)!.value,
      );
      this.selectedEndDate = null;
    } else if (this.mode === "range") {
      if (this.formGroup.get("departureDate")?.value) {
        this.selectedStartDate = this.parseLocalDate(
          this.formGroup.get("departureDate")!.value,
        );
      } else {
        this.selectedStartDate = null;
      }

      if (this.formGroup.get("arrivalDate")?.value) {
        this.selectedEndDate = this.parseLocalDate(
          this.formGroup.get("arrivalDate")!.value,
        );
      } else {
        this.selectedEndDate = null;
      }
    } else if (this.mode === 'multiple' && this.segmentIndex !== null) {
      const seg = this.allSegments?.[this.segmentIndex];

      if (seg?.departureDate) {
        this.selectedStartDate = this.parseLocalDate(seg.departureDate);
      }
      this.selectedEndDate = null;
    }
  }

  // private generateMobileMonths() {
  //   let baseDate: Date;

  //   if (this.selectedStartDate) {
  //     baseDate = new Date(this.selectedStartDate.getFullYear(), 0, 1);
  //   } else {
  //     baseDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  //   }

  //   this.generateMonths(12, baseDate);
  // }
private generateMobileMonths() {
  // Always start rendering from the CURRENT month (e.g., August 2026)
  const baseDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);

  // Generate 12 rolling months (August 2026 -> July 2027)
  this.generateMonths(12, baseDate);
}

  private generateMonths(count: number, baseDate?: Date) {
    this.months = [];

    const startDate = baseDate ?? new Date();

    let startMonth = startDate.getMonth();
    let startYear = startDate.getFullYear();

    for (let i = 0; i < count; i++) {
      const month = (startMonth + i) % 12;
      const year = startYear + Math.floor((startMonth + i) / 12);

      this.months.push({
        month,
        year,
        days: this.buildDays(month, year),
        emptyDays: this.getEmptyDays(month, year),
      });
    }
  }
  

  private scrollToSelectedMonth() {
    if (!this.isMobile || !this.selectedStartDate) return;

    requestAnimationFrame(() => {
      const el = document.querySelector(".selected-month");
      el?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
  }

  buildDays(month: number, year: number): Date[] {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  // isPastDate(date: Date): boolean {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   if (this.mode === 'multiple') {
  //     const minDate = this.getMinDateForMulti();
  //     if (minDate && date < minDate) return true;
  //   }

  //   return date.getTime() < today.getTime();
  // }
isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!this.isDomestic && this.mode !== 'multiple') {
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2); 

    return date < minDate;
  }

  if (this.mode === 'multiple') {
    const minDate = this.getMinDateForMulti();
    if (minDate && date < minDate) return true;
  }

  return date.getTime() < today.getTime();
}
  getMonthName(month: number, year: number): string {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return year === new Date().getFullYear()
      ? monthNames[month]
      : `${monthNames[month]} ${year}`;
  }


  onDayHover(date: Date) {
    if (this.isTouchDevice) return;

    if (
      this.mode === 'range' &&
      !this.selectedEndDate &&
      !this.isPastDate(date)
    ) {
      this.hoverDate = date;
    }
  }

  // onDayHover(date: Date) {
  //   if (this.isTouchDevice) return;
  //   if (
  //     this.mode === "range" &&
  //     this.selectedStartDate &&
  //     !this.selectedEndDate &&
  //     !this.isPastDate(date)
  //   ) {
  //     this.hoverDate = date;
  //   }
  // }
  onDayLeave() {
    if (!this.isTouchDevice) this.hoverDate = null;
  }

  isSelected(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.selectedStartDate && date.toDateString() === today.toDateString()) {
      return true;
    }

    if (this.mode === 'single') {
      return this.selectedStartDate?.toDateString() === date.toDateString();
    }
    if (this.mode === 'multiple') {
      return this.selectedStartDate?.toDateString() === date.toDateString();
    }
    // 🔥 RANGE WITH HOVER (BOTH DIRECTIONS)
    if (this.selectedStartDate && !this.selectedEndDate && this.hoverDate) {
      const min = this.hoverDate < this.selectedStartDate
        ? this.hoverDate
        : this.selectedStartDate;

      const max = this.hoverDate > this.selectedStartDate
        ? this.hoverDate
        : this.selectedStartDate;

      return date >= min && date <= max;
    }

    // FINAL RANGE
    if (this.selectedStartDate && this.selectedEndDate) {
      return date >= this.selectedStartDate && date <= this.selectedEndDate;
    }

    return false;
  }
  // isSelected(date: Date): any {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   if (!this.selectedStartDate && date.toDateString() === today.toDateString())
  //     return true;

  //   if (this.mode === "single") {
  //     return this.selectedStartDate?.toDateString() === date.toDateString();
  //   } else {
  //     const isSelectedRange =
  //       this.selectedStartDate &&
  //       this.selectedEndDate &&
  //       date >= this.selectedStartDate &&
  //       date <= this.selectedEndDate;
  //     const isHoverRange =
  //       this.selectedStartDate &&
  //       this.hoverDate &&
  //       date >= this.selectedStartDate &&
  //       date <= this.hoverDate;
  //     return isSelectedRange || isHoverRange;
  //   }
  // }

  isStartOfRange(date: Date): boolean {
    return (
      this.mode === "range" &&
      this.selectedStartDate?.toDateString() === date.toDateString()
    );
  }

  isEndOfRange(date: Date): boolean {
    return (
      this.mode === "range" &&
      this.selectedEndDate?.toDateString() === date.toDateString()
    );
  }

  applyDates(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // 🔥 MULTI-CITY MODE (NEW)
    if (this.mode === 'multiple') {

      const start = this.selectedStartDate
        ? this.normalizeDate(this.selectedStartDate)
        : null;

      const startStr = start ? this.formatDate(start) : "";

      // ✅ Cascade update (same as datesChanged)
      const updatedSegments = [...this.allSegments];

      if (this.segmentIndex !== null) {
        for (let i = this.segmentIndex; i < updatedSegments.length; i++) {
          const currentDate = this.parseLocalDate(updatedSegments[i]?.departureDate);

          if (!currentDate || currentDate < this.selectedStartDate!) {
            updatedSegments[i].departureDate = startStr;
          }
        }
      }

      // ✅ Emit applied event with segments
      this.datesApplied.emit({
        departure: startStr,
        formattedDeparture: start
          ? start.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "",
        segments: updatedSegments // 🔥 IMPORTANT
      });

      // ✅ Update current form only
      this.formGroup.get('departureDate')?.setValue(startStr);

      setTimeout(() => this.closeDrawer.emit(), 100);
      return;
    }

    // ===============================
    // ✅ EXISTING LOGIC (UNCHANGED)
    // ===============================

    const start = this.selectedStartDate
      ? this.normalizeDate(this.selectedStartDate)
      : null;

    const end = this.selectedEndDate
      ? this.normalizeDate(this.selectedEndDate)
      : null;

    const startStr = start ? this.formatDate(start) : "";
    const endStr = end ? this.formatDate(end) : "";

    this.datesApplied.emit({
      departure: startStr,
      arrival: endStr || undefined,
      formattedDeparture: start
        ? start.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "",
      formattedArrival: end
        ? end.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "",
    });

    if (this.mode === "single") {
      this.formGroup.get(this.controlName)?.setValue(startStr);
    } else {
      this.formGroup.get("departureDate")?.setValue(startStr);
      this.formGroup.get("arrivalDate")?.setValue(endStr);
    }

    setTimeout(() => this.closeDrawer.emit(), 100);
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = ("0" + (date.getMonth() + 1)).slice(-2);
    const d = ("0" + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
  }

  getDaysInMonth(month: number, year: number): Date[] {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getEmptyDays(month: number, year: number): number[] {
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
    return Array(offset).fill(0);
  }

  handleDateClick(date: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // 🔥 Mark that change is coming from inside calendar click
    this.isInternalClick = true;

    this.selectDate(date, this.isArrival);

    // ✅ Reset after Angular finishes update cycle
    setTimeout(() => {
      this.isInternalClick = false;
    }, 0);
  }

  selectDate(date: Date, isArrival: boolean) {
    this._selectDate(date, isArrival);

    if (!this.isMobile) {

      if (this.mode === "single") {
        this.applyDates();
        return;
      }

      if (
        this.mode === "range" &&
        this.selectedStartDate &&
        this.selectedEndDate
      ) {
        this.applyDates();
        return;
      }

      // ✅ 🔥 ADD THIS BLOCK FOR MULTIPLE
      if (this.mode === "multiple" && this.selectedStartDate) {
        this.applyDates(); // 👈 THIS WAS MISSING
        return;
      }
    }
  }

  private getMinDateForMulti(): Date | null {
    if (this.mode !== 'multiple' || this.segmentIndex === null) return null;

    const baseStart = this.parseLocalDate(this.startDate); // 🔥 startObj

    // ✅ INDEX 0 → use startDate OR today
    if (this.segmentIndex === 0) {
      return baseStart || this.today;
    }

    // ✅ PREVIOUS SEGMENT DATE
    const prevSegment = this.allSegments?.[this.segmentIndex - 1];
    const prevDate = prevSegment?.departureDate
      ? this.parseLocalDate(prevSegment.departureDate)
      : null;

    // ✅ FINAL MIN = MAX(startDate, previousSegment)
    if (baseStart && prevDate) {
      return prevDate > baseStart ? prevDate : baseStart;
    }

    return prevDate || baseStart || this.today;
  }

  private _selectDate(date: Date, isArrival: boolean) {
    if (this.isPastDate(date)) return;

    const normalized = this.normalizeDate(date);

    // ✅ SINGLE MODE
    if (this.mode === "single") {
      this.selectedStartDate = normalized;
      this.selectedEndDate = null;

      // ✅ Instant update
      this.emitInstantDates();
      return;
    }
    if (this.mode === 'multiple') {
      const minDate = this.getMinDateForMulti();

      if (minDate && date < minDate) {
        return; // ❌ block selection
      }

      const normalized = this.normalizeDate(date);

      this.selectedStartDate = normalized;
      this.selectedEndDate = null;

      // ✅ Emit instantly
      this.emitInstantDates();

      return;
    }
    const start = this.selectedStartDate;
    const end = this.selectedEndDate;

    // ===============================
    // ✅ FIRST CLICK → Start Date
    // ===============================
    if (!start) {
      this.selectedStartDate = normalized;
      this.selectedEndDate = null;

      // ✅ Instant update after first click
      this.emitInstantDates();
      return;
    }

    // ===============================
    // ✅ SECOND CLICK → End Date
    // ===============================
    if (!end) {
      if (date >= start) {
        this.selectedEndDate = normalized;
      } else {
        // Swap if earlier
        this.selectedEndDate = start;
        this.selectedStartDate = normalized;
      }

      // ✅ Instant update after second click
      this.emitInstantDates();
      return;
    }

    // ===============================
    // ✅ THIRD CLICK → Reset Logic
    // ===============================
    if (isArrival) {
      // ARRIVAL adjustment
      if (date > end) {
        this.selectedEndDate = normalized;
      } else if (date < start) {
        this.selectedStartDate = normalized;
        this.selectedEndDate = null;
        this.isRangeWithValue = false;
      } else {
        this.selectedEndDate = normalized;
      }
    } else {
      // DEPARTURE adjustment
      if (date < start) {
        this.selectedStartDate = normalized;
      } else if (date > end) {
        this.selectedStartDate = normalized;
        this.selectedEndDate = null;
        this.isRangeWithValue = false;
      } else {
        this.selectedStartDate = normalized;
      }
    }

    // ✅ Instant update again after reset/change
    this.emitInstantDates();
  }
  private emitInstantDates() {
    const start = this.selectedStartDate
      ? this.formatDate(this.selectedStartDate)
      : "";

    const end = this.selectedEndDate
      ? this.formatDate(this.selectedEndDate)
      : "";

    // ✅ MULTI-CITY CASCADE UPDATE
    if (this.mode === 'multiple' && this.segmentIndex !== null) {
      const updatedSegments = [...this.allSegments];

      for (let i = this.segmentIndex; i < updatedSegments.length; i++) {
        const currentDate = this.parseLocalDate(updatedSegments[i]?.departureDate);

        if (!currentDate || currentDate < this.selectedStartDate!) {
          updatedSegments[i].departureDate = start;
        }
      }

      this.datesChanged.emit({
        departure: start,
        formattedDeparture: this.selectedStartDate
          ? this.selectedStartDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "",
        // 🔥 send full updated segments
        segments: updatedSegments,
      });

      return;
    }

    // ✅ DEFAULT (existing logic untouched)
    this.datesChanged.emit({
      departure: start,
      arrival: end || undefined,
      formattedDeparture: this.selectedStartDate
        ? this.selectedStartDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "",
      formattedArrival: this.selectedEndDate
        ? this.selectedEndDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        : "",
    });
  }


  handleDateHover(date: Date) {
    if (!this.isTouchDevice) this.onDayHover(date);
  }

  handleDateLeave() {
    if (!this.isTouchDevice) this.onDayLeave();
  }
  goToPreviousMonth() {
    const first = this.months[0];
    if (!first) return;

    let prevMonth = first.month - 1;
    let prevYear = first.year;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    const firstMonthObj = {
      month: prevMonth,
      year: prevYear,
      days: this.buildDays(prevMonth, prevYear),
      emptyDays: this.getEmptyDays(prevMonth, prevYear),
    };

    const secondMonthObj = {
      month: first.month,
      year: first.year,
      days: this.buildDays(first.month, first.year),
      emptyDays: this.getEmptyDays(first.month, first.year),
    };

    this.months = [firstMonthObj, secondMonthObj];
  }

  goToNextMonth() {
    const first = this.months[0];
    if (!first) return;

    let nextMonth = first.month + 1;
    let nextYear = first.year;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }

    const firstMonthObj = {
      month: nextMonth,
      year: nextYear,
      days: this.buildDays(nextMonth, nextYear),
      emptyDays: this.getEmptyDays(nextMonth, nextYear),
    };

    const secondMonth = (nextMonth + 1) % 12;
    const secondYear = nextMonth === 11 ? nextYear + 1 : nextYear;

    const secondMonthObj = {
      month: secondMonth,
      year: secondYear,
      days: this.buildDays(secondMonth, secondYear),
      emptyDays: this.getEmptyDays(secondMonth, secondYear),
    };

    this.months = [firstMonthObj, secondMonthObj];
  }

  private normalizeDate(date: Date | null): Date | null {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  onDatesApplied(event: any) {
    this.startDate = this.parseLocalDate(event.departure);
    this.endDate = this.parseLocalDate(event.arrival);
  }

  private parseLocalDate(input: any): Date | null {
    if (!input) return null;

    // If it's already a Date object, we need to make sure it's not shifted
    // If it came from a string "2026-02-10" via new Date(), it has hours=16:00 (PST)
    // We force it to local midnight.
    if (input instanceof Date) {
      return new Date(input.getFullYear(), input.getMonth(), input.getDate());
    }

    // If it's a string "YYYY-MM-DD"
    if (typeof input === "string") {
      const parts = input.split("-");
      if (parts.length === 3) {
        return new Date(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[2], 10),
        );
      }
    }
    return null;
  }
  isHoverEndRange(date: Date): boolean {
    if (
      this.mode !== 'range' ||
      this.isTouchDevice ||
      !this.hoverDate
    ) {
      return false;
    }

    // CASE 1: Start selected, end not selected (normal flow)
    if (this.selectedStartDate && !this.selectedEndDate) {
      return date.toDateString() === this.hoverDate.toDateString();
    }

    // CASE 2: End selected first, start not selected (reverse flow)
    if (!this.selectedStartDate && this.selectedEndDate) {
      return date.toDateString() === this.hoverDate.toDateString();
    }

    return false;
  }

}
