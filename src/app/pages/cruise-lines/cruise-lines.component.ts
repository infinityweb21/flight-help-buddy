import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';

import { SearchCountryField, CountryISO, PhoneNumberFormat, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CruisesTabComponent } from '../../components/main-filter/cruises-tab/cruises-tab.component';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/common/spinner.service';
import { TosterService } from '../../services/common/toaster.service';
import { TopRoutesService } from '../../services/destinations/top-routes.service';
import { SearchService } from '../../services/search.service';
import { SharedService } from '../../services/shared/shared.service';
import { CruiseLineService } from '../../services/destinations/cruise-line.service';

@Component({
  selector: 'app-cruise-lines',
  imports: [NgFor, NgStyle, RouterLink, NgIf, ReactiveFormsModule, CruisesTabComponent, NgxIntlTelInputModule],
  templateUrl: './cruise-lines.component.html',
  styleUrl: './cruise-lines.component.scss'
})
export class CruiseLinesComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  origin = '';
  destination = '';
 separateDialCode = false;
      SearchCountryField = SearchCountryField;
      CountryISO = CountryISO;
      PhoneNumberFormat = PhoneNumberFormat;
      preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  travelFeatures = [
    {
      icon: 'assets/images/top-routes/Plan-Your-Budget.png',
      title: 'TRAVEL WITH YOUR BUDGET',
      description:
        'It’s time to travel with your own budget and also fulfill all your dreams of flying.',
    },
    {
      icon: 'assets/images/top-routes/A-Journey-of-Comfort.png',
      title: 'BEST MODE OF COMFORT',
      description:
        'Witness that extra dose of comfort as you fly high with us.',
    },
    {
      icon: 'assets/images/top-routes/Easy-Booking-&-Payment.png',
      title: 'EASY BOOKING & PAYMENT',
      description:
        'Have the access to the convenient mode of payment for bookings, right now!',
    },
  ];
  activeroute: string = '';
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  backgroundImageUrl = '';
  headerText = '';
  subHeaderText = '';
  private routeBackgrounds: { [key: string]: string } = {
    'cruise-lines': '/assets/images/destination-banner/cruise-line.webp',
    default:
      'https://control.theinfinitytravel.com/assets/images/top-destinations/1631957667Londonwebp.webp',
  };
  private routeHeaderTexts: { [key: string]: string } = {
    'cruise-lines': 'Find Your Bliss on the High Seas',
    default: 'Find Your Bliss on the High Seas',
  };


  private routeSubHeaderTexts: { [key: string]: string } = {
    'cruise-lines':
      'Set sail on your dream voyage as you discover the world with us and book now to enjoy exclusive discounts at the perfect time of day',
    default:
      'Set sail on your dream voyage as you discover the world with us and book now to enjoy exclusive discounts at the perfect time of day',
  };

  private shareService: SharedService = inject(SharedService);
    private searchService: SearchService = inject(SearchService);

  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);

  private authService: AuthService = inject(AuthService);
  private cruiseService: CruiseLineService = inject(CruiseLineService);
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
        phone: [undefined, [Validators.required,this.phoneLengthValidator]]
    });
  }
 phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // Ensure value is an object and has nationalNumber
  if (value && typeof value === 'object' && value.number) {
    const digits = value.number.replace(/\D/g, ''); // remove non-digits
    const length = digits.length;

    if (length < 6 || length > 15) {
      return { invalidPhoneLength: true };
    }
  }

  return null;
}
  destinations: { name: string;  destination: string,slug:string,destinationName:string,image:string,description:string,logo:string, }[] = [];
  flightData: { name: string;  destination: string,slug:string,destinationName:string,image:string,description:string,logo:string, }[][] = [];
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });

    // First, try to get data from resolved route data
    this.route.data.subscribe(data => {
      console.log('Resolved cruise lines data:', data['cruiseLinesData']);
      
      if (data['cruiseLinesData']) {
        this.processCruiseLinesData(data['cruiseLinesData']);
      } else {
        // Fallback to manual fetch if resolver failed
        this.getCruiseLine();
      }
    });
  }
  ngAfterViewInit(): void {
    this.setActiveTabBasedOnRoute(this.router.url);
  }

  setActiveTabBasedOnRoute(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    console.log('Last segment:', lastSegment);
    this.activeroute = lastSegment;
    this.backgroundImageUrl =
      this.routeBackgrounds[lastSegment] || this.routeBackgrounds['default'];
    this.headerText =
      this.routeHeaderTexts[lastSegment] || this.routeHeaderTexts['default'];
    this.subHeaderText =
      this.routeSubHeaderTexts[lastSegment] ||
      this.routeSubHeaderTexts['default'];

    this.cdr.detectChanges();
  }

  private processCruiseLinesData(cruiseLinesData: any) {
    if (cruiseLinesData?.data) {
      this.flightData = cruiseLinesData.data;
      this.destinations = cruiseLinesData.data.map((route: any) => ({
        name: route.Name,
        destination: route.Destination,
        slug: route?.Slug,
        destinationName: route?.DestinationName,
        description: route?.MetaDescription,
        image: `https://control.theinfinitytravel.com/assets/images/cruise-lines/${route?.Banner}`,
        logo:`https://control.theinfinitytravel.com/assets/images/cruise-lines/${route?.cruise_logo}`
      }));
      this.chunkDestinations(7);
      this.cdr.detectChanges();
    } else {
      console.log(cruiseLinesData, "cruiseLinesData---------");
      // Handle case where cruise lines data was not found
      this.handleCruiseLinesNotFound();
    }
  }

  private handleCruiseLinesNotFound() {
    this.toasterService.showError("Unable to load cruise lines data");
    // Optionally set empty arrays to prevent UI issues
    this.flightData = [];
    this.destinations = [];
  }

  getCruiseLine() {
    this.SpinnerService.show();
    this.cruiseService
      .getCruise()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.SpinnerService.hide();
          this.flightData = res?.data;
          this.destinations = res.data.map((route: any) => ({
            name: route.Name,
        destination: route.Destination,
        slug:route?.Slug,
        destinationName:route?.DestinationName,
        description:route?.MetaDescription,
        image:`https://control.theinfinitytravel.com/assets/images/cruise-lines/${route?.Banner}`,
         logo:`https://control.theinfinitytravel.com/assets/images/cruise-lines/${route?.cruise_logo}`
          }));
          this.chunkDestinations(7);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.SpinnerService.hide();
          this.toasterService.showError(
            err.error.message ||
              'Something went wrong while sending the contact!'
          );
        },
      });
  }
  lightData: string[][] = [];

  chunkDestinations(size: number): void {
    this.flightData = [];
    for (let i = 0; i < this.destinations.length; i += size) {
      this.flightData.push(this.destinations.slice(i, i + size));
    }
  }

  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  }



  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(
      control &&
      (control.touched || this.submitted) &&
      control.invalid
    );
  }

  submitContactForm() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    console.log('this.getData.email', this.getData.email);
    const payload = {
      name: this.contactForm.value['name'],
      email: '',
      phone: this.contactForm.value['phone'],
      subject: 'get a call back',
      message: 'request a call back',
      contact_email: this.getData.email,
      appName: this.getData?.appName,
    };
    this.SpinnerService.show();
    this.authService
      .sendEmail(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.SpinnerService.hide();
          this.contactForm.reset();
          this.router.navigate(['/thankyou']);
        },
        error: (err) => {
          this.SpinnerService.hide();
          this.toasterService.showError(
            err.error.message ||
              'Something went wrong while sending the contact!'
          );
        },
      });
  }
}
