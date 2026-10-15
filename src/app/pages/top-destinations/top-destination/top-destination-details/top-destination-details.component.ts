import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  model,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { DomSanitizer, Title, Meta, SafeHtml } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
  NgxIntlTelInputModule,
} from 'ngx-intl-tel-input';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { SpinnerService } from '../../../../services/common/spinner.service';
import { TosterService } from '../../../../services/common/toaster.service';
import { SearchService } from '../../../../services/search.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { NgFor, NgStyle, NgIf, TitleCasePipe, NgClass, CommonModule } from '@angular/common';
import { FlightsTabComponent } from '../../../../components/main-filter/flights-tab/flights-tab.component';
import { MapModule } from '../../../../core/map/map.module';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-top-destination-details',
  imports: [
    NgFor,
    NgStyle,
    NgIf,
    ReactiveFormsModule,
    FlightsTabComponent,
    NgxIntlTelInputModule,
    RouterLink,
    MapModule,
    TitleCasePipe,
    NgClass,
    ToggleSwitchModule,
    FormsModule,
    ProgressSpinnerModule,
    ImageModule
  ],
  templateUrl: './top-destination-details.component.html',
  styleUrls: [
    './top-destination-details.component.scss',
    '../../../top-destinations/top-destination-body.scss',
  ],
})
export class TopDestinationDetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  origin = '';
  destination = '';
  public sanitizer: DomSanitizer = inject(DomSanitizer);
  private titleService: Title = inject(Title);
  private metaService: Meta = inject(Meta);
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  lat: number = 35.6895;
  lng: number = 139.6917;

  isCelsius: boolean = true;
  imageBasePath: string = environment.BLOG_IMAGE_BASE_PATH;
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
  private shareService: SharedService = inject(SharedService);
  private toasterService: TosterService = inject(TosterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private SpinnerService: SpinnerService = inject(SpinnerService);
  private searchService: SearchService = inject(SearchService);

  private authService: AuthService = inject(AuthService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  getData: any = '';
  contactForm!: FormGroup;
  submitted = false;
  trustedThingsToDoHtml: SafeHtml | null = null;
  trustedContentHtml: SafeHtml | null = null;
  trustedWhenToVisitHtml: SafeHtml | null = null;
  destinationMediaInfo: any;
  destinationThingsToDoInfo: any;
  destinationSeasonDetails: any[] = [];
  destinationWeatherInfo: any[] = [];
  public currentSlug: string = '';
  months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: [undefined, [Validators.required, this.phoneLengthValidator]],
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

  ngAfterViewInit(): void {
    this.setActiveTabBasedOnRoute(this.router.url);
  }

  setActiveTabBasedOnRoute(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    console.log('Last segment:', lastSegment);
    this.activeroute = lastSegment;
    this.cdr.detectChanges();
  }
  destinations: {
    name: string;
    origin: string;
    destination: string;
    slug: string;
    originName: string;
    destinationName: string;
  }[] = [];
  flightData: {
    name: string;
    origin: string;
    destination: string;
    slug: string;
    originName: string;
    destinationName: string;
  }[][] = [];
  mainData: any = '';
  parsedFaq: any[] = [];
  trustedHtml: SafeHtml | null = null;
  slug: string = '';
  routeData: any = '';
  ngOnInit(): void {
    this.getData = this.shareService.getcompanyName();

    this.activatedRoute.data.subscribe((data) => {
      if (data['allDestinations']?.data) {
        this.destinations = data['allDestinations'].data;
        this.chunkDestinations(7);
      }
    });

    this.setActiveTabBasedOnRoute(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabBasedOnRoute(event.urlAfterRedirects);
        const urlParts = event.urlAfterRedirects.split('/');
            this.currentSlug = urlParts[urlParts.length - 1];
      }
    });
    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.SpinnerService.hide();
        console.log('matched', data);
        const matched = data?.topDestinationDetailsData?.data || [];
        console.log('matched', matched);
        if (matched) {
          this.mainData = matched;
          this.currentSlug = this.mainData.Slug; 

          this.titleService.setTitle(
            this.mainData.MetaTitle || this.mainData.Name
          );
          this.metaService.updateTag({
            name: 'description',
            content: this.mainData.MetaDescription,
          });
          this.metaService.updateTag({
            name: 'keywords',
            content: this.mainData.MetaKeyword,
          });

          // Sanitize and bypass security for HTML content
          this.trustedContentHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.mainData.Content || ''
          );
          this.trustedWhenToVisitHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.mainData.whentovisitdesc || ''
          );
          this.trustedThingsToDoHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.mainData.thingstododesc || ''
          );

          // Assign the new data sections to the component properties
          this.destinationMediaInfo =
            this.mainData.destination_media_info || [];

            this.images = this.destinationMediaInfo.map((media: any) => {
              const fullUrl = `https://control.theinfinitytravel.com/assets/images/top-destinations/destination/${media.medianame}`;
              return {
                itemImageSrc: fullUrl,
                thumbnailImageSrc: fullUrl,
                alt: 'Destination Image',
                title: 'Destination Photo',
              };
            });
          this.destinationThingsToDoInfo =
            this.mainData.destination_things_do_info || [];
          this.destinationWeatherInfo =
            this.mainData.destination_weather_info || [];
          this.destinationSeasonDetails =
            this.mainData.destination_season_details || [];

          // Update other data properties
          this.backgroundImageUrl = `https://control.theinfinitytravel.com/assets/images/top-destinations/${this.mainData.Banner}`;
          this.headerText = this.mainData.BannerHeading;
          this.subHeaderText = this.mainData.BannerText;
          this.lat = parseFloat(this.mainData.latitude);
          this.lng = parseFloat(this.mainData.longitude);
        } else {
          this.mainData = null;
        }
        if (this.mainData?.faq) {
          try {
            this.parsedFaq = JSON.parse(this.mainData.faq);
            console.log('this.parsedFaq', this.parsedFaq);
          } catch (error) {
            console.error('Invalid FAQ JSON:', error);
          }
        }
        const today = new Date();
        const futureDate = new Date(today.setDate(today.getDate() + 15));
        this.destinations = data?.allDestinations.data.map((route: any) => ({
          name: route.Name,

          slug: route?.Slug,

          futureDate: futureDate,
        }));
        console.log('this.destinations', this.destinations);

        this.chunkDestinations(7);
        this.cdr.detectChanges();
      });
  }

  removeInlineStyles(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('[style]');

    elementsWithStyle.forEach((el) => {
      el.removeAttribute('style');
    });

    return doc.body.innerHTML;
  }

  lightData: string[][] = [];

  chunkDestinations(size: number): void {
    this.flightData = [];
    for (let i = 0; i < this.destinations.length; i += size) {
      this.flightData.push(this.destinations.slice(i, i + size));
    }
    console.log('this.flightData', this.flightData);
  }
  slugify(text: string): string {
    return text
      ?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .trim();
  }

  onDestinationClick(route: { name: string; slug: string }) {
    if (this.slug != route.slug) {
      this.SpinnerService.show();
    }

    // this.searchService.setRouteData(route);
    // this.router.navigate([`/top-routes/${route?.slug}`]);
    // this.router.navigate(['/top-destinations', route.slug]);
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

  getMonthName(monthNumber: string): string {
    const monthIndex = parseInt(monthNumber) - 1;
    return this.months[monthIndex] || '';
  }

  // Helper method to get month range (e.g., 'Apr to Jun')
  getMonthRange(fromMonth: string, toMonth: string): string {
    const startMonthName = this.getMonthName(fromMonth);
    const endMonthName = this.getMonthName(toMonth);
    return `${startMonthName} to ${endMonthName}`;
  }

  // Helper method to convert temperature to Celsius
  convertToCelsius(tempC: string): number {
    return parseFloat(tempC);
  }
  convertToFahrenheit(tempF: string): number {
    return parseFloat(tempF);
  }
  toggleTemperatureUnit(): void {
    this.isCelsius = !this.isCelsius;
  }

  // Helper method to get the season type for a given month number
  getSeasonTypeForMonth(monthNumber: string): string {
    const month = parseInt(monthNumber);
    const season = this.destinationSeasonDetails.find((s) => {
      const from = parseInt(s.from_month);
      const to = parseInt(s.to_month);
      // Handle seasons that wrap around the year (e.g., Nov-Feb)
      if (from > to) {
        return month >= from || month <= to;
      }
      return month >= from && month <= to;
    });
    return season ? season.season_type : '';
  }

  // Helper method to get the correct icon class based on season type
  getWeatherOpinionIcon(monthNumber: string): string {
    const seasonType = this.getSeasonTypeForMonth(monthNumber);
    switch (seasonType) {
      case 'Peak Season':
        return 'fa-regular fa-face-grin-hearts';
      case 'Moderate Season':
        return 'fa-regular fa-face-smile-beam';
      case 'Off-season':
        return 'fa-regular fa-face-sad-cry';
      default:
        return '';
    }
  }

  getFormattedDate(dateString: string): string {
  if (!dateString) {
    return 'N/A';
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

images: any[] = []; 
displayCustom: boolean = false;
activeIndex: number = 0;
hotelCategories: number[] = [3, 4, 5];
responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];


}
