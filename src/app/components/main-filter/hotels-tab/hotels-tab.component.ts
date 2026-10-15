import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, ElementRef, EventEmitter, HostListener, Inject, inject, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { FlatpickrDirective } from '../../../directives/flatpickr.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { TosterService } from '../../../services/common/toaster.service';
import { SharedService } from '../../../services/shared/shared.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { DrawerWrapperComponent } from '../hotels-tab/drawer/drawer-wrapper/drawer-wrapper.component';
import { DatesDrawerComponent } from '../hotels-tab/drawer/dates-drawer/dates-drawer.component';
import { DestinationComponent } from '../hotels-tab/drawer/destination/destination.component';
import { GuestDrawerComponent } from '../hotels-tab/drawer/guest-drawer/guest-drawer.component';
import { DeviceService } from '../../../services/shared/device.service';
import { Popover } from 'primeng/popover';
import { HotelService } from '../../../services/hotel/hotel.service';
import { HotelFilterService } from '../../../services/hotel/hotel-filter.service';

@Component({
  selector: 'app-hotels-tab',
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf,
    FlatpickrDirective,
    ClickOutsideDirective,
    AutoCompleteModule,
    SelectModule,
    DrawerModule,
    DrawerWrapperComponent,
    DatesDrawerComponent,
    DestinationComponent,
    GuestDrawerComponent,
    Popover,
    NgClass


  ],
  templateUrl: './hotels-tab.component.html',
  styleUrl: './hotels-tab.component.scss',
})
export class HotelsTabComponent {

  @ViewChild("popcheckInDate") popcheckInDate!: Popover;
  @ViewChild("popcheckOutDate") popcheckOutDate!: Popover;
  @ViewChild("departureAC") DepartAutoComplete!: AutoComplete;
  @ViewChild("guestDrawer") guestDrawer!: GuestDrawerComponent;
  @ViewChild('scrollContainer')
scrollContainer!: ElementRef;
  hotelForm: FormGroup;
  showGuestDropdown: boolean = false;
  showRoomsDropdown: boolean = false;
  private searchService = inject(SearchService);
  private toasterService: TosterService = inject(TosterService)
  private sharedService: SharedService = inject(SharedService);
    private hotelService: HotelService = inject(HotelService);
    private shareService: SharedService = inject(SharedService);
  private hotelFilterService =
  inject(HotelFilterService);
  private deviceService = inject(DeviceService);
  private route = inject(ActivatedRoute);
  isMobile: boolean = false;
  private router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef)
  public destinationList: any[] = [];
  showDrawer: boolean = false;
  activeDrawer:
    | "destination"
    | "checkInDate"
    | "checkOutDate"
    | "guests"
    | null = null;
  activeInput: string = "";
  drawerTitle = "";
  isAndroid = false;
  formattedchecheckInDate = "";
  formattedcheckOutDate = "";
  checkInDateObj: Date | null = null;
  checkOutDateObj: Date | null = null;
    isBrowser: boolean = false;
deviceReady = false;
  departCountry: string = "";
  submitted: boolean = false;
  roomCount: number = 1;
  isHotelDetails = false;
  getData: any = "";
   packageTabActive = false;
  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser=isPlatformBrowser(this.platformId);
 if (this.isBrowser) {
  this.isMobile=window.innerWidth < 992
 }
     const url = this.router.url;

    this.packageTabActive = url.includes("package");
  this.isHotelDetails = this.router.url.includes('/hotels-list');

  
  this.hotelForm = new FormGroup({
  destination: new FormControl('', [Validators.required]),
  checkInDate: new FormControl('', [Validators.required]),
  checkOutDate: new FormControl('', [Validators.required]),

  // ✅ SINGLE COUNTERS
  adults: new FormControl(2),
  childrens: new FormControl(0),

  // ✅ all children ages globally
  childAges: new FormArray([]),

  // ✅ auto generated rooms
  rooms: new FormArray([])
}, {
  validators: [this.checkDates]
});

