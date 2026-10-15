import { Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TosterService } from '../../../services/common/toaster.service';
import { ToastModule } from 'primeng/toast';
import { LocationService } from '../../../services/shared/location.service';
import { AutoComplete } from 'primeng/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../../../services/search.service';
import { SvgIcons } from '../../../shared/svg-icons';
import { SharedService } from '../../../services/shared/shared.service';
import { FlightService } from '../../../services/flight/flight.service';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-package-book',
  imports: [
    StepperModule, 
    ButtonModule, 
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule, 
    CommonModule,
    ToastModule ,FormsModule,AutoComplete// Add this import
  ],
  templateUrl: './package-book.component.html',
  styleUrl: './package-book.component.scss',
})
export class PackageBookComponent implements OnInit {
  private toasterService: TosterService = inject(TosterService);
        private locationService:LocationService=inject(LocationService)
    protected icons = inject(SvgIcons);
      private destroyRef: DestroyRef = inject(DestroyRef);
  inputValue: string = '';
  showDropdown: boolean = false;
  dropdownOpen: boolean = false;

  selectedAdults: number = 1;
  selectedChildren: number = 0;
  selectedInfants: number = 0;

  private router = inject(Router);
  private searchService = inject(SearchService);

  selectedCabin = { name: 'Economy', value: 'E' };
  departureAirports: any[] = [];
  arrivalAirports: any[] = [];
  allAirports: any[] = [];
  submitted:boolean=false;
 cabinOptions = [
    { name: 'Economy', value: 'E' },
        { name: 'First', value: 'F' },
            { name: 'Business', value: 'B' },
    { name: 'Premium Economy', value: 'P' },
  ];

  adultsList = Array.from({ length: 9 }, (_, i) => i + 1);
  childrenList = Array.from({ length: 8 }, (_, i) => i + 1);
  infantsList = Array.from({ length: 5 }, (_, i) => i);
 origin: string = '';
  destination: string = '';
  activeStep = 1;
  Math = Math;
  bookingForm: FormGroup;

  durationOptions = [
    { label: '4-6 Days', value: '4-6' },
    { label: '7-9 Days', value: '7-9' },
    { label: '10-12 Days', value: '10-12' },
    { label: '12-20 Days', value: '12-20' }
  ];
  childAges: number[] = [];
  
  // Getter methods
    // Getter methods
  get departureControl(): FormControl {
    return this.bookingForm.get('departure') as FormControl;
  }
  get destinationControl(): FormControl {
    return this.bookingForm.get('destination') as FormControl;
  }
  
  get durationControl(): FormControl {
    return this.bookingForm.get('duration') as FormControl;
  }
  
  get departureDateControl(): FormControl {
    return this.bookingForm.get('departureDate') as FormControl;
  }
  
  get adultsControl(): FormControl {
    return this.bookingForm.get('adults') as FormControl;
  }
  
  get childrenControl(): FormControl {
    return this.bookingForm.get('children') as FormControl;
  }
  
  get roomsControl(): FormControl {
    return this.bookingForm.get('rooms') as FormControl;
  }
  
  get infantsControl(): FormControl {
    return this.bookingForm.get('infants') as FormControl;
  }
  getdeparture:any='';
  constructor(private fb: FormBuilder, private flightService: FlightService,private sharedService:SharedService,private route:ActivatedRoute) {
    // Set date constraints
    const today = new Date();
    this.minDate = today;
    this.maxDate = new Date();
    this.maxDate.setFullYear(today.getFullYear() + 1);
    
    // Initialize form
    this.bookingForm = this.fb.group({
        departure: ['', Validators.required],
      destination: ['', Validators.required],
      duration: ['', Validators.required],
      departureDate: [null, Validators.required],
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]],
      rooms: [1, [Validators.required, Validators.min(1)]],
      childAges: this.fb.array([]),
      infants: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
         this.searchService.packageSearchData$.subscribe((searchData) => {
      console.log('Received cruise Data:', searchData);
      if (searchData) {
        this.bookingForm.patchValue({
          departure: searchData?.fromvalue?.departure,
  destination: searchData?.fromvalue?.destination,
  duration: searchData?.fromvalue?.duration,
  departureDate: searchData?.fromvalue?.departureDate 
    ? new Date(searchData.fromvalue.departureDate) 
    : null,   // <-- convert to Date
  adults: searchData?.fromvalue?.adults,
  children: searchData?.fromvalue?.children,
  rooms: searchData?.fromvalue?.rooms,
  childAges: searchData?.fromvalue?.childAges,
  infants: searchData?.fromvalue?.infants
        });
        // Use searchData to fetch or filter flights
      } else {
        // Optionally handle empty state (e.g., redirect back or show message)
      }
    });
    // Initialize child ages array based on initial children count
    this.updateChildAges();
    
    // Watch for changes to children count
    this.childrenControl.valueChanges.subscribe(() => {
      this.updateChildAges();
    });

  }
  filterCountry(event: any): void {
    const query = event.query.toLowerCase();
  
        this.flightService.airportlList(query).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
    
       this.departureAirports = res.data.map((airport: any) => ({
      displayName: `${airport.city} - ${airport.country}`,
      code: airport.airport_code,
      city: airport.city,
      airport_name: airport.airport_name ,
      country:airport.country,// keep full object if needed later
      country_code:airport.country_code
    }));
      },
      error: (err) => {
        this.departureAirports=[];
        this.toasterService.showError(err.error.message || 'Something went wrong while fetching data!')
      }
    })

  }
  updateChildAges() {
    const childrenCount = this.childrenControl.value || 0;
    const currentAges = this.bookingForm.get('childAges')?.value || [];
    
    // Add or remove age fields based on children count
    if (childrenCount > currentAges.length) {
      for (let i = currentAges.length; i < childrenCount; i++) {
        currentAges.push(5); // Default age
      }
    } else {
      currentAges.splice(childrenCount);
    }
    
    this.bookingForm.get('childAges')?.setValue(currentAges);
    this.childAges = [...currentAges]; // For template reference
  }

