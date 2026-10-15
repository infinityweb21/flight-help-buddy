import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  makeStateKey,
  TransferState,
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
import { FlightsTabComponent } from '../../../components/main-filter/flights-tab/flights-tab.component';
import { AuthService } from '../../../services/auth.service';
import { SpinnerService } from '../../../services/common/spinner.service';
import { TosterService } from '../../../services/common/toaster.service';
import { TopRoutesService } from '../../../services/destinations/top-routes.service';
import { MockFlightDataService } from '../../../services/flight/mock-flight-data.service';
import { SharedService } from '../../../services/shared/shared.service';
import { SearchCountryField, CountryISO, PhoneNumberFormat, NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SearchService } from '../../../services/search.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-top-routesmain',
  imports: [NgFor, NgStyle, NgIf, RouterLink, ReactiveFormsModule, FlightsTabComponent, NgxIntlTelInputModule],
  templateUrl: './top-routesmain.component.html',
  styleUrl: './top-routesmain.component.scss',
})
export class TopRoutesmainComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private transferState: TransferState = inject(TransferState);
  private metaService: Meta = inject(Meta);
  private readonly BLOG_KEY = makeStateKey<any>('top-routes');

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
    'top-routes': '/assets/images/top-routes/Top-Routes.webp',
    default:
      'https://control.theinfinitytravel.com/assets/images/top-destinations/1631957667Londonwebp.webp',
  };
  private routeHeaderTexts: { [key: string]: string } = {
    'top-routes': 'ONE LIFE, ONE WORLD, LETS US EXPLORE IT!',
    default: 'ONE LIFE, ONE WORLD, LET US EXPLORE IT!',
  };

  private routeSubHeaderTexts: { [key: string]: string } = {
    'top-routes':
      'Accomplish all your dream plans as you explore it with us. Purchase the discounted prices at the best time of the day.',
    default:
      'Accomplish all your dream plans as you explore it with us. Purchase the discounted prices at the best time of the day.',
  };

  private shareService: SharedService = inject(SharedService);
  private searchService: SearchService = inject(SearchService);

  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private topRoutesService: TopRoutesService = inject(TopRoutesService);
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [undefined, [Validators.required, this.phoneLengthValidator]]
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
  destinations: { name: string; origin: string; destination: string, slug: string, originName: string, destinationName: string }[] = [];
  flightData: { name: string; origin: string; destination: string, slug: string, originName: string, destinationName: string }[][] = [];
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();
    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
      }
    });
    // First, try to get data from resolved route data
    this.activatedRoute.data.subscribe(data => {
      console.log('Resolved route data:', data['topRouteData']);

      if (data['topRouteData']) {
        this.processBlogData(data['topRouteData']);
      } else {
        // Fallback to manual fetch if resolver failed


        this.getFlightRoutes();


      }
    });

  }

  private processBlogData(blogData: any) {
    if (blogData?.data) {
      this.flightData = blogData?.data;
      const today = new Date();
      const futureDate = new Date(today.setDate(today.getDate() + 15));
      this.destinations = blogData.data.map((route: any) => ({
        name: route.Name,
        origin: route.Origin,
        destination: route.Destination,
        slug: route?.Slug,
        originName: route?.OriginName,
        destinationName: route?.DestinationName,
        futureDate: futureDate
      }));
      this.chunkDestinations(7);
      this.cdr.detectChanges();
      this.transferState.set(this.BLOG_KEY, this.flightData);

    } else {
      console.log(blogData, "blogData---------");

      // Handle case where blog was not found
      // this.handleBlogNotFound();
    }
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

  getFlightRoutes() {
    this.SpinnerService.show();
    this.topRoutesService
      .getToproutes({ category: 'top-routes' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.SpinnerService.hide();
          this.flightData = res?.data;
          const today = new Date();
          const futureDate = new Date(today.setDate(today.getDate() + 15));
          this.destinations = res.data.map((route: any) => ({
            name: route.Name,
            origin: route.Origin,
            destination: route.Destination,
            slug: route?.Slug,
            originName: route?.OriginName,
            destinationName: route?.DestinationName,
            futureDate: futureDate
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

  onDestinationClick(route: {
    name: string;
    origin: string;
    destination: string;
    slug: string;
    originName: string;
    destinationName: string;
  }) {
    // this.SpinnerService.show();
    this.searchService.setRouteData(route);
    // this.router.navigate([`/top-routes/${route?.slug}`]);
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
      contact_email: this.getData.sendemail,
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