// ✅ initialize first room
this.generateRooms();
  }

  ngOnInit(): void {
    if(this.isBrowser){
      this.deviceService.isMobile$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((status) => {
      this.isMobile = status;
      this.deviceReady = true;
      this.cdr.markForCheck(); // only if OnPush
    });
    this.getData = this.shareService.getcompanyName();
  }
    // this.checkIfModifySearch();
    // Ensure the drawer is closed and state is reset on component load
    this.showDrawer = false;
    this.activeDrawer = null;
    // This is a good practice to clean up from previous navigations.
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      document.body.style.overflow = "";
    }
      // ✅ 1. Listen to query params (URL change)
  this.route.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {

      if (!params) return;

      this.patchFromRoute(params);
    });

  // ✅ 2. Listen to shared search service
  this.searchService.hotelSearchData$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => {

      if (!data) return;

      this.patchFromService(data);
    });
  }
  formatToAPIDate(dateString: string): string {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
    dateFromApiString(apiDate: string): Date {
    const [year, month, day] = apiDate.split("-").map(Number);
    return new Date(year, month - 1, day); // local date
  }
patchFromRoute(params: any) {
  if (!params) return;

  console.log('Patching from route with params:', params);

  const name = params.city_name || params.hotel_name;
  const type = params.city_name ? 'city' : 'hotel';

  const checkIn = params?.checkin || '';
  const checkOut = params?.checkout || '';

  // ===============================
  // ✅ 1. PATCH DATES FIRST (IMPORTANT)
  // ===============================
  this.hotelForm.patchValue({
    checkInDate: checkIn,
    checkOutDate: checkOut
  });




        this.formattedchecheckInDate = checkIn
          ? this.dateFromApiString(checkIn).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "";

        this.formattedcheckOutDate = checkOut
          ? this.dateFromApiString(checkOut).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          : "";
        this.checkInDateObj = checkIn ? new Date(checkIn) : null;
        this.checkOutDateObj = checkOut ? new Date(checkOut) : null;


  // ===============================
  // ✅ 2. HANDLE DESTINATION (API)
  // ===============================
  if (!name) return;

this.hotelService.hotel_cityList(name.toLowerCase())
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe((res: any) => {

    if (!res?.success || !res.data?.length) return;

    // Better match (handles "Kolka" vs "Kolkata")
    const match = res.data.find((item: any) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );

    if (!match) return;

    const destinationObj = {
      displayName:
        match.type === 'hotel'
          ? match.name
          : match.state?.trim()
            ? `${match.city}, ${match.state}, ${match.country}`
            : `${match.city}, ${match.country}`,
      name: match.name,
      type: match.type, // use match.type instead of the passed type
      country: match.country,
      countrycode: match.countryCode || match.countrycode,
      city: match.city,
      code: match.code || match.cityid,
      destinationCode: match.destinationCode
    };

    // Patch destination only
    this.hotelForm.patchValue({
      destination: destinationObj
    });

    this.searchService.setSearchHotelData({
      checkIn,
      checkOut,
      destination: destinationObj,
      rooms: this.hotelForm.value.rooms
    });

    this.cdr.detectChanges();
  });
        this.cdr.markForCheck();
}

patchFromService(data: any) {

  if (!data) return;

  // =========================
  // ✅ CALCULATE TOTALS
  // =========================

  let totalAdults = 0;
  let totalChildren = 0;

  const globalChildAges: number[] = [];

  data.rooms.forEach((room: any) => {

    totalAdults += room.adults || 0;

    const childAges =
      room.childAges || [];

    totalChildren += childAges.length;

    globalChildAges.push(...childAges);
  });

  // =========================
  // ✅ PATCH MAIN FORM
  // =========================

  this.hotelForm.patchValue({
    destination: data.destination,
    checkInDate: data.checkIn,
    checkOutDate: data.checkOut,
    adults: totalAdults,
    childrens: totalChildren
  });

  // =========================
  // ✅ PATCH GLOBAL CHILD AGES
  // =========================

  this.childAgesArray.clear();

  globalChildAges.forEach(age => {

    this.childAgesArray.push(
      new FormControl(age)
    );
  });

  // =========================
  // ✅ PATCH ROOMS
  // =========================

  this.rooms.clear();

  data.rooms.forEach((room: any) => {

    this.rooms.push(
      this.createRoom(
        room.adults,
        room.childAges || []
      )
    );
  });

  // =========================
  // ✅ UPDATE ROOM COUNT
  // =========================

  this.roomCount =
    this.rooms.length;

  // =========================
  // ✅ UPDATE DATE UI
  // =========================

  if (data.checkIn) {

    this.formattedchecheckInDate =
      this.dateFromApiString(data.checkIn)
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

    this.checkInDateObj =
      new Date(data.checkIn);
  }

  if (data.checkOut) {

    this.formattedcheckOutDate =
      this.dateFromApiString(data.checkOut)
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

    this.checkOutDateObj =
      new Date(data.checkOut);
  }

  this.cdr.detectChanges();
}


get childAgesArray(): FormArray {
  return this.hotelForm.get('childAges') as FormArray;
}

get adultsCount(): number {
  return this.hotelForm.get('adults')?.value || 1;
}

get childrenCount(): number {
  return this.hotelForm.get('childrens')?.value || 0;
}

get totalGuests(): number {
  return this.adultsCount + this.childrenCount;
}

createRoom(adults = 1, childAges: number[] = []): FormGroup {
  return new FormGroup({
    adults: new FormControl(adults),
    childAges: new FormArray(
      childAges.map(age => new FormControl(age))
    )
  });
}
  addRoom(): void {
    if (this.rooms.length >= 5) {
      this.toasterService.showError('Maximum 5 rooms allowed');
      return;
    }
    this.rooms.push(this.createRoom());
  }


  removeRoom(index: number): void {
    if (this.rooms.length > 1) {
      this.rooms.removeAt(index);
    }
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

    this.toasterService.showError(
      'At least 1 adult required'
    );

    return;
  }

  const totalGuests = adults + childrens;

  // =========================
  // ✅ MAX 45 GUESTS
  // =========================

  if (totalGuests > 45) {

    this.toasterService.showError(
      'Maximum 45 guests allowed'
    );

    return;
  }

  // =========================
  // ✅ ADULT / CHILD VALIDATION
  // 1 adult = max 3 children
  // =========================

 const maxChildrenAllowed =
  adults * 3;

if (childrens > maxChildrenAllowed) {

  this.toasterService.showError(
    `${adults} adult${adults > 1 ? 's' : ''} can accompany maximum ${maxChildrenAllowed} children`
  );

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

    this.toasterService.showError(
      'Maximum 9 rooms allowed'
    );

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

        this.toasterService.showError(
          'Maximum 9 rooms allowed'
        );

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

        this.toasterService.showError(
          'Each room requires at least 1 adult'
        );

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

    this.toasterService.showError(
      'Invalid room distribution'
    );

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
 changeAdults(delta: number): void {

  let adults =
    this.adultsCount + delta;

  const childrens =
    this.childrenCount;

  // min 1 adult
  if (adults < 1) {
    return;
  }

  // total capacity
  const total = adults + childrens;

  if (total > 45) {
    this.toasterService.showError(
      'Maximum 45 guests allowed'
    );
    return;
  }

  this.hotelForm
    .get('adults')
    ?.setValue(adults);

  this.generateRooms();
}


changeChildren(delta: number): void {

  const adults = this.adultsCount;

  // current children
  const currentChildren =
    this.childrenCount;

  // next children count
  const childrens =
    currentChildren + delta;

  // =========================
  // ✅ MIN LIMIT
  // =========================

  if (childrens < 0) {
    return;
  }

  // =========================
  // ✅ MAX TOTAL GUESTS
  // =========================

  const total = adults + childrens;

  if (total > 45) {

    this.toasterService.showError(
      'Maximum 45 guests allowed'
    );

    return;
  }

  // =========================
  // ✅ CHILD RESTRICTION
  // 1 adult = 3 children
  // =========================

  const maxChildrenAllowed =
    adults * 3;

  if (
    childrens >
    maxChildrenAllowed
  ) {

    this.toasterService.showError(
      `${adults} adult${adults > 1 ? 's' : ''} can accompany maximum ${maxChildrenAllowed} children`
    );

    return; // ❌ stop increasing
  }

  // =========================
  // ✅ UPDATE CHILD AGE ARRAY
  // =========================

  const childAges =
    this.childAgesArray;

  // add controls
  while (
    childAges.length <
    childrens
  ) {

    childAges.push(
      new FormControl(1)
    );
  }

  // remove controls
  while (
    childAges.length >
    childrens
  ) {

    childAges.removeAt(
      childAges.length - 1
    );
  }

  // =========================
  // ✅ UPDATE FORM VALUE
  // =========================

  this.hotelForm
    .get('childrens')
    ?.setValue(childrens);

  // =========================
  // ✅ AUTO GENERATE ROOMS
  // =========================

  this.generateRooms();
}
  updateChildAge(roomIndex: number, childIndex: number, delta: number): void {
    const childAgesArray = this.rooms.at(roomIndex).get('childAges') as FormArray;
    const ageCtrl = childAgesArray.at(childIndex) as FormControl;

    const newAge = Math.max(0, Math.min(17, ageCtrl.value + delta)); // ✅ 0–17
    ageCtrl.setValue(newAge);
  }
changeRooms(delta: number): void {

  const newRoomCount =
    this.rooms.length + delta;

  // =========================
  // ✅ MIN 1 ROOM
  // =========================

  if (newRoomCount < 1) {
    return;
  }

  // =========================
  // ✅ MAX 9 ROOMS
  // =========================

  if (newRoomCount > 9) {

    this.toasterService.showError(
      'Maximum 9 rooms allowed'
    );

    return;
  }

  // =========================
  // ✅ ROOMS CANNOT EXCEED ADULTS
  // =========================

  if (
    delta > 0 &&
    newRoomCount > this.adultsCount
  ) {

    this.toasterService.showError(
      `Minimum ${newRoomCount} adults required for ${newRoomCount} rooms`
    );

    return;
  }

  // =========================
  // ✅ ADD ROOM
  // =========================

if (delta > 0) {
  // add empty room first
  this.rooms.push(this.createRoom(0, []));

  // redistribute existing adults
  let remainingAdults = this.adultsCount;

  this.rooms.controls.forEach(room => {
    room.get('adults')?.setValue(0);
  });

  let roomIndex = 0;

  while (remainingAdults > 0) {
    const room = this.rooms.at(roomIndex);

    room.get('adults')?.setValue(
      room.get('adults')?.value + 1
    );

    remainingAdults--;
    roomIndex++;

    if (roomIndex >= this.rooms.length) {
      roomIndex = 0;
    }
  }
} else {

    this.rooms.removeAt(
      this.rooms.length - 1
    );
  }

  this.roomCount =
    this.rooms.length;
}

setChildAge(
  childIndex: number,
  age: number
) {

  this.childAgesArray
    .at(childIndex)
    .setValue(age);

  this.generateRooms();
}
checkDates = (group: AbstractControl): ValidationErrors | null => {

  const checkInControl = group.get('checkInDate');
  const checkOutControl = group.get('checkOutDate');

  const checkIn = checkInControl?.value;
  const checkOut = checkOutControl?.value;

  // ✅ clear only custom errors
  if (checkInControl?.errors) {
    delete checkInControl.errors['sameDayNotAllowed'];
    delete checkInControl.errors['checkInPast'];

    if (Object.keys(checkInControl.errors).length === 0) {
      checkInControl.setErrors(null);
    } else {
      checkInControl.setErrors(checkInControl.errors);
    }
  }

  if (checkOutControl?.errors) {
    delete checkOutControl.errors['checkOutBeforeCheckIn'];
    delete checkOutControl.errors['maxStayExceeded'];

    if (Object.keys(checkOutControl.errors).length === 0) {
      checkOutControl.setErrors(null);
    } else {
      checkOutControl.setErrors(checkOutControl.errors);
    }
  }

  if (!checkIn || !checkOut) {
    return null;
  }

  const today = new Date();

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  today.setHours(0, 0, 0, 0);
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);

  // ❌ Same day booking
  if (checkInDate.getTime() === today.getTime()) {

    checkInControl?.setErrors({
      ...(checkInControl.errors || {}),
      sameDayNotAllowed: true
    });

    return { sameDayNotAllowed: true };
  }

  // ❌ Past date
  if (checkInDate < today) {

    checkInControl?.setErrors({
      ...(checkInControl.errors || {}),
      checkInPast: true
    });

    return { checkInPast: true };
  }

  // ❌ checkout before checkin
  if (checkOutDate <= checkInDate) {

    checkOutControl?.setErrors({
      ...(checkOutControl.errors || {}),
      checkOutBeforeCheckIn: true
    });

    return { checkOutBeforeCheckIn: true };
  }

  // ❌ stay > 30
  const diffDays =
    (checkOutDate.getTime() - checkInDate.getTime()) /
    (1000 * 60 * 60 * 24);

  if (diffDays > 30) {

    checkOutControl?.setErrors({
      ...(checkOutControl.errors || {}),
      maxStayExceeded: true
    });

    return { maxStayExceeded: true };
  }

  return null;
};
  get rooms(): FormArray {
    return this.hotelForm.get('rooms') as FormArray;
  }

  get childAges(): FormArray[] {
    return this.rooms.controls.map(
      (room) => room.get('childAges') as FormArray
    );
  }
onRoomsApply(rooms: any) {

  this.rooms.clear();

  let totalAdults = 0;
  let totalChildren = 0;

  const globalChildAges: number[] = [];

  rooms.forEach((room: any) => {

    totalAdults += room.adults || 0;

    totalChildren +=
      room.childAges?.length || 0;

    globalChildAges.push(
      ...(room.childAges || [])
    );

    this.rooms.push(
      this.createRoom(
        room.adults,
        room.childAges || []
      )
    );
  });

  // update totals
  this.hotelForm.patchValue({
    adults: totalAdults,
    childrens: totalChildren
  });

  // update global child ages
  this.childAgesArray.clear();

  globalChildAges.forEach(age => {

    this.childAgesArray.push(
      new FormControl(age)
    );
  });

  this.roomCount =
    this.rooms.length;

  this.closeDrawer();
}
  toggleGuestDropdown() {
         this.DepartAutoComplete?.hide();
         this.popcheckOutDate?.hide();
    this.popcheckInDate?.hide();
    this.showGuestDropdown = !this.showGuestDropdown;
  }


  closeGuestDropdown() {
    this.showGuestDropdown = false;
  }

get guestSummary(): string {

  const totalRooms = this.rooms.length;

  let summary = `${this.adultsCount} Adult${this.adultsCount > 1 ? 's' : ''}`;

  if (this.childrenCount > 0) {
    summary += `, ${this.childrenCount} ${this.childrenCount === 1 ? 'Child' : 'Children'}`;
  }

  summary += `, ${totalRooms} Room${totalRooms > 1 ? 's' : ''}`;

  return summary;
}

  // onCheckInSelected(event: { departure: string }) {
  //   this.hotelForm.get('checkInDate')?.setValue(event.departure);
  // }
  // (dateSelected)="onCheckInSelected($event)"

  // onCheckOutSelected(event: { departure: string }) {
  //   this.hotelForm.get('checkOutDate')?.setValue(event.departure);
  // }
  // (dateSelected)="onCheckOutSelected($event)"


  filterCountry(event: any) {

    // If code exists → call API with code
    if (event.name) {
      this.getallAirport(event.name);
    }
    // Otherwise, call API with query/displayName
    else {
      this.getallAirport(event.query);
    }
  }
getallAirport(data: any) {
  if (data.length < 3 && data.length !== 0) {
    return;
  }

  const query = data.toLowerCase();

  this.hotelService.hotel_cityList(query).subscribe((res: any) => {
    if (res.success && res.data.length > 0) {
      this.destinationList = [];

      res.data.forEach((item: any) => {

        const displayName =
          item.type === 'hotel'
            ? item.name
            : item.state?.trim()
              ? `${item.city}, ${item.state}, ${item.country}`
              : `${item.city}, ${item.country}`;

        const maindata: any = {
          displayName,
          name: item.name,
          type: item.type,
          country: item.country,
          countrycode: item.countryCode || item.countrycode,
          city: item.city,
          code: item.code || item.cityid,
          destinationCode: item.destinationCode
        };

        this.destinationList.push(maindata);
      });

      this.cdr.detectChanges();

    }
  });
        this.cdr.markForCheck();
}

  roomValidator(control: AbstractControl): ValidationErrors | null {
    const adults = control.get('adults')?.value || 0;
    const children = control.get('childrens')?.value || 0;
    const total = adults + children;

    if (adults < 1) {
      return { minAdultRequired: true };
    }

    if (total > 5) {
      return { maxGuestsExceeded: true };
    }

    return null;
  }

  private toggleDrawerScroll(lock: boolean) {
    const html = document.documentElement;
    const body = document.body;

    if (lock) {
      html.classList.add("overflow-hidden");
      body.classList.add("overflow-hidden");
    } else {
      html.classList.remove("overflow-hidden");
      body.classList.remove("overflow-hidden");
    }
  }
  onInputFocus(
    drawerType: 'destination' | 'checkInDate' | 'checkOutDate' | 'guests',
    index?: number
  ) {
    if (!this.isMobile) return;

    this.showDrawer = true;
    this.activeDrawer = drawerType;


    switch (drawerType) {
      case "destination":
        this.drawerTitle = "Select Departure";
        break;

      case "checkInDate":
        this.drawerTitle = "Select check-in Date";
        break;
      case "checkOutDate":
        this.drawerTitle = "Select check-out Date";
        break;
      case "guests":
        this.drawerTitle = "Select Guests";
        break;
    }

    this.toggleDrawerScroll(true);
    this.cdr.detectChanges();
  }
  closeDrawer() {
    this.showDrawer = false;
    this.activeDrawer = null;
    this.activeInput = '';
    this.drawerTitle = '';
    this.toggleDrawerScroll(false);
    this.cdr.detectChanges();
  }

  // Children Age Dropdown

  isOpen = false;
  selectedAge: number | null = null;

ages = Array.from(
  { length: 17 },
  (_, i) => i + 1
);  activeDropdown: { i: number; j: number } | null = null;
toggleDropdownChildAge(i: number, j: number) {
  if (this.activeDropdown?.i === i && this.activeDropdown?.j === j) {
    this.activeDropdown = null; // close if same
  } else {
    this.activeDropdown = { i, j }; // open specific
  }
}
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectAge(age: number, event: Event) {
    event.stopPropagation();
    this.selectedAge = age;
    this.isOpen = false;
  }

  showArrivalPopover(event: MouseEvent, target: HTMLElement, drawerType: any) {
    this.popcheckInDate.hide();
        this.showGuestDropdown=false;
                this.DepartAutoComplete?.hide();
    this.popcheckOutDate.show(event, target);
    this.activeInput = drawerType;

    setTimeout(() => {
      const overlay = document.querySelector(".arrival-popover") as HTMLElement;
      if (!overlay || !target) return;

      const targetRect = target.getBoundingClientRect();
      const overlayWidth = overlay.offsetWidth;

      // 🔹 Center align with target
      let left = targetRect.left + targetRect.width / 2 - overlayWidth / 2;

      const top = targetRect.bottom + window.scrollY + 8;

      // 🔹 Prevent overflow on edges (important for last input)
      const padding = 8;
      const maxLeft = window.innerWidth - overlayWidth - padding;

      if (left < padding) {
        left = padding;
      } else if (left > maxLeft) {
        left = maxLeft;
      }

      overlay.style.position = "absolute";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;

      overlay.classList.add("slide-from-bottom");
    }, 0);
  }

  showDeparturePopover(
    event: MouseEvent,
    target: HTMLElement,
    drawerType: any
  ) {
    event.preventDefault();
    event.stopPropagation();
     this.showGuestDropdown=false;
         this.popcheckOutDate?.hide();
                 this.DepartAutoComplete?.hide();
    this.popcheckInDate?.hide();
    if (this.popcheckInDate?.overlayVisible) {
      this.popcheckInDate.hide();
      return;
    }

    this.popcheckInDate.show(event, target);
    this.activeInput = drawerType;

    setTimeout(() => {
      const overlays = document.querySelectorAll(".departure-popover");
      const overlay = overlays[overlays.length - 1] as HTMLElement;

      if (!overlay || !target) return;

      const targetRect = target.getBoundingClientRect();
      const overlayWidth = overlay.offsetWidth;

      // 🔹 Center align
      let left =
        targetRect.left + targetRect.width / 2 - overlayWidth / 2;

      const top = targetRect.bottom + window.scrollY + 8;

      // 🔹 Prevent overflow
      const padding = 8;
      const maxLeft = window.innerWidth - overlayWidth - padding;

      if (left < padding) left = padding;
      else if (left > maxLeft) left = maxLeft;

      overlay.style.position = "absolute";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;

      overlay.classList.remove("slide-from-bottom");
      void overlay.offsetWidth; // reset animation
      overlay.classList.add("slide-from-bottom");
    }, 0);
  }
  resetActiveInput() {
    this.activeInput = "";
  }


  onDatesApplied(event: {
    checkInDate: string;
    checkOutDate?: string;
    formattedCheckIn: string;
    formattedCheckOut?: string;
  }) {

    this.activeInput = '';
    this.toggleDrawerScroll(false);

    this.hotelForm.get('checkInDate')?.setValue(event.checkInDate);
    this.hotelForm.get('checkOutDate')?.setValue(event.checkOutDate || '');

    this.hotelForm.get('checkInDate')?.markAsTouched();
    this.hotelForm.get('checkOutDate')?.markAsTouched();

    // Update formatted display
    this.formattedchecheckInDate = event.formattedCheckIn;
    this.formattedcheckOutDate = event.formattedCheckOut || '';

    // ===============================
    // ✅ Update Date Objects (Used for calendar min/max)
    // ===============================

    this.checkInDateObj = event.checkInDate
      ? new Date(event.checkInDate)
      : null;

    this.checkOutDateObj = event.checkOutDate
      ? new Date(event.checkOutDate)
      : null;

      console.log('Dates applied:',
        this.checkInDateObj,
        this.checkOutDateObj
      );
  }
  onDatesChanged(event: {
    checkInDate: string;
    checkOutDate?: string;
    formattedCheckIn: string;
    formattedCheckOut?: string;
  }) {
    // ✅ Update form immediately
    this.hotelForm.get("checkInDate")?.setValue(event.checkInDate);

    this.hotelForm.get("checkOutDate")?.setValue(event.checkOutDate || "");

    // ✅ Update display instantly
    this.formattedchecheckInDate = event.formattedCheckIn;
    this.formattedcheckOutDate = event.formattedCheckOut || "";

    // ✅ Update linked objects instantly
    this.checkInDateObj = event.checkInDate ? new Date(event.checkInDate) : null;
    this.checkOutDateObj = event.checkOutDate ? new Date(event.checkOutDate) : null;
  }
  getActiveFormGroup(): FormGroup {


    return this.hotelForm;
  }

  onDepartSelected(event: any) {
    const selectedDepart = event?.value;
    if (!selectedDepart) return;
    this.processDepartSelection(selectedDepart);
  }


  processDepartSelection(selectedDepart: any) {
    const control = this.hotelForm.get("departureAirport");
    control?.markAsTouched();
 this.departCountry=control?.value?.country;

    this.cdr.detectChanges();
  }
    allowOnlyLetters(event: KeyboardEvent) {
    const char = event.key;
    const allowedPattern = /^[A-Za-z\s-]+$/;

    if (!allowedPattern.test(char)) {
      event.preventDefault();
    }
  }

  sanitizePaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData ?? (window as any).clipboardData;
    const pastedText = clipboardData?.getData("text") ?? "";
    const cleanedText = pastedText.replace(/[^A-Za-z\s-]/g, "");
    const target = event.target as HTMLInputElement;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? 0;
    target.value =
      target.value.substring(0, start) +
      cleanedText +
      target.value.substring(end);
    const inputEvent = new Event("input", { bubbles: true });
    target.dispatchEvent(inputEvent);
  }

   checkDepartOpen() {
    const control = this.hotelForm.get("destination")?.value;

    // Case 1 → Selected airport object
    if (control && control.displayName && control.displayName.trim() !== "") {
      this.openDepartSuggestions();
      return;
    }
  }
  openDepartSuggestions() {
    setTimeout(() => {
      if (this.DepartAutoComplete) {
        this.DepartAutoComplete.show();
        const controlValue = this.hotelForm.get("destination")?.value;
        if (controlValue.code != "") {
          this.hotelForm.get("destination")?.setValue(controlValue);
          this.filterCountry({
            query: controlValue.displayName || "",
            name: controlValue.name,
          });
        } else {
          this.filterCountry({ query: "" });
        }
      }
    }, 0);
  }
  clearDepartureIfHighlightedOnKey(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.hotelForm.get("destination");
    if (!input || !control || !input.value) return;

    const isAllSelected =
      input.selectionStart === 0 && input.selectionEnd === input.value.length;

    if (isAllSelected) {
      const key = event.key;
      const isTextOnly = /^[a-zA-Z\s]$/.test(key);
      event.preventDefault();

      // Clear old value
      control.setValue("");

      // Insert typed key
      if (key.length === 1 && isTextOnly) {
        control.setValue(key);
      }

      this.textHighlightedDeparture = false;
      this.clickedOnceDeparture = false;

      setTimeout(() => input.focus(), 0);
    }
  }

    textHighlightedDeparture = false;
  clickedOnceDeparture = false;

  highlightDepartureText(event: any) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      setTimeout(() => {
        input.select(); // highlight full text
        this.textHighlightedDeparture = true;
        this.clickedOnceDeparture = false; // reset click tracker
      });
    }
  }

  handleDepartureClick(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    const control = this.hotelForm.get("destination");

    // Highlighted → clicking clears
    if (this.textHighlightedDeparture) {
      control?.setValue("");
      this.textHighlightedDeparture = false;
      this.clickedOnceDeparture = false;

      setTimeout(() => input.focus(), 0);
      return;
    }

    this.clickedOnceDeparture = false;
  }
    handleDepartureSelection(event: any) {
    if (this.isMobile) {
      this.closeDrawer();
    }
  }
  submitForm() {

  if (this.hotelForm.invalid) {
    this.hotelForm.markAllAsTouched();
    return;
  }
  if(this.isBrowser){
    const html = document.documentElement;
    const body = document.body;

  
      html.classList.add("modal-backdrop-hide");
      body.classList.add("modal-backdrop-hide");
    }
  const formValue =
    this.hotelForm.value;

  const destination =
    formValue.destination;

  // ✅ auto generated room payload
  const roomPayload =
    this.rooms.controls.map((room: any) => ({
      adults: room.get('adults')?.value,
      childAges:
        room.get('childAges')?.value || []
    }));

  const formData = {
    checkIn: formValue.checkInDate,
    checkOut: formValue.checkOutDate,

    // ✅ final room wise payload
    rooms: roomPayload,

    destination: formValue.destination
  };

  console.log(formData);
 if (this.packageTabActive) {
  const existingPackageData =
    this.searchService.getCurrentpackageData();

  this.searchService.setSearchpackageData({
    ...existingPackageData,
    hoteldata: formData
  });
   
  this.router.navigate(['/package-hotels-list'], {
    queryParams: {
      source: 'etg'
    }
  });
} else {
  this.searchService.setSearchHotelData(formData);

  this.hotelFilterService.resetFilters();

  if (!this.isHotelDetails) {
    this.router.navigate(['/hotels-list'], {
      queryParams: {
        source: 'etg'
      }
    });
  }
}

}

