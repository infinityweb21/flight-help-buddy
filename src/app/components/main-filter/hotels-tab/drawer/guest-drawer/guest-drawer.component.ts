import {
  NgTemplateOutlet,
  NgClass,
  isPlatformBrowser,
  CommonModule
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
  OnDestroy
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormControl
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guest-drawer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './guest-drawer.component.html',
  styleUrl: './guest-drawer.component.scss'
})
export class GuestDrawerComponent
  implements OnInit, OnDestroy {
@Input() adultsCount: number = 1;

@Input() childrenCount: number = 0;

@Input() childAgesArray!: FormArray;
@Input() roomCount: number = 1;

@Output() adultsChanged =
  new EventEmitter<number>();

@Output() childrenChanged =
  new EventEmitter<number>();

@Output() childAgeChanged =
  new EventEmitter<any>();
  @Input() titleTemplate:
    TemplateRef<any> | null = null;

  @Input() rooms!: FormArray;

  @Input() ages: number[] = [];

  @Output() applyPassengers =
    new EventEmitter<any>();

  @Output() closeDrawer =
    new EventEmitter<void>();

  isAndroid = false;

  private roomSub?: Subscription;

  guestSummary = {
    adults: 0,
    children: 0,
    rooms: 1
  };

  guestError: string = '';

  constructor(
    private toastr: ToastrService,
    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}

  ngOnInit(): void {

    if (
      isPlatformBrowser(this.platformId)
    ) {

      this.isAndroid =
        /Android/i.test(
          navigator.userAgent
        );

      document.body.style.overflow = "";
    }

    this.updateGuestSummary();

    this.roomSub =
      this.rooms.valueChanges.subscribe(() => {

        this.updateGuestSummary();
      });
  }

  ngOnDestroy(): void {

    this.roomSub?.unsubscribe();
  }

  // ====================================
  // ✅ GETTERS
  // ====================================

  get childAges(): FormArray[] {

    return this.rooms.controls.map(
      (room) =>
        room.get('childAges') as FormArray
    );
  }

  get totalAdults(): number {

    let total = 0;

    this.rooms.controls.forEach((room: any) => {

      total +=
        room.get('adults')?.value || 0;
    });

    return total;
  }

  get totalChildren(): number {

    let total = 0;

    this.rooms.controls.forEach((room: any) => {

      total +=
        room.get('childAges')?.length || 0;
    });

    return total;
  }

  get totalGuests(): number {

    return (
      this.totalAdults +
      this.totalChildren
    );
  }

  // ====================================
  // ✅ ROOM CREATOR
  // ====================================

  createRoom(
    adults = 1,
    childAges: number[] = []
  ): FormGroup {

    return new FormGroup({

      adults:
        new FormControl(adults),

      childAges:
        new FormArray(
          childAges.map(age =>
            new FormControl(age)
          )
        )
    });
  }

  // ====================================
  // ✅ SUMMARY
  // ====================================

  updateGuestSummary() {

    this.guestSummary = {

      adults: this.totalAdults,

      children: this.totalChildren,

      rooms: this.rooms.length
    };
  }

  // ====================================
  // ✅ ADULTS
  // ====================================

changeAdults(delta: number): void {

  let adults =
    this.adultsCount + delta;

  const childrens =
    this.childrenCount;

  if (adults < 1) {
    return;
  }

  const total = adults + childrens;

  if (total > 45) {

    this.guestError =
      'Maximum 45 guests allowed';

    return;
  }

  this.adultsCount = adults;

  this.generateRooms();
    this.adultsChanged.emit(delta);

}

  // ====================================
  // ✅ CHILDREN
  // ====================================
changeChildren(delta: number): void {

  const adults =
    this.adultsCount;

  const currentChildren =
    this.childrenCount;

  const childrens =
    currentChildren + delta;

  if (childrens < 0) {
    return;
  }

  const total =
    adults + childrens;

  if (total > 45) {

    this.guestError =
      'Maximum 45 guests allowed';

    return;
  }

  const maxChildrenAllowed =
    adults * 3;

  if (
    childrens >
    maxChildrenAllowed
  ) {

    this.guestError =
      `${adults} adult${adults > 1 ? 's' : ''} can accompany maximum ${maxChildrenAllowed} children`;

    return;
  }

  while (
    this.childAgesArray.length <
    childrens
  ) {

    this.childAgesArray.push(
      new FormControl(1)
    );
  }

  while (
    this.childAgesArray.length >
    childrens
  ) {

    this.childAgesArray.removeAt(
      this.childAgesArray.length - 1
    );
  }

  this.childrenCount = childrens;

  this.generateRooms();
    this.childrenChanged.emit(delta);

}
generateRooms(): void {

  const adults = this.adultsCount;
  const childrens = this.childrenCount;

  const allChildAges =
    this.childAgesArray.value || [];

  // =========================
  // ✅ BASIC VALIDATIONS
  // =========================

  if (adults < 1) {

   this.guestError =
      'At least 1 adult required';
    

    return;
  }

  const totalGuests = adults + childrens;

  // =========================
  // ✅ MAX 45 GUESTS
  // =========================

  if (totalGuests > 45) {

    this.guestError =
      'Maximum 45 guests allowed';

    return;
  }

  // =========================
  // ✅ ADULT / CHILD VALIDATION
  // 1 adult = max 3 children
  // =========================

 const maxChildrenAllowed =
  adults * 3;

if (childrens > maxChildrenAllowed) {

  this.guestError =
    `${adults} adult${adults > 1 ? 's' : ''} can accompany maximum ${maxChildrenAllowed} children`;

  while (
    this.childAgesArray.length >
    maxChildrenAllowed
  ) {

    this.childAgesArray.removeAt(
      this.childAgesArray.length - 1
    );
  }

  return;
}

  // =========================
  // ✅ CALCULATE REQUIRED ROOMS
  // =========================

  let requiredRooms =
    Math.ceil(totalGuests / 5);

  // every room must have 1 adult
  if (requiredRooms > adults) {
    requiredRooms = adults;
  }

  // minimum 1 room
  if (requiredRooms < 1) {
    requiredRooms = 1;
  }

  // max 9 rooms
  if (requiredRooms > 9) {

    this.guestError =
      'Maximum 9 rooms allowed';

    return;
  }

  // =========================
  // ✅ REMOVE EXTRA USER ROOMS
  // =========================

  if (this.rooms.length > adults) {

    while (this.rooms.length > adults) {

      this.rooms.removeAt(
        this.rooms.length - 1
      );
    }
  }

  // =========================
  // ✅ CREATE ROOM STRUCTURE
  // each room starts with 1 adult
  // =========================

  const generatedRooms: any[] = [];

  for (let i = 0; i < requiredRooms; i++) {

    generatedRooms.push({
      adults: 1,
      childAges: []
    });
  }

  // =========================
  // ✅ DISTRIBUTE REMAINING ADULTS
  // =========================

  let remainingAdults =
    adults - requiredRooms;

  let roomIndex = 0;

  while (remainingAdults > 0) {

    const room =
      generatedRooms[roomIndex];

    const totalPersons =
      room.adults +
      room.childAges.length;

    // max 5 per room
    if (totalPersons < 5) {

      room.adults++;

      remainingAdults--;
    }

    roomIndex++;

    if (
      roomIndex >= generatedRooms.length
    ) {
      roomIndex = 0;
    }
  }

  // =========================
  // ✅ DISTRIBUTE CHILDREN
  // max 3 children per adult
  // =========================

  allChildAges.forEach((age: number) => {

    let assigned = false;

    for (
      let i = 0;
      i < generatedRooms.length;
      i++
    ) {

      const room = generatedRooms[i];

      const totalPersons =
        room.adults +
        room.childAges.length;

      const maxChildrenInRoom =
        room.adults * 3;

      // =====================
      // room capacity check
      // =====================

      if (
        totalPersons < 5 &&
        room.childAges.length <
        maxChildrenInRoom
      ) {

        room.childAges.push(age);

        assigned = true;

        break;
      }
    }

    // =========================
    // ✅ IF NO ROOM AVAILABLE
    // CREATE NEW ROOM
    // =========================

    if (!assigned) {

      // max 9 rooms
      if (
        generatedRooms.length >= 9
      ) {

        this.guestError =
          'Maximum 9 rooms allowed';

        return;
      }

      // take 1 adult from room
      // having extra adults

      const donorRoom =
        generatedRooms.find(
          r => r.adults > 1
        );

      // no donor room found
      if (!donorRoom) {

        this.guestError =
          'Each room requires at least 1 adult';

        return;
      }

      donorRoom.adults--;

      generatedRooms.push({
        adults: 1,
        childAges: [age]
      });
    }
  });

  // =========================
  // ✅ FINAL VALIDATION
  // =========================

  let invalidRoom = false;

  generatedRooms.forEach(room => {

    const total =
      room.adults +
      room.childAges.length;

    // max 5 persons
    if (total > 5) {

      invalidRoom = true;
    }

    // child without adult
    if (
      room.childAges.length > 0 &&
      room.adults < 1
    ) {

      invalidRoom = true;
    }

    // adult-child ratio
    if (
      room.childAges.length >
      room.adults * 3
    ) {

      invalidRoom = true;
    }
  });

  if (invalidRoom) {

    this.guestError =
      'Invalid room distribution';

    return;
  }

  // =========================
  // ✅ UPDATE FORM ARRAY
  // =========================

  this.rooms.clear();

  generatedRooms.forEach(room => {

    this.rooms.push(
      this.createRoom(
        room.adults,
        room.childAges
      )
    );

  });

  // =========================
  // ✅ UPDATE ROOM COUNT
  // =========================

  this.roomCount =
    this.rooms.length;
}
  // ====================================
  // ✅ ROOMS
  // ====================================
changeRooms(delta: number): void {
  this.guestError = '';

  const newRoomCount = this.rooms.length + delta;

  // =========================
  // MIN 1 ROOM
  // =========================
  if (newRoomCount < 1) {
    return;
  }

  // =========================
  // MAX 9 ROOMS
  // =========================
  if (newRoomCount > 9) {
    this.guestError = 'Maximum 9 rooms allowed';
    return;
  }

  // =========================
  // ROOMS CANNOT EXCEED ADULTS
  // =========================
  if (delta > 0 && newRoomCount > this.adultsCount) {
    this.guestError = `Minimum ${newRoomCount} adults required for ${newRoomCount} rooms`;
    return;
  }

  // =========================
  // ADD ROOM
  // =========================
  if (delta > 0) {

    // Find a room having more than 1 adult
    let moved = false;

    for (let i = 0; i < this.rooms.length; i++) {
      const room = this.rooms.at(i);
      const adults = room.get('adults')?.value || 1;

      if (adults > 1) {
        // Move one adult from this room to the new room
        room.get('adults')?.setValue(adults - 1);
        this.rooms.push(this.createRoom(1, []));
        moved = true;
        break;
      }
    }

    // If all rooms already have only 1 adult,
    // just add a new room with 1 adult.
    // (This case should normally be prevented by the validation above.)
    if (!moved) {
      this.rooms.push(this.createRoom(1, []));
    }

  } else {

    // =========================
    // REMOVE ROOM
    // =========================

    const lastRoom = this.rooms.at(this.rooms.length - 1);
    const lastAdults = lastRoom.get('adults')?.value || 1;
    const lastChildren = lastRoom.get('childAges')?.value || [];

    this.rooms.removeAt(this.rooms.length - 1);

    // Move adults back to the first room
    const firstRoom = this.rooms.at(0);
    firstRoom.get('adults')?.setValue(
      (firstRoom.get('adults')?.value || 0) + lastAdults
    );

    // Move children back to the first room
    firstRoom.get('childAges')?.setValue([
      ...(firstRoom.get('childAges')?.value || []),
      ...lastChildren
    ]);
  }

  this.roomCount = this.rooms.length;
}


  // ====================================
  // ✅ CHILD AGE
  // ====================================

  activeDropdown:
    { i: number; j: number } | null = null;

  toggleDropdownChildAge(
    i: number,
    j: number
  ) {

    if (
      this.activeDropdown?.i === i &&
      this.activeDropdown?.j === j
    ) {

      this.activeDropdown = null;

    } else {

      this.activeDropdown = { i, j };
    }
  }

  setChildAge(
    childIndex: number,
    age: number
  ) {


      
  this.childAgesArray
    .at(childIndex)
    .setValue(age);
      this.childAgeChanged.emit({
    index: childIndex,
    age
  });
  }

  // ====================================
  // ✅ APPLY
  // ====================================

  apply() {

    // =========================
    // ✅ FINAL VALIDATION
    // =========================

    let invalidRoom = false;

    this.rooms.controls.forEach(
      (room: any) => {

        const adults =
          room.get('adults')?.value || 0;

        const children =
          room.get('childAges')?.length || 0;

        const total =
          adults + children;

        if (adults < 1) {
          invalidRoom = true;
        }

        if (total > 5) {
          invalidRoom = true;
        }

        if (children > adults * 3) {
          invalidRoom = true;
        }
      }
    );

    if (invalidRoom) {

      this.guestError =
        'Invalid room distribution';

      return;
    }

    this.applyPassengers.emit(
      this.rooms.value
    );

    this.closeDrawer.emit();
  }

  // ====================================
  // ✅ OPTIONAL
  // ====================================

  isOpen = false;

  selectedAge: number | null = null;

  toggleDropdown() {

    this.isOpen = !this.isOpen;
  }

  selectAge(
    age: number,
    event: Event
  ) {

    event.stopPropagation();

    this.selectedAge = age;

    this.isOpen = false;
  }


}