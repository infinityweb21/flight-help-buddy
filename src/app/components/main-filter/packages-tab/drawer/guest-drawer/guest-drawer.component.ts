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
    this.syncRooms();
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
        this.syncRooms();
  }

  // =====================================================
  // APPLY
  // =====================================================

apply(): void {
  console.log('✅ APPLY BUTTON CLICKED');

  this.syncSelectedCabin();

  console.log('Before distributeGuests:', {
    roomCount: this.roomCount,
    rooms: this.rooms,
    passengerErrors: this.passengerErrors
  });

  this.distributeGuests();

  console.log('After distributeGuests:', {
    roomCount: this.roomCount,
    rooms: this.rooms,
    passengerErrors: this.passengerErrors
  });

  if (this.passengerErrors['rooms']) {
    console.warn('❌ Apply stopped:', this.passengerErrors['rooms']);
    return;
  }

  const passengers = {
    ...this.formGroup.value,
    roomCount: this.roomCount,
    rooms: this.rooms.map(room => ({
      adults: room.adults,
      children: [...room.childAges]
    }))
  };

  console.log('✅ Emitting passengers:', passengers);

  this.applyPassengers.emit(passengers);
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

  this.selectedCabin = this.cabinOptions[0];
  this.cabinDropdownOpen = false;
  this.passengerErrors = {};

  this.roomCount = 1;
  this.rooms = [{ adults: 1, childAges: [] }];

  this.formGroup.updateValueAndValidity();
}

  // =====================================================
  // CLOSE
  // =====================================================

roomCount = 1;

rooms: {
  adults: number;
  childAges: number[];
}[] = [{ adults: 1, childAges: [] }];


private getPassengerCounts() {
  const adults = Number(this.formGroup.get('adults')?.value ?? 1);
  const children = Number(this.formGroup.get('children')?.value ?? 0);
  const infants = Number(this.formGroup.get('infants')?.value ?? 0);

  // Infants are treated as children for room occupancy.
  return {
    adults,
    children: children + infants,
    total: adults + children + infants
  };
}

private syncRooms(): void {
  const passengers = this.getPassengerCounts();

  // At least one adult and one room are required
  if (passengers.adults < 1) {
    this.roomCount = 1;
    this.rooms = [{ adults: 1, childAges: [] }];
    return;
  }

  // Automatically increase rooms when total passengers exceed capacity.
  const requiredRooms = Math.max(
    1,
    Math.ceil(passengers.total / 5)
  );

  // Each room must have at least one adult; maximum 9 rooms.
  this.roomCount = Math.min(
    9,
    requiredRooms,
    passengers.adults
  );

  this.distributeGuests();
}
private distributeGuests(): void {
  const passengers = this.getPassengerCounts();

  const roomCount = Math.max(
    1,
    Math.min(this.roomCount, passengers.adults, 9)
  );

  const rooms = Array.from({ length: roomCount }, () => ({
    adults: 1,
    childAges: [] as number[]
  }));

  // Distribute remaining adults.
  let remainingAdults = passengers.adults - roomCount;
  let index = 0;

  while (remainingAdults > 0) {
    const room = rooms[index % rooms.length];

    if (room.adults + room.childAges.length < 5) {
      room.adults++;
      remainingAdults--;
    }

    index++;
  }

  // Treat children and lap infants as children for room occupancy.
  // Ages are placeholders here; replace them with actual child ages
  // if your hotel API requires age-specific guest data.
  for (let i = 0; i < passengers.children; i++) {
    const room = rooms.find(
      r =>
        r.adults + r.childAges.length < 5 &&
        r.childAges.length < r.adults * 3
    );

    if (!room) {
      this.passengerErrors['rooms'] =
        'Unable to distribute guests across the selected rooms.';
      return;
    }

    room.childAges.push(1);
  }

  this.rooms = rooms;
  this.roomCount = rooms.length;
  delete this.passengerErrors['rooms'];
}

changeRooms(delta: number): void {
  this.passengerErrors = {};

  const currentCount = Number(
    this.formGroup.get('roomCount')?.value ?? this.roomCount
  );

  const nextCount = currentCount + delta;
  const passengers = this.getPassengerCounts();

  if (nextCount < 1 || nextCount > 9) {
    return;
  }

  if (nextCount > passengers.adults) {
    this.passengerErrors['rooms'] =
      `At least ${nextCount} adults are required for ${nextCount} rooms.`;
    return;
  }

  if (nextCount * 5 < passengers.total) {
    this.passengerErrors['rooms'] =
      'Each room can accommodate a maximum of 5 guests.';
    return;
  }

  this.roomCount = nextCount;

  // Update the Reactive Form so the template displays the new count.
  this.formGroup.get('roomCount')?.setValue(nextCount);

  // Redistribute guests among the selected rooms.
  this.distributeGuests();

  // Save the updated room assignments to the Reactive Form.
  this.formGroup.get('rooms')?.setValue(
    this.rooms.map(room => ({
      adults: room.adults,
      children: [...room.childAges]
    }))
  );
}


close(): void {
  this.cabinDropdownOpen = false;

  this.distributeGuests();

  const passengers = {
    ...this.formGroup.value,
    roomCount: this.roomCount,
    rooms: this.rooms.map(room => ({
      adults: room.adults,
      children: [...room.childAges]
    }))
  };

  console.log('Closing drawer with passengers:', passengers);

  this.closeDrawer.emit(passengers);
}
}