scrollToSection(section: HTMLElement): void {
   if (!this.isBrowser) {
    return;
   }
   if(!this.isHotelDetails){

   
  const topOffset = 180;

  const startPosition = window.scrollY;
  const targetPosition =
    section.getBoundingClientRect().top +
    window.scrollY -
    topOffset;

  const distance = targetPosition - startPosition;
  const duration = 300; // increase for slower scroll

  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (!startTime) startTime = currentTime;

    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    // ease-in-out effect
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo({
      top: startPosition + distance * ease
    });

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
}
}


toggleRoomsDropdown(event?: Event): void {
  event?.stopPropagation();

  // Close other desktop dropdowns/popovers
  this.showGuestDropdown = false;
  this.DepartAutoComplete?.hide();
  this.popcheckInDate?.hide();
  this.popcheckOutDate?.hide();

  this.showRoomsDropdown = !this.showRoomsDropdown;
}

closeRoomsDropdown(): void {
  this.showRoomsDropdown = false;
}

getRoomChildren(roomIndex: number): FormArray {
  return this.rooms
    .at(roomIndex)
    .get('childAges') as FormArray;
}


changeRoomAdults(
  roomIndex: number,
  delta: number
): void {

  const room = this.rooms.at(roomIndex);

  if (!room) {
    return;
  }

  const adultsControl = room.get('adults');

  if (!adultsControl) {
    return;
  }

  const currentAdults =
    adultsControl.value || 0;

  const children =
    this.getRoomChildren(roomIndex).length;

  const newAdults =
    currentAdults + delta;


  // Minimum 1 adult
  if (newAdults < 1) {
    return;
  }


  // Maximum 5 persons per room
  if (newAdults + children > 5) {

    this.toasterService.showError(
      'Maximum 5 guests allowed in a room'
    );

    return;
  }


  // Maximum 3 children per adult
  if (children > newAdults * 3) {

    this.toasterService.showError(
      `${newAdults} adult${newAdults > 1 ? 's' : ''} can accompany maximum ${newAdults * 3} children`
    );

    return;
  }


  adultsControl.setValue(newAdults);

  this.updateHotelGuestTotals();
}


