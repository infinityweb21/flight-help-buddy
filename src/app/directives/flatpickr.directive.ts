import {
  Directive,
  ElementRef,
  OnDestroy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  input,
  Inject,
  PLATFORM_ID,
  Input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';

@Directive({
  selector: '[appFlatpickr]',
})
export class FlatpickrDirective implements OnDestroy, AfterViewInit, OnChanges {

  @Input() minDate: any;
  readonly mode = input<'single' | 'range' | 'basic'|'normal'| 'datetime' | null>('single', {
    alias: 'appFlatpickr',
  });
  @Output() dateSelected = new EventEmitter<{
    departure: string;
    arrival?: string;
  }>();
@Input() dateType: 'departure' | 'arrival' = 'departure'; // 🔹 Add this line
  private flatpickrInstance!: Instance;
  private resizeListener!: () => void;
private lastStart: Date | null = null;
private lastEnd: Date | null = null;
// Shared static memory between all FlatpickrDirective instances
@Input() selectedDates: (Date | null)[] = [];


  private static sharedRange: { start: Date | null; end: Date | null } = { start: null, end: null };

  constructor(
    private el: ElementRef<HTMLInputElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initFlatpickr();
      this.resizeListener = () => this.reinitFlatpickr();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
     console.log("selectedDates",this.selectedDates)
    if (changes['mode'] && !changes['mode'].firstChange && isPlatformBrowser(this.platformId)) {
      this.reinitFlatpickr();
    }
      if (this.flatpickrInstance && this.minDate) {
     
    this.flatpickrInstance.set('minDate', this.minDate);
  }
  }

  private initFlatpickr(): void {
  if (!isPlatformBrowser(this.platformId)) return;
  
  const showMonths = window.innerWidth < 768 ? 1 : 2;

  // BASIC mode
 if (this.mode() === 'basic') {
  this.flatpickrInstance = flatpickr(this.el.nativeElement, {
    enableTime: false,
    mode: 'single',
    dateFormat: 'Y-m-d',
    minDate: this.minDate || 'today',       // ✅ disables before minDate
    defaultDate: this.minDate || null,   // ✅ opens in minDate's month
    disableMobile: true,
    onChange: (selectedDates, dateStr, instance) => {
      const [date] = selectedDates;
      if (date) {
        const formatted = instance.formatDate(date, 'Y-m-d');
        this.dateSelected.emit({ departure: formatted });
      } else {
        this.dateSelected.emit({ departure: '' });
      }
    },
  });
  return;
}
 // ✅ DATETIME mode (Date + Time in same popup)
if (this.mode() === 'datetime') {

  this.flatpickrInstance = flatpickr(this.el.nativeElement, {

    enableTime: true,
    noCalendar: false,

    // ✅ Backend format (stored value)
    dateFormat: 'Y-m-d H:i',

    // ✅ Pretty display format
    altInput: true,
    altFormat: 'D, M j H:i',

    time_24hr: true,
    minDate: this.minDate || 'today',
    disableMobile: true,

    onChange: (selectedDates, dateStr, instance) => {

      const [date] = selectedDates;

      if (date) {

        // 👇 This keeps backend format
        const formatted = instance.formatDate(date, 'Y-m-d H:i');

        // Update actual input value (for Angular form control)
        this.el.nativeElement.value = formatted;

        this.dateSelected.emit({
          departure: formatted
        });

      } else {
        this.dateSelected.emit({ departure: '' });
      }
    }
  });

  return;
}
  // BASIC mode
if (this.mode() === 'normal') {
  this.flatpickrInstance = flatpickr(this.el.nativeElement, {
    enableTime: false,
    mode: 'single',
    dateFormat: 'Y-m-d',
    monthSelectorType: 'dropdown', // ✅ month dropdown
    minDate: this.minDate || null,
    defaultDate: this.minDate || null,
    disableMobile: true,

    onReady: (_, __, fp) => {
      // Replace year input with scrollable dropdown
      const yearElem = fp.yearElements[0];
      if (yearElem && yearElem.tagName === 'INPUT') {
        const currentYear = parseInt(yearElem.value, 10);
        const select = document.createElement('select');
        select.classList.add('year-scroll-dropdown'); // ✅ for styling

        // Generate year list (1900 → 2050)
        for (let y = 1900; y <= 2050; y++) {
          const opt = document.createElement('option');
          opt.value = y.toString();
          opt.text = y.toString();
          if (y === currentYear) opt.selected = true;
          select.appendChild(opt);
        }

        // Prevent arrow keys from changing the year
        select.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
          }
        });

        // Replace input with dropdown
        yearElem.parentNode?.replaceChild(select, yearElem);

        // Update year on change
        select.addEventListener('change', () => {
          fp.changeYear(parseInt(select.value, 10));
        });
      }

      // Make calendar show limited visible days (scrollable)
      const daysContainer = fp.daysContainer;
      if (daysContainer) {
        daysContainer.classList.add('limited-days-view');
      }
    },

    onChange: (selectedDates, dateStr, instance) => {
      const [date] = selectedDates;
      if (date) {
        const formatted = instance.formatDate(date, 'Y-m-d');
        this.dateSelected.emit({ departure: formatted });
      } else {
        this.dateSelected.emit({ departure: '' });
      }
    },
  });

  return;
}




  // SINGLE or RANGE mode
  this.flatpickrInstance = flatpickr(this.el.nativeElement, {
    mode: this.mode() === 'single' ? 'single' : 'range',
    showMonths,
    dateFormat: 'Y-m-d',
    minDate: this.minDate || 'today', // ✅ Added here
   
    clickOpens: false,
    disableMobile: true,
onChange: (selectedDates, dateStr, instance) => {
  const [start, end] = selectedDates;
    console.log("this.mode()",selectedDates)

  if (this.mode() === 'range') {
    const shared = FlatpickrDirective.sharedRange;

    // ✅ CASE 1: First time selecting normal range
    if (start && end) {
      this.lastStart = start;
      this.lastEnd = end;
      shared.start = start;
      shared.end = end;

      this.dateSelected.emit({
        departure: instance.formatDate(start, 'Y-m-d'),
        arrival: instance.formatDate(end, 'Y-m-d'),
      });
      instance.close();
      return;
    }

    const newDate = start || end;
    if (!newDate) return;

    // ✅ CASE 2: If another field (arrival/departure) already has a range → preload that
    if (!this.lastStart && shared.start && shared.end) {
      this.lastStart = shared.start;
      this.lastEnd = shared.end;
    }

    if (this.lastStart && this.lastEnd) {
      // --- Departure field logic ---
      if (this.dateType === 'departure') {
        if (newDate > this.lastEnd) {
          // later → reset
          instance.clear();
          instance.setDate([newDate]);
          this.lastStart = newDate;
          this.lastEnd = null;
        } else if (newDate < this.lastStart) {
          // earlier → extend backward
          instance.setDate([newDate, this.lastEnd]);
          this.lastStart = newDate;
        }
      }

      // --- Arrival field logic ---
      else if (this.dateType === 'arrival') {
        if (newDate < this.lastStart) {
          // earlier → reset
          instance.clear();
          instance.setDate([newDate]);
          this.lastStart = newDate;
          this.lastEnd = null;
        } else if (newDate > this.lastEnd) {
          // later → extend forward
          instance.setDate([this.lastStart, newDate]);
          this.lastEnd = newDate;
        }
      }

      // ✅ Update shared range
      shared.start = this.lastStart;
      shared.end = this.lastEnd;

      // ✅ Emit
      const range = instance.selectedDates;
      this.dateSelected.emit({
        departure: range[0]
          ? instance.formatDate(range[0], 'Y-m-d')
          : this.lastStart
          ? instance.formatDate(this.lastStart, 'Y-m-d')
          : '',
        arrival: range[1]
          ? instance.formatDate(range[1], 'Y-m-d')
          : this.lastEnd
          ? instance.formatDate(this.lastEnd, 'Y-m-d')
          : '',
      });
    } else {
      // ✅ Single date selected (start new range)
      this.lastStart = newDate;
      this.lastEnd = null;
      shared.start = newDate;
      shared.end = null;
      this.dateSelected.emit({
        departure: instance.formatDate(newDate, 'Y-m-d'),
        arrival: '',
      });
    }
  } else if (start) {
    // ✅ single mode fallback
    const formatted = instance.formatDate(start, 'Y-m-d');
    this.el.nativeElement.value = formatted;
    this.dateSelected.emit({ departure: formatted, arrival: '' });
  }
},


    onOpen: (selectedDates, dateStr, instance) => {
  console.log("📌 Flatpickr opened. Incoming selectedDates:", this.selectedDates);

  const [start, end] = this.selectedDates;
  setTimeout(() => {
    if (start) {
      instance.setDate(end ? [start, end] : [start], false); // ❗ false prevents re-triggering
    }

    // Sync internal memory
    this.lastStart = start ?? null;
    this.lastEnd = end ?? null;

    FlatpickrDirective.sharedRange.start = start ?? null;
    FlatpickrDirective.sharedRange.end = end ?? null;
  }, 0);

  // Close button logic
  const container = instance.calendarContainer;
  container.classList.add('custom-calender-container');

  if (!container.querySelector('.custom-calender-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = 'Close';
    closeBtn.className = 'custom-calender-close-btn';
    closeBtn.addEventListener('click', () => instance.close());
    container.appendChild(closeBtn);
  }
},

      
    });

    this.el.nativeElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.flatpickrInstance.open();
    });
}
  private reinitFlatpickr(): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
    this.initFlatpickr();
  }

  ngOnDestroy(): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