updateCount(field: string, increment: number) {
  const control = this.bookingForm.get(field) as FormControl;
  if (control) {
    const currentValue = control.value || 0;
    const newValue = Math.max(0, currentValue + increment);

    if (field === 'rooms') {
      // Rooms will be auto-calculated by updateRoomsBasedOnGuests()
      this.updateRoomsBasedOnGuests();
    } else {
      control.setValue(newValue);

      // After updating adults/children, recalc rooms
      if (field === 'adults' || field === 'children') {
        this.updateRoomsBasedOnGuests();
      }
    }
  }
}

updateRoomsBasedOnGuests() {
  const adults = this.adultsControl.value || 0;
  const children = this.childrenControl.value || 0;
  const totalGuests = adults + children;

  if (totalGuests > 0) {
    const requiredRooms = Math.ceil(totalGuests / 4); // 4 guests per room
    this.bookingForm.get('rooms')?.setValue(requiredRooms);
  } else {
    this.bookingForm.get('rooms')?.setValue(1); // at least 1 room
  }
}


  updateChildAge(index: number, value: number) {
    const childAges = [...this.childAges];
    childAges[index] = value;
    this.childAges = childAges;
    this.bookingForm.get('childAges')?.setValue(childAges);
  }

  isStepValid(step: number): boolean {
    switch(step) {
            case 1:
        return this.departureControl.valid;
      case 2:
        return this.destinationControl.valid;
      case 3:
        return this.durationControl.valid;
      case 4:
        return this.departureDateControl.valid;
      case 5:
        return this.bookingForm.valid;
      default:
        return false;
    }
  }

  goToStep(step: number) {
    if (step < this.activeStep || this.isStepValid(this.activeStep)) {
      this.activeStep = step;
    }
  }

  // This method will be called from the template
  validateAndProceed(nextStep: number) {
    console.log("nextStep",nextStep);
    
    if (this.isStepValid(this.activeStep)) {
        
      this.activeStep = nextStep;
      console.log("this.activeStep if",this.activeStep);
      
    } else {
      console.log("this.activeStep else",this.activeStep);
      
      // Show error message based on current step
      switch(this.activeStep) {
        case 1:
          this.toasterService.showError('Please select a departure.');
          break;
        case 2:
          this.toasterService.showError('Please select a destination.');
          break;
        case 3:
          this.toasterService.showError('Please select a duration.');
          break;
        case 4:
          this.toasterService.showError('Please select a departure date.');
          break;
        case 5:
          this.toasterService.showError('Please complete all fields in this step.');
          break;
      }
    }
  }
  returnDate: Date | null = null;

  minDate: Date = new Date(); // set minimum date
  maxDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 6)); // +6 months

  // ✅ Convert date -> dd/MM/yyyy
  formatDate(date: Date): string {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // ✅ Calculate return date based on duration
calculateReturnDate() {
  const departureDate = this.departureDateControl.value as Date | null;
  if (!departureDate || !this.bookingForm.value['duration']) return;

  const daysToAdd = parseInt(this.bookingForm.value['duration'].split('-')[1], 10);
  console.log("daysToAdd",daysToAdd)
  const returnDate = new Date(departureDate);
  returnDate.setDate(returnDate.getDate() + daysToAdd);

  this.returnDate = returnDate;
}

  submitForm() {
        this.calculateReturnDate();
    if (this.bookingForm.valid) {
      console.log('Form submitted:', this.bookingForm.value);
         const departureDate: Date = this.bookingForm.value['departureDate'];

      const payload=
        {
    "CurrencyCode": "USD",
    "NoOfAdults":this.bookingForm.value['adults'],
    "NoOfInfants":this.bookingForm.value['infants'],
    "NoOfChildren":this.bookingForm.value['children'],
    "endDate":this.returnDate ? this.formatDate(this.returnDate) : null,
    "city":this.bookingForm.value['destination']?.city,
    "country":this.bookingForm.value['destination']?.country_code,
    "OriginDestination": [
        {
			"DepartureTime":this.formatDate(departureDate) ,
			"DepartureLocationCode": this.bookingForm.value['departure']?.code,
			"ArrivalLocationCode": this.bookingForm.value['destination']?.code,
		}
    ]
    

      }
      console.log("payload",payload)
      const setpayload={
        payload:payload,
        fromvalue:this.bookingForm.value
      }
  this.searchService.setSearchpackageData(setpayload);

      this.router.navigate(['/select-package']);
    } else {
      this.toasterService.showError('Please complete all required fields.');
    }
  }
}