changeRoomChildren(
  roomIndex: number,
  delta: number
): void {

  const room = this.rooms.at(roomIndex);

  if (!room) {
    return;
  }

  const adults =
    room.get('adults')?.value || 0;

  const childAges =
    this.getRoomChildren(roomIndex);

  const currentChildren =
    childAges.length;

  const newChildren =
    currentChildren + delta;


  // Minimum 0 children
  if (newChildren < 0) {
    return;
  }


  // Maximum 3 children per adult
  const maxChildren =
    adults * 3;

  if (newChildren > maxChildren) {

    this.toasterService.showError(
      `${adults} adult${adults > 1 ? 's' : ''} can accompany maximum ${maxChildren} children`
    );

    return;
  }


  // Maximum 5 people per room
  if (adults + newChildren > 5) {

    this.toasterService.showError(
      'Maximum 5 guests allowed in a room'
    );

    return;
  }


  if (delta > 0) {

    childAges.push(
      new FormControl(1)
    );

  } else {

    childAges.removeAt(
      childAges.length - 1
    );

  }


  this.updateHotelGuestTotals();
}


setRoomChildAge(
  roomIndex: number,
  childIndex: number,
  age: number | string
): void {

  const childAges =
    this.getRoomChildren(roomIndex);

  const control =
    childAges.at(childIndex);

  if (!control) {
    return;
  }

  control.setValue(
    Number(age)
  );

  this.updateHotelGuestTotals();
}


private updateHotelGuestTotals(): void {

  let totalAdults = 0;
  let totalChildren = 0;

  const globalChildAges: number[] = [];


  this.rooms.controls.forEach(room => {

    const adults =
      room.get('adults')?.value || 0;

    const childAges =
      room.get('childAges') as FormArray;

    totalAdults += adults;

    totalChildren +=
      childAges.length;

    globalChildAges.push(
      ...childAges.value
    );

  });


  this.hotelForm.patchValue(
    {
      adults: totalAdults,
      childrens: totalChildren
    },
    {
      emitEvent: false
    }
  );


  // Keep global child ages in sync
  this.childAgesArray.clear();

  globalChildAges.forEach(age => {

    this.childAgesArray.push(
      new FormControl(age)
    );

  });


  this.roomCount =
    this.rooms.length;

  this.cdr.detectChanges();
}
@HostListener('window:scroll')
@HostListener('window:resize')
hideFlightPopovers(): void {
   if (this.isBrowser) {
         this.popcheckOutDate?.hide();
    this.popcheckInDate?.hide();
   }
}



focusDepartureInput(): void {
  const input = this.DepartAutoComplete?.inputEL?.nativeElement;

  if (input) {
    input.focus();
  }
}

}
