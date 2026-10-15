import {
  CommonModule,
  NgClass,
  isPlatformBrowser
} from '@angular/common';

import {
  Component,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  OnInit,
  HostListener
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-guest-drawer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './guest-drawer.component.html',
  styleUrl: './guest-drawer.component.scss'
})
export class GuestDrawerComponent implements OnInit {

  @Input() formGroup!: FormGroup;

  @Input() titleTemplate: TemplateRef<any> | null = null;

  @Output() applyPassengers = new EventEmitter<any>();

  @Output() closeDrawer = new EventEmitter<any>();

  passengerErrors: {
    [key: string]: string
  } = {};

  isAndroid = false;

  // =====================================================
  // CABIN DROPDOWN
  // =====================================================

  cabinDropdownOpen = false;

  cabinOptions = [
    {
      name: 'Basic Economy / Economy',
      value: 'E'
    },
    {
      name: 'Premium Economy',
      value: 'PE'
    },
    {
      name: 'Business',
      value: 'B'
    },
    {
      name: 'First',
      value: 'F'
    }
  ];

  selectedCabin = this.cabinOptions[0];

  constructor(
    private toastr: ToastrService,
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // Android check
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid =
        /Android/i.test(navigator.userAgent);
    }

    // Sync cabin with parent FormGroup
    this.syncSelectedCabin();
  }

  // =====================================================
  // SYNC CABIN
  // =====================================================

  private syncSelectedCabin(): void {

    if (!this.formGroup) {
      return;
    }

    const cabinValue =
      this.formGroup.get('cabin')?.value;

    const cabin =
      this.cabinOptions.find(
        item => item.value === cabinValue
      );

    if (cabin) {

      this.selectedCabin = cabin;

    } else {

      this.selectedCabin =
        this.cabinOptions[0];

      this.formGroup
        .get('cabin')
        ?.setValue('E');
    }
  }

  // =====================================================
  // OPEN / CLOSE CABIN DROPDOWN
  // =====================================================

  toggleCabinDropdown(
    event: MouseEvent
  ): void {

    event.preventDefault();
    event.stopPropagation();

    this.cabinDropdownOpen =
      !this.cabinDropdownOpen;
  }

  // =====================================================
  // SELECT CABIN
  // =====================================================

  selectCabin(
    cabin: {
      name: string;
      value: string;
    },
    event: MouseEvent
  ): void {

    event.preventDefault();
    event.stopPropagation();

    // Update selected display
    this.selectedCabin = cabin;

    // Update Reactive Form
    this.formGroup
      .get('cabin')
      ?.setValue(cabin.value);

    this.formGroup
      .get('cabin')
      ?.markAsDirty();

    this.formGroup
      .get('cabin')
      ?.markAsTouched();

    this.formGroup
      .get('cabin')
      ?.updateValueAndValidity();

    // Close dropdown
    this.cabinDropdownOpen = false;
  }

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  @HostListener('document:click')
  onDocumentClick(): void {

    if (this.cabinDropdownOpen) {
      this.cabinDropdownOpen = false;
    }
  }

  // =====================================================
  // PASSENGER INCREMENT
  // =====================================================

  increment(control: string): void {

    const current =
      Number(
        this.formGroup
          .get(control)
          ?.value ?? 0
      );

    this.updatePassenger(
      control,
      current + 1
    );
  }

  // =====================================================
  // PASSENGER DECREMENT
  // =====================================================

  decrement(control: string): void {

    const current =
      Number(
        this.formGroup
          .get(control)
          ?.value ?? 0
      );

    if (current > 0) {

      this.updatePassenger(
        control,
        current - 1
      );
    }
  }

  // =====================================================
  // UPDATE PASSENGER
  // =====================================================

  private updatePassenger(
    control: string,
    newValue: number
  ): void {

    const adults =
      Number(
        this.formGroup
          .get('adults')
          ?.value ?? 0
      );

    const children =
      Number(
        this.formGroup
          .get('children')
          ?.value ?? 0
      );

    const infantsLap =
      Number(
        this.formGroup
          .get('infants')
          ?.value ?? 0
      );

    const futureAdults =
      control === 'adults'
        ? newValue
        : adults;

    const futureChildren =
      control === 'children'
        ? newValue
        : children;

    const futureInfantsLap =
      control === 'infants'
        ? newValue
        : infantsLap;

    const totalInfants =
      futureInfantsLap;

    const totalPassengers =
      futureAdults +
      futureChildren +
      totalInfants;

    // Clear previous errors
    this.passengerErrors = {};

    // =====================================================
    // RULE 1
    // AT LEAST 1 ADULT
    // =====================================================

    if (futureAdults < 1) {

      this.passengerErrors['adults'] =
        'At least 1 adult is required';

      return;
    }

    // =====================================================
    // RULE 2
    // INFANT RESTRICTIONS
    // =====================================================

    if (futureAdults === 1) {

      if (futureInfantsLap > 1) {

        this.passengerErrors['infants'] =
          'With 1 adult, maximum 1 infant is allowed';

        return;
      }

      if (totalInfants > 1) {

        this.passengerErrors['infants_total'] =
          'With 1 adult, total infant cannot exceed 1';

        return;
      }

    } else {

      if (
        totalInfants >
        futureAdults * 1
      ) {

        this.passengerErrors['infants_total'] =
          'Each adult can accompany up to 1 infant';

        return;
      }
    }

    // =====================================================
    // RULE 3
    // MAXIMUM 9 PASSENGERS
    // =====================================================

    if (totalPassengers > 9) {

      this.passengerErrors['total'] =
        'Total passengers cannot exceed 9';

      return;
    }

    // =====================================================
    // VALID
    // =====================================================

    this.formGroup
      .get(control)
      ?.setValue(newValue);

    this.formGroup
      .get(control)
      ?.updateValueAndValidity();
  }

  // =====================================================
  // APPLY
  // =====================================================

  apply(): void {

    // Make sure cabin display matches form
    this.syncSelectedCabin();

    this.formGroup.updateValueAndValidity();

    // Send complete form value
    this.applyPassengers.emit(
      this.formGroup.value
    );

    // Close drawer
    this.closeDrawer.emit();
  }

  // =====================================================
  // RESET
  // =====================================================

  resetPassengers(): void {

    this.formGroup.patchValue({
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'E'
    });

    // Reset selected cabin
    this.selectedCabin =
      this.cabinOptions[0];

    // Close dropdown
    this.cabinDropdownOpen = false;

    // Clear errors
    this.passengerErrors = {};

    // Update form
    this.formGroup.updateValueAndValidity();
  }

  // =====================================================
  // CLOSE
  // =====================================================

  close(): void {

    this.cabinDropdownOpen = false;

    this.closeDrawer.emit(
      this.formGroup.value
    );
  }
}