import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  Inject,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CruisesTabComponent } from './cruises-tab/cruises-tab.component';
import { FlightsTabComponent } from './flights-tab/flights-tab.component';
import { HotelsTabComponent } from './hotels-tab/hotels-tab.component';
import { PackagesTabComponent } from './packages-tab/packages-tab.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SvgIcons } from '../../shared/svg-icons';
import { SharedService } from '../../services/shared/shared.service';
import { CardModule } from 'primeng/card';
import {
  CountryISO,
  NgxIntlTelInputModule,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/common/spinner.service';
import { TosterService } from '../../services/common/toaster.service';
import { CarTabComponent } from './car-tab/car-tab.component';
// ✅ Declare outside class (Trustpilot)
declare global {
  interface Window {
    Trustpilot: any;
  }
}
@Component({
  selector: 'app-main-filter',
  imports: [
    CruisesTabComponent,
    FlightsTabComponent,
    HotelsTabComponent,
    PackagesTabComponent,
    CommonModule,
    CardModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    CarTabComponent,
    
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './main-filter.component.html',
  styleUrl: './main-filter.component.scss',
})
export class MainFilterComponent implements OnInit, AfterViewInit {
  private router: Router = inject(Router);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private fb: FormBuilder = inject(FormBuilder);
  protected icons = inject(SvgIcons);
  private shareService: SharedService = inject(SharedService);
  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private authService: AuthService = inject(AuthService);
  @ViewChild('trustpilotWidget')
trustpilotWidget!: ElementRef;
  @Input() inquiryForm!: FormGroup;
  showPlaceholder = true;

  activeTab: string = '';
  activeTabCta: string = 'flight-tab';
  companyName: string = '';
  phoneNumber: string = '';
  flightContactNumber: string = '';
  hotelContactNumber: string = '';
  cruiseContactNumber: string = '';

  showHome: boolean = false;
  showHomeCta: boolean = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  separateDialCode = false;
  submitted: boolean = false;
  getData: any = '';
  filterTab: string = 'flight-tab';
  toggleTab(tab: string): void {
    this.filterTab = tab;
    this.activeTab = tab;
  }
      isBrowser = false;

constructor(  @Inject(PLATFORM_ID) private platformId: Object,) {
     this.isBrowser = isPlatformBrowser(this.platformId);
}
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
          if (!this.isBrowser) return;
        if (!window.Trustpilot) {
      const script = document.createElement("script");
      script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      script.async = true;
      document.head.appendChild(script);
      this.getTrustpilot();
    }
    this.companyName = this.getData.companyName;
    this.phoneNumber = this.getData.phoneNumber;
    this.flightContactNumber = this.getData.flightContactNumber;
    this.hotelContactNumber = this.getData.hotelContactNumber;
    this.cruiseContactNumber = this.getData.cruiseContactNumber;

    // Set the tab immediately on init
    this.setActiveTabBasedOnRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });

    this.inquiryForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, Validators.required, this.phoneLengthValidator],
      departure: ['', Validators.required],
      destination: ['', Validators.required],
      days: [null, Validators.required],
      pax: [null, Validators.required],
    });
  }

 
  phoneLengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Ensure value is an object and has nationalNumber
    if (value && typeof value === 'object' && value.number) {
      const digits = value.number.replace(/\D/g, '');
      const length = digits.length;

      if (length < 6 || length > 15) {
        return { invalidPhoneLength: true };
      }
    }

    return null;
  }

  setActiveTabBasedOnRoute(url: string): void {
    this.showHome = false;

    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter((segment) => segment);
    const lastSegment = segments[segments.length - 1];

    const knownTabs = [
      'flights',
      'flight',
      'hotel',
      'hotels',
      'cruise',
      'packages',
      'car'
    ];
    if (knownTabs.includes(lastSegment)) {
      this.activeTab = `${lastSegment}-tab`;
      this.filterTab = `${lastSegment}-tab`;
    } else {
      const tab = `${lastSegment}-tab`;

      if (tab == 'undefined-tab') {
        this.activeTab = 'home-tab';
        this.filterTab = 'home-tab';
      } else if (url.includes('/blog-details')) {
        this.activeTab = 'blog-details-tab';
        this.filterTab = 'home-tab';
      } else if (url.includes('/first-class-flight-tickets')) {
        this.activeTab = 'first-class-flight-tickets-tab';
        this.filterTab = 'home-tab';
      } else if (url.includes('/business-class-flight-tickets')) {
        this.activeTab = 'business-class-flight-tickets-tab';
        this.filterTab = 'home-tab';
      }
      else if (url.includes('/international-flights-from-us')) {
        this.activeTab = 'international-flights-from-us-tab';
        this.filterTab = 'home-tab';
      } else if (url.includes('/international-flights-to-us')) {
        this.activeTab = 'international-flights-to-us-tab';
        this.filterTab = 'home-tab';
      }
      else if (url.includes('/routes')) {
        this.activeTab = 'flight-tab';
        this.filterTab = 'flight-tab';
      }
      else if (url.includes('/business-classs')) {
        this.activeTab = 'flight-tab';
        this.filterTab = 'flight-tab';
      }
      
      else {
        this.activeTab = 'home-tab';
        this.filterTab = 'home-tab';
      }
      console.log("this.activeTab",this.activeTab,this.filterTab)
    }

    this.cdr.detectChanges();
    
  }
  // In your component.ts
  bannerImages: Record<string, string[]> = {
    'flight-tab': [
      'assets/images/flight/flightbanner/thumb-1.webp',
      'assets/images/flight/flightbanner/thumb-2.webp',
      'assets/images/flight/flightbanner/thumb-3.webp',
    ],
    'hotel-tab': [
      'assets/images/hotel/hotelbanner/thumb-2.webp',
      'assets/images/hotel/hotelbanner/thumb-2.webp',
      'assets/images/hotel/hotelbanner/thumb-3.webp',
    ],
    'cruise-tab': [
      'assets/images/cruise/cruisebanner/thumb-1.webp',
      'assets/images/cruise/cruisebanner/thumb-2.webp',
      'assets/images/cruise/cruisebanner/thumb-3.webp',
    ],
    'package-tab': [
      'assets/images/flight/flightbanner/thumb-1.webp',
      'assets/images/cruise/cruisebanner/thumb-2.webp',
      'assets/images/hotel/hotelbanner/thumb-3.webp',
    ],
    'blog-details-tab': [
      'assets/images/banner/blog-details/thumb-1.webp',
      'assets/images/banner/blog-details/thumb-2.webp',
      'assets/images/banner/blog-details/thumb-3.webp',
    ],
    'new-york-tab': [
      'assets/images/global-vacation/new-work/Banner/banner-1.webp',
      'assets/images/global-vacation/new-work/Banner/banner-2.webp',
      'assets/images/global-vacation/new-work/Banner/banner-3.webp',
    ],
    'bangkok-tab': [
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_1.webp',
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_2.webp',
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_3.webp',
    ],
    'sydney-tab': [
      'assets/images/global-vacation/Sydney/Banner/banner-1.webp',
      'assets/images/global-vacation/Sydney/Banner/banner-2.webp',
      'assets/images/global-vacation/Sydney/Banner/banner-3.webp',
    ],
    'kuala-lumpur-tab': [
      'assets/images/global-vacation/kuala-lumpur/banner/kuala_lumpur_banner1.webp',
      'assets/images/global-vacation/kuala-lumpur/banner/kuala_lumpur_banner2.webp',
      'assets/images/global-vacation/kuala-lumpur/banner/kuala_lumpur_banner3.webp',
    ],
    //sjdhfs
    'paris-tab': [
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_1.webp',
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_2.webp',
      'assets/images/global-vacation/bangkok/banner/bangkok_banner_3.webp',
    ],
    'tokyo-tab': [
      'assets/images/global-vacation/tokyo/banner/tokyo_banner1.webp',
      'assets/images/global-vacation/tokyo/banner/tokyo_banner2.webp',
      'assets/images/global-vacation/tokyo/banner/tokyo_banner3.webp',
    ],
    'amsterdam-tab': [
      'assets/images/global-vacation/Amsterdam/Banner/banner-1.webp',
      'assets/images/global-vacation/Amsterdam/Banner/banner-2.webp',
      'assets/images/global-vacation/Amsterdam/Banner/banner-3.webp',
    ],
    'swis-alps-tab': [
      'assets/images/trending-escape/swis-Alps/Banner/banner-1.webp',
      'assets/images/trending-escape/swis-Alps/Banner/banner-2.webp',
      'assets/images/trending-escape/swis-Alps/Banner/banner-3.webp',
    ],
    'california-tab': [
      'assets/images/trending-escape/california/Banner/banner-1.webp',
      'assets/images/trending-escape/california/Banner/banner-2.webp',
      'assets/images/trending-escape/california/Banner/banner-3.webp',
    ],
    'florida-tab': [
      'assets/images/trending-escape/florida-escape/Banner/banner-1.webp',
      'assets/images/trending-escape/florida-escape/Banner/banner-2.webp',
      'assets/images/trending-escape/florida-escape/Banner/banner-3.webp',
    ],
    'hong-kong-tab': [
      'assets/images/hotel/hongkong/banner/hongkong-banner-1.webp',
      'assets/images/hotel/hongkong/banner/hongkong-banner-2.webp',
      'assets/images/hotel/hongkong/banner/hongkong-banner-3.webp',
    ],
    'bali-tab': [
      'assets/images/hotel/bali/banner/bali_banner_1.webp',
      'assets/images/hotel/bali/banner/bali_banner_2.webp',
      'assets/images/hotel/bali/banner/bali_banner_3.webp',
    ],
    'dubai-tab': [
      'assets/images/hotel/dubai/banner/dubai_banner_1.webp',
      'assets/images/hotel/dubai/banner/dubai_banner_1.webp',
      'assets/images/hotel/dubai/banner/dubai_banner_1.webp',
    ],
    'rome-tab': [
      'assets/images/trending-escape/florida-escape/Banner/banner-1.webp',
      'assets/images/trending-escape/florida-escape/Banner/banner-2.webp',
      'assets/images/trending-escape/florida-escape/Banner/banner-3.webp',
    ],
    'venice-tab': [
      'assets/images/hotel/Venice/banner/venice_banner_1.webp',
      'assets/images/hotel/Venice/banner/venice_banner_2.webp',
      'assets/images/hotel/Venice/banner/venice_banner_3.webp',
    ],
    'first-class-flight-tickets-tab': [
      'assets/images/flight/thumb-1.webp',
      'assets/images/flight/thumb-2.webp',
      'assets/images/flight/thumb-3.webp',
    ],
    'business-class-flight-tickets-tab': [
      'assets/images/flight/business-flight/thumb-1.webp',
      'assets/images/flight/business-flight/thumb-2.webp',
      'assets/images/flight/business-flight/thumb-3.webp',
    ],
    'international-flights-from-us-tab': [
      'assets/images/international-flights-from-us/thumb-1.webp',
      'assets/images/international-flights-from-us/thumb-2.webp',
      'assets/images/international-flights-from-us/thumb-3.webp'
    ],
    'international-flights-to-us-tab': [
      'assets/images/international-flights-from-us/thumb-1.webp',
      'assets/images/international-flights-from-us/thumb-2.webp',
      'assets/images/international-flights-from-us/thumb-3.webp'
    ]
  };

  onSubmit(): void {
    this.submitted = true;
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }
    const payload = {
      name: this.inquiryForm.value['fullName'],
      email: this.inquiryForm.value['email'],
      phone: this.inquiryForm.value['phone'].e164Number,
      subject: 'Package inquiry',
      message: 'Package inquiry',
      contact_email: this.getData.sendemail,
      appName: this.getData?.appName,
      template: 'inquiry',
      departure: this.inquiryForm.value['departure'],
      destination: this.inquiryForm.value['destination'],
      days: this.inquiryForm.value['days'],
      pax: this.inquiryForm.value['pax'],
    };

    this.SpinnerService.show();
    this.authService
      .sendEmail(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.SpinnerService.hide();
          this.inquiryForm.reset();
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
  ngAfterViewInit(): void {
   this.getTrustpilot();
  }
getTrustpilot() {
  if (!this.isBrowser) return;

  this.showPlaceholder = true;

  setTimeout(() => {
    if (window.Trustpilot) {
      const widgets = document.querySelectorAll('.trustpilot-widget');

      widgets.forEach((widget: any) => {
        if (widget.dataset.templateId) {
          window.Trustpilot.loadFromElement(widget);

          // Check when Trustpilot has rendered
          const observer = new MutationObserver(() => {
            if (widget.querySelector('iframe')) {
              this.showPlaceholder = false;
              this.cdr.detectChanges();
              observer.disconnect();
            }
          });

          observer.observe(widget, {
            childList: true,
            subtree: true
          });
        }
      });
    }
  }, 100);
}

  
}
